/**
 * Answer validation utilities for World Flag Championships
 * Simple wrapper around GameLogic validation
 */

const AnswerValidator = {
    /**
     * Validate if an answer is correct
     * @param {string} answer - User's answer
     * @param {object} country - Country object to check against
     * @returns {boolean} True if answer is correct
     */
    isCorrect: function(answer, country) {
        return GameLogic.validateAnswer(answer, country);
    },

    /**
     * Check if an answer is close to the correct answer
     * @param {string} answer - User's answer
     * @param {object} country - Country object to check against
     * @returns {boolean} True if answer is very close
     */
    isClose: function(answer, country) {
        // For future use - suggestion system
        const normalizedAnswer = answer.toLowerCase().trim();
        const normalizedCountry = country.name.toLowerCase().trim();

        // Direct substring match
        if (normalizedAnswer.includes(normalizedCountry) ||
            normalizedCountry.includes(normalizedAnswer)) {
            return true;
        }

        return false;
    },

    /**
     * Get suggestions based on partial input
     * @param {string} partial - Partial user input
     * @param {Array} countries - Array of country objects
     * @returns {Array} Array of suggested country names
     */
    getSuggestions: function(partial, countries) {
        if (!partial || partial.length < 2) return [];

        const normalizedPartial = partial.toLowerCase().trim();
        const suggestions = [];

        for (const country of countries) {
            if (country.name.toLowerCase().includes(normalizedPartial)) {
                suggestions.push(country.name);
                if (suggestions.length >= 5) break; // Limit suggestions
            }
        }

        return suggestions;
    }
};

// Export for use in other modules
window.AnswerValidator = AnswerValidator;
