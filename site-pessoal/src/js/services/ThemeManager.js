import eventBus from '../core/EventBus.js';

/**
 * @brief Theme manager service
 * @description Manages application theme and dark/light mode with persistence
 */
export class ThemeManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.currentTheme = 'light';
        this.isInitialized = false;
        this.systemPreference = null;

        this.onThemeChange = this.onThemeChange.bind(this);
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    }

    /**
     * @brief Initialize theme manager
     * @description Loads saved theme or detects system preference
     */
    async init() {
        if (this.isInitialized) return;

        // Detect system preference
        this.systemPreference = this.detectSystemPreference();
        
        // Load saved theme or use system preference
        const savedTheme = localStorage.getItem('app-theme');
        this.currentTheme = savedTheme || this.systemPreference;
        
        // Apply theme
        await this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.info('ThemeManager: Initialized with theme:', this.currentTheme);
    }

    /**
     * @brief Detect system color scheme preference
     * @returns {string} 'light' or 'dark'
     */
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        // Listen for theme change events
        this.eventBus.subscribe('theme:change', this.onThemeChange);
        this.eventBus.subscribe('theme:toggle', this.toggleTheme.bind(this));
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', this.handleSystemThemeChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(this.handleSystemThemeChange);
        }
    }

    /**
     * @brief Handle system theme changes
     * @param {MediaQueryListEvent} event - Media query event
     */
    handleSystemThemeChange(event) {
        this.systemPreference = event.matches ? 'dark' : 'light';
        
        // Only update if no manual theme is set
        if (!localStorage.getItem('app-theme')) {
            this.setTheme(this.systemPreference, true);
        }
        
        console.info('ThemeManager: System theme preference changed to:', this.systemPreference);
    }

    /**
     * @brief Handle theme change events
     * @param {Object} data - Event data
     */
    onThemeChange(data) {
        if (data.theme && this.isValidTheme(data.theme)) {
            this.setTheme(data.theme);
        }
    }

    /**
     * @brief Set application theme
     * @param {string} theme - Theme name ('light' or 'dark')
     * @param {boolean} isSystemChange - Whether this is a system-triggered change
     */
    async setTheme(theme, isSystemChange = false) {
        if (!this.isValidTheme(theme)) {
            console.warn('ThemeManager: Invalid theme:', theme);
            return;
        }

        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        // Apply theme to DOM
        await this.applyTheme(theme);
        
        // Save preference (unless this is a system change and we have a manual preference)
        if (!isSystemChange || !localStorage.getItem('app-theme')) {
            if (isSystemChange) {
                // Clear manual preference to follow system
                localStorage.removeItem('app-theme');
            } else {
                // Save manual preference
                localStorage.setItem('app-theme', theme);
            }
        }
        
        // Publish theme change event
        this.eventBus.publish('theme:changed', { 
            theme: this.currentTheme,
            previousTheme,
            isSystemChange
        });
        
        console.info(`ThemeManager: Theme changed to: ${theme}${isSystemChange ? ' (system)' : ''}`);
    }

    /**
     * @brief Apply theme to document
     * @param {string} theme - Theme name
     */
    async applyTheme(theme) {
        return new Promise((resolve) => {
            // Set data-theme attribute
            document.documentElement.setAttribute('data-theme', theme);
            
            // Update meta theme-color for mobile browsers
            this.updateThemeMeta(theme);
            
            // Add transition class for smooth theme switching
            document.documentElement.classList.add('theme-transition');
            
            // Remove transition class after animation
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
                resolve();
            }, 300);
        });
    }

    /**
     * @brief Update theme-color meta tag
     * @param {string} theme - Theme name
     */
    updateThemeMeta(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set appropriate theme color based on theme
        const themeColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
        metaThemeColor.setAttribute('content', themeColor);
    }

    /**
     * @brief Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * @brief Reset to system theme preference
     */
    resetToSystemTheme() {
        localStorage.removeItem('app-theme');
        this.setTheme(this.systemPreference, true);
    }

    /**
     * @brief Check if theme is valid
     * @param {string} theme - Theme to validate
     * @returns {boolean} True if theme is valid
     */
    isValidTheme(theme) {
        return ['light', 'dark'].includes(theme);
    }

    /**
     * @brief Get current theme
     * @returns {string} Current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * @brief Get system preference
     * @returns {string} System theme preference
     */
    getSystemPreference() {
        return this.systemPreference;
    }

    /**
     * @brief Check if dark mode is active
     * @returns {boolean} Dark mode status
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * @brief Check if using manual theme (not system)
     * @returns {boolean} True if manual theme is set
     */
    isManualTheme() {
        return localStorage.getItem('app-theme') !== null;
    }

    /**
     * @brief Get theme information
     * @returns {Object} Theme information object
     */
    getThemeInfo() {
        return {
            current: this.currentTheme,
            system: this.systemPreference,
            isManual: this.isManualTheme(),
            isDark: this.isDarkMode()
        };
    }

    /**
     * @brief Destroy theme manager
     */
    destroy() {
        // Remove event bus subscriptions
        this.eventBus.unsubscribe('theme:change', this.onThemeChange);
        this.eventBus.unsubscribe('theme:toggle');
        
        // Remove media query listeners
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        } else {
            mediaQuery.removeListener(this.handleSystemThemeChange);
        }
        
        this.isInitialized = false;
        console.info('ThemeManager: Destroyed');
    }
}