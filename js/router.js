/**
 * Simple Client-Side Router for World Quiz Championships
 * Handles navigation between different game modes and screens
 */

// Simple hash-based routing
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;

        // Listen for hash changes
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));
    }

    // Add a route
    addRoute(route, handler) {
        this.routes[route] = handler;
    }

    // Navigate to a route
    navigate(route, options = {}) {
        // Update URL hash
        window.location.hash = route;

        // Handle the route
        this.handleRoute(route, options);
    }

    // Handle hash change event
    handleHashChange() {
        const hash = window.location.hash.substring(1) || '';
        this.handleRoute(hash);
    }

    // Handle page load
    handleLoad() {
        const hash = window.location.hash.substring(1) || '';
        if (hash) {
            this.handleRoute(hash);
        }
    }

    // Handle route execution
    handleRoute(route, options = {}) {
        if (this.routes[route]) {
            this.currentRoute = route;
            this.routes[route](options);
        } else {
            // Default to main page
            this.navigateToMain();
        }
    }

    // Navigate to game mode
    navigateToGameMode(gameMode) {
        if (gameMode === 'geography') {
            window.location.href = 'game-modes/geography-games/world-flag-championships/index.html';
        } else {
            // For future math games or other modes
            console.log('Game mode not implemented:', gameMode);
        }
    }

    // Navigate back to main
    navigateToMain() {
        window.location.href = 'index.html';
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Initialize router globally
const router = new Router();

// Add routes for main landing page
if (document.querySelector('.game-modes')) {
    // Only add routes on the main landing page
    router.addRoute('', () => {
        // Default route - already on landing page
    });

    // Listen for game mode clicks
    document.addEventListener('DOMContentLoaded', () => {
        const gameModeCards = document.querySelectorAll('.game-mode-card');

        gameModeCards.forEach(card => {
            if (!card.classList.contains('disabled')) {
                card.addEventListener('click', () => {
                    const gameMode = card.dataset.game;
                    router.navigateToGameMode(gameMode);
                });

                // Also allow button clicks
                const button = card.querySelector('.game-mode-btn');
                if (button) {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent card click
                        const gameMode = card.dataset.game;
                        router.navigateToGameMode(gameMode);
                    });
                }
            }
        });
    });
}

// Export for use in modules
window.Router = Router;
window.router = router;
