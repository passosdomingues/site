import eventBus from '../core/EventBus.js';

/**
 * @brief Manages the application theme (dark/light modes).
 * @description Handles theme detection, application, persistence in localStorage,
 * and responds to system theme changes.
 */
export class ThemeManager {
    /**
     * @brief Constructs a new ThemeManager instance.
     * @param {object} [dependencies={}] - The dependencies for the manager.
     * @param {object} [dependencies.eventBus] - The event bus instance for communication.
     */
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.currentTheme = 'dark';
        this.isInitialized = false;
        this.systemPreference = null;

        this.onThemeChange = this.onThemeChange.bind(this);
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    }

    /**
     * @brief Initializes the theme manager.
     * @description Detects system preference, loads the saved theme from localStorage,
     * applies the theme, and sets up event listeners.
     */
    async init() {
        if (this.isInitialized) return;

        this.systemPreference = this.detectSystemPreference();
        
        const savedTheme = localStorage.getItem('app-theme');
        this.currentTheme = savedTheme || 'dark'; // Default to dark theme
        
        await this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.info(`ThemeManager: Initialized with theme: ${this.currentTheme}`);
    }

    /**
     * @brief Detects the user's preferred color scheme from the operating system.
     * @returns {string} 'dark' or 'light'.
     */
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * @brief Sets up event listeners for theme changes.
     * @description Subscribes to custom theme events and listens for OS-level theme changes.
     */
    setupEventListeners() {
        this.eventBus.subscribe('theme:change', this.onThemeChange);
        this.eventBus.subscribe('theme:toggle', this.toggleTheme.bind(this));
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    /**
     * @brief Handles changes in the system's color scheme.
     * @param {MediaQueryListEvent} event - The media query event object.
     */
    handleSystemThemeChange(event) {
        this.systemPreference = event.matches ? 'dark' : 'light';
        
        // Only update the theme if the user hasn't manually set one.
        if (!localStorage.getItem('app-theme')) {
            this.setTheme(this.systemPreference, true);
        }
    }

    /**
     * @brief Handles the 'theme:change' event from the event bus.
     * @param {object} data - The event data.
     * @param {string} data.theme - The new theme to apply ('light' or 'dark').
     */
    onThemeChange(data) {
        if (data.theme && this.isValidTheme(data.theme)) {
            this.setTheme(data.theme);
        }
    }

    /**
     * @brief Sets the application theme.
     * @param {string} theme - The theme to set ('light' or 'dark').
     * @param {boolean} [isSystemChange=false] - Flag to indicate if the change was triggered by the system.
     */
    async setTheme(theme, isSystemChange = false) {
        if (!this.isValidTheme(theme)) {
            console.warn(`ThemeManager: Invalid theme provided: ${theme}`);
            return;
        }

        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        await this.applyTheme(theme);
        
        if (!isSystemChange) {
            localStorage.setItem('app-theme', theme);
        }
        
        this.eventBus.publish('theme:changed', { 
            theme: this.currentTheme,
            previousTheme,
            isSystemChange
        });
    }

    /**
     * @brief Applies the specified theme to the DOM.
     * @description Sets the 'data-theme' attribute on the <html> element and adds
     * a transition class for a smooth visual change.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     * @returns {Promise<void>} A promise that resolves when the theme transition is complete.
     */
    async applyTheme(theme) {
        return new Promise((resolve) => {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeMeta(theme);
            
            document.documentElement.classList.add('theme-transition');
            
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
                resolve();
            }, 300); // Duration should match CSS transition time
        });
    }

    /**
     * @brief Updates the 'theme-color' meta tag in the document head.
     * @description This is used by mobile browsers to color the UI around the webpage.
     * @param {string} theme - The current theme ('light' or 'dark').
     */
    updateThemeMeta(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const themeColor = theme === 'dark' ? '#1a1f2d' : '#f7fafc';
        metaThemeColor.setAttribute('content', themeColor);
    }

    /**
     * @brief Toggles between 'light' and 'dark' themes.
     * @returns {string} The new theme.
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * @brief Validates if a given theme name is supported.
     * @param {string} theme - The theme name to check.
     * @returns {boolean} True if the theme is valid, otherwise false.
     */
    isValidTheme(theme) {
        return ['light', 'dark'].includes(theme);
    }

    /**
     * @brief Gets the current active theme.
     * @returns {string} The current theme ('light' or 'dark').
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * @brief Checks if the dark mode is currently active.
     * @returns {boolean} True if the current theme is 'dark'.
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * @brief Cleans up resources used by the ThemeManager.
     * @description Removes event listeners to prevent memory leaks.
     */
    destroy() {
        this.eventBus.unsubscribe('theme:change', this.onThemeChange);
        this.eventBus.unsubscribe('theme:toggle');
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        
        this.isInitialized = false;
        console.info('ThemeManager: Destroyed.');
    }
}