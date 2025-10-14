/**
 * @file Main application entry point
 * @brief Initializes core application components and UI controls
 */

import { App } from './core/App.js';
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { ContentModel } from './models/ContentModel.js';
import { UserModel } from './models/UserModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';

/**
 * @class Application
 * @brief Main application class coordinating initialization and UI setup
 */
class Application {
    constructor() {
        this.app = null;
        this.isInitialized = false;
        this.initializeApplication();
    }

    /**
     * @brief Initialize core application and UI controls
     * @async
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

            this.setupMobileNavigation();
            this.setupUIControls();
            this.setupScrollEffects();
            
            this.isInitialized = true;
            this.showMainContent();

        } catch (error) {
            console.error('Application: Critical initialization failed.', error);
            this.showErrorState();
        }
    }

    /**
     * @brief Hide loading overlay and show main content
     */
    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const mainContainer = document.getElementById('main-container');
        
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
        
        if (mainContainer) {
            mainContainer.classList.remove('critical-hidden');
        }
    }

    /**
     * @brief Show main content with fade-in animation
     */
    showMainContent() {
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.style.opacity = '0';
            mainContainer.style.display = 'block';
            
            setTimeout(() => {
                mainContainer.style.transition = 'opacity 0.5s ease';
                mainContainer.style.opacity = '1';
            }, 100);
        }
        
        this.hideLoadingOverlay();
    }

    /**
     * @brief Show error state when initialization fails
     */
    showErrorState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <h1>Something went wrong</h1>
                    <p>Failed to load portfolio. Please refresh the page.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    /**
     * @brief Set up mobile navigation functionality
     */
    setupMobileNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navOverlay = document.getElementById('nav-overlay');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                const isOpening = !menuToggle.classList.contains('active');
                
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                if (navOverlay) navOverlay.classList.toggle('active');
                
                document.body.style.overflow = isOpening ? 'hidden' : '';
                
                const announcement = isOpening ? 'Navigation menu opened' : 'Navigation menu closed';
                this.app.services.accessibilityManager.announceContent(announcement);
            });
            
            if (navOverlay) {
                navOverlay.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    if (navOverlay) navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    if (navOverlay) navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    /**
     * @brief Set up UI control buttons (theme, font size, etc.)
     */
    setupUIControls() {
        const controlsContainer = document.getElementById('app-controls');
        if (!controlsContainer) return;

        const themeManager = this.app.services.themeManager;
        const accessibilityManager = this.app.services.accessibilityManager;

        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'app-control-button theme-toggle-btn';
        themeToggleBtn.setAttribute('aria-label', 'Toggle light and dark theme');
        themeToggleBtn.setAttribute('title', 'Toggle theme (Ctrl+T)');
        
        const updateThemeIcon = () => {
            themeToggleBtn.textContent = themeManager.isDarkMode() ? '🌙' : '☀️';
        };
        
        themeToggleBtn.addEventListener('click', () => {
            themeManager.toggleTheme();
            updateThemeIcon();
        });
        
        controlsContainer.appendChild(themeToggleBtn);
        updateThemeIcon();

        const fontIncreaseBtn = this.createControlButton('A+', 'Increase font size', () => {
            accessibilityManager.increaseFontSize();
        });
        
        const fontDecreaseBtn = this.createControlButton('A-', 'Decrease font size', () => {
            accessibilityManager.decreaseFontSize();
        });
        
        const fontResetBtn = this.createControlButton('A↺', 'Reset font size', () => {
            accessibilityManager.resetFontSize();
        });

        controlsContainer.appendChild(fontIncreaseBtn);
        controlsContainer.appendChild(fontDecreaseBtn);
        controlsContainer.appendChild(fontResetBtn);

        console.info('Application: UI Controls initialized.');
    }

    /**
     * @brief Create a control button with specified parameters
     * @param {string} text - Button text content
     * @param {string} label - Accessibility label
     * @param {Function} onClick - Click handler function
     * @returns {HTMLButtonElement} Created button element
     */
    createControlButton(text, label, onClick) {
        const button = document.createElement('button');
        button.className = 'app-control-button';
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    /**
     * @brief Set up scroll effects (header hide/show, smooth scrolling)
     */
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.getElementById('main-header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            }, { passive: true });
        }
        
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
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
            }
        });
    }

    /**
     * @brief Get application instance
     * @returns {App} Application instance
     */
    getApp() {
        return this.app;
    }

    /**
     * @brief Check if application is initialized
     * @returns {boolean} Initialization status
     */
    isAppInitialized() {
        return this.isInitialized;
    }

    /**
     * @brief Destroy application and clean up resources
     */
    destroy() {
        if (this.app) {
            this.app.destroy();
        }
        this.isInitialized = false;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new Application();
    });
} else {
    window.app = new Application();
}

export { Application };