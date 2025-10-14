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
     * All controls are properly accessible and coordinate between services.
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
        themeToggleBtn.setAttribute('title', 'Switch between light and dark mode');
        
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
            // Announce theme change for screen readers
            this.app.services.accessibilityManager.announceContent(
                `Switched to ${themeManager.isDarkMode() ? 'dark' : 'light'} mode`
            );
        });
        
        controlsContainer.appendChild(themeToggleBtn);
        updateThemeIcon(); // Set initial icon

        // --- Accessibility Controls Container ---
        const accessibilityManager = this.app.services.accessibilityManager;
        const accessibilityControls = document.createElement('div');
        accessibilityControls.className = 'accessibility-controls';
        accessibilityControls.setAttribute('aria-label', 'Accessibility controls');

        // Font Size Controls
        const fontControls = document.createElement('div');
        fontControls.className = 'font-controls';
        fontControls.setAttribute('aria-label', 'Font size controls');

        // Decrease Font Button
        const decreaseFontBtn = document.createElement('button');
        decreaseFontBtn.className = 'btn btn--icon app-control-button font-decrease-btn';
        decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseFontBtn.setAttribute('title', 'Decrease text size (Ctrl + -)');
        decreaseFontBtn.innerHTML = 'A-';
        decreaseFontBtn.addEventListener('click', () => {
            accessibilityManager.decreaseFontSize();
            // Provide feedback on current font scale
            const status = accessibilityManager.getAccessibilityStatus();
            this.app.services.accessibilityManager.announceContent(
                `Font size decreased to ${Math.round(status.fontSizeScale * 100)}%`
            );
        });
        fontControls.appendChild(decreaseFontBtn);

        // Increase Font Button
        const increaseFontBtn = document.createElement('button');
        increaseFontBtn.className = 'btn btn--icon app-control-button font-increase-btn';
        increaseFontBtn.setAttribute('aria-label', 'Increase font size');
        increaseFontBtn.setAttribute('title', 'Increase text size (Ctrl + +)');
        increaseFontBtn.innerHTML = 'A+';
        increaseFontBtn.addEventListener('click', () => {
            accessibilityManager.increaseFontSize();
            // Provide feedback on current font scale
            const status = accessibilityManager.getAccessibilityStatus();
            this.app.services.accessibilityManager.announceContent(
                `Font size increased to ${Math.round(status.fontSizeScale * 100)}%`
            );
        });
        fontControls.appendChild(increaseFontBtn);

        // Reset Font Button
        const resetFontBtn = document.createElement('button');
        resetFontBtn.className = 'btn btn--icon app-control-button font-reset-btn';
        resetFontBtn.setAttribute('aria-label', 'Reset font size to default');
        resetFontBtn.setAttribute('title', 'Reset text size to default (Ctrl + 0)');
        resetFontBtn.innerHTML = 'A↺';
        resetFontBtn.addEventListener('click', () => {
            accessibilityManager.resetFontSize();
            this.app.services.accessibilityManager.announceContent('Font size reset to default');
        });
        fontControls.appendChild(resetFontBtn);

        accessibilityControls.appendChild(fontControls);

        // High Contrast Toggle Button
        const highContrastBtn = document.createElement('button');
        highContrastBtn.className = 'btn btn--icon app-control-button high-contrast-btn';
        highContrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
        highContrastBtn.setAttribute('aria-pressed', 'false');
        highContrastBtn.setAttribute('title', 'Toggle high contrast mode for better visibility');
        highContrastBtn.innerHTML = '⚫';
        
        // Update high contrast button state based on current preferences
        const updateHighContrastState = () => {
            const status = accessibilityManager.getAccessibilityStatus();
            const isActive = status.isHighContrast;
            highContrastBtn.setAttribute('aria-pressed', isActive.toString());
            highContrastBtn.setAttribute('aria-label', 
                isActive ? 'Disable high contrast mode' : 'Enable high contrast mode');
            // Optional: Change icon based on state
            highContrastBtn.innerHTML = isActive ? '⚪' : '⚫';
            highContrastBtn.style.border = isActive ? '2px solid #ff0000' : '';
        };
        
        highContrastBtn.addEventListener('click', () => {
            accessibilityManager.toggleHighContrast();
            updateHighContrastState();
            // Announce state change
            const status = accessibilityManager.getAccessibilityStatus();
            this.app.services.accessibilityManager.announceContent(
                `High contrast mode ${status.isHighContrast ? 'enabled' : 'disabled'}`
            );
        });
        
        accessibilityControls.appendChild(highContrastBtn);
        controlsContainer.appendChild(accessibilityControls);

        // --- Keyboard Shortcuts ---
        this.setupKeyboardShortcuts();

        // --- Initialize States ---
        updateHighContrastState(); // Set initial high contrast state

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