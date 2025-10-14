/**
 * @file Theme manager service
 * @brief Manages application theme and dark/light mode with persistence
 */

import eventBus from '../core/EventBus.js';

/**
 * @class ThemeManager
 * @brief Handles theme management and system preference detection
 */
export class ThemeManager {
    /**
     * @brief Constructs ThemeManager instance
     * @param {Object} dependencies - Service dependencies
     * @param {Object} dependencies.eventBus - Event bus instance
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
     * @brief Initialize theme manager
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) return;

        this.systemPreference = this.detectSystemPreference();
        
        const savedTheme = localStorage.getItem('app-theme');
        this.currentTheme = savedTheme || 'dark';
        
        await this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.info('ThemeManager: Initialized with theme:', this.currentTheme);
    }

    /**
     * @brief Detect system color scheme preference
     * @returns {string} System preference ('dark' or 'light')
     */
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * @brief Set up event listeners for theme changes
     */
    setupEventListeners() {
        this.eventBus.subscribe('theme:change', this.onThemeChange);
        this.eventBus.subscribe('theme:toggle', this.toggleTheme.bind(this));
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    /**
     * @brief Handle system theme changes
     * @param {MediaQueryListEvent} event - Media query change event
     */
    handleSystemThemeChange(event) {
        this.systemPreference = event.matches ? 'dark' : 'light';
        
        if (!localStorage.getItem('app-theme')) {
            this.setTheme(this.systemPreference, true);
        }
    }

    /**
     * @brief Handle theme change events from event bus
     * @param {Object} data - Event data containing theme information
     */
    onThemeChange(data) {
        if (data.theme && this.isValidTheme(data.theme)) {
            this.setTheme(data.theme);
        }
    }

    /**
     * @brief Set application theme
     * @async
     * @param {string} theme - Theme to apply ('light' or 'dark')
     * @param {boolean} isSystemChange - Whether change is from system preference
     * @returns {Promise<void>}
     */
    async setTheme(theme, isSystemChange = false) {
        if (!this.isValidTheme(theme)) {
            console.warn('ThemeManager: Invalid theme:', theme);
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
     * @brief Apply theme to document with transition
     * @param {string} theme - Theme to apply
     * @returns {Promise} Promise that resolves after transition
     */
    async applyTheme(theme) {
        return new Promise((resolve) => {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeMeta(theme);
            
            document.documentElement.classList.add('theme-transition');
            
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
                resolve();
            }, 300);
        });
    }

    /**
     * @brief Update theme-color meta tag for browser UI
     * @param {string} theme - Current theme
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
     * @brief Toggle between light and dark themes
     * @returns {string} New theme after toggle
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * @brief Check if theme is valid
     * @param {string} theme - Theme to validate
     * @returns {boolean} Validation result
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
     * @brief Check if dark mode is active
     * @returns {boolean} Dark mode status
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * @brief Destroy theme manager and clean up resources
     */
    destroy() {
        this.eventBus.unsubscribe('theme:change', this.onThemeChange);
        this.eventBus.unsubscribe('theme:toggle');
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        
        this.isInitialized = false;
    }
}