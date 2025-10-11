/**
 * @file App.js
 * @brief Main application initialization and view management
 * @description Orchestrates SPA functionality and coordinates between modules with enhanced
 *              error handling, performance monitoring, and accessibility features
 */

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
import SectionView from './SectionView.js'; // Import SectionView

/**
 * @class App
 * @brief Central application controller and coordinator
 * @description Initializes all application subsystems, manages lifecycle events,
 *              and handles cross-module communication with robust error handling
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
         * @description Manages view rendering and transitions
         */
        this.viewManager = null;

        /**
         * @private
         * @type {Router|null}
         * @description Handles client-side routing and navigation
         */
        this.router = null;

        /**
         * @private
         * @type {ThemeManager|null}
         * @description Manages theme switching and persistence
         */
        this.themeManager = null;

        /**
         * @private
         * @type {AccessibilityManager|null}
         * @description Enhances accessibility features and screen reader support
         */
        this.accessibilityManager = null;

        /**
         * @private
         * @type {PerformanceMonitor|null}
         * @description Tracks application performance metrics
         */
        this.performanceMonitor = null;

        /**
         * @private
         * @type {ErrorReporter|null}
         * @description Handles error tracking and reporting
         */
        this.errorReporter = null;

        /**
         * @private
         * @type {MainController|null}
         * @description The main application controller
         */
        this.mainController = null;

        /**
         * @private
         * @type {NavigationController|null}
         * @description Controller for navigation elements
         */
        this.navigationController = null;

        /**
         * @private
         * @type {SectionController|null}
         * @description Controller for content sections
         */
        this.sectionController = null;

        /**
         * @private
         * @type {Object}
         * @description Stores instances of data models
         */
        this.models = {};

        /**
         * @private
         * @type {Object}
         * @description Stores instances of view classes
         */
        this.views = {};

        /**
         * @private
         * @type {boolean}
         * @description Tracks initialization status
         */
        this.isInitialized = false;

        /**
         * @private
         * @type {boolean}
         * @description Tracks if the application is in a healthy state
         */
        this.isHealthy = true;

        /**
         * @private
         * @type {AbortController}
         * @description Controls cleanup of event listeners
         */
        this.eventAbortController = new AbortController();

        this.initializeApplication = this.initializeApplication.bind(this);
    }

    /**
     * @brief Initializes all application subsystems with dependency order
     * @method initializeApplication
     * @returns {Promise<void>}
     * @public
     */
    async initializeApplication() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            this.performanceMonitor = new PerformanceMonitor();
            await this.performanceMonitor.startMonitoring();

            // Validate critical browser features before proceeding
            if (!this.checkBrowserCompatibility()) {
                this.handleBrowserIncompatibility();
                return;
            }

            // Initialize core managers in proper dependency order
            await this.initializeCoreManagers();
            
            // Set up application-wide event system
            this.setupGlobalEventListeners();
            
            // Initialize cross-manager communication
            this.setupInterManagerCommunication();

            this.hideLoadingOverlay();

            this.isInitialized = true;
            this.isHealthy = true;

            console.info('Application initialized successfully');
            
            // Notify other components that app is ready
            this.dispatchApplicationEvent('app:initialized', {
                timestamp: Date.now(),
                initializationDuration: performance.now()
            });

        } catch (initializationError) {
            console.error('Application initialization failed:', initializationError);
            await this.handleInitializationFailure(initializationError);
        }
    }

    /**
     * @brief Checks for required browser features and APIs
     * @method checkBrowserCompatibility
     * @returns {boolean} True if browser meets minimum requirements
     * @private
     */
    checkBrowserCompatibility() {
        const requiredFeatures = {
            promises: typeof Promise !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            intersectionObserver: typeof IntersectionObserver !== 'undefined',
            customElements: typeof customElements !== 'undefined',
            cssVariables: window.CSS && CSS.supports && CSS.supports('--test', '0'),
            es6: typeof Map !== 'undefined' && typeof Set !== 'undefined'
        };

        const missingFeatures = Object.entries(requiredFeatures)
            .filter(([, isSupported]) => !isSupported)
            .map(([feature]) => feature);

        if (missingFeatures.length > 0) {
            console.warn('Missing browser features:', missingFeatures);
            return false;
        }

        return true;
    }

    /**
     * @brief Handles browser incompatibility gracefully
     * @method handleBrowserIncompatibility
     * @private
     */
    handleBrowserIncompatibility() {
        const applicationContainer = document.getElementById('app');
        if (!applicationContainer) return;

        applicationContainer.innerHTML = `
            <div class="browser-compatibility-error" role="alert" aria-live="polite">
                <div class="error-container">
                    <h1 class="error-title">Browser Update Recommended</h1>
                    <p class="error-description">
                        Your current browser doesn't support all the features required 
                        for this application. Please update to a modern browser for 
                        the best experience.
                    </p>
                    <div class="browser-recommendations">
                        <p>Recommended browsers:</p>
                        <ul class="browser-list">
                            <li>Google Chrome (latest)</li>
                            <li>Mozilla Firefox (latest)</li>
                            <li>Microsoft Edge (latest)</li>
                            <li>Safari (latest)</li>
                        </ul>
                    </div>
                    <button class="retry-button" onclick="window.location.reload()">
                        Retry Application Load
                    </button>
                </div>
            </div>
        `;

        this.dispatchApplicationEvent('app:browserIncompatible', {
            missingFeatures: this.getMissingBrowserFeatures(),
            userAgent: navigator.userAgent
        });
    }

    /**
     * @brief Initializes core application managers with proper error handling and dependency injection
     * @method initializeCoreManagers
     * @returns {Promise<void>}
     * @private
     */
    async initializeCoreManagers() {
        try {
            console.info('App: Starting core managers initialization...');

            // Execute initialization steps in proper sequence
            await this.initializeDataModels();
            await this.initializeInfrastructureManagers();
            await this.initializeViewLayer();
            await this.initializeRouter();
            await this.initializeControllers(); // New method for controllers
            
            // After all controllers are initialized, pass them to MainController
            // This ensures MainController has references to fully initialized sub-controllers
            if (this.mainController) {
                this.mainController.setControllers({
                    navigation: this.navigationController,
                    section: this.sectionController
                });
            }

            await this.renderInitialContent();
            
            // Verify overall initialization status
            await this.verifyInitializationStatus();

            console.info('App: All core managers initialized successfully!');

        } catch (error) {
            await this.handleInitializationFailure(error);
            throw error;
        }
    }

    /**
     * @brief Initializes data models (foundation layer)
     * @private
     * @returns {Promise<void>}
     */
    async initializeDataModels() {
        console.info('App: Initializing data models...');
        
        try {
            this.models = {
                content: new ContentModel(),
                user: new UserModel()
            };

            // Inicialize modelos com timeout
            await this.executeWithTimeout(
                Promise.allSettled([
                    this.models.content.initializeContentModel?.() || this.models.content.initialize?.(),
                    this.models.user.initialize?.()
                ]),
                'DataModels'
            );

            console.info('App: Data models initialization attempted.');
            
        } catch (error) {
            console.error('App: Data models initialization failed, continuing with fallback:', error);
            // Não lance erro aqui - permita que o app continue com dados de fallback
        }
    }

    /**
     * @brief Initializes infrastructure managers (support services layer)
     * @private
     * @returns {Promise<void>}
     */
    async initializeInfrastructureManagers() {
        console.info('App: Initializing infrastructure managers...');

        this.errorReporter = new ErrorReporter();
        this.accessibilityManager = new AccessibilityManager();
        this.themeManager = new ThemeManager();

        // Initialize infrastructure managers in parallel
        await this.executeWithTimeout(
            Promise.allSettled([
                this.errorReporter.initialize(),
                this.accessibilityManager.initialize(),
                this.themeManager.initialize()
            ]),
            'InfrastructureManagers'
        );
    }

    /**
     * @brief Initializes view layer components
     * @private
     * @returns {Promise<void>}
     */
    async initializeViewLayer() {
        console.info('App: Initializing view layer...');

        const mainContentElement = document.getElementById('main-content');
        if (!mainContentElement) {
            throw new Error('App: Main content element #main-content not found.');
        }

        this.viewManager = new ViewManager({
            viewContainer: mainContentElement,
            enableCaching: true
        });

        await this.executeWithTimeout(
            this.viewManager.initialize(),
            'ViewManager'
        );

        if (!this.viewManager.isInitialized) {
            throw new Error('ViewManager failed to initialize');
        }

        // Instantiate specific views and register them with ViewManager if needed
        // For SectionView, we will instantiate it directly and pass to SectionController
        this.views = {
            navigation: new NavigationView(document.getElementById('main-nav')), // Assuming main-nav exists
            hero: new HeroView(document.getElementById('hero-section')), // Assuming hero-section exists
            footer: new FooterView(document.getElementById('main-footer')), // Assuming main-footer exists
            section: new SectionView(mainContentElement) // SectionView takes the main content container
        };

        // Register views that ViewManager should manage (e.g., for routing if they were separate pages)
        // For this project, SectionView is managed by SectionController, not directly by ViewManager's renderView
        // this.viewManager.registerView('navigation', this.views.navigation);
        // this.viewManager.registerView('hero', this.views.hero);
        // this.viewManager.registerView('footer', this.views.footer);
    }

    /**
     * @brief Initializes routing system
     * @private
     * @returns {Promise<void>}
     */
    async initializeRouter() {
        console.info('App: Initializing router...');

        this.router = new Router();
        
        await this.executeWithTimeout(
            this.router.initialize(),
            'Router'
        );
    }

    /**
     * @brief Initializes all application controllers
     * @private
     * @returns {Promise<void>}
     */
    async initializeControllers() {
        console.info('App: Initializing application controllers...');

        // NavigationController needs navigation view and router
        this.navigationController = new NavigationController(this.views.navigation, this.router);
        // Register NavigationController as an observer for NavigationView events
        this.navigationController.registerNavigationViewObserver(this.views.navigation);
        await this.executeWithTimeout(
            this.navigationController.initialize(),
            'NavigationController'
        );

        // SectionController needs content model and section view
        this.sectionController = new SectionController(this.models.content, this.views.section);
        await this.executeWithTimeout(
            this.sectionController.initialize(),
            'SectionController'
        );

        // MainController needs models, viewManager, and *all* sub-controllers
        this.mainController = new MainController(this.models, this.viewManager, {
            navigation: this.navigationController,
            section: this.sectionController
        });
        await this.executeWithTimeout(
            this.mainController.initializeApplication(),
            'MainController'
        );
        if (!this.mainController.getInitializationState()) {
            throw new Error('MainController failed to initialize');
        }
    }

    /**
     * @brief Renders initial application content
     * @private
     * @returns {Promise<void>}
     */
    async renderInitialContent() {
        console.info('App: Rendering initial application content...');

        if (this.mainController && this.mainController.getInitializationState()) {
            try {
                // The MainController will now use the SectionController to render sections
                await this.mainController.renderInitialContent();
                console.info('App: Initial content rendered successfully.');
            } catch (error) {
                console.error('App: Initial content rendering failed:', error);
                this.showContentLoadingError(error);
                // Don't throw here - allow application to continue in degraded mode
            }
        } else {
            const errorMessage = 'App: MainController not initialized, cannot render initial content.';
            console.error(errorMessage);
  
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)