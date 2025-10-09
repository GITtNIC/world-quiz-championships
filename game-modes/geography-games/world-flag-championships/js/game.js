/**
 * Main game logic for World Flag Championships
 */

// Global game state
let gameState = {
    countries: [],
    currentQuestionIndex: 0,
    score: 0,
    timer: null,
    timeLimit: 180, // 3 minutes in seconds
    timeRemaining: 180,
    attempts: {},
    gameActive: false,
    totalQuestions: 20,
    awaitingAcknowledgment: false, // Track if waiting for player acknowledgment after 2 wrong attempts
    lastCorrectAnswer: null, // Store the correct answer for validation
    startTime: null, // Track when the game started
    correctFirstTry: 0, // Track first try correct answers
    correctSecondTry: 0, // Track second try correct answers
    correctThirdTry: 0, // Track third try correct answers
    failedQuestions: 0, // Track third try wrong answers
    bestStreak: 0, // Track the best streak of correct answers
    currentStreak: 0 // Current streak counter
};

/**
 * Load countries data from JSON file
 */
async function loadCountriesData() {
    try {
        // Determine which data file to load based on current language
        const currentLanguage = localStorage.getItem('wqc-language') || 'en';
        const dataFile = `data/countries_${currentLanguage}.json`;

        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const countriesData = await response.json();

        if (!countriesData.countries || !countriesData.continents) {
            throw new Error('Invalid countries data format');
        }

        return countriesData;

    } catch (error) {
        console.error('Error loading countries data:', error);
        throw error;
    }
}

/**
 * Initialize the game
 */
async function initGame() {
    try {
        // Initialize translations
        await translator.initialize();
        // Load game settings
        const settings = Storage.get('gameSettings');
        if (!settings) {
            ErrorHandler.showMessage(translator.getTranslation('settingsNotFound'));
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        // Load countries data
        const countriesData = await loadCountriesData();
        gameState.countries = countriesData.countries.filter(country =>
            settings.selectedCountryIds.includes(country.id)
        );

        if (gameState.countries.length === 0) {
            ErrorHandler.showMessage(translator.getTranslation('noCountriesSelected'));
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        // Initialize game state
        gameState.timeLimit = settings.timeLimit || 180;
        gameState.timeRemaining = gameState.timeLimit;
        gameState.totalQuestions = gameState.countries.length;

        // Shuffle countries for random order
        shuffleArray(gameState.countries);

        // Set up UI
        setupUI();

        // Start the game
        startGame();

    } catch (error) {
        console.error('Failed to initialize game:', error);
        ErrorHandler.showMessage(translator.getTranslation('dataLoadFailed'));
    }
}

/**
 * Set up the game UI
 */
function setupUI() {
    updateScore(0);
    updateProgress(0, gameState.totalQuestions);
    updateTimer(gameState.timeRemaining);

    // Set up input handlers
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.addEventListener('keypress', handleAnswerKeypress);
        answerInput.placeholder = translator.getTranslation('typeCountryName');
    }

    // Set up keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);
}

/**
 * Start the game
 */
function startGame() {
    gameState.gameActive = true;
    gameState.startTime = Date.now(); // Record when the game starts for accurate time calculation

    if (gameState.timeLimit > 0) {
        startTimer();
    }

    showNextQuestion();
}

/**
 * Handle answer input
 */
function handleAnswerKeypress(event) {
    if (event.key === 'Enter' && gameState.gameActive) {
        submitAnswer();
    }
}

/**
 * Handle global keyboard events
 */
function handleGlobalKeydown(event) {
    if (!gameState.gameActive) return;

    // Escape to quit
    if (event.key === 'Escape') {
        quitGame();
    }
}

/**
 * Show the next question
 */
function showNextQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        endGame();
        return;
    }

    const country = gameState.countries[gameState.currentQuestionIndex];
    const answerInput = document.getElementById('answer-input');
    const feedbackElement = document.getElementById('feedback');
    const attemptElement = document.getElementById('attempt-text');

    // Reset acknowledgment state
    gameState.awaitingAcknowledgment = false;
    gameState.lastCorrectAnswer = null;

    // Reset UI
    if (answerInput) {
        answerInput.value = '';
        answerInput.focus();
    }

    if (feedbackElement) {
        feedbackElement.textContent = '';
    }

    // Set attempt text
    const attempts = gameState.attempts[country.id] || 0;
    if (attemptElement) {
        if (attempts === 0) {
            attemptElement.textContent = translator.getTranslation('firstTryLabel');
        } else {
            attemptElement.textContent = translator.getTranslation('secondTry');
        }
    }

    // Load the flag
    loadFlag(country);

    // Display status label
    displayStatusLabel(country);

    gameState.gameActive = true;
}

/**
 * Load and display a flag
 */
function loadFlag(country) {
    const flagImg = document.getElementById('flag-img');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!flagImg || !loadingSpinner) return;

    // Show loading spinner
    loadingSpinner.style.display = 'flex';
    flagImg.style.display = 'none';

    // Use the SVG blob loading method for reliable SVG display
    loadFlagAlternative(country);
}

/**
 * Alternative flag loading method
 */
function loadFlagAlternative(country) {
    const flagImg = document.getElementById('flag-img');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!flagImg) return;

    // Try loading as SVG content
    fetch(country.flagPath)
        .then(response => response.text())
        .then(svgContent => {
            // Create a blob URL for SVG or use inline SVG
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            flagImg.src = url;
            flagImg.onload = () => {
                loadingSpinner.style.display = 'none';
                flagImg.style.display = 'block';
            };
        })
        .catch(error => {
            console.error('Failed to load flag as SVG:', error);
            showErrorPlaceholder();
        });
}

/**
 * Show error placeholder for flag
 */
function showErrorPlaceholder() {
    const flagImg = document.getElementById('flag-img');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (flagImg) {
        flagImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTJlOGYwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIxNSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0iYWlkIGltaWQiPk4vQTwvdGV4dD4KPC9zdmc+';
        flagImg.alt = 'Flag not available';
        flagImg.onload();
    }

    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
        flagImg.style.display = 'block';
    }
}

/**
 * Submit an answer
 */
function submitAnswer() {
    if (!gameState.gameActive) return;

    const country = gameState.countries[gameState.currentQuestionIndex];
    const currentAttempts = gameState.attempts[country.id] || 0;

    // Prevent submission if already made 3 or more attempts on this question
    if (currentAttempts >= 3) {
        return;
    }

    const answerInput = document.getElementById('answer-input');
    const feedbackElement = document.getElementById('feedback');
    const attemptElement = document.getElementById('attempt-text');

    if (!answerInput || !feedbackElement || !attemptElement) return;

    const userAnswer = answerInput.value.trim().toLowerCase();

    if (!userAnswer) {
        showFeedback(translator.getTranslation('enterAnswer'), 'warning');
        return;
    }

    // Validate answer
    const isCorrect = GameLogic.validateAnswer(userAnswer, country);

    // Track attempts
    if (!gameState.attempts[country.id]) {
        gameState.attempts[country.id] = 0;
    }

    gameState.attempts[country.id]++;

    if (isCorrect) {
        // Correct answer - track statistics and update streak
        if (gameState.attempts[country.id] === 1) {
            gameState.correctFirstTry++;
        } else if (gameState.attempts[country.id] === 2) {
            gameState.correctSecondTry++;
        } else if (gameState.attempts[country.id] === 3) {
            gameState.correctThirdTry++;
        }

        // Update streak
        gameState.currentStreak++;
        if (gameState.currentStreak > gameState.bestStreak) {
            gameState.bestStreak = gameState.currentStreak;
        }

        // Points based on attempt number
        let points = 0;
        if (gameState.attempts[country.id] === 1) {
            points = 10; // First try
        } else if (gameState.attempts[country.id] === 2) {
            points = 5;  // Second try
        } else {
            points = 0;  // Third try - 0 points for educational attempt
        }

        gameState.score += points;
        updateScore(gameState.score);

        let feedbackMessage;
        if (points === 0) {
            feedbackMessage = translator.getTranslation('correctLabel');
        } else {
            feedbackMessage = translator.getTranslation('correctWithPoints').replace('{{points}}', points.toString());
        }

        showFeedback(feedbackMessage, 'success');

        // Move to next question after delay
        setTimeout(() => {
            gameState.currentQuestionIndex++;
            updateProgress(gameState.currentQuestionIndex, gameState.totalQuestions);
            showNextQuestion();
        }, 2000);

    } else {
        // Wrong answer - reset streak
        gameState.currentStreak = 0;
        // Wrong answer
        if (gameState.attempts[country.id] >= 3) {
            // Third attempt failed - track as failed question
            gameState.failedQuestions++;

            // Third attempt failed - show correct answer and move on (0 points)
            showFeedback(translator.getTranslation('answerWas').replace('{{answer}}', country.name), 'error');

            // Move to next question after delay
            setTimeout(() => {
                gameState.currentQuestionIndex++;
                updateProgress(gameState.currentQuestionIndex, gameState.totalQuestions);
                showNextQuestion();
            }, 3000);

        } else if (gameState.attempts[country.id] === 2) {
            // Second attempt failed - show correct answer as hint for educational try
            showFeedback(translator.getTranslation('correctAnswerIs').replace('{{answer}}', country.name), 'info');
            attemptElement.textContent = translator.getTranslation('finalTry');
            answerInput.value = '';
            answerInput.focus();

        } else {
            // First attempt failed - allow second try
            showFeedback(translator.getTranslation('wrongTryAgain'), 'warning');
            attemptElement.textContent = translator.getTranslation('secondTry');
            answerInput.value = '';
            answerInput.focus();
        }
    }
}

/**
 * Move to the next question and reset states
 */
function moveToNextQuestion() {
    gameState.awaitingAcknowledgment = false;
    gameState.lastCorrectAnswer = null;
    gameState.currentQuestionIndex++;
    updateProgress(gameState.currentQuestionIndex, gameState.totalQuestions);
    showNextQuestion();
}

/**
 * Show feedback to the user
 */
function showFeedback(message, type) {
    const feedbackElement = document.getElementById('feedback');
    if (!feedbackElement) return;

    feedbackElement.textContent = message;
    feedbackElement.className = `feedback-display ${type}`;
}

/**
 * Update score display
 */
function updateScore(score) {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

/**
 * Update progress display
 */
function updateProgress(current, total) {
    const progressElement = document.getElementById('progress');
    if (progressElement) {
        progressElement.textContent = `${current + 1} / ${total}`;
    }
}

/**
 * Start the game timer
 */
function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);

    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;

        if (gameState.timeRemaining <= 0) {
            endGame();
        }

        updateTimer(gameState.timeRemaining);
    }, 1000);
}

/**
 * Update timer display
 */
function updateTimer(seconds) {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    if (gameState.timeLimit === 0) {
        timerElement.textContent = '∞';
        return;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * End the game
 */
function endGame() {
    gameState.gameActive = false;
    if (gameState.timer) clearInterval(gameState.timer);

    // Calculate actual time taken
    const endTime = Date.now();
    const timeTakenSeconds = gameState.startTime ? Math.floor((endTime - gameState.startTime) / 1000) : gameState.timeLimit;

    // Save detailed results for accurate statistics
    const results = {
        score: gameState.score,
        totalQuestions: gameState.totalQuestions,
        timeLimit: gameState.timeLimit,
        timeTaken: timeTakenSeconds, // Actual time used
        completedQuestions: gameState.currentQuestionIndex,
        correctFirstTry: gameState.correctFirstTry,
        correctSecondTry: gameState.correctSecondTry,
        correctThirdTry: gameState.correctThirdTry,
        failedQuestions: gameState.failedQuestions,
        bestStreak: gameState.bestStreak,
        date: new Date().toISOString()
    };

    if (!Storage.set('gameResults', results)) {
        console.error('Failed to save game results');
    }

    // Navigate to results page
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 1000);
}

/**
 * Quit the game
 */
function quitGame() {
    const modal = document.getElementById('quit-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Cancel quit
 */
function cancelQuit() {
    const modal = document.getElementById('quit-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Confirm quit
 */
function confirmQuit() {
    gameState.gameActive = false;
    if (gameState.timer) clearInterval(gameState.timer);

    window.location.href = 'index.html';
}

/**
 * Display country status label
 */
function displayStatusLabel(country) {
    const statusLabel = document.getElementById('status-label');
    if (!statusLabel) return;

    let displayText = '';
    switch (country.status) {
        case 'official':
            displayText = translator.getTranslation('unOfficial');
            break;
        case 'territory':
            displayText = translator.getTranslation('territoryLabel');
            break;
        case 'observer':
            displayText = translator.getTranslation('observerState');
            break;
        case 'disputed':
            displayText = translator.getTranslation('disputedLabel');
            break;
        default:
            displayText = '';
    }

    statusLabel.textContent = displayText;
    statusLabel.className = `status-label status-${country.status}`;
}

/**
 * Utility function to shuffle array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
