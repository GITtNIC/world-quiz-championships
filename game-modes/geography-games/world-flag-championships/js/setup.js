/**
 * Setup Screen Logic for World Flag Championships
 * Handles country/continent selection and game configuration
 */

// Game setup state
let countriesData = null;
let selectedCountryIds = new Set();
let continentStates = {};
let territoryIncluded = true; // Territory filter state

// Continent configuration (human-readable names)
const CONTINENTS = {
    'Africa': 'Africa',
    'Asia': 'Asia',
    'Europe': 'Europe',
    'North America': 'North America',
    'South America': 'South America',
    'Oceania': 'Oceania',
    'Antarctica': 'Antarctica'
};

// Filter buttons configuration (reordered with Territory after Antarctica, removed ocean regions)
const FILTER_BUTTONS = {
    'Africa': 'Africa',
    'Asia': 'Asia',
    'Europe': 'Europe',
    'North America': 'North America',
    'South America': 'South America',
    'Oceania': 'Oceania',
    'Antarctica': 'Antarctica',
    'territories': 'Territory'
};

/**
 * Initialize setup screen
 */
async function initSetup() {
    try {
        // Load countries data
        const loadingIndicator = new LoadingIndicator({ text: 'Loading countries...' });
        loadingIndicator.show(document.body);

        await loadCountriesData();

        loadingIndicator.hide();

        // Initialize state
        selectedCountryIds = new Set(countriesData.countries.map(c => c.id));
        initializeContinentStates();

        // Render UI
        renderFilterButtons();
        renderCountryButtons();

        // Update UI
        updateSelectedCounter();

        // Set up event listeners
        setupEventListeners();

        // Set default time limit
        const timeSelect = document.getElementById('time-select');
        if (timeSelect) {
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
        const response = await fetch('data/countries.json');
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
 * Render filter buttons (territories and continents)
 */
function renderFilterButtons() {
    const container = document.getElementById('filter-buttons');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(FILTER_BUTTONS).forEach(filterKey => {
        const button = DOM.create('button', {
            class: 'filter-btn active',
            text: FILTER_BUTTONS[filterKey],
            'data-filter': filterKey
        });

        // Set territory button to be selected by default (active)
        if (filterKey === 'territories') {
            territoryIncluded = true; // Ensure it's set to true
        }

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
 * Toggle filter (either continent or territory)
 */
function toggleFilter(filterKey, buttonElement) {
    const isCurrentlyActive = buttonElement.classList.contains('active');
    const shouldSelect = !isCurrentlyActive;

    if (filterKey === 'territories') {
        // Handle territory filter
        territoryIncluded = shouldSelect;
        applyFilters();
    } else {
        // Handle continent filter
        continentStates[filterKey] = shouldSelect;
        applyFilters();
    }

    // Update button state
    buttonElement.classList.toggle('active', shouldSelect);

    // Update UI
    updateCountryButtons();
    updateFilterButtons();
    updateSelectedCounter();
    updateStartButton();
}

/**
 * Apply all filters to update country selection
 */
function applyFilters() {
    // Start with all countries, then filter based on active filters
    let filteredCountryIds = new Set(countriesData.countries.map(c => c.id));

    // Apply continent filters
    const activeContinents = Object.keys(continentStates).filter(cont => continentStates[cont]);
    if (activeContinents.length < Object.keys(continentStates).length) {
        // If not all continents are selected, filter to only include selected continents
        filteredCountryIds.clear();
        activeContinents.forEach(continent => {
            const countryIds = countriesData.continents[continent] || [];
            countryIds.forEach(id => filteredCountryIds.add(id));
        });
    }

    // Apply territory filter
    if (!territoryIncluded) {
        // Remove all territories from the filtered set
        const territoryCountries = countriesData.countries
            .filter(country => country.status === 'territory')
            .map(country => country.id);
        territoryCountries.forEach(id => filteredCountryIds.delete(id));
    }

    // Update selected countries to match filtered results
    selectedCountryIds = filteredCountryIds;
}

/**
 * Update filter button states based on current selections
 */
function updateFilterButtons() {
    // Update continent filter buttons
    Object.keys(CONTINENTS).forEach(continent => {
        const button = document.querySelector(`[data-filter="${continent}"]`);
        if (!button) return;

        const isActive = continentStates[continent];
        button.classList.toggle('active', isActive);
    });

    // Update territory filter button
    const territoryButton = document.querySelector('[data-filter="territories"]');
    if (territoryButton) {
        territoryButton.classList.toggle('active', territoryIncluded);
    }
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
 * Update selected countries counter
 */
function updateSelectedCounter() {
    const counter = document.getElementById('selected-count');
    if (counter) {
        counter.textContent = selectedCountryIds.size;
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
 * Set up event listeners
 */
function setupEventListeners() {
    // Start game button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
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
        continentStates: { ...continentStates }
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSetup);
