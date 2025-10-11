/**
 * @file App.js
 * @brief Main application initialization and view management
 * @description Orchestrates SPA functionality and coordinates between modules with enhanced
 *              error handling, performance monitoring, and accessibility features
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
     * @brief Gets list of missing browser features for analytics
     * @method getMissingBrowserFeatures
     * @returns {Array<string>} List of missing features
     * @private
     */
    getMissingBrowserFeatures() {
        const featureTests = {
            promises: () => typeof Promise === 'undefined',
            fetch: () => typeof fetch === 'undefined',
            intersectionObserver: () => typeof IntersectionObserver === 'undefined',
            cssVariables: () => !(window.CSS && CSS.supports && CSS.supports('--test', '0'))
        };

        return Object.entries(featureTests)
            .filter(([, test]) => test())
            .map(([feature]) => feature);
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

        // MainController needs models and viewManager (for general view rendering, if any)
        this.mainController = new MainController(this.models, this.viewManager);
        await this.executeWithTimeout(
            this.mainController.initializeApplication(),
            'MainController'
        );
        if (!this.mainController.getInitializationState()) {
            throw new Error('MainController failed to initialize');
        }

        // NavigationController needs navigation view and router
        this.navigationController = new NavigationController(this.views.navigation, this.router);
        await this.executeWithTimeout(
            this.navigationController.initialize(),
            'NavigationController'
        );

        // SectionController needs content model and section view
        this.sectionController = new SectionController(this.models, this.views.section);
        await this.executeWithTimeout(
            this.sectionController.initialize(),
            'SectionController'
        );
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
            const errorMsg = 'App: MainController not available or not initialized for rendering.';
            console.error(errorMsg);
            this.showContentLoadingError(new Error(errorMsg));
        }
    }

    /**
     * @brief Verifies initialization status of all components
     * @private
     * @returns {Promise<void>}
     */
    async verifyInitializationStatus() {
        console.info('App: Verifying initialization status of all managers...');

        const initializationStatus = {
            ContentModel: this.models.content?.isInitialized ? 'OK' : 'FAILED',
            UserModel: this.models.user?.isInitialized ? 'OK' : 'FAILED',
            ErrorReporter: this.errorReporter?.isInitialized ? 'OK' : 'FAILED',
            AccessibilityManager: this.accessibilityManager?.isInitialized ? 'OK' : 'FAILED',
            ThemeManager: this.themeManager?.isInitialized ? 'OK' : 'FAILED',
            ViewManager: this.viewManager?.isInitialized ? 'OK' : 'FAILED',
            Router: this.router?.isInitialized ? 'OK' : 'FAILED',
            MainController: this.mainController?.getInitializationState() ? 'OK' : 'FAILED',
            NavigationController: this.navigationController?.isInitialized ? 'OK' : 'FAILED',
            SectionController: this.sectionController?.getInitializationState() ? 'OK' : 'FAILED'
        };

        // Log comprehensive initialization status
        console.info('App: Initialization status report:', initializationStatus);

        // Identify failed components
        const failedManagers = Object.entries(initializationStatus)
            .filter(([_, status]) => status === 'FAILED')
            .map(([manager]) => manager);

        if (failedManagers.length > 0) {
            const errorMessage = `Application initialization partially failed. Failed components: ${failedManagers.join(', ')}`;
            console.warn('App:', errorMessage);
            
            // Check for critical failures
            const criticalComponents = ['ContentModel', 'MainController', 'ViewManager', 'SectionController'];
            const criticalFailures = failedManagers.filter(manager => 
                criticalComponents.includes(manager)
            );

            if (criticalFailures.length > 0) {
                throw new Error(`Critical initialization failure: ${criticalFailures.join(', ')}`);
            } else {
                console.warn('App: Non-critical initialization failures, application continuing in degraded mode.');
            }
        }
    }

    /**
     * @brief Executes initialization with timeout protection
     * @private
     * @param {Promise} promise - Promise to execute with timeout
     * @param {string} componentName - Name of the component for error reporting
     * @returns {Promise<void>}
     */
    async executeWithTimeout(promise, componentName) {
        const timeoutDuration = 10000; // 10 seconds
        
        try {
            await Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`${componentName} initialization timeout`)), timeoutDuration)
                )
            ]);
        } catch (error) {
            console.error(`App: ${componentName} initialization failed:`, error);
            throw error;
        }
    }

    /**
     * @brief Handles initialization failures comprehensively
     * @private
     * @param {Error} error - The initialization error
     * @returns {Promise<void>}
     */
    handleInitializationFailure = async (error) => {
        this.errorReporter?.captureError(error, {
            type: 'initialization',
            severity: 'critical',
            timestamp: Date.now()
        });

        await this.renderCriticalErrorFallback(error);
    };

    /**
     * @brief Helper method to show content loading errors to users
     * @private
     * @param {Error} error - The error that occurred during content loading
     */
    showContentLoadingError(error) {
        console.error('App: Content loading error:', error);
        
        const loadingIndicator = document.querySelector('.content-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.innerHTML = `
                <div class="content-error-state">
                    <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <h3>Content Loading Issue</h3>
                    <p>Some content could not be loaded. Please refresh the page or try again later.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">
                        <i class="fas fa-redo" aria-hidden="true"></i>
                        Reload Page
                    </button>
                    <details class="error-details">
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            `;
            loadingIndicator.hidden = false;
        }
    }

    /**
     * @brief Helper method to show initialization errors
     * @private
     * @param {Error} error - The initialization error
     */
    showInitializationError(error) {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="initialization-error-container">
                    <div class="error-content">
                        <h1>Application Startup Error</h1>
                        <p>We're having trouble starting the application. This might be due to:</p>
                        <ul>
                            <li>Network connectivity issues</li>
                            <li>Browser compatibility problems</li>
                            <li>Temporary server unavailability</li>
                        </ul>
                        <div class="error-actions">
                            <button onclick="window.location.reload()" class="btn btn--primary">
                                Try Again
                            </button>
                            <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" 
                                    class="btn btn--secondary">
                                Clear Cache & Reload
                            </button>
                        </div>
                        <details class="error-details">
                            <summary>Technical Information</summary>
                            <pre>${error.message}</pre>
                        </details>
                    </div>
                </div>
            `;
        }
    }

    /**
     * @brief Helper method to get names of failed managers for error reporting
     * @private
     * @returns {Array} Array of failed manager names
     */
    getFailedManagerNames() {
        const failed = [];
        if (this.models?.content && !this.models.content.isInitialized) failed.push('ContentModel');
        if (this.models?.user && !this.models.user.isInitialized) failed.push('UserModel');
        if (this.errorReporter && !this.errorReporter.isInitialized) failed.push('ErrorReporter');
        if (this.accessibilityManager && !this.accessibilityManager.isInitialized) failed.push('AccessibilityManager');
        if (this.themeManager && !this.themeManager.isInitialized) failed.push('ThemeManager');
        if (this.viewManager && !this.viewManager.isInitialized) failed.push('ViewManager');
        if (this.router && !this.router.isInitialized) failed.push('Router');
        if (this.mainController && !this.mainController.getInitializationState()) failed.push('MainController');
        if (this.navigationController && !this.navigationController.isInitialized) failed.push('NavigationController');
        if (this.sectionController && !this.sectionController.getInitializationState()) failed.push('SectionController');
        return failed;
    }

    /**
     * @brief Sets up global event listeners for application lifecycle
     * @method setupGlobalEventListeners
     * @private
     */
    setupGlobalEventListeners() {
        const { signal } = this.eventAbortController;

        // Handle view changes from router
        window.addEventListener('router:viewchange', this.handleViewChangeEvent.bind(this), { signal });

        // Handle theme changes
        window.addEventListener('theme:changed', this.handleThemeChangeEvent.bind(this), { signal });

        // Handle accessibility changes
        window.addEventListener('accessibility:changed', this.handleAccessibilityChangeEvent.bind(this), { signal });

        // Global error handling
        window.addEventListener('error', this.handleGlobalErrorEvent.bind(this), { signal });
        window.addEventListener('unhandledrejection', this.handleUnhandledRejectionEvent.bind(this), { signal });

        // Performance and visibility monitoring
        window.addEventListener('load', this.handleWindowLoadEvent.bind(this), { signal });
        document.addEventListener('visibilitychange', this.handleVisibilityChangeEvent.bind(this), { signal });

        // Online/offline status monitoring
        window.addEventListener('online', this.handleOnlineStatusEvent.bind(this), { signal });
        window.addEventListener('offline', this.handleOfflineStatusEvent.bind(this), { signal });
    }

    /**
     * @brief Sets up communication channels between different managers
     * @method setupInterManagerCommunication
     * @private
     */
    setupInterManagerCommunication() {
        // Router to MainController (which now orchestrates section rendering)
        this.router.onRouteChange((routeData) => {
            // The router should ideally trigger a method in MainController
            // that then decides how to render the content (e.g., using SectionController)
            this.mainController.handleRouteChange(routeData)
                .catch(error => this.handleViewRenderError(error, routeData));
        });

        // ThemeManager to ViewManager communication
        this.themeManager.onThemeChange((themeData) => {
            // ViewManager doesn't directly update theme, it's handled by App or ThemeManager
            // This might be a place to notify SectionView or other views if they need to react
            console.debug('App: Theme change detected, notifying relevant components.');
            // Example: this.views.section.updateTheme(themeData);
        });

        // AccessibilityManager to ViewManager communication
        this.accessibilityManager.onAccessibilityChange((accessibilitySettings) => {
            // Similar to theme, ViewManager doesn't directly update accessibility
            console.debug('App: Accessibility change detected, notifying relevant components.');
            // Example: this.views.section.updateAccessibility(accessibilitySettings);
        });

        // SectionController to MainController/App communication (e.g., for lazy loading events)
        this.sectionController.on('section:sectionVisible', (event) => {
            this.performanceMonitor?.mark(`section-visible-${event.detail.sectionId}`);
            console.debug(`App: Section ${event.detail.sectionId} became visible.`);
            // Potentially trigger lazy content loading here if not already handled by SectionController
        });

        this.sectionController.on('section:contentLoadError', (event) => {
            console.error(`App: Content load error in section ${event.detail.sectionId}:`, event.detail.error);
            this.errorReporter?.captureError(new Error(event.detail.error), {
                type: 'sectionContentLoad',
                sectionId: event.detail.sectionId
            });
        });
    }

    /**
     * @brief Handles view change events from the router
     * @method handleViewChangeEvent
     * @param {CustomEvent} event - View change event with route details
     * @private
     */
    handleViewChangeEvent = async (event) => {
        const { viewName, viewData, routeParameters } = event.detail;
        
        try {
            this.performanceMonitor?.mark(`view-change-start-${viewName}`);
            
            // The MainController is now responsible for handling view rendering based on route
            await this.mainController.handleRouteChange({ viewName, viewData, routeParameters });
            
            this.performanceMonitor?.mark(`view-change-end-${viewName}`);
            this.performanceMonitor?.measure(
                `view-render-${viewName}`,
                `view-change-start-${viewName}`,
                `view-change-end-${viewName}`
            );

            // Update accessibility announcements
            this.accessibilityManager.announceViewChange(viewName);
            
            // Track analytics for view changes
            this.trackViewAnalytics(viewName, routeParameters);

        } catch (viewRenderError) {
            console.error(`Error rendering view ${viewName}:`, viewRenderError);
            await this.handleViewRenderError(viewRenderError, { viewName, viewData });
        }
    };

    /**
     * @brief Handles theme change events
     * @method handleThemeChangeEvent
     * @param {CustomEvent} event - Theme change event
     * @private
     */
    handleThemeChangeEvent = (event) => {
        const themeData = event.detail;
        
        // Update document theme attribute for CSS theming
        document.documentElement.setAttribute('data-theme', themeData.themeName);
        document.documentElement.style.setProperty('color-scheme', themeData.colorScheme);

        // Persist theme preference
        this.persistUserPreference('theme', themeData);
    };

    /**
     * @brief Handles accessibility preference changes
     * @method handleAccessibilityChangeEvent
     * @param {CustomEvent} event - Accessibility change event
     * @private
     */
    handleAccessibilityChangeEvent = (event) => {
        const accessibilitySettings = event.detail;
        
        // Update document with accessibility attributes
        Object.entries(accessibilitySettings).forEach(([key, value]) => {
            if (value) {
                document.documentElement.setAttribute(`data-a11y-${key}`, value);
            } else {
                document.documentElement.removeAttribute(`data-a11y-${key}`);
            }
        });

        this.persistUserPreference('accessibility', accessibilitySettings);
    };

    /**
     * @brief Handles global JavaScript errors
     * @method handleGlobalErrorEvent
     * @param {ErrorEvent} errorEvent - Global error event
     * @private
     */
    handleGlobalErrorEvent = (errorEvent) => {
        const errorContext = {
            filename: errorEvent.filename,
            lineno: errorEvent.lineno,
            colno: errorEvent.colno,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };

        console.error('Global error occurred:', errorEvent.error, errorContext);
        this.errorReporter?.captureError(errorEvent.error, errorContext);
    };

    /**
     * @brief Handles unhandled promise rejections
     * @method handleUnhandledRejectionEvent
     * @param {PromiseRejectionEvent} rejectionEvent - Promise rejection event
     * @private
     */
    handleUnhandledRejectionEvent = (rejectionEvent) => {
        console.error('Unhandled promise rejection:', rejectionEvent.reason);
        
        this.errorReporter?.captureError(rejectionEvent.reason, {
            type: 'unhandledRejection',
            timestamp: Date.now()
        });

        // Prevent browser default handling
        rejectionEvent.preventDefault();
    };

    /**
     * @brief Handles window load completion
     * @method handleWindowLoadEvent
     * @private
     */
    handleWindowLoadEvent = () => {
        this.performanceMonitor?.mark('window-loaded');
        this.dispatchApplicationEvent('app:windowLoaded', {
            loadTime: performance.now()
        });
    };

    /**
     * @brief Handles page visibility changes
     * @method handleVisibilityChangeEvent
     * @private
     */
    handleVisibilityChangeEvent = () => {
        const isVisible = !document.hidden;
        this.dispatchApplicationEvent('app:visibilityChange', {
            isVisible,
            timestamp: Date.now()
        });

        // Optimize performance when tab is not visible
        if (!isVisible) {
            this.viewManager?.reducePerformanceWhenHidden();
        }
    };

    /**
     * @brief Handles online status restoration
     * @method handleOnlineStatusEvent
     * @private
     */
    handleOnlineStatusEvent = () => {
        this.dispatchApplicationEvent('app:online');
        this.isHealthy = true;
        
        // Retry any failed network operations
        this.retryFailedOperations();
    };

    /**
     * @brief Handles offline status detection
     * @method handleOfflineStatusEvent
     * @private
     */
    handleOfflineStatusEvent = () => {
        this.dispatchApplicationEvent('app:offline');
        this.isHealthy = false;
        
        // Show offline indicator
        this.showOfflineIndicator();
    };

    /**
     * @brief Handles view rendering errors with fallback strategies
     * @method handleViewRenderError
     * @param {Error} error - Rendering error
     * @param {Object} routeData - Original route data for recovery
     * @returns {Promise<void>}
     * @private
     */
    handleViewRenderError = async (error, routeData) => {
        this.errorReporter?.captureError(error, {
            type: 'viewRender',
            viewName: routeData.viewName,
            routeData: routeData
        });

        // Attempt to render error view
        try {
            // The ViewManager's renderErrorView expects a simple error object, not a complex one
            await this.viewManager.renderErrorView(error, routeData.viewName);
        } catch (fallbackError) {
            console.error('Even error view failed:', fallbackError);
            this.renderCriticalErrorFallback(error);
        }
    };

    /**
     * @brief Handles complete application initialization failure
     * @method handleInitializationFailure
     * @param {Error} error - The initialization error
     * @returns {Promise<void>}
     * @private
     */
    handleInitializationFailure = async (error) => {
        this.errorReporter?.captureError(error, {
            type: 'initialization',
            severity: 'critical',
            timestamp: Date.now()
        });

        await this.renderCriticalErrorFallback(error);
    };

    /**
     * @brief Renders critical error fallback when all else fails
     * @method renderCriticalErrorFallback
     * @param {Error} error - The critical error
     * @private
     */
    renderCriticalErrorFallback = (error) => {
        const applicationContainer = document.getElementById('app');
        if (!applicationContainer) return;

        applicationContainer.innerHTML = `
            <div class="critical-error-container" role="alert" aria-live="assertive">
                <div class="error-content">
                    <h1 class="error-title">Application Error</h1>
                    <p class="error-description">
                        We're experiencing technical difficulties. Our team has been notified.
                    </p>
                    <div class="error-actions">
                        <button class="retry-button" onclick="window.location.reload()">
                            Reload Application
                        </button>
                        <button class="support-button" onclick="window.open('/support', '_blank')">
                            Contact Support
                        </button>
                    </div>
                    <details class="error-details">
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            </div>
        `;
    };

    /**
     * @brief Persists user preferences to storage
     * @method persistUserPreference
     * @param {string} preferenceType - Type of preference (theme, accessibility, etc.)
     * @param {Object} preferenceData - Preference data to store
     * @private
     */
    persistUserPreference = (preferenceType, preferenceData) => {
        try {
            const storageKey = `user-preferences-${preferenceType}`;
            localStorage.setItem(storageKey, JSON.stringify(preferenceData));
        } catch (storageError) {
            console.warn('Failed to persist user preference:', storageError);
        }
    };

    /**
     * @brief Tracks view analytics for user behavior monitoring
     * @method trackViewAnalytics
     * @param {string} viewName - Name of the view being tracked
     * @param {Object} routeParameters - Route parameters for context
     * @private
     */
    trackViewAnalytics = (viewName, routeParameters) => {
        this.dispatchApplicationEvent('app:viewTracked', {
            viewName,
            routeParameters,
            timestamp: Date.now()
        });
    };

    /**
     * @brief Shows offline indicator to user
     * @method showOfflineIndicator
     * @private
     */
    showOfflineIndicator = () => {
        const existingIndicator = document.getElementById('offline-indicator');
        if (existingIndicator) return;

        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <p>You are currently offline. Some features may not be available.</p>
        `;
        document.body.appendChild(indicator);
    };

    /**
     * @brief Retries failed network operations (e.g., after going online)
     * @method retryFailedOperations
     * @private
     */
    retryFailedOperations = () => {
        console.info('App: Retrying failed operations...');
        // Implement retry logic for network requests here
        // e.g., re-fetch content that failed to load when offline
    };

    /**
     * @brief Dispatches a custom application-wide event
     * @method dispatchApplicationEvent
     * @param {string} eventType - Type of application event
     * @param {Object} eventDetail - Additional event data
     * @private
     */
    dispatchApplicationEvent(eventType, eventDetail = {}) {
        const appEvent = new CustomEvent(eventType, {
            detail: {
                source: 'App',
                ...eventDetail
            },
            bubbles: true,
            cancelable: true
        });
        window.dispatchEvent(appEvent);
    }

    /**
     * @brief Hides the initial loading overlay
     * @private
     */
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.addEventListener('transitionend', () => overlay.remove());
        }
    }

    /**
     * @brief Cleans up resources and event listeners when the app is destroyed
     * @public
     */
    destroy() {
        this.eventAbortController.abort();
        this.viewManager?.destroy();
        this.router?.destroy();
        this.themeManager?.destroy();
        this.accessibilityManager?.destroy();
        this.performanceMonitor?.destroy();
        this.errorReporter?.destroy();
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

