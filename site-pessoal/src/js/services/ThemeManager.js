import eventBus from '../core/EventBus.js';

/**
 * @brief Theme manager service
 * @description Manages application theme and dark/light mode
 */
export class ThemeManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.currentTheme = 'light';
        this.isInitialized = false;

        this.onThemeChange = this.onThemeChange.bind(this);
    }

    /**
     * @brief Initialize theme manager
     * @description Loads saved theme or detects system preference
     */
    async init() {
        if (this.isInitialized) return;

        const savedTheme = localStorage.getItem('app-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.info('ThemeManager: Initialized with theme:', this.currentTheme);
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        this.eventBus.subscribe('theme:change', this.onThemeChange);
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('app-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    onThemeChange({ theme }) {
        this.setTheme(theme);
    }

    /**
     * @brief Set a new theme
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn(`ThemeManager: Invalid theme '${theme}'. Defaulting to 'light'.`);
            theme = 'light';
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        
        localStorage.setItem('app-theme', theme);
        
        this.eventBus.publish('theme:changed', { theme });
        // **NOVO**: Notifica o sistema de acessibilidade sobre a mudança de tema.
        this.eventBus.publish('accessibility:announce', `Theme changed to ${theme} mode.`);
        
        console.info('ThemeManager: Theme changed to:', theme);
    }

    /**
     * @brief Apply theme to document
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
        }
    }

    /**
     * @brief Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
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
     * @brief Destroy theme manager
     */
    destroy() {
        this.eventBus.unsubscribe('theme:change', this.onThemeChange);
        console.info('ThemeManager: Destroyed');
    }
}