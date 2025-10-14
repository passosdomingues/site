import { App } from './core/App.js';
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { ContentModel } from './models/ContentModel.js';
import { UserModel } from './models/UserModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';

/**
 * @brief Main application entry point
 * @description Initializes and coordinates all MVC components, including UI controls for theme and accessibility
 */
class Application {
    /**
     * @brief Application constructor
     * @description Creates new application instance and starts initialization
     */
    constructor() {
        this.app = null;
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application and then sets up UI controls
     * @returns {Promise<void>}
     */
    async initializeApplication() {
        try {
            console.info('Application: Starting initialization...');
            const appConfig = {
                services: {
                    contentModel: ContentModel,
                    userModel: UserModel,
                    themeManager: ThemeManager,
                    accessibilityManager: AccessibilityManager,
                    performanceMonitor: PerformanceMonitor
                },
                controllers: {
                    mainController: MainController,
                    navigationController: NavigationController
                }
            };
            this.app = new App(appConfig);
            await this.app.initialize();
            console.info('Application: All components initialized successfully.');

            // Wait for services to be fully ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // After the app is ready, set up the UI controls
            this.setupUIControls();
            this.setupKeyboardShortcuts();

        } catch (error) {
            console.error('Application: Critical initialization failed.', error);
        }
    }

    /**
     * @brief Creates and manages the UI controls for theme and accessibility
     * @description This method dynamically injects control buttons into the page,
     * providing theme switching, font size adjustment, and high contrast mode
     */
    setupUIControls() {
        // Check if services are available
        if (!this.app?.services?.themeManager || !this.app?.services?.accessibilityManager) {
            console.error('Application: Services not available for UI controls');
            return;
        }

        console.log('Application: Setting up UI controls...');

        // Create main controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'app-controls';
        controlsContainer.setAttribute('aria-label', 'Application controls');
        document.body.appendChild(controlsContainer);

        const { themeManager, accessibilityManager } = this.app.services;

        // Create and configure theme toggle button
        this.createThemeToggleButton(controlsContainer, themeManager);
        
        // Create and configure menu toggle button
        this.createMenuToggleButton(controlsContainer);
        
        // Create and configure accessibility menu
        this.createAccessibilityMenu(controlsContainer, accessibilityManager);

        console.log('Application: UI Controls initialized successfully');
    }

    /**
     * @brief Creates and configures the theme toggle button
     * @param {HTMLElement} container - Parent container element
     * @param {ThemeManager} themeManager - Theme manager service instance
     */
    createThemeToggleButton(container, themeManager) {
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'theme-toggle-btn';
        themeToggleBtn.setAttribute('aria-label', 'Toggle light and dark theme');
        themeToggleBtn.setAttribute('aria-pressed', themeManager.isDarkMode());
        
        /**
         * @brief Updates the theme button icon and accessibility attributes
         */
        const updateThemeIcon = () => {
            const isDarkMode = themeManager.isDarkMode();
            themeToggleBtn.innerHTML = isDarkMode ? '🌙' : '☀️';
            themeToggleBtn.setAttribute('aria-pressed', isDarkMode.toString());
            themeToggleBtn.setAttribute('aria-label', 
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
        };
        
        // Add click event listener
        themeToggleBtn.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            themeManager.toggleTheme();
            updateThemeIcon();
        });
        
        container.appendChild(themeToggleBtn);
        updateThemeIcon();
    }

    /**
     * @brief Creates and configures the menu toggle button
     * @param {HTMLElement} container - Parent container element
     */
    createMenuToggleButton(container) {
        const menuToggleBtn = document.createElement('button');
        menuToggleBtn.className = 'menu-toggle-btn';
        menuToggleBtn.setAttribute('aria-label', 'Open accessibility menu');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        menuToggleBtn.innerHTML = '♿';
        container.appendChild(menuToggleBtn);

        // Add menu toggle functionality
        menuToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleAccessibilityMenu(container, menuToggleBtn);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!container.contains(event.target)) {
                this.closeAccessibilityMenu(container, menuToggleBtn);
            }
        });
    }

    /**
     * @brief Creates and configures the accessibility menu
     * @param {HTMLElement} container - Parent container element
     * @param {AccessibilityManager} accessibilityManager - Accessibility service instance
     */
    createAccessibilityMenu(container, accessibilityManager) {
        const accessibilityMenu = document.createElement('div');
        accessibilityMenu.className = 'accessibility-menu';
        accessibilityMenu.setAttribute('aria-hidden', 'true');
        
        // Create font controls
        this.createFontControls(accessibilityMenu, accessibilityManager);
        
        // Create high contrast toggle
        this.createHighContrastToggle(accessibilityMenu, accessibilityManager);
        
        container.appendChild(accessibilityMenu);
    }

    /**
     * @brief Creates font size control buttons
     * @param {HTMLElement} menuContainer - Accessibility menu container
     * @param {AccessibilityManager} accessibilityManager - Accessibility service instance
     */
    createFontControls(menuContainer, accessibilityManager) {
        const fontControls = document.createElement('div');
        fontControls.className = 'font-controls';

        // Decrease font button
        const decreaseFontBtn = document.createElement('button');
        decreaseFontBtn.className = 'app-control-button font-decrease-btn';
        decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseFontBtn.innerHTML = 'A-';
        decreaseFontBtn.addEventListener('click', () => {
            console.log('Decrease font clicked');
            accessibilityManager.decreaseFontSize();
        });

        // Increase font button
        const increaseFontBtn = document.createElement('button');
        increaseFontBtn.className = 'app-control-button font-increase-btn';
        increaseFontBtn.setAttribute('aria-label', 'Increase font size');
        increaseFontBtn.innerHTML = 'A+';
        increaseFontBtn.addEventListener('click', () => {
            console.log('Increase font clicked');
            accessibilityManager.increaseFontSize();
        });

        // Reset font button
        const resetFontBtn = document.createElement('button');
        resetFontBtn.className = 'app-control-button font-reset-btn';
        resetFontBtn.setAttribute('aria-label', 'Reset font size to default');
        resetFontBtn.innerHTML = 'A↺';
        resetFontBtn.addEventListener('click', () => {
            console.log('Reset font clicked');
            accessibilityManager.resetFontSize();
        });

        // Append all font control buttons
        fontControls.appendChild(decreaseFontBtn);
        fontControls.appendChild(increaseFontBtn);
        fontControls.appendChild(resetFontBtn);
        menuContainer.appendChild(fontControls);
    }

    /**
     * @brief Creates high contrast mode toggle button
     * @param {HTMLElement} menuContainer - Accessibility menu container
     * @param {AccessibilityManager} accessibilityManager - Accessibility service instance
     */
    createHighContrastToggle(menuContainer, accessibilityManager) {
        const highContrastBtn = document.createElement('button');
        highContrastBtn.className = 'high-contrast-btn';
        highContrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
        highContrastBtn.setAttribute('aria-pressed', 'false');
        highContrastBtn.innerHTML = '⚫ High Contrast';
        
        /**
         * @brief Updates high contrast button state and appearance
         */
        const updateHighContrastState = () => {
            const status = accessibilityManager.getAccessibilityStatus();
            const isActive = status.isHighContrast;
            highContrastBtn.setAttribute('aria-pressed', isActive.toString());
            highContrastBtn.setAttribute('aria-label', 
                isActive ? 'Disable high contrast mode' : 'Enable high contrast mode');
            highContrastBtn.innerHTML = isActive ? '⚪ High Contrast' : '⚫ High Contrast';
            
            // Update visual state
            if (isActive) {
                highContrastBtn.style.background = 'var(--accent-color)';
                highContrastBtn.style.color = 'white';
            } else {
                highContrastBtn.style.background = 'var(--component-bg)';
                highContrastBtn.style.color = 'var(--text-color)';
            }
        };
        
        // Add click event listener
        highContrastBtn.addEventListener('click', () => {
            console.log('High contrast toggle clicked');
            accessibilityManager.toggleHighContrast();
            updateHighContrastState();
        });

        menuContainer.appendChild(highContrastBtn);
        updateHighContrastState();
    }

    /**
     * @brief Toggles the accessibility menu open/closed state
     * @param {HTMLElement} container - Controls container element
     * @param {HTMLElement} menuToggleBtn - Menu toggle button element
     */
    toggleAccessibilityMenu(container, menuToggleBtn) {
        const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        menuToggleBtn.setAttribute('aria-expanded', newState.toString());
        container.classList.toggle('menu-open', newState);
        
        // Find and update the accessibility menu
        const accessibilityMenu = container.querySelector('.accessibility-menu');
        if (accessibilityMenu) {
            accessibilityMenu.setAttribute('aria-hidden', (!newState).toString());
        }
        
        console.log('Accessibility menu toggled:', newState);
    }

    /**
     * @brief Closes the accessibility menu
     * @param {HTMLElement} container - Controls container element
     * @param {HTMLElement} menuToggleBtn - Menu toggle button element
     */
    closeAccessibilityMenu(container, menuToggleBtn) {
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        container.classList.remove('menu-open');
        
        const accessibilityMenu = container.querySelector('.accessibility-menu');
        if (accessibilityMenu) {
            accessibilityMenu.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * @brief Sets up keyboard shortcuts for accessibility controls
     * @description Provides keyboard alternatives for common accessibility functions
     */
    setupKeyboardShortcuts() {
        const { themeManager, accessibilityManager } = this.app.services;

        document.addEventListener('keydown', (event) => {
            // Skip if user is typing in input fields
            if (this.isFormElement(event.target)) {
                return;
            }

            // Execute keyboard shortcuts
            this.handleKeyboardShortcut(event, themeManager, accessibilityManager);
        });
    }

    /**
     * @brief Checks if element is a form input that should ignore shortcuts
     * @param {Element} element - Target element to check
     * @returns {boolean} True if element is a form input
     */
    isFormElement(element) {
        const formTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
        return formTags.includes(element.tagName) || element.isContentEditable;
    }

    /**
     * @brief Handles keyboard shortcut execution
     * @param {KeyboardEvent} event - Keyboard event object
     * @param {ThemeManager} themeManager - Theme manager service instance
     * @param {AccessibilityManager} accessibilityManager - Accessibility service instance
     */
    handleKeyboardShortcut(event, themeManager, accessibilityManager) {
        const isCtrl = event.ctrlKey || event.metaKey;

        switch (true) {
            // Ctrl/Cmd + T - Toggle theme
            case isCtrl && event.key === 't':
                event.preventDefault();
                themeManager.toggleTheme();
                this.announceIfAvailable(accessibilityManager, 
                    `Theme switched to ${themeManager.isDarkMode() ? 'dark' : 'light'} mode`);
                break;

            // Ctrl/Cmd + Plus - Increase font size
            case isCtrl && (event.key === '+' || event.key === '='):
                event.preventDefault();
                accessibilityManager.increaseFontSize();
                break;

            // Ctrl/Cmd + Minus - Decrease font size
            case isCtrl && event.key === '-':
                event.preventDefault();
                accessibilityManager.decreaseFontSize();
                break;

            // Ctrl/Cmd + 0 - Reset font size
            case isCtrl && event.key === '0':
                event.preventDefault();
                accessibilityManager.resetFontSize();
                this.announceIfAvailable(accessibilityManager, 'Font size reset to default');
                break;

            // Ctrl/Cmd + H - Toggle high contrast
            case isCtrl && event.key === 'h':
                event.preventDefault();
                accessibilityManager.toggleHighContrast();
                const status = accessibilityManager.getAccessibilityStatus();
                this.announceIfAvailable(accessibilityManager,
                    `High contrast mode ${status.isHighContrast ? 'enabled' : 'disabled'}`);
                break;

            // Escape - Close accessibility menu
            case event.key === 'Escape':
                this.closeAllMenus();
                break;
        }
    }

    /**
     * @brief Announces message via accessibility manager if available
     * @param {AccessibilityManager} accessibilityManager - Accessibility service instance
     * @param {string} message - Message to announce
     */
    announceIfAvailable(accessibilityManager, message) {
        if (accessibilityManager.announceContent) {
            accessibilityManager.announceContent(message);
        }
    }

    /**
     * @brief Closes all open menus and dialogs
     */
    closeAllMenus() {
        const menuToggle = document.querySelector('.menu-toggle-btn');
        const controls = document.querySelector('.app-controls');
        
        if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
            this.closeAccessibilityMenu(controls, menuToggle);
        }
    }
}

// Wait for DOM to be fully ready before initializing application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Application());
} else {
    new Application();
}