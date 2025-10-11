/**
 * @file App.js
 * @brief Main application initialization and view management
 */

// Corrected import paths to be relative
import MainController from './MainController.js';
import ViewManager from './ViewManager.js';

// Corrected path for the CSS file
import './src/main.css';

/**
 * @class App
 * @brief Central application controller
 */
class App {
    constructor() {
        this.viewManager = null;
        this.mainController = null;
        this.models = {};
        this.views = {};
        this.isInitialized = false;
    }

    async initializeApplication() {
        if (this.isInitialized) return;

        try {
            console.log("App: Initializing...");

            this.viewManager = new ViewManager();
            
            // Mock models and controllers for demonstration
            const mockModels = { content: { load: async () => {} }, user: { load: async () => {} } };
            const mockControllers = {};

            this.mainController = new MainController(mockModels, this.viewManager, mockControllers);

            await this.mainController.initialize();
            
            console.log("App: Rendering all views...");
            await this.viewManager.renderAllViews();
            
            this.isInitialized = true;
            console.log("App: Initialized successfully.");

        } catch (error) {
            console.error('App: A critical error occurred during initialization.', error);
            this.displayFatalError();
        }
    }

    displayFatalError() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `<div class="fatal-error"><h1>Application Error</h1><p>Something went wrong. Please refresh the page.</p></div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initializeApplication();
});