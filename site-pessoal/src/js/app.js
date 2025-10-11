/**
 * @file App.js
 * @brief Main application initialization and lifecycle management
 * @description Centralized application controller with modular architecture and robust error handling
 */

// Import CSS
import '../css/main.css';

// Core Modules
import ViewManager from './modules/ViewManager.js';
import Router from './modules/Router.js';
import ThemeManager from './modules/ThemeManager.js';
import AccessibilityManager from './modules/AccessibilityManager.js';
import PerformanceMonitor from './modules/PerformanceMonitor.js';
import ErrorReporter from './modules/ErrorReporter.js';

// Models
import ContentModel from './models/ContentModel.js';
import UserModel from './models/UserModel.js';

// Controllers
import MainController from './controllers/MainController.js';

/**
 * @class App
 * @brief Central application coordinator and lifecycle manager
 * @description Orchestrates all application subsystems with dependency injection and error recovery
 */
class App {
    /**
     * @brief Creates a new App instance
     * @constructor
     */
    constructor() {
        // Core Managers
        this.viewManager = null;
        this.router = null;
        this.themeManager = null;
        this.accessibilityManager = null;
        this.performanceMonitor = null;
        this.errorReporter = null;
        
        // Data Models
        this.models = {
            content: null,
            user: null
        };
        
        // Controllers
        this.mainController = null;
        
        // State Management
        this.isInitialized = false;
        this.isHealthy = true;
        this.initializationPhase = 'pending'; // pending, bootstrapping, running, error
        
        // Event Management
        this.eventAbortController = new AbortController();
        
        // Bind methods
        this.initializeApplication = this.initializeApplication.bind(this);
        this.handleError = this.handleError.bind(this);
        
        console.info('App: Application instance created');
    }

    /**
     * @brief Main application initialization sequence
     * @public
     * @returns {Promise<void>}
     */
    async initializeApplication() {
        if (this.isInitialized) {
            console.warn('App: Application already initialized');
            return;
        }

        this.initializationPhase = 'bootstrapping';
        
        try {
            // Enhance HTML immediately
            this.enhanceHTML();
            
            // Initialize core systems in sequence
            await this.initializeCoreSystems();
            await this.initializeDataLayer();
            await this.initializePresentationLayer();
            await this.initializeBusinessLayer();
            
            // Finalize initialization
            await this.finalizeInitialization();
            
            console.info('App: Application initialized successfully');
            
        } catch (error) {
            await this.handleInitializationFailure(error);
        }
    }

    /**
     * @brief Enhances HTML with JavaScript capabilities
     * @private
     */
    enhanceHTML() {
        // Remove no-js class and add js-enabled
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js-enabled');
        
        // Mark app as initialized for CSS
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.setAttribute('data-app-initialized', 'true');
        }
        
        console.debug('App: HTML enhanced with JavaScript capabilities');
    }

    /**
     * @brief Initializes core infrastructure systems
     * @private
     * @returns {Promise<void>}
     */
    async initializeCoreSystems() {
        console.info('App: Initializing core systems...');
        
        // Performance monitoring first
        this.performanceMonitor = new PerformanceMonitor();
        await this.performanceMonitor.initialize();
        
        // Error reporting
        this.errorReporter = new ErrorReporter();
        await this.errorReporter.initialize();
        
        // Theme management
        this.themeManager = new ThemeManager();
        await this.themeManager.initialize();
        
        // Accessibility
        this.accessibilityManager = new AccessibilityManager();
        await this.accessibilityManager.initialize();
        
        console.debug('App: Core systems initialized');
    }

    /**
     * @brief Initializes data models and persistence layer
     * @private
     * @returns {Promise<void>}
     */
    async initializeDataLayer() {
        console.info('App: Initializing data layer...');
        
        try {
            // Initialize content model with timeout protection
            this.models.content = new ContentModel();
            await this.executeWithTimeout(
                this.models.content.initializeContentModel(),
                'ContentModel',
                10000 // 10 second timeout
            );
            
            // Initialize user model
            this.models.user = new UserModel();
            if (typeof this.models.user.initialize === 'function') {
                await this.executeWithTimeout(
                    this.models.user.initialize(),
                    'UserModel',
                    5000 // 5 second timeout
                );
            }
            
            console.debug('App: Data layer initialized successfully');
            
        } catch (error) {
            console.warn('App: Data layer initialization issues, continuing with fallbacks:', error);
            // Don't throw - allow application to continue with degraded functionality
        }
    }

    /**
     * @brief Initializes presentation layer (views and routing)
     * @private
     * @returns {Promise<void>}
     */
    async initializePresentationLayer() {
        console.info('App: Initializing presentation layer...');
        
        // View Manager
        this.viewManager = new ViewManager({
            viewContainer: document.getElementById('dynamic-content'),
            enableCaching: true,
            transitionDuration: 300
        });
        await this.viewManager.initialize();
        
        // Router
        this.router = new Router();
        await this.router.initialize();
        
        // Set up view-routing integration
        this.setupViewRoutingIntegration();
        
        console.debug('App: Presentation layer initialized');
    }

    /**
     * @brief Initializes business logic layer (controllers)
     * @private
     * @returns {Promise<void>}
     */
    async initializeBusinessLayer() {
        console.info('App: Initializing business layer...');
        
        // Main Controller
        this.mainController = new MainController({
            contentModel: this.models.content,
            userModel: this.models.user,
            viewManager: this.viewManager
        });
        
        await this.mainController.initialize();
        
        console.debug('App: Business layer initialized');
    }

    /**
     * @brief Finalizes application initialization
     * @private
     * @returns {Promise<void>}
     */
    async finalizeInitialization() {
        console.info('App: Finalizing initialization...');
        
        // Set up global event listeners
        this.setupGlobalEventListeners();
        
        // Set up inter-module communication
        this.setupModuleCommunication();
        
        // Hide loading states and show content
        this.hideLoadingStates();
        
        // Render initial content
        await this.renderInitialContent();
        
        // Update application state
        this.isInitialized = true;
        this.initializationPhase = 'running';
        
        // Dispatch initialization complete event
        this.dispatchApplicationEvent('app:initialized', {
            timestamp: Date.now(),
            initializationTime: performance.now()
        });
        
        console.info('App: Initialization finalized successfully');
    }

    /**
     * @brief Sets up integration between router and view manager
     * @private
     */
    setupViewRoutingIntegration() {
        if (!this.router || !this.viewManager) return;
        
        this.router.onRouteChange(async (routeData) => {
            try {
                await this.viewManager.renderView(routeData.view, routeData.params);
            } catch (error) {
                console.error('App: View routing error:', error);
                await this.handleViewRenderError(error, routeData);
            }
        });
    }

    /**
     * @brief Sets up global event listeners for application lifecycle
     * @private
     */
    setupGlobalEventListeners() {
        const { signal } = this.eventAbortController;
        
        // Error handling
        window.addEventListener('error', this.handleError, { signal });
        window.addEventListener('unhandledrejection', this.handleError, { signal });
        
        // Performance and lifecycle
        window.addEventListener('load', this.handleWindowLoad.bind(this), { signal });
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this), { signal });
        
        // Network status
        window.addEventListener('online', this.handleOnlineStatus.bind(this), { signal });
        window.addEventListener('offline', this.handleOfflineStatus.bind(this), { signal });
        
        console.debug('App: Global event listeners configured');
    }

    /**
     * @brief Sets up communication between different modules
     * @private
     */
    setupModuleCommunication() {
        // Theme changes to view manager
        this.themeManager?.onThemeChange((theme) => {
            this.viewManager?.updateTheme(theme);
        });
        
        // Accessibility changes to view manager
        this.accessibilityManager?.onAccessibilityChange((settings) => {
            this.viewManager?.updateAccessibility(settings);
        });
        
        console.debug('App: Module communication channels established');
    }

    /**
     * @brief Hides all loading states and reveals content
     * @private
     */
    hideLoadingStates() {
        // Hide main loading indicator
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('data-main-initialized', 'true');
        }
        
        // Hide hero loading state
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.setAttribute('data-hero-initialized', 'true');
        }
        
        // Remove loading indicator
        const loadingIndicator = document.querySelector('.content-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.hidden = true;
        }
        
        console.debug('App: Loading states hidden, content revealed');
    }

    /**
     * @brief Renders initial application content
     * @private
     * @returns {Promise<void>}
     */
    async renderInitialContent() {
        console.info('App: Rendering initial content...');
        
        if (this.mainController && typeof this.mainController.renderInitialContent === 'function') {
            try {
                await this.mainController.renderInitialContent();
                console.debug('App: Initial content rendered successfully');
            } catch (error) {
                console.error('App: Initial content rendering failed:', error);
                await this.handleContentRenderingError(error);
            }
        } else {
            console.warn('App: MainController not available for initial rendering');
        }
    }

    /**
     * @brief Handles initialization failures gracefully
     * @private
     * @param {Error} error - The initialization error
     * @returns {Promise<void>}
     */
    async handleInitializationFailure(error) {
        this.initializationPhase = 'error';
        this.isHealthy = false;
        
        console.error('App: Initialization failed:', error);
        
        // Report error
        if (this.errorReporter) {
            await this.errorReporter.captureError(error, {
                context: 'application_initialization',
                phase: this.initializationPhase
            });
        }
        
        // Show user-friendly error
        this.showCriticalError(
            'Application failed to load properly. ' +
            'Some features may be unavailable. ' +
            'Please refresh the page to try again.'
        );
        
        // Still try to hide loading states
        this.hideLoadingStates();
    }

    /**
     * @brief Handles view rendering errors
     * @private
     * @param {Error} error - The rendering error
     * @param {Object} routeData - The route data that caused the error
     * @returns {Promise<void>}
     */
    async handleViewRenderError(error, routeData) {
        console.error('App: View rendering error:', error);
        
        if (this.errorReporter) {
            await this.errorReporter.captureError(error, {
                context: 'view_rendering',
                routeData: routeData
            });
        }
        
        // Show error view
        if (this.viewManager) {
            await this.viewManager.renderErrorView({
                error: error,
                route: routeData,
                message: 'Unable to load this section. Please try navigating to a different page.'
            });
        }
    }

    /**
     * @brief Handles content rendering errors
     * @private
     * @param {Error} error - The content rendering error
     * @returns {Promise<void>}
     */
    async handleContentRenderingError(error) {
        console.error('App: Content rendering error:', error);
        
        const dynamicContent = document.getElementById('dynamic-content');
        if (dynamicContent) {
            dynamicContent.innerHTML = `
                <div class="content-error" role="alert">
                    <h2>Content Loading Issue</h2>
                    <p>We're having trouble loading some content. The application will continue with limited functionality.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">
                        Reload Application
                    </button>
                </div>
            `;
        }
    }

    /**
     * @brief Generic error handler for uncaught errors
     * @private
     * @param {ErrorEvent|PromiseRejectionEvent} event - The error event
     */
    async handleError(event) {
        const error = event instanceof ErrorEvent ? event.error : event.reason;
        
        console.error('App: Unhandled error:', error);
        
        if (this.errorReporter) {
            await this.errorReporter.captureError(error, {
                context: 'unhandled_error',
                type: event.type
            });
        }
        
        // Don't show critical errors for minor issues during runtime
        if (this.isInitialized && this.isHealthy) {
            this.showNotification(
                'A minor error occurred. The application continues to run normally.',
                'warning'
            );
        }
    }

    /**
     * @brief Shows a critical error message to the user
     * @private
     * @param {string} message - The error message
     */
    showCriticalError(message) {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="critical-error" role="alert" aria-live="assertive">
                    <div class="error-content">
                        <h1>Application Error</h1>
                        <p>${message}</p>
                        <div class="error-actions">
                            <button onclick="window.location.reload()" class="btn btn--primary">
                                Reload Application
                            </button>
                            <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" 
                                    class="btn btn--secondary">
                                Clear Data & Reload
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * @brief Shows a notification to the user
     * @private
     * @param {string} message - The notification message
     * @param {string} type - The notification type (info, warning, error, success)
     */
    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        if (!notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        
        notificationArea.appendChild(notification);
        notificationArea.hidden = false;
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (notificationArea.children.length === 0) {
                notificationArea.hidden = true;
            }
        }, 5000);
    }

    /**
     * @brief Executes a promise with timeout protection
     * @private
     * @param {Promise} promise - The promise to execute
     * @param {string} operation - Operation name for error reporting
     * @param {number} timeoutMs - Timeout in milliseconds
     * @returns {Promise}
     */
    async executeWithTimeout(promise, operation, timeoutMs = 10000) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }

    /**
     * @brief Window load event handler
     * @private
     */
    handleWindowLoad() {
        console.info('App: Window fully loaded');
        this.performanceMonitor?.mark('windowLoaded');
    }

    /**
     * @brief Visibility change event handler
     * @private
     */
    handleVisibilityChange() {
        const isVisible = document.visibilityState === 'visible';
        console.debug(`App: Visibility changed to ${document.visibilityState}`);
        
        if (isVisible) {
            this.performanceMonitor?.resume();
        } else {
            this.performanceMonitor?.pause();
        }
    }

    /**
     * @brief Online status event handler
     * @private
     */
    handleOnlineStatus() {
        console.info('App: Application is online');
        this.isHealthy = true;
        this.showNotification('Connection restored', 'success');
    }

    /**
     * @brief Offline status event handler
     * @private
     */
    handleOfflineStatus() {
        console.warn('App: Application is offline');
        this.isHealthy = false;
        this.showNotification('You are currently offline. Some features may be unavailable.', 'warning');
    }

    /**
     * @brief Dispatches a custom application event
     * @private
     * @param {string} eventName - The event name
     * @param {Object} detail - Event details
     */
    dispatchApplicationEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                app: this,
                timestamp: Date.now()
            },
            bubbles: true
        });
        
        window.dispatchEvent(event);
    }

    /**
     * @brief Gets application status information
     * @public
     * @returns {Object} Application status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isHealthy: this.isHealthy,
            initializationPhase: this.initializationPhase,
            models: {
                content: this.models.content?.isInitialized ?? false,
                user: this.models.user?.isInitialized ?? false
            },
            managers: {
                viewManager: this.viewManager?.isInitialized ?? false,
                router: this.router?.isInitialized ?? false,
                themeManager: this.themeManager?.isInitialized ?? false,
                accessibilityManager: this.accessibilityManager?.isInitialized ?? false
            }
        };
    }

    /**
     * @brief Cleans up application resources
     * @public
     */
    destroy() {
        console.info('App: Cleaning up application resources...');
        
        // Abort all event listeners
        this.eventAbortController.abort();
        
        // Clean up managers
        this.viewManager?.destroy();
        this.router?.destroy();
        this.themeManager?.destroy();
        this.accessibilityManager?.destroy();
        this.performanceMonitor?.destroy();
        this.errorReporter?.destroy();
        
        // Clean up models
        this.models.content?.destroy();
        this.models.user?.destroy();
        
        // Reset state
        this.isInitialized = false;
        this.isHealthy = false;
        this.initializationPhase = 'destroyed';
        
        console.info('App: Application destroyed successfully');
    }
}

// Application bootstrap
document.addEventListener('DOMContentLoaded', async () => {
    console.info('App: DOM content loaded, starting application...');
    
    const app = new App();
    
    // Make app globally available for debugging
    if (process.env.NODE_ENV === 'development') {
        window.app = app;
    }
    
    try {
        await app.initializeApplication();
    } catch (bootstrapError) {
        console.error('App: Bootstrap failed:', bootstrapError);
        
        // Ultimate fallback
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: system-ui;">
                <h1>Application Failed to Load</h1>
                <p>We apologize for the inconvenience. Please refresh the page or try again later.</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin: 0.5rem;">
                    Reload Page
                </button>
            </div>
        `;
    }
});

export default App;