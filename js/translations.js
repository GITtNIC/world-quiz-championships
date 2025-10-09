/**
 * Translation system for World Quiz Championships
 * Supports dynamic loading of translation files
 */

class TranslationService {
    constructor() {
        this.currentLanguage = localStorage.getItem('wqc-language') || 'en';
        this.translations = {};
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    async setLanguage(language) {
        if (language === this.currentLanguage) return;

        this.currentLanguage = language;
        localStorage.setItem('wqc-language', language);

        try {
            await this.loadTranslations(language);
            this.updatePageLanguage();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    async loadTranslations(language) {
        if (this.translations[language]) return this.translations[language];

        const response = await fetch(`/world-quiz-championships/assets/translations/${language}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${language}`);
        }
        this.translations[language] = await response.json();
        return this.translations[language];
    }

    updatePageLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage === 'no' ? 'nb' : 'en';

        // Update all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (element.tagName === 'OPTION') {
                // For select options, get the current value and create new option
                const currentValue = element.value;
                const selected = element.selected;
                const newOption = document.createElement('option');
                newOption.value = currentValue;
                newOption.textContent = translation;
                newOption.selected = selected;
                element.parentNode.replaceChild(newOption, element);
            } else {
                element.textContent = translation;
            }
        });

        // Dispatch custom event for other components to listen to
        const event = new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        });
        document.dispatchEvent(event);
    }

    async initialize() {
        await this.loadTranslations(this.currentLanguage);
        this.updatePageLanguage();
    }
}

// Initialize translation service globally
const translator = new TranslationService();

// Export for use in modules
window.TranslationService = TranslationService;
window.translator = translator;
