/**
 * Results Page Logic for World Flag Championships
 */

let gameResults = null;

/**
 * Initialize results page
 */
function initResults() {
    // Load results from localStorage
    gameResults = Storage.get('gameResults');

    if (!gameResults) {
        console.error('No game results found');
        ErrorHandler.showMessage('No game results found. Redirecting to setup.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Initialize translations first
    // Initialize translations first then load results
    // Wait for translations to initialize before loading results
    translator.initialize();
    setTimeout(() => {
        displayResults(); 
    }, 100);
}

/**
 * Display the game results
 */
function displayResults() {
    // Update final score
    updateElement('final-score', gameResults.score);

    // Update grade
    const grade = calculateGrade();
    updateElement('grade', grade.grade);
    document.getElementById('grade').className = `grade grade-${grade.grade}`;

    // Update performance summary - use what was actually completed during gameplay
    const totalAttempts = calculateTotalAttempts();
    const flagsPlayed = gameResults.completedQuestions || gameResults.totalQuestions; // Fallback for older saves
    updateElement('total-flags', flagsPlayed);
    updateElement('correct-first', gameResults.correctFirstTry || 0);
    updateElement('correct-second', gameResults.correctSecondTry || 0);
    // Treat third-try correct as failures (0 points like failures)
    updateElement('correct-third', 0);
    updateElement('failed', gameResults.failedQuestions || 0);

    // Calculate and update detailed statistics based on actual flags played
    const correctQuestions = (gameResults.correctFirstTry || 0) + (gameResults.correctSecondTry || 0);
    const maxPossibleScore = flagsPlayed * 10;
    const accuracy = flagsPlayed > 0 ? Math.round((correctQuestions / flagsPlayed) * 100) : 0;
    const firstTryRate = flagsPlayed > 0 ? Math.round((gameResults.correctFirstTry / flagsPlayed) * 100) : 0;
    const timeTakenSeconds = gameResults.timeTaken || 0; // Elapsed time instead of time limit
    // Use completed flags for per-minute calculation, not total available countries
    const completedQuestions = gameResults.completedQuestions || 0;
    const actualFlagsPerMinute = timeTakenSeconds > 0 ? (completedQuestions / (timeTakenSeconds / 60)) : completedQuestions;

    // Add third-try correct to failed, since they give no points like failures
    const failedWithThird = (gameResults.failedQuestions || 0) + (gameResults.correctThirdTry || 0);

    updateElement('accuracy', accuracy + '%');
    updateElement('failed', failedWithThird);
    updateElement('first-try-rate', firstTryRate + '%');
    updateElement('flags-per-minute', actualFlagsPerMinute.toFixed(1));
    updateElement('best-streak', gameResults.bestStreak || 0);
    updateElement('time-taken', formatTime(timeTakenSeconds));

    // Display practice more box if there are countries to practice
    displayPracticeCountries();
}

/**
 * Display countries that need practice (second try correct + failed)
 */
function displayPracticeCountries() {
    const practiceContainer = document.getElementById('practice-countries');
    const practiceBox = document.getElementById('practice-more');

    if (!practiceContainer || !practiceBox) return;

    // Combine second try and failed countries
    const allPracticeCountries = [
        ...(gameResults.secondTryCountries || []),
        ...(gameResults.failedCountries || [])
    ];

    if (allPracticeCountries.length === 0) {
        // No countries need practice, keep box hidden
        practiceBox.style.display = 'none';
        return;
    }

    // Show the practice box
    practiceBox.style.display = 'block';

    // Clear previous content
    practiceContainer.innerHTML = '';

    // Create grid container for countries
    const countriesGrid = document.createElement('div');
    countriesGrid.className = 'practice-countries-grid';

    // Add each country
    allPracticeCountries.forEach(country => {
        const countryItem = document.createElement('div');
        countryItem.className = 'practice-country-item';

        // Flag container
        const flagContainer = document.createElement('div');
        flagContainer.className = 'practice-flag-container';

        const flagImg = document.createElement('img');
        flagImg.className = 'practice-flag';
        flagImg.alt = country.name;

        flagContainer.appendChild(flagImg);
        countryItem.appendChild(flagContainer);

        // Country name
        const nameElement = document.createElement('div');
        nameElement.className = 'practice-country-name';
        nameElement.textContent = country.name;
        countryItem.appendChild(nameElement);

        countriesGrid.appendChild(countryItem);

        // Load flag asynchronously
        loadPracticeFlag(country, flagImg);
    });

    practiceContainer.appendChild(countriesGrid);
}

/**
 * Load a flag for the practice countries display
 */
async function loadPracticeFlag(country, imgElement) {
    try {
        const response = await fetch(country.flagPath);
        const svgContent = await response.text();

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        imgElement.src = url;
    } catch (error) {
        console.error('Failed to load flag for practice:', error);
        // Show error placeholder
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTJlOGYwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIxNSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0iYWlkIGltaWQiPk4vQTwvdGV4dD4KPC9zdmc+';
    }
}

/**
 * Calculate performance grade
 */
function calculateGrade() {
    // Use correct identifications-based accuracy and first-try rate calculations - only first/second try count as accurate
    const flagsPlayed = gameResults.completedQuestions || gameResults.totalQuestions; // Fallback for older saves
    const correctQuestions = (gameResults.correctFirstTry || 0) + (gameResults.correctSecondTry || 0);
    const accuracy = flagsPlayed > 0 ? (correctQuestions / flagsPlayed) * 100 : 0;
    const firstTryRate = flagsPlayed > 0 ? (gameResults.correctFirstTry / flagsPlayed) * 100 : 0;

    if (accuracy >= 95 && firstTryRate >= 70) {
        return { grade: 'S', color: 'gold' };
    } else if ((accuracy >= 85 && firstTryRate >= 50) || accuracy >= 90) {
        return { grade: 'A', color: 'purple' };
    } else if (accuracy >= 75 && firstTryRate >= 30) {
        return { grade: 'B', color: 'cyan' };
    } else if (accuracy >= 60) {
        return { grade: 'C', color: 'green' };
    } else {
        return { grade: 'D', color: 'red' };
    }
}

/**
 * Calculate total attempts made by player
 */
function calculateTotalAttempts() {
    const firstTryCorrect = gameResults.correctFirstTry || 0;
    const secondTryCorrect = gameResults.correctSecondTry || 0;
    const thirdTryCorrect = gameResults.correctThirdTry || 0;
    const failed = gameResults.failedQuestions || 0;

    // Each first-try correct = 1 attempt
    // Each second-try correct = 2 attempts (1 wrong + 1 right)
    // Each third-try correct = 3 attempts (2 wrong + 1 right)
    // Each failed question = 3 attempts (three wrong answers)
    return firstTryCorrect * 1 + secondTryCorrect * 2 + thirdTryCorrect * 3 + failed * 3;
}

/**
 * Format time in MM:SS format
 */
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Play again with same settings
 */
function playAgain() {
    // Navigate back to game.html - settings should still be in localStorage
    window.location.href = 'game.html';
}

/**
 * Start a new game (with same settings)
 */
function newGame() {
    // Clear results and progress but keep settings - go back to setup with preserved settings
    Storage.remove('gameResults');
    Storage.remove('quizProgress'); // Clear any game progress too
    window.location.href = 'index.html'; // Go back to filter/setup page with preserved settings
}

/**
 * Go back to main menu
 */
function mainMenu() {
    // Clear results and navigate to main landing page
    Storage.remove('gameResults');
    Storage.remove('quizProgress'); // Clear any game progress too
    window.location.href = '../../../index.html';
}

/**
 * Update element text content
 */
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof translator !== 'undefined') {
        translator.initialize();
        initResults();
    } else {
        console.error('Translator not loaded');
        setTimeout(() => location.reload(), 500); // Retry after short delay
    }
});
