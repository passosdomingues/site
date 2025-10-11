
/**
 * @file App.js
 * @brief Main application initialization and view management
 * @description Orchestrates SPA functionality and coordinates between modules with enhanced
 *              error handling, performance monitoring, and accessibility features
 */

import MainController from './controllers/MainController.js';
import '../css/main.css';

import ViewManager from './modules/ViewManager.js';
import Router from './modules/Router.js';
import ThemeManager from './modules/ThemeManager.js';
import AccessibilityManager from './modules/AccessibilityManager.js';
import PerformanceMonitor from './modules/PerformanceMonitor.js';
import ErrorReporter from './modules/ErrorReporter.js';

import ContentModel from './models/ContentModel.js';
import UserModel from './models/UserModel.js';

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
            await this.initializeMainController();
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

            // Initialize models with timeout, explicitly calling their initialize methods
            await this.executeWithTimeout(
                Promise.allSettled([
                    this.models.content.initialize(), // Call the new initialize method
                    this.models.user.initialize?.()
                ]),
                'DataModels'
            );

            console.info('App: Data models initialization attempted.');
            
        } catch (error) {
            console.error('App: Data models initialization failed, continuing with fallback:', error);
            // Do not throw error here - allow the app to continue with fallback data
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

        this.viewManager = new ViewManager({
            viewContainer: document.getElementById('dynamic-content'),
            enableCaching: true
        });

        await this.executeWithTimeout(
            this.viewManager.initialize(),
            'ViewManager'
        );

        if (!this.viewManager.isInitialized) {
            throw new Error('ViewManager failed to initialize');
        }
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
     * @brief Initializes main application controller
     * @private
     * @returns {Promise<void>}
     */
    async initializeMainController() {
        console.info('App: Initializing MainController with data models...');

        this.mainController = new MainController(this.models);
        
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
            MainController: this.mainController?.getInitializationState() ? 'OK' : 'FAILED'
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
            const criticalComponents = ['ContentModel', 'MainController', 'ViewManager'];
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
     * @param {Promise<any>} promise - Promise to execute with timeout
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
    async handleInitializationFailure(error) {
        this.isHealthy = false;
        console.error('App: Handling initialization failure:', error);
        // Report error to external service if errorReporter is available
        if (this.errorReporter) {
            await this.errorReporter.reportError(error, { context: 'Application Initialization' });
        }
        // Display a user-friendly error message
        this.showCriticalErrorMessage('Failed to load application. Please try again later.');
        this.hideLoadingOverlay();
    }

    /**
     * @brief Displays a critical error message to the user
     * @private
     * @param {string} message - The error message to display
     */
    showCriticalErrorMessage(message) {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="critical-error-message" role="alert" aria-live="assertive">
                    <h1>Application Error</h1>
                    <p>${message}</p>
                    <button onclick="window.location.reload()">Reload</button>
                </div>
            `;
        }
    }

    /**
     * @brief Hides the loading overlay
     * @private
     */
    hideLoadingOverlay() {
        const loadingIndicator = document.querySelector('.content-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.hidden = true;
        }
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('data-main-initialized', 'true');
        }
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.setAttribute('data-app-initialized', 'true');
        }
    }

    /**
     * @brief Shows content loading error
     * @private
     * @param {Error} error - The error that occurred during content loading
     */
    showContentLoadingError(error) {
        console.error('App: Displaying content loading error:', error);
        const dynamicContentContainer = document.getElementById('dynamic-content');
        if (dynamicContentContainer) {
            dynamicContentContainer.innerHTML = `
                <div class="content-error-message" role="alert" aria-live="assertive">
                    <h2>Failed to Load Content</h2>
                    <p>There was an issue loading the dynamic content. Please try refreshing the page.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * @brief Dispatches a custom application event
     * @private
     * @param {string} eventName - Name of the event to dispatch
     * @param {Object} detail - Custom data to pass with the event
     */
    dispatchApplicationEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }

    /**
     * @brief Handles router view change events
     * @private
     * @param {CustomEvent} event - The custom event from the router
     */
    handleViewChangeEvent(event) {
        console.log('App: View change event received:', event.detail);
        // Further logic to handle view changes, e.g., loading new content based on route
    }

    /**
     * @brief Handles theme change events
     * @private
     * @param {CustomEvent} event - The custom event from the theme manager
     */
    handleThemeChangeEvent(event) {
        console.log('App: Theme change event received:', event.detail);
        // Update UI based on new theme
    }

    /**
     * @brief Handles accessibility change events
     * @private
     * @param {CustomEvent} event - The custom event from the accessibility manager
     */
    handleAccessibilityChangeEvent(event) {
        console.log('App: Accessibility change event received:', event.detail);
        // Update UI based on new accessibility settings
    }

    /**
     * @brief Handles global uncaught errors
     * @private
     * @param {ErrorEvent} event - The error event
     */
    handleGlobalErrorEvent(event) {
        console.error('App: Global error caught:', event.message, event.filename, event.lineno);
        if (this.errorReporter) {
            this.errorReporter.reportError(event.error || new Error(event.message), { context: 'Global Error' });
        }
        this.showCriticalErrorMessage('An unexpected error occurred. Please refresh.');
    }

    /**
     * @brief Handles unhandled promise rejections
     * @private
     * @param {PromiseRejectionEvent} event - The promise rejection event
     */
    handleUnhandledRejectionEvent(event) {
        console.error('App: Unhandled promise rejection:', event.reason);
        if (this.errorReporter) {
            this.errorReporter.reportError(event.reason, { context: 'Unhandled Promise Rejection' });
        }
        this.showCriticalErrorMessage('An unexpected issue occurred. Please refresh.');
    }

    /**
     * @brief Handles window load event
     * @private
     */
    handleWindowLoadEvent() {
        console.info('App: Window loaded.');
        this.performanceMonitor?.mark('windowLoad');
    }

    /**
     * @brief Handles visibility change event
     * @private
     */
    handleVisibilityChangeEvent() {
        console.info('App: Visibility changed to:', document.visibilityState);
        if (document.visibilityState === 'hidden') {
            this.performanceMonitor?.pause();
        } else {
            this.performanceMonitor?.resume();
        }
    }

    /**
     * @brief Handles online status event
     * @private
     */
    handleOnlineStatusEvent() {
        console.info('App: Application is online.');
        // Potentially re-fetch data or sync state
    }

    /**
     * @brief Handles offline status event
     * @private
     */
    handleOfflineStatusEvent() {
        console.warn('App: Application is offline.');
        // Display a warning to the user
        this.dispatchApplicationEvent('app:offline', { message: 'You are currently offline.' });
    }

    /**
     * @brief Cleans up all event listeners and resources
     * @public
     */
    destroy() {
        this.eventAbortController.abort();
        console.info('App: Application destroyed and resources cleaned up.');
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const appInstance = new App();
    appInstance.initializeApplication();
});

export default App;
