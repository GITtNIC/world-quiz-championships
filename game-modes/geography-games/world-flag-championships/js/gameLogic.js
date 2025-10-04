/**
 * Game logic utilities for World Flag Championships
 */

const GameLogic = {
    /**
     * Validate a user's answer against a country's name
     * @param {string} userAnswer - The user's submitted answer
     * @param {object} country - Country object from data
     * @returns {boolean} True if the answer is correct
     */
    validateAnswer: function(userAnswer, country) {
        // Normalize both strings for comparison
        const normalizeString = (str) => {
            return str.toLowerCase()
                .trim()
                // Remove special characters and accents
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                // Remove punctuation
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                // Replace multiple spaces with single space
                .replace(/\s+/g, ' ');
        };

        const normalizedUserAnswer = normalizeString(userAnswer);
        const normalizedCountryName = normalizeString(country.name);

        // Direct match
        if (normalizedUserAnswer === normalizedCountryName) {
            return true;
        }

        // Check for common variations and alternatives
        const alternatives = this.getCountryAlternatives(country);
        for (const alt of alternatives) {
            if (normalizeString(alt) === normalizedUserAnswer) {
                return true;
            }
        }

        // Check for partial matches with high confidence
        return this.checkPartialMatch(normalizedUserAnswer, normalizedCountryName);
    },

    /**
     * Get alternative names/accepted answers for a country
     * @param {object} country - Country object
     * @returns {string[]} Array of alternative names
     */
    getCountryAlternatives: function(country) {
        const alternatives = [country.name];

        // Add common alternative names
        switch(country.id) {
            case 'USA':
                alternatives.push('United States', 'United States of America', 'America');
                break;
            case 'GBR':
                alternatives.push('United Kingdom', 'Britain', 'UK', 'Great Britain');
                break;
            case 'PRK':
                alternatives.push('North Korea', "Democratic People's Republic of Korea");
                break;
            case 'KOR':
                alternatives.push('South Korea', 'Republic of Korea');
                break;
            case 'COD':
                alternatives.push('Democratic Republic of the Congo', 'DR Congo', 'DRC');
                break;
            case 'COG':
                alternatives.push('Republic of the Congo', 'Congo-Brazzaville');
                break;
            case 'PSE':
                alternatives.push('Palestine', 'Palestinian territories');
                break;
            case 'TZA':
                alternatives.push('Tanzania, United Republic of');
                break;
            case 'FSM':
                alternatives.push('Micronesia', 'Federated States of Micronesia');
                break;
            case 'SSD':
                alternatives.push('South Sudan');
                break;
            case 'MKD':
                alternatives.push('North Macedonia', 'Macedonia');
                break;
            case 'SWZ':
                alternatives.push('Eswatini', 'Swaziland');
                break;
            case 'VEN':
                alternatives.push('Venezuela (Bolivarian Republic of)');
                break;
            case 'BOL':
                alternatives.push('Bolivia (Plurinational State of)');
                break;
            case 'LAO':
                alternatives.push("Lao People's Democratic Republic", 'Laos');
                break;
        }

        return alternatives;
    },

    /**
     * Check for partial matches with fuzzy logic
     * @param {string} userAnswer - Normalized user answer
     * @param {string} correctAnswer - Normalized correct answer
     * @returns {boolean} True if they match sufficiently
     */
    checkPartialMatch: function(userAnswer, correctAnswer) {
        // Exact substring match (for abbreviated answers)
        if (userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
            return true;
        }

        // Check for similar words (Levenshtein distance for small strings)
        if (userAnswer.length <= 3 || correctAnswer.length <= 3) {
            return userAnswer === correctAnswer;
        }

        // Simple fuzzy match for longer strings
        const words1 = userAnswer.split(' ');
        const words2 = correctAnswer.split(' ');

        // Check if all main words are present (ignoring articles)
        const ignoreWords = ['the', 'of', 'and', 'in', 'on', 'at', 'to', 'for', 'is'];
        const filteredWords1 = words1.filter(word => !ignoreWords.includes(word) && word.length > 1);
        const filteredWords2 = words2.filter(word => !ignoreWords.includes(word) && word.length > 1);

        // If both answers have multiple words, at least 80% of words should match
        if (filteredWords1.length > 1 && filteredWords2.length > 1) {
            let matches = 0;
            for (const word of filteredWords1) {
                if (filteredWords2.some(w2 => w2.includes(word) || word.includes(w2))) {
                    matches++;
                }
            }
            return matches >= Math.min(filteredWords1.length, filteredWords2.length) * 0.8;
        }

        return false;
    },

    /**
     * Calculate score for a game
     * @param {number} correctFirstTry - Number of correct answers on first try
     * @param {number} correctSecondTry - Number of correct answers on second try
     * @param {number} totalQuestions - Total questions asked
     * @returns {number} Final score
     */
    calculateScore: function(correctFirstTry, correctSecondTry, totalQuestions) {
        return (correctFirstTry * 10) + (correctSecondTry * 5);
    },

    /**
     * Get performance rating based on score and total questions
     * @param {number} score - Final game score
     * @param {number} totalQuestions - Total questions asked
     * @returns {object} Rating object with level and description
     */
    getPerformanceRating: function(score, totalQuestions) {
        const maxScore = totalQuestions * 10;
        const percentage = (score / maxScore) * 100;

        if (percentage >= 95) return { level: 'legendary', description: 'Flag Master!' };
        if (percentage >= 85) return { level: 'expert', description: 'Expert Identifier' };
        if (percentage >= 70) return { level: 'advanced', description: 'Geography Guru' };
        if (percentage >= 50) return { level: 'intermediate', description: 'Getting There' };
        if (percentage >= 30) return { level: 'beginner', description: 'Keep Studying' };
        return { level: 'novice', description: 'Newbie Navigator' };
    },

    /**
     * Format time duration for display
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime: function(seconds) {
        if (seconds === 0) return '∞';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Get game statistics
     * @param {Array} gameResults - Array of attempt data
     * @returns {object} Statistics object
     */
    getGameStatistics: function(gameResults) {
        if (!gameResults || gameResults.length === 0) {
            return {
                totalGames: 0,
                averageScore: 0,
                bestScore: 0,
                averageAccuracy: 0,
                averageTime: 0
            };
        }

        const totalGames = gameResults.length;
        const scores = gameResults.map(g => g.score);
        const bestScore = Math.max(...scores);
        const averageScore = scores.reduce((a, b) => a + b, 0) / totalGames;

        // Assuming each result has an accuracy and time field
        const accuracies = gameResults.map(g => g.accuracy || 0);
        const times = gameResults.map(g => g.timeSpent || 0);

        const averageAccuracy = accuracies.length > 0 ?
            accuracies.reduce((a, b) => a + b, 0) / accuracies.length : 0;

        const averageTime = times.length > 0 ?
            times.reduce((a, b) => a + b, 0) / times.length : 0;

        return {
            totalGames,
            averageScore: Math.round(averageScore),
            bestScore,
            averageAccuracy: Math.round(averageAccuracy),
            averageTime: Math.round(averageTime)
        };
    }
};

// Export for use in other modules
window.GameLogic = GameLogic;
