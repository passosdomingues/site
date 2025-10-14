import { App } from './core/App.js';
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { ContentModel } from './models/ContentModel.js';
import { UserModel } from './models/UserModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';

/**
 * @brief Main application entry point.
 * @description Initializes the application, sets up UI components,
 * and manages the application lifecycle.
 */
class Application {
    /**
     * @brief Constructs the main Application class.
     */
    constructor() {
        this.app = null;
        this.isInitialized = false;
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application, services, and controllers.
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

            this.setupMobileNavigation();
            this.setupUiControls();
            this.setupScrollEffects();
            
            this.isInitialized = true;
            this.showMainContent();

        } catch (error) {
            console.error('Application: Critical initialization failed.', error);
            this.showErrorState();
        }
    }

    /**
     * @brief Hides the loading overlay.
     */
    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500); // Match this with transition duration
        }
    }

    /**
     * @brief Shows the main application content with a fade-in effect.
     */
    showMainContent() {
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.classList.remove('critical-hidden');
            mainContainer.style.opacity = '0';
            
            setTimeout(() => {
                mainContainer.style.transition = 'opacity 0.5s ease';
                mainContainer.style.opacity = '1';
            }, 100);
        }
        
        this.hideLoadingOverlay();
    }

    /**
     * @brief Displays an error message if the application fails to load.
     */
    showErrorState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '1';
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <h1>Something went wrong</h1>
                    <p>Failed to load the portfolio. Please refresh the page.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    /**
     * @brief Sets up event listeners and functionality for mobile navigation.
     */
    setupMobileNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navOverlay = document.getElementById('nav-overlay');
        
        if (!menuToggle || !navMenu || !navOverlay) return;

        const toggleMenu = (isOpen) => {
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            navMenu.classList.toggle('active', isOpen);
            navOverlay.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';

            const announcement = isOpen ? 'Navigation menu opened' : 'Navigation menu closed';
            this.app.services.accessibilityManager.announceContent(announcement);
        };

        menuToggle.addEventListener('click', () => {
            const isOpening = !menuToggle.classList.contains('active');
            toggleMenu(isOpening);
        });
        
        navOverlay.addEventListener('click', () => toggleMenu(false));
        
        navMenu.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                toggleMenu(false);
            }
        });
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    /**
     * @brief Sets up the UI controls for theme and accessibility.
     */
    setupUiControls() {
        const controlsContainer = document.getElementById('app-controls');
        if (!controlsContainer) return;

        const { themeManager, accessibilityManager } = this.app.services;

        // Theme Toggle Button
        const themeToggleBtn = this.createControlButton(
            themeManager.isDarkMode() ? '🌙' : '☀️',
            'Toggle light and dark theme',
            'Toggle theme (Ctrl+T)',
            () => {
                themeManager.toggleTheme();
                themeToggleBtn.textContent = themeManager.isDarkMode() ? '🌙' : '☀️';
            }
        );
        controlsContainer.appendChild(themeToggleBtn);

        // Font Size Controls
        controlsContainer.appendChild(this.createControlButton('A+', 'Increase font size', 'Increase font size (Ctrl++)', () => accessibilityManager.increaseFontSize()));
        controlsContainer.appendChild(this.createControlButton('A-', 'Decrease font size', 'Decrease font size (Ctrl+-)', () => accessibilityManager.decreaseFontSize()));
        controlsContainer.appendChild(this.createControlButton('A⟳', 'Reset font size', 'Reset font size (Ctrl+0)', () => accessibilityManager.resetFontSize()));

        console.info('Application: UI Controls initialized.');
    }

    /**
     * @brief Factory function to create a control button element.
     * @param {string} text - The button's visible text or icon.
     * @param {string} ariaLabel - The ARIA label for screen readers.
     * @param {string} title - The tooltip title.
     * @param {Function} onClick - The callback function for the click event.
     * @returns {HTMLButtonElement} The created button element.
     */
    createControlButton(text, ariaLabel, title, onClick) {
        const button = document.createElement('button');
        button.className = 'app-control-button';
        button.setAttribute('aria-label', ariaLabel);
        button.setAttribute('title', title);
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    /**
     * @brief Sets up scroll-related effects like a hiding header and smooth scrolling.
     */
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.getElementById('main-header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                header.classList.toggle('scrolled', currentScrollY > 50);
                
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
            }, { passive: true });
        }
        
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link || link.getAttribute('href') === '#') return;

            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, `#${targetId}`);
            }
        });
    }

    /**
     * @brief Gets the initialized application instance.
     * @returns {App} The core application instance.
     */
    getApp() {
        return this.app;
    }

    /**
     * @brief Checks if the application has been successfully initialized.
     * @returns {boolean} True if initialized.
     */
    isAppInitialized() {
        return this.isInitialized;
    }

    /**
     * @brief Destroys the application instance and cleans up resources.
     */
    destroy() {
        if (this.app) {
            this.app.destroy();
        }
        this.isInitialized = false;
    }
}

// Initialize the application when the DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new Application();
    });
} else {
    window.app = new Application();
}

export { Application };