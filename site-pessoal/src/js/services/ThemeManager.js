/**
 * @brief Theme manager service
 * @description Manages application theme, dark/light mode, and persistence
 * @description Compatible with AccessibilityManager for coordinated UI updates
 */
export class ThemeManager {
    /**
     * @brief ThemeManager constructor
     * @param {Object} dependencies - Service dependencies
     * @param {Object} dependencies.eventBus - Event bus for inter-component communication
     */
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus;
        this.currentTheme = 'light';
        this.isInitialized = false;
        this.storageKey = 'portfolio-theme-preference';

        // Bind methods for event listeners
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
        this.onAccessibilityChange = this.onAccessibilityChange.bind(this);
    }

    /**
     * @brief Initialize theme manager
     * @description Loads saved theme preference or detects system preference
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            console.warn('ThemeManager: Already initialized');
            return;
        }

        try {
            await this.loadThemePreference();
            this.applyCurrentTheme();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.info('ThemeManager: Initialized successfully with theme:', this.currentTheme);
            
        } catch (error) {
            console.error('ThemeManager: Initialization failed', error);
            throw error;
        }
    }

    /**
     * @brief Set up event listeners for theme changes
     */
    setupEventListeners() {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', this.handleSystemThemeChange);
        
        // Listen for accessibility changes that might affect theme
        if (this.eventBus) {
            this.eventBus.subscribe('accessibility:highcontrast:toggle', this.onAccessibilityChange);
        }
    }

    /**
     * @brief Handle system theme preference changes
     * @param {MediaQueryListEvent} event - Media query event
     */
    handleSystemThemeChange(event) {
        // Only auto-update if user hasn't set a manual preference
        if (!localStorage.getItem(this.storageKey)) {
            const newTheme = event.matches ? 'dark' : 'light';
            this.setTheme(newTheme, false);
        }
    }

    /**
     * @brief Handle accessibility-related theme changes
     * @param {Object} data - Event data
     */
    onAccessibilityChange(data) {
        if (data.highContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-high-contrast');
        }
    }

    /**
     * @brief Load theme preference from storage or detect system preference
     * @returns {Promise<void>}
     */
    async loadThemePreference() {
        try {
            const savedTheme = localStorage.getItem(this.storageKey);
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
                this.currentTheme = savedTheme;
            } else {
                this.currentTheme = systemPrefersDark ? 'dark' : 'light';
            }
            
        } catch (error) {
            console.warn('ThemeManager: Failed to load theme preference, using default');
            this.currentTheme = 'light';
        }
    }

    /**
     * @brief Set and apply application theme
     * @param {string} theme - Theme name ('light' or 'dark')
     * @param {boolean} savePreference - Whether to save to localStorage
     */
    setTheme(theme, savePreference = true) {
        if (!['light', 'dark'].includes(theme)) {
            console.warn('ThemeManager: Invalid theme requested:', theme);
            return;
        }

        console.log('ThemeManager: Setting theme to:', theme);
        this.currentTheme = theme;
        this.applyCurrentTheme();

        if (savePreference) {
            this.saveThemePreference();
        }

        // Notify other components about theme change
        if (this.eventBus) {
            this.eventBus.publish('theme:changed', { 
                theme: this.currentTheme,
                isDarkMode: this.isDarkMode()
            });
        }

        console.info('ThemeManager: Theme changed to:', this.currentTheme);
    }

    /**
     * @brief Apply current theme to document and meta tags
     */
    applyCurrentTheme() {
        const { documentElement } = document;
        
        // Set data-theme attribute
        documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update meta theme-color for mobile browsers
        this.updateThemeMetaTag();
        
        // Update CSS custom properties
        this.updateCssCustomProperties();
    }

    /**
     * @brief Update theme-color meta tag for mobile browsers
     */
    updateThemeMetaTag() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const themeColor = this.isDarkMode() ? '#1a1a2e' : '#2c3e50';
        metaThemeColor.setAttribute('content', themeColor);
    }

    /**
     * @brief Update CSS custom properties for theme
     */
    updateCssCustomProperties() {
        const root = document.documentElement;
        const isDark = this.isDarkMode();
        
        // Update CSS variables based on theme
        if (isDark) {
            root.style.setProperty('--primary-color', '#5dade2');
            root.style.setProperty('--secondary-color', '#3498db');
            root.style.setProperty('--text-color', '#ecf0f1');
            root.style.setProperty('--background-color', '#1a1a2e');
            root.style.setProperty('--component-bg', '#2c3e50');
            root.style.setProperty('--nav-bg', 'rgba(26, 26, 46, 0.95)');
        } else {
            root.style.setProperty('--primary-color', '#2c3e50');
            root.style.setProperty('--secondary-color', '#3498db');
            root.style.setProperty('--text-color', '#2c3e50');
            root.style.setProperty('--background-color', '#ffffff');
            root.style.setProperty('--component-bg', '#ffffff');
            root.style.setProperty('--nav-bg', 'rgba(255, 255, 255, 0.95)');
        }
    }

    /**
     * @brief Save current theme preference to localStorage
     */
    saveThemePreference() {
        try {
            localStorage.setItem(this.storageKey, this.currentTheme);
        } catch (error) {
            console.warn('ThemeManager: Failed to save theme preference', error);
        }
    }

    /**
     * @brief Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.isDarkMode() ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /**
     * @brief Get current theme
     * @returns {string} Current theme name
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * @brief Check if dark mode is currently active
     * @returns {boolean} True if dark mode is active
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * @brief Reset theme to system preference
     */
    resetToSystemPreference() {
        localStorage.removeItem(this.storageKey);
        this.loadThemePreference();
        this.applyCurrentTheme();
    }

    /**
     * @brief Clean up theme manager resources
     */
    destroy() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        
        if (this.eventBus) {
            this.eventBus.unsubscribe('accessibility:highcontrast:toggle', this.onAccessibilityChange);
        }
        
        this.isInitialized = false;
        console.info('ThemeManager: Cleaned up successfully');
    }
}