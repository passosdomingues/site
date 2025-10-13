/**
 * @brief Main application entry point
 * @description Initializes and coordinates all MVC components
 */
import { App } from './core/App.js';
import { Router } from './core/Router.js';

// Import controllers
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';

// Import services
import { ContentModel } from './models/ContentModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';

class Application {
    constructor() {
        this.app = null;
        this.initializeApplication();
    }

    /**
     * @brief Initialize all application components
     * @description Sets up MVC architecture with dependency injection
     */
    async initializeApplication() {
        try {
            // Application configuration
            const appConfig = {
                services: {
                    contentModel: ContentModel,
                    themeManager: ThemeManager,
                    accessibilityManager: AccessibilityManager,
                    performanceMonitor: PerformanceMonitor
                },
                controllers: {
                    mainController: MainController,
                    navigationController: NavigationController
                }
            };

            // Initialize main application
            this.app = new App(appConfig);
            await this.app.initialize();

            console.info('Application: All components initialized successfully');

        } catch (error) {
            console.error('Application: Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * @brief Handle initialization errors gracefully
     * @param {Error} error - The initialization error
     */
    handleInitializationError(error) {
        // Fallback basic functionality
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div style="padding: 20px; text-align: center; color: white;">
                    <h1>Application Error</h1>
                    <p>Please refresh the page or try again later.</p>
                    <button onclick="window.location.reload()" 
                            style="padding: 10px 20px; margin-top: 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Application();
    });
} else {
    new Application();
}