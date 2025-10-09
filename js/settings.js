/**
 * Settings menu for World Quiz Championships
 * Handles hamburger menu and settings dropdown functionality
 */

class SettingsMenu {
    constructor() {
        this.isOpen = false;
        this.menuElement = null;
        this.init();
    }

    init() {
        this.createMenu();
        this.setupEventListeners();
    }

    createMenu() {
        // Create hamburger button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.setAttribute('aria-label', 'Settings menu');
        hamburgerBtn.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'settings-dropdown';
        dropdown.innerHTML = `
            <div class="settings-section">
                <h3 class="settings-title" data-translate="languageLabel">Language</h3>
                <div class="language-options">
                    <button class="language-option" data-language="en">
                        <span class="language-flag">🇺🇸</span> <span data-translate="english">English</span>
                    </button>
                    <button class="language-option" data-language="no">
                        <span class="language-flag">🇳🇴</span> <span data-translate="norwegian">Norsk</span>
                    </button>
                </div>
            </div>
            <div class="settings-section">
                <div class="dark-mode-toggle">
                    <span class="dark-mode-label" data-translate="darkMode">Dark Mode</span>
                    <label class="toggle-switch">
                        <input type="checkbox" disabled>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="coming-soon-badge" data-translate="darkModeComingSoon">Coming soon</span>
                </div>
            </div>
        `;

        // Insert into header - handle both main site and game page headers
        let header = document.querySelector('.site-header .container');
        if (!header) {
            header = document.querySelector('.game-header .container');
        }

        if (!header) {
            console.error('Settings menu: No suitable header container found');
            return;
        }

        const menuContainer = document.createElement('div');
        menuContainer.className = 'settings-menu-container';
        menuContainer.appendChild(hamburgerBtn);
        menuContainer.appendChild(dropdown);

        header.appendChild(menuContainer);
        this.menuElement = dropdown;

        // Mark current language as selected
        this.updateLanguageSelection();
    }

    setupEventListeners() {
        // Hamburger button click
        document.addEventListener('click', (e) => {
            const hamburgerBtn = e.target.closest('.hamburger-btn');
            const settingsDropdown = e.target.closest('.settings-dropdown');
            const languageOption = e.target.closest('.language-option');

            if (hamburgerBtn) {
                this.toggleMenu();
                return;
            }

            if (languageOption) {
                const language = languageOption.dataset.language;
                translator.setLanguage(language);
                this.closeMenu();
                this.updateLanguageSelection();
                return;
            }

            // Close menu if clicked outside
            if (!hamburgerBtn && !settingsDropdown) {
                this.closeMenu();
            }
        });

        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            this.updateLanguageSelection();
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.menuElement.classList.toggle('open', this.isOpen);

        // Update hamburger button
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        hamburgerBtn.classList.toggle('open', this.isOpen);
    }

    closeMenu() {
        if (this.isOpen) {
            this.isOpen = false;
            this.menuElement.classList.remove('open');
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            hamburgerBtn.classList.remove('open');
        }
    }

    updateLanguageSelection() {
        const currentLang = translator.getCurrentLanguage();
        const languageOptions = document.querySelectorAll('.language-option');

        languageOptions.forEach(option => {
            const isSelected = option.dataset.language === currentLang;
            option.classList.toggle('selected', isSelected);
        });
    }
}

// Initialize settings menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const settingsMenu = new SettingsMenu();
});

// Export for use in other modules
window.SettingsMenu = SettingsMenu;
