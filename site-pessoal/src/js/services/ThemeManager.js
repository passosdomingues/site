import eventBus from '../core/EventBus.js';

/**
 * @brief Theme manager service
 * @description Manages application theme and dark/light mode with persistence
 */
export class ThemeManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.currentTheme = 'dark'; // Default to dark
        this.isInitialized = false;
        this.systemPreference = null;

        this.onThemeChange = this.onThemeChange.bind(this);
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
    }

    /**
     * @brief Initialize theme manager
     */
    async init() {
        if (this.isInitialized) return;

        // Detect system preference
        this.systemPreference = this.detectSystemPreference();
        
        // Load saved theme or use dark as default
        const savedTheme = localStorage.getItem('app-theme');
        this.currentTheme = savedTheme || 'dark'; // Force dark as default
        
        // Apply theme
        await this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.info('ThemeManager: Initialized with theme:', this.currentTheme);
    }

    /**
     * @brief Detect system color scheme preference
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
        this.eventBus.subscribe('theme:change', this.onThemeChange);
        this.eventBus.subscribe('theme:toggle', this.toggleTheme.bind(this));
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }

    /**
     * @brief Handle system theme changes
     */
    handleSystemThemeChange(event) {
        this.systemPreference = event.matches ? 'dark' : 'light';
        
        // Only update if no manual theme is set
        if (!localStorage.getItem('app-theme')) {
            this.setTheme(this.systemPreference, true);
        }
    }

    /**
     * @brief Handle theme change events
     */
    onThemeChange(data) {
        if (data.theme && this.isValidTheme(data.theme)) {
            this.setTheme(data.theme);
        }
    }

    /**
     * @brief Set application theme
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
        
        // Save preference unless this is a system change
        if (!isSystemChange) {
            localStorage.setItem('app-theme', theme);
        }
        
        // Publish theme change event
        this.eventBus.publish('theme:changed', { 
            theme: this.currentTheme,
            previousTheme,
            isSystemChange
        });
    }

    /**
     * @brief Apply theme to document
     */
    async applyTheme(theme) {
        return new Promise((resolve) => {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeMeta(theme);
            
            // Add transition class
            document.documentElement.classList.add('theme-transition');
            
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
                resolve();
            }, 300);
        });
    }

    /**
     * @brief Update theme-color meta tag
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
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * @brief Check if theme is valid
     */
    isValidTheme(theme) {
        return ['light', 'dark'].includes(theme);
    }

    /**
     * @brief Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * @brief Check if dark mode is active
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * @brief Destroy theme manager
     */
    destroy() {
        this.eventBus.unsubscribe('theme:change', this.onThemeChange);
        this.eventBus.unsubscribe('theme:toggle');
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        
        this.isInitialized = false;
    }
}