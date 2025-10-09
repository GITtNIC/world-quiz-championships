/**
 * Setup Screen Logic for World Flag Championships
 * Handles country/continent selection and game configuration
 */

// Game setup state
let countriesData = null;
let selectedCountryIds = new Set();
let continentStates = {};
let selectionMode = 'both'; // Selection mode: 'countries', 'both', 'territories'

// Continent configuration (internal keys)
const CONTINENTS = {
    'Africa': 'africa',
    'Asia': 'asia',
    'Europe': 'europe',
    'North America': 'northAmerica',
    'South America': 'southAmerica',
    'Oceania': 'oceania',
    'Antarctica': 'antarctica'
};

// Filter buttons configuration (continents only)
const FILTER_BUTTONS = {
    'Africa': 'africa',
    'Asia': 'asia',
    'Europe': 'europe',
    'North America': 'northAmerica',
    'South America': 'southAmerica',
    'Oceania': 'oceania'
};

/**
 * Initialize setup screen
 */
async function initSetup() {
    try {
        // Initialize translations and settings menu
        translator.initialize();

        // Load countries data
        const loadingIndicator = new LoadingIndicator({ text: 'Loading countries...' });
        loadingIndicator.show(document.body);

        await loadCountriesData();

        loadingIndicator.hide();

        // Check for saved game settings and restore them, or use defaults
        const savedSettings = Storage.get('gameSettings');
        if (savedSettings) {
            // Restore saved settings
            selectedCountryIds = new Set(savedSettings.selectedCountryIds || countriesData.countries.map(c => c.id));
            continentStates = { ...savedSettings.continentStates };
            selectionMode = savedSettings.selectionMode || 'both';

            // Restore time limit
            const timeSelect = document.getElementById('time-select');
            if (timeSelect && savedSettings.timeLimit) {
                timeSelect.value = savedSettings.timeLimit.toString();
            }

            // Restore selection mode radio buttons
            const selectionRadio = document.querySelector(`input[name="selection-mode"][value="${selectionMode}"]`);
            if (selectionRadio) {
                selectionRadio.checked = true;
            }
        } else {
            // Initialize with defaults
            selectedCountryIds = new Set(countriesData.countries.map(c => c.id));
            initializeContinentStates();
        }

        // Render UI
        renderFilterButtons();
        renderCountryButtons();

        // Update UI
        updateSelectedCounter();

        // Set up event listeners
        setupEventListeners();

        // Listen for language changes to update dynamic content
        document.addEventListener('languageChanged', () => {
            renderFilterButtons();
            updateSelectedCounter();
        });

        // Set default time limit if not already set from saved settings
        const timeSelect = document.getElementById('time-select');
        if (timeSelect && !timeSelect.value) {
            timeSelect.value = '180'; // 3 minutes default
        }

    } catch (error) {
        console.error('Failed to initialize setup:', error);
        ErrorHandler.showMessage('Failed to load countries data. Please refresh the page.');
    }
}

/**
 * Load countries data from JSON file
 */
async function loadCountriesData() {
    try {
        // Determine which data file to load based on current language
        const currentLanguage = localStorage.getItem('wqc-language') || 'en';
        const dataFile = currentLanguage === 'no' ? 'data/countries_no.json' : 'data/countries.json';

        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        countriesData = await response.json();

        if (!countriesData.countries || !countriesData.continents) {
            throw new Error('Invalid countries data format');
        }

        console.log(`Loaded ${countriesData.countries.length} countries`);

    } catch (error) {
        console.error('Error loading countries data:', error);
        throw error;
    }
}

/**
 * Initialize continent states (all selected by default)
 */
function initializeContinentStates() {
    continentStates = {};
    Object.keys(CONTINENTS).forEach(continent => {
        continentStates[continent] = true;
    });
}

/**
 * Render filter buttons with count information
 */
function renderFilterButtons() {
    const container = document.getElementById('filter-buttons');
    if (!container) return;

    container.innerHTML = '';

    const counts = getContinentCounts();

    Object.keys(FILTER_BUTTONS).forEach(filterKey => {
        let buttonText = translator.getTranslation(FILTER_BUTTONS[filterKey]);
        let buttonClass = 'filter-btn continent-filter';

        // Get count display based on selection mode
        let countDisplay = '';
        if (counts[filterKey] && selectionMode !== 'both') {
            if (selectionMode === 'countries') {
                countDisplay = `(${counts[filterKey].countries})`;
            } else if (selectionMode === 'territories') {
                countDisplay = `(${counts[filterKey].territories})`;
            }
        }

        if (countDisplay) {
            buttonText = `${buttonText} ${countDisplay}`;
        }

        const button = DOM.create('button', {
            class: buttonClass + (continentStates[filterKey] ? ' active' : ''),
            'data-filter': filterKey
        });

        // Create text span
        const textSpan = DOM.create('span', {
            class: 'filter-text',
            text: buttonText
        });
        button.appendChild(textSpan);

        // Add click handler
        button.addEventListener('click', () => toggleFilter(filterKey, button));

        container.appendChild(button);
    });
}

/**
 * Render country selection buttons
 */
function renderCountryButtons() {
    const container = document.getElementById('country-buttons');
    if (!container) return;

    container.innerHTML = '';

    countriesData.countries.forEach(country => {
        const button = DOM.create('button', {
            class: `country-btn${selectedCountryIds.has(country.id) ? ' active' : ''}`,
            'data-country-id': country.id
        });

        // Create flag img element
        const img = DOM.create('img', {
            src: country.flagPath,
            alt: country.name,
            loading: 'lazy'
        });

        // Add error handling for flags
        img.addEventListener('error', () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTJlOGYwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIxNSIgZm9udC1mYW1pbHk9ImFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0iYWlkIGltaWQiPk4vQTwvdGV4dD4KPC9zdmc+'; // N/A placeholder
        });

        // Create country name span
        const span = DOM.create('span', {
            text: country.name
        });

        // Add click handler
        button.addEventListener('click', () => toggleCountry(country.id, button));

        // Append elements
        button.appendChild(img);
        button.appendChild(span);
        container.appendChild(button);
    });
}

/**
 * Toggle continent filter
 */
function toggleFilter(filterKey, buttonElement) {
    const isCurrentlyActive = buttonElement.classList.contains('active');
    const shouldSelect = !isCurrentlyActive;

    // Handle continent filter
    continentStates[filterKey] = shouldSelect;
    applyFilters();

    // Update button state
    buttonElement.classList.toggle('active', shouldSelect);

    // Update UI
    updateCountryButtons();
    updateSelectedCounter();
    updateStartButton();
}

/**
 * Apply all filters to update country selection
 */
function applyFilters() {
    let filteredCountryIds = new Set();

    // Get active continents
    const activeContinents = Object.keys(continentStates).filter(cont => continentStates[cont]);

    // Filter logic based on selection mode
    if (activeContinents.length > 0) {
        activeContinents.forEach(continent => {
            const countryIds = countriesData.continents[continent] || [];
            countryIds.forEach(id => {
                const country = countriesData.countries.find(c => c.id === id);
                if (!country) return;

                // Apply selection mode filter
                const shouldInclude = (selectionMode === 'both') ||
                    (selectionMode === 'countries' && country.status !== 'territory') ||
                    (selectionMode === 'territories' && country.status === 'territory');

                if (shouldInclude) {
                    filteredCountryIds.add(id);
                }
            });
        });
    }
    // If NO continents selected but selection mode is territories, show ALL territories globally
    else if (selectionMode === 'territories') {
        countriesData.countries
            .filter(country => country.status === 'territory')
            .forEach(country => filteredCountryIds.add(country.id));
    }
    // If NO continents selected and selection mode is countries, show ALL countries globally
    else if (selectionMode === 'countries') {
        countriesData.countries
            .filter(country => country.status !== 'territory')
            .forEach(country => filteredCountryIds.add(country.id));
    }
    // If NO continents selected and selection mode is both, show ALL countries and territories
    else if (selectionMode === 'both') {
        countriesData.countries.forEach(country => filteredCountryIds.add(country.id));
    }

    // Filter out countries we don't want in the game (like Antarctica)
    filteredCountryIds = new Set([...filteredCountryIds].filter(id => id !== 'ATA'));

    // Update selected countries to match filtered results
    selectedCountryIds = filteredCountryIds;
}

/**
 * Update filter button states based on current selections
 */
function updateFilterButtons() {
    // No need to do anything here anymore since renderFilterButtons handles everything
    // and we no longer have a territories button
}

/**
 * Toggle individual country selection
 */
function toggleCountry(countryId, buttonElement) {
    if (selectedCountryIds.has(countryId)) {
        selectedCountryIds.delete(countryId);
        buttonElement.classList.remove('active');
    } else {
        selectedCountryIds.add(countryId);
        buttonElement.classList.add('active');
    }

    updateContinentButtons();
    updateSelectedCounter();
    updateStartButton();
}

/**
 * Update country button states based on selections
 */
function updateCountryButtons() {
    const buttons = document.querySelectorAll('.country-btn');
    buttons.forEach(button => {
        const countryId = button.dataset.countryId;
        const isSelected = selectedCountryIds.has(countryId);
        button.classList.toggle('active', isSelected);
    });
}

/**
 * Update continent button states based on country selections
 */
function updateContinentButtons() {
    Object.keys(CONTINENTS).forEach(continent => {
        const button = document.querySelector(`[data-continent="${continent}"]`);
        if (!button) return;

        const countryIdsInContinent = countriesData.continents[continent] || [];
        const selectedInContinent = countryIdsInContinent.filter(id => selectedCountryIds.has(id)).length;
        const totalInContinent = countryIdsInContinent.length;

        // Continent is active if all countries are selected
        const isActive = selectedInContinent === totalInContinent && totalInContinent > 0;
        button.classList.toggle('active', isActive);
    });
}

/**
 * Update selected countries counter with breakdown
 */
function updateSelectedCounter() {
    const counter = document.getElementById('selected-count');
    if (!counter) return;

    const selectedCountries = countriesData.countries.filter(c => selectedCountryIds.has(c.id));
    const selectedTerritories = selectedCountries.filter(c => c.status === 'territory');
    const selectedRegularCountries = selectedCountries.filter(c => c.status !== 'territory');

    if (selectedTerritories.length > 0) {
        const selectedText = translator.getTranslation('selected');
        const countriesText = translator.getTranslation('countries');
        const territoriesText = translator.getTranslation('territories');
        counter.textContent = `${selectedCountryIds.size} ${selectedText} (${selectedRegularCountries.length} ${countriesText}, ${selectedTerritories.length} ${territoriesText})`;
        counter.classList.add('with-breakdown');
    } else {
        const selectedText = translator.getTranslation('selected');
        counter.textContent = `${selectedCountryIds.size} ${selectedText}`;
        counter.classList.remove('with-breakdown');
    }
}

/**
 * Update start button state
 */
function updateStartButton() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.disabled = selectedCountryIds.size === 0;
    }
}

/**
 * Clear all game settings and reset to defaults
 */
function clearSettings() {
    // Clear saved settings from storage
    Storage.remove('gameSettings');

    // Reset to all countries selected
    selectedCountryIds = new Set(countriesData.countries.map(c => c.id));

    // Reset all continents to active
    initializeContinentStates();

    // Reset selection mode to "both"
    selectionMode = 'both';
    const selectionRadio = document.querySelector('input[name="selection-mode"][value="both"]');
    if (selectionRadio) {
        selectionRadio.checked = true;
    }

    // Reset time limit to 3 minutes
    const timeSelect = document.getElementById('time-select');
    if (timeSelect) {
        timeSelect.value = '180';
    }

    // Update UI
    renderFilterButtons();
    renderCountryButtons();
    updateSelectedCounter();
    updateStartButton();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Start game button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }

    // Clear settings button
    const clearBtn = document.getElementById('clear-settings-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSettings);
    }

    // Enter key on time select should not submit form
    const timeSelect = document.getElementById('time-select');
    if (timeSelect) {
        timeSelect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }

    // Selection mode radio buttons
    const selectionRadios = document.querySelectorAll('input[name="selection-mode"]');
    selectionRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectionMode = e.target.value;
            applyFilters();
            renderFilterButtons();
            updateSelectedCounter();
            updateStartButton();
        });
    });
}

/**
 * Start the game
 */
function startGame() {
    if (selectedCountryIds.size === 0) {
        ErrorHandler.showMessage('Please select at least one country to play.');
        return;
    }

    const timeLimit = parseInt(document.getElementById('time-select').value) || 0;

    // Save game settings
    const gameSettings = {
        selectedCountryIds: Array.from(selectedCountryIds),
        timeLimit: timeLimit,
        continentStates: { ...continentStates },
        selectionMode: selectionMode
    };

    if (!Storage.set('gameSettings', gameSettings)) {
        ErrorHandler.showMessage('Failed to save game settings. Please try again.');
        return;
    }

    // Navigate to game screen
    window.location.href = 'game.html';
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to start game
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const startBtn = document.getElementById('start-btn');
        if (startBtn && !startBtn.disabled) {
            startGame();
        }
    }
});


/**
 * Get territory and country counts for each continent
 */
function getContinentCounts() {
    if (!countriesData) return {};

    const counts = {};

    Object.keys(CONTINENTS).forEach(continent => {
        const countryIds = countriesData.continents[continent] || [];
        const countries = countryIds.map(id => countriesData.countries.find(c => c.id === id)).filter(c => c);

        counts[continent] = {
            total: countries.length,
            territories: countries.filter(c => c.status === 'territory').length,
            countries: countries.filter(c => c.status !== 'territory').length
        };
    });

    // Also add total territories
    const allTerritories = countriesData.countries.filter(c => c.status === 'territory');
    counts.totalTerritories = allTerritories.length;

    return counts;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSetup);
