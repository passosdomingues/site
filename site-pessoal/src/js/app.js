/**
 * @file App.js
 * @brief Main application initialization and view management
 * @description Orchestrates SPA functionality and coordinates between modules with enhanced
 *              error handling, performance monitoring, and accessibility features
 */

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
     * @description Orchestrates the sequential initialization of all core application subsystems
     * with robust error handling, timeout protection, and proper dependency management.
     * Ensures models are initialized first, followed by infrastructure managers, and finally
     * the view layer with all required dependencies injected.
     */
    async initializeCoreManagers() {
        /**
         * @step 1: Initialize critical data models first
         * @description Models form the foundation of the application and must be available
         * before any other components that depend on data access and business logic.
         */
        const initializationPromises = [];

        try {
            console.info('App: Starting core managers initialization...');

            /**
             * @subsection A: Data Models Initialization
             * @priority Critical - Foundation layer
             */
            this.models = {
                content: new ContentModel(),
                user: new UserModel()
            };

            // Add model initialization to promises array for parallel execution
            initializationPromises.push(
                this.models.content.initialize().catch(error => {
                    console.error('App: ContentModel initialization failed:', error);
                    throw new Error(`ContentModel failed: ${error.message}`);
                }),
                this.models.user.initialize().catch(error => {
                    console.error('App: UserModel initialization failed:', error);
                    throw new Error(`UserModel failed: ${error.message}`);
                })
            );

            /**
             * @subsection B: Infrastructure Managers Initialization
             * @priority High - Support services layer
             */
            this.errorReporter = new ErrorReporter();
            initializationPromises.push(
                this.errorReporter.initialize().catch(error => {
                    console.error('App: ErrorReporter initialization failed:', error);
                    throw new Error(`ErrorReporter failed: ${error.message}`);
                })
            );

            this.accessibilityManager = new AccessibilityManager();
            initializationPromises.push(
                this.accessibilityManager.initialize().catch(error => {
                    console.error('App: AccessibilityManager initialization failed:', error);
                    throw new Error(`AccessibilityManager failed: ${error.message}`);
                })
            );

            this.themeManager = new ThemeManager();
            initializationPromises.push(
                this.themeManager.initialize().catch(error => {
                    console.error('App: ThemeManager initialization failed:', error);
                    throw new Error(`ThemeManager failed: ${error.message}`);
                })
            );

            /**
             * @subsection C: View Layer Initialization
             * @priority Medium - UI layer (depends on models and infrastructure)
             * @fix CORRECTED: ViewManager constructor accepts only configuration, not models
             */
            this.viewManager = new ViewManager({
                // ViewManager configuration goes here if needed
                viewContainer: document.getElementById('dynamic-content'),
                enableCaching: true
            });
            initializationPromises.push(
                this.viewManager.initialize().catch(error => {
                    console.error('App: ViewManager initialization failed:', error);
                    throw new Error(`ViewManager failed: ${error.message}`);
                })
            );

            /**
             * @subsection D: Routing System Initialization
             * @priority Medium - Navigation layer
             */
            this.router = new Router();
            initializationPromises.push(
                this.router.initialize().catch(error => {
                    console.error('App: Router initialization failed:', error);
                    throw new Error(`Router failed: ${error.message}`);
                })
            );

            /**
             * @step 2: Execute all initializations with robust timeout protection
             * @description Uses Promise.allSettled to ensure all promises complete regardless of success/failure
             * Implements individual timeouts to prevent hanging initializations from blocking the entire app
             */
            console.info('App: Executing parallel initialization with timeout protection...');
            
            const timeoutDuration = 10000; // 10 seconds
            const initializationResults = await Promise.allSettled(
                initializationPromises.map(promise =>
                    Promise.race([
                        promise,
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Initialization timeout')), timeoutDuration)
                        )
                    ]).catch(error => {
                        console.warn('App: Individual initialization timeout or error:', error);
                        throw error;
                    })
                )
            );

            /**
             * @step 3: Analyze initialization results and handle partial failures
             */
            const failedInitializations = initializationResults
                .map((result, index) => ({ result, index }))
                .filter(({ result }) => result.status === 'rejected');

            if (failedInitializations.length > 0) {
                console.warn(`App: ${failedInitializations.length} initialization(s) failed:`, 
                    failedInitializations.map(({ result }) => result.reason));
            }

            /**
             * @step 4: CRITICAL FIX - Initialize MainController with required dependencies
             * @problem The original code tried to get MainController from ViewManager, but
             * ViewManager doesn't manage controllers. MainController must be instantiated separately.
             * @solution Create MainController instance and initialize it with the required models
             */
            console.info('App: Initializing MainController with data models...');
            
            // Import and instantiate MainController (make sure it's imported at the top of the file)
            this.mainController = new MainController(this.models);
            
            // Initialize the main controller
            await this.mainController.initializeApplication().catch(error => {
                console.error('App: MainController initialization failed:', error);
                throw new Error(`MainController failed: ${error.message}`);
            });

            /**
             * @step 5: Render initial content through the properly initialized MainController
             * @fix CORRECTED: Call renderInitialContent on the MainController instance, not from ViewManager
             */
            console.info('App: Rendering initial application content...');
            
            if (this.mainController && this.mainController.getInitializationState()) {
                await this.mainController.renderInitialContent().catch(error => {
                    console.error('App: Initial content rendering failed:', error);
                    // Don't throw here - allow application to continue in degraded mode
                    this.showContentLoadingError(error);
                });
            } else {
                const errorMsg = 'App: MainController not available or not initialized for rendering.';
                console.error(errorMsg);
                this.showContentLoadingError(new Error(errorMsg));
            }

            /**
             * @step 6: Comprehensive failure verification and error reporting
             * @description Check initialization status of all critical managers and provide
             * detailed error information for debugging and user feedback
             */
            console.info('App: Verifying initialization status of all managers...');
            
            const failedManagers = [];
            const initializationStatus = {};

            // Check each manager's initialization status
            if (this.models.content && !this.models.content.isInitialized) {
                failedManagers.push('ContentModel');
                initializationStatus.ContentModel = 'FAILED';
            } else {
                initializationStatus.ContentModel = 'OK';
            }

            if (this.models.user && !this.models.user.isInitialized) {
                failedManagers.push('UserModel');
                initializationStatus.UserModel = 'FAILED';
            } else {
                initializationStatus.UserModel = 'OK';
            }

            if (this.errorReporter && !this.errorReporter.isInitialized) {
                failedManagers.push('ErrorReporter');
                initializationStatus.ErrorReporter = 'FAILED';
            } else {
                initializationStatus.ErrorReporter = 'OK';
            }

            if (this.accessibilityManager && !this.accessibilityManager.isInitialized) {
                failedManagers.push('AccessibilityManager');
                initializationStatus.AccessibilityManager = 'FAILED';
            } else {
                initializationStatus.AccessibilityManager = 'OK';
            }

            if (this.themeManager && !this.themeManager.isInitialized) {
                failedManagers.push('ThemeManager');
                initializationStatus.ThemeManager = 'FAILED';
            } else {
                initializationStatus.ThemeManager = 'OK';
            }

            if (this.viewManager && !this.viewManager.isInitialized) {
                failedManagers.push('ViewManager');
                initializationStatus.ViewManager = 'FAILED';
            } else {
                initializationStatus.ViewManager = 'OK';
            }

            if (this.router && !this.router.isInitialized) {
                failedManagers.push('Router');
                initializationStatus.Router = 'FAILED';
            } else {
                initializationStatus.Router = 'OK';
            }

            if (this.mainController && !this.mainController.getInitializationState()) {
                failedManagers.push('MainController');
                initializationStatus.MainController = 'FAILED';
            } else {
                initializationStatus.MainController = 'OK';
            }

            // Log comprehensive initialization status
            console.info('App: Initialization status report:', initializationStatus);

            /**
             * @step 7: Final error handling and application state determination
             */
            if (failedManagers.length > 0) {
                const errorMessage = `Application initialization partially failed. Failed components: ${failedManagers.join(', ')}`;
                console.error('App:', errorMessage);
                
                // Determine if the failure is critical (missing essential components)
                const criticalComponents = ['ContentModel', 'MainController', 'ViewManager'];
                const criticalFailures = failedManagers.filter(manager => 
                    criticalComponents.includes(manager)
                );

                if (criticalFailures.length > 0) {
                    throw new Error(`Critical initialization failure: ${criticalFailures.join(', ')}`);
                } else {
                    // Non-critical failures - log but continue
                    console.warn('App: Non-critical initialization failures, application continuing in degraded mode.');
                }
            } else {
                console.info('App: All core managers initialized successfully!');
            }

        } catch (error) {
            /**
             * @step 8: Global error handling for initialization failures
             */
            console.error('App: Critical failure during core managers initialization:', error);
            
            // Report error through error reporter if available
            if (this.errorReporter && this.errorReporter.isInitialized) {
                this.errorReporter.captureError(error, {
                    context: 'initializeCoreManagers',
                    timestamp: Date.now(),
                    failedManagers: this.getFailedManagerNames()
                });
            }

            // Show user-friendly error message
            this.showInitializationError(error);
            
            // Re-throw to allow upper-level error handling
            throw error;
        }
    }

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
        // Router to ViewManager communication
        this.router.onRouteChange((routeData) => {
            this.viewManager.renderView(routeData.viewName, routeData.viewData)
                .catch(error => this.handleViewRenderError(error, routeData));
        });

        // ThemeManager to ViewManager communication
        this.themeManager.onThemeChange((themeData) => {
            this.viewManager.updateTheme(themeData);
        });

        // AccessibilityManager to ViewManager communication
        this.accessibilityManager.onAccessibilityChange((accessibilitySettings) => {
            this.viewManager.updateAccessibility(accessibilitySettings);
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
            
            await this.viewManager.renderView(viewName, viewData);
            
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
            await this.viewManager.renderErrorView({
                error,
                viewName: routeData.viewName,
                suggestion: 'Please try navigating to a different section.'
            });
        } catch (fallbackError) {
            console.error('Even error view failed:', fallbackError);
            this.renderCriticalErrorFallback(error);
        }
    };

    /**
     * @brief Handles complete application initialization failure
     * @method handleInitializationFailure
     * @param {Error} error - Initialization error
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
        // Implementation for showing offline UI
        const existingIndicator = document.getElementById('offline-indicator');
        if (existingIndicator) return;

        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'offline-indicator';
        indicator.setAttribute('role', 'status');
        indicator.setAttribute('aria-live', 'polite');
        indicator.textContent = 'You are currently offline. Some features may be unavailable.';
        
        document.body.prepend(indicator);
    };

    /**
     * @brief Retries failed operations when coming back online
     * @method retryFailedOperations
     * @private
     */
    retryFailedOperations = () => {
        // Remove offline indicator
        const offlineIndicator = document.getElementById('offline-indicator');
        if (offlineIndicator) {
            offlineIndicator.remove();
        }

        // Retry any queued operations
        this.dispatchApplicationEvent('app:retryOperations');
    };

    /**
     * @brief Dispatches custom application events
     * @method dispatchApplicationEvent
     * @param {string} eventName - Name of the event to dispatch
     * @param {Object} eventDetail - Event detail data
     * @private
     */
    dispatchApplicationEvent = (eventName, eventDetail = {}) => {
        const applicationEvent = new CustomEvent(eventName, {
            detail: {
                ...eventDetail,
                appInstance: this,
                timestamp: eventDetail.timestamp || Date.now()
            },
            bubbles: true
        });

        window.dispatchEvent(applicationEvent);
    };

    /**
     * @brief Cleans up application resources and event listeners
     * @method destroy
     * @returns {void}
     * @public
     */
    destroy() {
        // Abort all event listeners
        this.eventAbortController.abort();

        // Clean up managers
        this.viewManager?.destroy();
        this.router?.destroy();
        this.themeManager?.destroy();
        this.accessibilityManager?.destroy();
        this.performanceMonitor?.stopMonitoring();
        this.errorReporter?.destroy();

        this.isInitialized = false;
        this.isHealthy = false;

        console.info('Application destroyed successfully');
    }

    hideLoadingOverlay() {
        const overlay = document.querySelector('[data-loading-overlay]');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.addEventListener('transitionend', () => overlay.remove());
        }
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