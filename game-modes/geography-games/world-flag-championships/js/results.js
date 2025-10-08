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

    // Display results
    displayResults();
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
    updateElement('failed', gameResults.failedQuestions || 0);

    // Calculate and update detailed statistics based on actual flags played
    const correctQuestions = (gameResults.correctFirstTry || 0) + (gameResults.correctSecondTry || 0);
    const maxPossibleScore = flagsPlayed * 10;
    const accuracy = maxPossibleScore > 0 ? Math.round((gameResults.score / maxPossibleScore) * 100) : 0;
    const firstTryRate = flagsPlayed > 0 ? Math.round((gameResults.correctFirstTry / flagsPlayed) * 100) : 0;
    const timeTakenSeconds = gameResults.timeTaken || gameResults.timeLimit;
    // Use completed flags for per-minute calculation, not total available countries
    const completedQuestions = gameResults.completedQuestions || 0;
    const actualFlagsPerMinute = timeTakenSeconds > 0 ? (completedQuestions / (timeTakenSeconds / 60)) : completedQuestions;

    updateElement('accuracy', accuracy + '%');
    updateElement('first-try-rate', firstTryRate + '%');
    updateElement('flags-per-minute', actualFlagsPerMinute.toFixed(1));
    updateElement('best-streak', gameResults.bestStreak || 0);
    updateElement('time-taken', formatTime(timeTakenSeconds));
}

/**
 * Calculate performance grade
 */
function calculateGrade() {
    // Use score-based accuracy and first-try rate calculations based on actual flags played
    const flagsPlayed = gameResults.completedQuestions || gameResults.totalQuestions; // Fallback for older saves
    const maxPossibleScore = flagsPlayed * 10;
    const accuracy = maxPossibleScore > 0 ? (gameResults.score / maxPossibleScore) * 100 : 0;
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
    const failed = gameResults.failedQuestions || 0;

    // Each first-try correct = 1 attempt
    // Each second-try correct = 2 attempts (wrong + right)
    // Each failed question = 3 attempts (three wrong answers)
    return firstTryCorrect * 1 + secondTryCorrect * 2 + failed * 3;
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
    initResults();
});
