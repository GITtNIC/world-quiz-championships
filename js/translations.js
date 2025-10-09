/**
 * Translation system for World Quiz Championships
 * Supports English and Norwegian languages
 */

const translations = {
    en: {
        siteTitle: "World Quiz Championships",
        siteSubtitle: "Test your knowledge of geography, math, and more!",
        geographyGames: "Geography Games",
        geographyDescription: "Explore the world and test your country knowledge!",
        playGeography: "Play Geography",
        mathGames: "Math Games",
        mathDescription: "Challenge your mathematical skills (Coming Soon)",
        comingSoon: "Coming Soon",
        languageLabel: "Language",
        english: "English",
        norwegian: "Norsk",
        darkMode: "Dark Mode",
        darkModeComingSoon: "Coming soon",
        // Setup page translations
        flagChampionshipsTitle: "World Flag Championships",
        step1Title: "Step 1: Select Regions",
        step1Description: "Choose which continents or regions you want to include in your quiz.",
        countriesOnly: "Countries Only",
        both: "Both",
        territoriesOnly: "Territories Only",
        step2Title: "Step 2: Choose Countries",
        step2Description: "Fine-tune your selection by choosing specific countries.",
        countriesSelected: "countries selected",
        withTerritories: "with territories",
        selected: "valgt",
        countries: "land",
        territories: "territorier",
        step3Title: "Step 3: Set Time Limit",
        step3Description: "How long do you want to play? (Default: 3 minutes)",
        veryQuick: "30 seconds (Very quick)",
        fast: "1 minute (Fast)",
        standard: "3 minutes (Standard)",
        leisurely: "5 minutes (Leisurely)",
        long: "10 minutes (Long)",
        veryLong: "20 minutes (Very long)",
        noLimit: "No limit (Endless)",
        startGame: "Start Game",
        backToMain: "← Back to Main",
        clearSettings: "Clear Settings",
        // Continents
        africa: "Africa",
        asia: "Asia",
        europe: "Europe",
        northAmerica: "North America",
        southAmerica: "South America",
        oceania: "Oceania"
    },
    no: {
        siteTitle: "VM i Quiz",
        siteSubtitle: "Test kunnskapen din om geografi, matematikk og mer!",
        geographyGames: "Geografispill",
        geographyDescription: "Utforsk verden og test kunnskapen din om land!",
        playGeography: "Spill Geografi",
        mathGames: "Mattespill",
        mathDescription: "Utfordre dine matematiske ferdigheter (Kommer snart)",
        comingSoon: "Kommer snart",
        languageLabel: "Språk",
        english: "English",
        norwegian: "Norsk",
        darkMode: "Mørk modus",
        darkModeComingSoon: "Kommer snart",
        // Setup page translations
        flagChampionshipsTitle: "VM i flagg",
        step1Title: "Trinn 1: Velg regioner",
        step1Description: "Velg hvilke kontinenter eller regioner du vil inkludere i quizen din.",
        countriesOnly: "Kun land",
        both: "Begge",
        territoriesOnly: "Kun territorier",
        step2Title: "Trinn 2: Velg land",
        step2Description: "Juster utvalget ved å velge spesifikke land.",
        countriesSelected: "land valgt",
        withTerritories: "med territorier",
        step3Title: "Trinn 3: Tidsgrense",
        step3Description: "Hvor lenge vil du spille? (Standard: 3 minutter)",
        veryQuick: "30 sekunder (Svært raskt)",
        fast: "1 minutt (Raskt)",
        standard: "3 minutter (Standard)",
        leisurely: "5 minutter (Ledig)",
        long: "10 minutter (Langt)",
        veryLong: "20 minutter (Svært langt)",
        noLimit: "Ingen begrensning (Endeløs)",
        startGame: "Start spill",
        backToMain: "← Tilbake til hovedmeny",
        clearSettings: "Tøm innstillinger",
        // Continents
        africa: "Afrika",
        asia: "Asia",
        europe: "Europa",
        northAmerica: "Nord-Amerika",
        southAmerica: "Sør-Amerika",
        oceania: "Oseania"
    }
};

class TranslationService {
    constructor() {
        this.currentLanguage = localStorage.getItem('wqc-language') || 'en';
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setLanguage(language) {
        if (translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('wqc-language', language);
            this.updatePageLanguage();
        }
    }

    getTranslation(key) {
        return translations[this.currentLanguage][key] || key;
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

    initialize() {
        this.updatePageLanguage();
    }
}

// Initialize translation service globally
const translator = new TranslationService();

// Export for use in modules
window.TranslationService = TranslationService;
window.translator = translator;
