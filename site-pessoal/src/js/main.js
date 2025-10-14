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
        this.isInitialized = false;
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application and then sets up UI controls.
     */
    async initializeApplication() {
        try {
            console.info('Application: Starting initialization...');
            
            // Hide loading overlay when app is ready
            this.hideLoadingOverlay();
            
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

            // Set up mobile navigation
            this.setupMobileNavigation();
            
            // Set up UI controls
            this.setupUIControls();
            
            // Set up scroll effects
            this.setupScrollEffects();
            
            this.isInitialized = true;
            
            // Show main content
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
            
            // Trigger fade-in animation
            setTimeout(() => {
                mainContainer.style.transition = 'opacity 0.5s ease';
                mainContainer.style.opacity = '1';
            }, 100);
        }
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
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Announce menu state for screen readers
                const isOpen = navMenu.classList.contains('active');
                const announcement = isOpen ? 'Navigation menu opened' : 'Navigation menu closed';
                this.app.services.accessibilityManager.announceContent(announcement);
            });
            
            // Close menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
            
            // Close menu when pressing escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    /**
     * @brief Creates and manages the UI controls for theme and accessibility.
     */
    setupUIControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'app-controls';
        controlsContainer.setAttribute('aria-label', 'Accessibility controls');
        document.body.appendChild(controlsContainer);

        // --- Theme Toggle Button ---
        const themeManager = this.app.services.themeManager;
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'btn btn--icon app-control-button theme-toggle-btn';
        themeToggleBtn.setAttribute('aria-label', 'Toggle light and dark theme');
        themeToggleBtn.setAttribute('title', 'Toggle theme (Ctrl+T)');
        
        const updateThemeIcon = () => {
            // Use emojis for better compatibility
            themeToggleBtn.textContent = themeManager.isDarkMode() ? '🌙' : '☀️';
        };
        
        themeToggleBtn.addEventListener('click', () => {
            themeManager.toggleTheme();
            updateThemeIcon();
        });
        
        // Keyboard shortcut for theme toggle
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                themeManager.toggleTheme();
                updateThemeIcon();
            }
        });
        
        controlsContainer.appendChild(themeToggleBtn);
        updateThemeIcon();

        // --- Accessibility Buttons ---
        const accessibilityManager = this.app.services.accessibilityManager;
        
        // Font size increase button
        const increaseFontBtn = document.createElement('button');
        increaseFontBtn.className = 'btn btn--icon app-control-button';
        increaseFontBtn.setAttribute('aria-label', 'Increase font size');
        increaseFontBtn.setAttribute('title', 'Increase font size (Ctrl+Plus)');
        increaseFontBtn.textContent = 'A+';
        increaseFontBtn.addEventListener('click', () => accessibilityManager.increaseFontSize());
        controlsContainer.appendChild(increaseFontBtn);

        // Font size decrease button
        const decreaseFontBtn = document.createElement('button');
        decreaseFontBtn.className = 'btn btn--icon app-control-button';
        decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseFontBtn.setAttribute('title', 'Decrease font size (Ctrl+Minus)');
        decreaseFontBtn.textContent = 'A-';
        decreaseFontBtn.addEventListener('click', () => accessibilityManager.decreaseFontSize());
        controlsContainer.appendChild(decreaseFontBtn);

        // Font size reset button
        const resetFontBtn = document.createElement('button');
        resetFontBtn.className = 'btn btn--icon app-control-button';
        resetFontBtn.setAttribute('aria-label', 'Reset font size to default');
        resetFontBtn.setAttribute('title', 'Reset font size (Ctrl+0)');
        resetFontBtn.textContent = 'A↺';
        resetFontBtn.addEventListener('click', () => accessibilityManager.resetFontSize());
        controlsContainer.appendChild(resetFontBtn);

        console.info('Application: UI Controls initialized.');
    }

    /**
     * @brief Set up scroll effects for header and navigation
     */
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.getElementById('main-header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                // Add/remove scrolled class based on scroll position
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Hide header on scroll down, show on scroll up
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            }, { passive: true });
        }
        
        // Smooth scroll for anchor links
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
                    
                    // Update URL without page jump
                    history.pushState(null, null, `#${targetId}`);
                }
            }
        });
    }

    /**
     * @brief Get application instance (for debugging)
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
        
        // Remove event listeners
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (menuToggle) {
            menuToggle.replaceWith(menuToggle.cloneNode(true));
        }
        
        if (navMenu) {
            navMenu.replaceWith(navMenu.cloneNode(true));
        }
        
        this.isInitialized = false;
        console.info('Application: Destroyed');
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new Application();
    });
} else {
    window.app = new Application();
}

// Export for module usage
export { Application };