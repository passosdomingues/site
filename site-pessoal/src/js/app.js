/**
 * @file App.js
 * @brief Main application initialization and view management
 * @description Orchestrates SPA functionality and coordinates between modules with enhanced
 * error handling, performance monitoring, and accessibility features
 */

// Corrected import paths
import MainController from './MainController.js';
import NavigationController from './NavigationController.js';
import SectionController from './SectionController.js';
import './main.css';

import ViewManager from './ViewManager.js';
import Router from './Router.js';
import ThemeManager from './ThemeManager.js';
import AccessibilityManager from './AccessibilityManager.js';
import PerformanceMonitor from './PerformanceMonitor.js';
import ErrorReporter from './ErrorReporter.js';

import ContentModel from './ContentModel.js';
import UserModel from './UserModel.js';

import NavigationView from './NavigationView.js';
import HeroView from './HeroView.js';
import FooterView from './FooterView.js';
import SectionView from './SectionView.js';

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
        this.viewManager = null;
        this.mainController = null;
        this.navigationController = null;
        this.sectionController = null;
        this.models = {};
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

            this.setupErrorHandling();
            this.setupPerformanceMonitoring();
            
            this.models.content = new ContentModel();
            this.models.user = new UserModel();
            await Promise.all([this.models.content.load(), this.models.user.load()]);

            this.viewManager = new ViewManager();
            this.views.navigation = new NavigationView(this.models.content.getNavigationData());
            this.views.hero = new HeroView(this.models.content.getHeroData());
            this.views.footer = new FooterView(this.models.content.getFooterData());
            this.views.sections = new SectionView(this.models.content.getSectionsData());

            this.viewManager.registerView('navigation', this.views.navigation);
            this.viewManager.registerView('hero', this.views.hero);
            this.viewManager.registerView('footer', this.views.footer);
            this.viewManager.registerView('sections', this.views.sections);

            const controllers = {
                navigation: new NavigationController(this.models, this.views),
                section: new SectionController(this.models, this.views)
            };
            this.mainController = new MainController(this.models, this.viewManager, controllers);

            await this.mainController.initialize();
            
            await this.viewManager.renderAllViews();

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

    destroy() {
        if (!this.isInitialized) return;

        console.info('App: Starting application teardown...');
        
        this.themeManager?.destroy();
        this.accessibilityManager?.destroy();
        this.performanceMonitor?.stop();
        this.viewManager?.destroy();
        this.mainController?.destroy();
        this.navigationController?.destroy();
        this.sectionController?.destroy();

        this.models = {};
        this.views = {};

        this.isInitialized = false;
        this.isHealthy = false;
        console.info('App: Application destroyed and resources cleaned up.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const applicationInstance = new App();
    
    if (process.env.NODE_ENV === 'development') {
        window.app = applicationInstance;
    }

    try {
        await applicationInstance.initializeApplication();
    } catch (bootstrapError) {
        console.error('Application bootstrap failed:', bootstrapError);
        
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
}