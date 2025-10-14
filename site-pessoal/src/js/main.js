import { App } from './core/App.js';
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { ContentModel } from './models/ContentModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';

/**
 * @brief Main application entry point.
 */
class Application {
    constructor() {
        this.app = null;
        this.initializeApplication();
    }

    /**
     * @brief Configures and initializes the entire application.
     */
    async initializeApplication() {
        try {
            const appConfig = {
                // Services are modules without direct user interaction
                services: {
                    contentModel: ContentModel,
                    themeManager: ThemeManager,
                    accessibilityManager: AccessibilityManager
                },
                // Controllers manage specific parts of the UI and logic
                controllers: {
                    mainController: MainController,
                    navigationController: NavigationController
                }
            };
            
            this.app = new App(appConfig);
            await this.app.initialize();
            
        } catch (error) {
            console.error('Application: A critical error occurred during initialization.', error);
            this.showErrorState();
        }
    }

    /**
     * @brief Displays an error message if initialization fails.
     */
    showErrorState() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="loading-content">
                    <h2>An Error Occurred</h2>
                    <p>Could not load the portfolio. Please try refreshing the page.</p>
                </div>
            `;
            overlay.classList.remove('critical-hidden');
        }
    }
}

// Start the application once the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Application());
} else {
    new Application();
}