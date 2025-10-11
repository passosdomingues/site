/**
 * @file App.js
 * @brief Main application initialization and view management
 * @description Orchestrates SPA functionality and coordinates between modules with enhanced
 * error handling, performance monitoring, and accessibility features
 */

import MainController from './controllers/MainController.js';
import NavigationController from './controllers/NavigationController.js';
import SectionController from './controllers/SectionController.js';
import './css/main.css';

import ViewManager from './modules/ViewManager.js';
import Router from './modules/Router.js';
import ThemeManager from './modules/ThemeManager.js';
import AccessibilityManager from './modules/AccessibilityManager.js';
import PerformanceMonitor from './modules/PerformanceMonitor.js';
import ErrorReporter from './modules/ErrorReporter.js';

import ContentModel from './models/ContentModel.js';
import UserModel from './models/UserModel.js';

import NavigationView from './views/NavigationView.js';
import HeroView from './views/HeroView.js';
import FooterView from './views/FooterView.js';
import SectionView from './views/SectionView.js'; // Import SectionView

/**
 * @class App
 * @brief Central application controller and coordinator
 * @description Initializes all application subsystems, manages lifecycle events,
 * and handles cross-module communication with robust error handling
 */
class App {
    /**
     * @brief Creates a new App instance
     * @constructor
     */
    constructor() {
        /**
         * @private
         * @type {ViewManager|null}
         * @description Manages view rendering and lifecycle
         */
        this.viewManager = null;

        /**
         * @private
         * @type {MainController|null}
         * @description Main application controller for business logic
         */
        this.mainController = null;
        this.navigationController = null;
        this.sectionController = null;

        /**
         * @private
         * @type {Object}
         * @description Collection of data models
         */
        this.models = {};

        /**
         * @private
         * @type {Object}
         * @description Collection of view components
         */
        this.views = {};
        
        this.isInitialized = false;
        this.isHealthy = true;
    }

    /**
     * @brief Initializes the entire application
     * @async
     * @public
     * @throws {Error} If a critical initialization step fails
     */
    async initializeApplication() {
        if (this.isInitialized) {
            console.warn("App: Application already initialized.");
            return;
        }

        try {
            console.info("App: Starting application initialization...");

            // Initialize core components
            this.setupErrorHandling();
            this.setupPerformanceMonitoring();
            
            // Initialize models
            this.models.content = new ContentModel();
            this.models.user = new UserModel();
            await Promise.all([this.models.content.load(), this.models.user.load()]);

            // Initialize views
            this.viewManager = new ViewManager();
            this.views.navigation = new NavigationView(this.models.content.getNavigationData());
            this.views.hero = new HeroView(this.models.content.getHeroData());
            this.views.footer = new FooterView(this.models.content.getFooterData());
            this.views.sections = new SectionView(this.models.content.getSectionsData()); // Using SectionView

            // Register views with the ViewManager
            this.viewManager.registerView('navigation', this.views.navigation);
            this.viewManager.registerView('hero', this.views.hero);
            this.viewManager.registerView('footer', this.views.footer);
            this.viewManager.registerView('sections', this.views.sections);

            // Initialize controllers
            const controllers = {
                navigation: new NavigationController(this.models, this.views),
                section: new SectionController(this.models, this.views)
            };
            this.mainController = new MainController(this.models, this.viewManager, controllers);

            await this.mainController.initialize();
            
            // Initial render
            await this.viewManager.renderAllViews();

            // Setup post-initialization components
            this.setupThemeManager();
            this.setupAccessibilityManager();
            
            this.isInitialized = true;
            console.info("App: Application initialized successfully.");

        } catch (error) {
            this.isHealthy = false;
            console.error('App: A critical error occurred during initialization.', error);
            this.errorReporter.report(error, 'critical');
            this.displayFatalError();
            throw new Error(`Initialization failed: ${error.message}`);
        }
    }
    
    setupErrorHandling() {
        this.errorReporter = new ErrorReporter();
        window.addEventListener('error', (event) => this.errorReporter.report(event.error));
        window.addEventListener('unhandledrejection', (event) => this.errorReporter.report(event.reason));
    }
    
    setupPerformanceMonitoring() {
        this.performanceMonitor = new PerformanceMonitor();
        this.performanceMonitor.start();
    }
    
    setupThemeManager() {
        this.themeManager = new ThemeManager();
        this.themeManager.initialize();
    }
    
    setupAccessibilityManager() {
        this.accessibilityManager = new AccessibilityManager();
        this.accessibilityManager.initialize();
    }

    displayFatalError() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `<div class="fatal-error"><h1>Application Error</h1><p>Sorry, something went wrong. Please try refreshing the page.</p></div>`;
        }
    }

    /**
     * @brief Tears down the application and cleans up resources
     * @public
     */
    destroy() {
        if (!this.isInitialized) return;

        console.info('App: Starting application teardown...');
        
        // Destroy managers and controllers
        this.themeManager?.destroy();
        this.accessibilityManager?.destroy();
        this.performanceMonitor?.stop();
        this.viewManager?.destroy();
        this.mainController?.destroy();
        this.navigationController?.destroy();
        this.sectionController?.destroy();

        // Clear models and views
        this.models = {};
        this.views = {};

        this.isInitialized = false;
        this.isHealthy = false;
        console.info('App: Application destroyed and resources cleaned up.');
    }
}

// Application bootstrap with enhanced error handling
document.addEventListener('DOMContentLoaded', async () => {
    const applicationInstance = new App();
    
    // Make app instance globally available for debugging and emergency access
    if (process.env.NODE_ENV === 'development') {
        window.app = applicationInstance;
    }

    try {
        await applicationInstance.initializeApplication();
    } catch (bootstrapError) {
        console.error('Application bootstrap failed:', bootstrapError);
        
        // Final fallback for complete bootstrap failure
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: system-ui;">
                <h1>Application Failed to Load</h1>
                <p>Please refresh the page or try again later.</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem;">
                    Reload Page
                </button>
            </div>
        `;
    }
});

// Export for testing and potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
}