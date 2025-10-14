/**
 * @brief Main application entry point.
 * @description Initializes and coordinates all MVC components, including UI controls for theme and accessibility.
 */
import { App } from './core/App.js';
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { ContentModel } from './models/ContentModel.js';
import { UserModel } from './models/UserModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';

class Application {
    constructor() {
        this.app = null;
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application and then sets up UI controls.
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

            // After the app is ready, set up the UI controls
            this.setupUIControls();

        } catch (error) {
            console.error('Application: Critical initialization failed.', error);
        }
    }

    /**
     * @brief Creates and manages the UI controls for theme and accessibility.
     * @description This method dynamically injects control buttons into the page,
     * providing theme switching, font size adjustment, and high contrast mode.
     */
    setupUIControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'app-controls';
        controlsContainer.setAttribute('aria-label', 'Application controls');
        document.body.appendChild(controlsContainer);

        // --- Theme Toggle Button ---
        const themeManager = this.app.services.themeManager;
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'btn btn--icon app-control-button theme-toggle-btn';
        themeToggleBtn.setAttribute('aria-label', 'Toggle light and dark theme');
        themeToggleBtn.setAttribute('aria-pressed', themeManager.isDarkMode());
        
        const updateThemeIcon = () => {
            // Use emojis for better compatibility without external dependencies
            themeToggleBtn.innerHTML = themeManager.isDarkMode() ? '🌙' : '☀️';
            themeToggleBtn.setAttribute('aria-pressed', themeManager.isDarkMode());
            themeToggleBtn.setAttribute('aria-label', 
                themeManager.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode');
        };
        
        themeToggleBtn.addEventListener('click', () => {
            themeManager.toggleTheme();
            updateThemeIcon();
        });
        
        controlsContainer.appendChild(themeToggleBtn);
        updateThemeIcon();

        // --- Accessibility Controls ---
        const accessibilityManager = this.app.services.accessibilityManager;
        
        // Font Size Controls Container
        const fontControls = document.createElement('div');
        fontControls.className = 'font-controls';

        // Decrease Font Button
        const decreaseFontBtn = document.createElement('button');
        decreaseFontBtn.className = 'btn btn--icon app-control-button font-decrease-btn';
        decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseFontBtn.innerHTML = 'A-';
        decreaseFontBtn.addEventListener('click', () => {
            accessibilityManager.decreaseFontSize();
        });
        fontControls.appendChild(decreaseFontBtn);

        // Increase Font Button
        const increaseFontBtn = document.createElement('button');
        increaseFontBtn.className = 'btn btn--icon app-control-button font-increase-btn';
        increaseFontBtn.setAttribute('aria-label', 'Increase font size');
        increaseFontBtn.innerHTML = 'A+';
        increaseFontBtn.addEventListener('click', () => {
            accessibilityManager.increaseFontSize();
        });
        fontControls.appendChild(increaseFontBtn);

        // Reset Font Button
        const resetFontBtn = document.createElement('button');
        resetFontBtn.className = 'btn btn--icon app-control-button font-reset-btn';
        resetFontBtn.setAttribute('aria-label', 'Reset font size to default');
        resetFontBtn.innerHTML = 'A↺';
        resetFontBtn.addEventListener('click', () => {
            accessibilityManager.resetFontSize();
        });
        fontControls.appendChild(resetFontBtn);

        // High Contrast Toggle Button
        const highContrastBtn = document.createElement('button');
        highContrastBtn.className = 'btn btn--icon app-control-button high-contrast-btn';
        highContrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
        highContrastBtn.setAttribute('aria-pressed', 'false');
        highContrastBtn.innerHTML = '⚫';
        
        // Update high contrast button state
        const updateHighContrastState = () => {
            const status = accessibilityManager.getAccessibilityStatus();
            const isActive = status.isHighContrast;
            highContrastBtn.setAttribute('aria-pressed', isActive.toString());
            highContrastBtn.setAttribute('aria-label', 
                isActive ? 'Disable high contrast mode' : 'Enable high contrast mode');
            highContrastBtn.innerHTML = isActive ? '⚪' : '⚫';
        };
        
        highContrastBtn.addEventListener('click', () => {
            accessibilityManager.toggleHighContrast();
            updateHighContrastState();
        });
        
        // Create accessibility controls container
        const accessibilityControls = document.createElement('div');
        accessibilityControls.className = 'accessibility-controls';
        accessibilityControls.appendChild(fontControls);
        accessibilityControls.appendChild(highContrastBtn);

        controlsContainer.appendChild(accessibilityControls);

        // Initialize high contrast state
        updateHighContrastState();

        console.info('Application: UI Controls initialized successfully.');
    }

    /**
     * @brief Sets up keyboard shortcuts for accessibility controls
     * @description Provides keyboard alternatives for common accessibility functions
     */
    setupKeyboardShortcuts() {
        const { themeManager, accessibilityManager } = this.app.services;

        document.addEventListener('keydown', (event) => {
            // Skip if user is typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Ctrl/Cmd + T - Toggle theme
            if ((event.ctrlKey || event.metaKey) && event.key === 't') {
                event.preventDefault();
                themeManager.toggleTheme();
                accessibilityManager.announceContent(
                    `Theme switched to ${themeManager.isDarkMode() ? 'dark' : 'light'} mode`
                );
            }

            // Ctrl/Cmd + Plus - Increase font size
            if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
                event.preventDefault();
                accessibilityManager.increaseFontSize();
            }

            // Ctrl/Cmd + Minus - Decrease font size
            if ((event.ctrlKey || event.metaKey) && event.key === '-') {
                event.preventDefault();
                accessibilityManager.decreaseFontSize();
            }

            // Ctrl/Cmd + 0 - Reset font size
            if ((event.ctrlKey || event.metaKey) && event.key === '0') {
                event.preventDefault();
                accessibilityManager.resetFontSize();
                accessibilityManager.announceContent('Font size reset to default');
            }

            // Ctrl/Cmd + H - Toggle high contrast
            if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
                event.preventDefault();
                accessibilityManager.toggleHighContrast();
                const status = accessibilityManager.getAccessibilityStatus();
                accessibilityManager.announceContent(
                    `High contrast mode ${status.isHighContrast ? 'enabled' : 'disabled'}`
                );
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Application());