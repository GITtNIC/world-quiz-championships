/**
 * Shared Utilities for World Quiz Championships
 * Contains common functions used across the application
 */

/**
 * SessionStorage helpers
 */
const Storage = {
    // Set a value
    set(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save to sessionStorage:', error);
            return false;
        }
    },

    // Get a value
    get(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to read from sessionStorage:', error);
            return defaultValue;
        }
    },

    // Remove a value
    remove(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from sessionStorage:', error);
            return false;
        }
    },

    // Clear all
    clear() {
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Failed to clear sessionStorage:', error);
            return false;
        }
    }
};

/**
 * Timer utilities
 */
const Timer = {
    // Create a countdown timer
    createCountdown(seconds, onTick, onComplete) {
        let remaining = seconds;
        let interval = null;

        const update = () => {
            onTick && onTick(remaining);
            return remaining;
        };

        const start = () => {
            update(); // Initial tick
            interval = setInterval(() => {
                remaining--;
                update();

                if (remaining <= 0) {
                    stop();
                    onComplete && onComplete();
                }
            }, 1000);
            return interval;
        };

        const stop = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        const getRemaining = () => remaining;
        const setRemaining = (value) => { remaining = value; };

        return { start, stop, getRemaining, setRemaining };
    },

    // Format seconds as MM:SS
    formatTime(seconds) {
        if (seconds === 0) return '0:00';
        if (!seconds || seconds < 0) return '--:--';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

/**
 * Array utilities
 */
const ArrayUtils = {
    // Shuffle array using Fisher-Yates algorithm
    shuffle(array) {
        if (!Array.isArray(array)) return array;

        const shuffled = [...array]; // Create copy to avoid modifying original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Get random elements from array
    getRandom(array, count = 1) {
        if (!Array.isArray(array) || count <= 0) return [];

        const shuffled = this.shuffle(array);
        return shuffled.slice(0, Math.min(count, array.length));
    }
};

/**
 * String utilities
 */
const StringUtils = {
    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Remove extra spaces and normalize
    normalize(str) {
        if (!str) return '';
        return str.trim().replace(/\s+/g, ' ');
    }
};

/**
 * Navigation utilities
 */
const Navigation = {
    // Navigate to a relative path
    go(path) {
        window.location.href = path;
    },

    // Navigate back
    back() {
        window.history.back();
    },

    // Reload current page
    reload() {
        window.location.reload();
    }
};

/**
 * DOM utilities
 */
const DOM = {
    // Get element by ID
    $(id) {
        return document.getElementById(id);
    },

    // Query selector
    $$(selector, context = document) {
        return context.querySelector(selector);
    },

    // Query selector all
    $$$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    // Create element
    create(tag, options = {}) {
        const element = document.createElement(tag);

        if (options.class) element.className = options.class;
        if (options.text) element.textContent = options.text;
        if (options.html) element.innerHTML = options.html;
        if (options.id) element.id = options.id;

        for (const [key, value] of Object.entries(options)) {
            if (['class', 'text', 'html', 'id'].includes(key)) continue;
            element.setAttribute(key, value);
        }

        return element;
    },

    // Add event listener
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        return element;
    }
};

/**
 * Polyfill for Element.closest
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(selector) {
        let element = this;
        while (element && element.nodeType === 1) {
            if (element.matches(selector)) {
                return element;
            }
            element = element.parentElement || element.parentNode;
        }
        return null;
    };
}

/**
 * Error handling utilities
 */
const ErrorHandler = {
    // Handle and log errors
    handle(error, context = '') {
        console.error(`Error${context ? ` in ${context}` : ''}:`, error);
        // Could be extended to send to error reporting service
    },

    // Display user-friendly error message
    showMessage(message, type = 'error') {
        // Simple alert for now - could be enhanced with toast notifications
        alert(message);
    }
};

// Export utilities globally
window.Storage = Storage;
window.Timer = Timer;
window.ArrayUtils = ArrayUtils;
window.StringUtils = StringUtils;
window.Navigation = Navigation;
window.DOM = DOM;
window.ErrorHandler = ErrorHandler;
