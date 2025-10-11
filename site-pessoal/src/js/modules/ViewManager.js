/**
 * @file ViewManager.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Advanced view management and rendering system for single-page applications.
 * @description Handles dynamic view loading, rendering, lifecycle management,
 * performance optimization, and error handling with comprehensive state tracking.
 */

/**
 * @constant {Object} VIEW_CONFIGURATION
 * @brief Configuration constants for view management behavior
 * @description Defines view loading strategies, performance settings, and behavior thresholds
 */
const VIEW_CONFIGURATION = {
    CRITICAL_VIEWS: ["navigation", "hero", "footer"],
    LAZY_LOADING: {
        rootMargin: "50px 0px",
        threshold: 0.1,
        preloadBuffer: 3 // Number of adjacent views to preload
    },
    PERFORMANCE: {
        viewTransitionDuration: 300,
        loadingTimeout: 10000, // 10 seconds
        cacheSize: 20,
        preloadDelay: 100
    },
    ERROR_HANDLING: {
        maxRetryAttempts: 2,
        retryDelay: 1000,
        fallbackView: "error"
    }
};

/**
 * @constant {Object} VIEW_EVENTS
 * @brief Custom event types for view management system
 * @description Defines standardized event names for view lifecycle and state changes
 */
const VIEW_EVENTS = {
    VIEW_CHANGED: "viewmanager:viewchanged",
    VIEW_LOADING_START: "viewmanager:loadingstart",
    VIEW_LOADING_END: "viewmanager:loadingend",
    VIEW_ERROR: "viewmanager:error",
    VIEW_RENDERED: "viewmanager:rendered"
};

/**
 * @class ViewManager
 * @brief Manages the lifecycle and rendering of views in the application
 * @description Orchestrates view loading, rendering, transitions, and state management,
 * with features like caching, lazy loading, and robust error handling.
 */
class ViewManager {
    /**
     * @brief Creates an instance of ViewManager
     * @constructor
     */
    constructor() {
        /** @private */
        this.viewRegistry = new Map();
        /** @private */
        this.viewModuleCache = new Map();
        /** @private */
        this.viewLoadingStates = new Map();
        /** @private */
        this.currentActiveView = null;
        /** @private */
        this.lazyLoadingObserver = null;
        /** @private */
        this.performanceMetrics = {
            renderTimes: [],
            loadTimes: []
        };
        /** @private */
        this.operationAbortController = new AbortController();
    }

    /**
     * @brief Initializes the ViewManager
     * @public
     */
    initialize() {
        this.setupLazyLoading();
        console.info("ViewManager: Initialized and ready.");
    }

    /**
     * @brief Registers a view with the ViewManager
     * @public
     * @param {string} viewName - The unique name for the view
     * @param {Object} viewInstance - The instance of the view class
     */
    registerView(viewName, viewInstance) {
        if (this.viewRegistry.has(viewName)) {
            console.warn(`ViewManager: View "${viewName}" is already registered. Overwriting.`);
        }
        this.viewRegistry.set(viewName, viewInstance);
        this.viewLoadingStates.set(viewName, { isLoading: false, hasLoaded: false, error: null });
    }

    /**
     * @brief Renders a specific view by name
     * @public
     * @async
     * @param {string} viewName - The name of the view to render
     * @param {Object} [data={}] - Optional data to pass to the view's render method
     * @returns {Promise<void>}
     */
    async renderView(viewName, data = {}) {
        const viewInstance = this.viewRegistry.get(viewName);
        if (!viewInstance) {
            throw new Error(`ViewManager: View "${viewName}" not found.`);
        }
        
        this.setLoadingState(viewName, true);
        this.dispatchEvent(VIEW_EVENTS.VIEW_LOADING_START, { viewName });

        try {
            const startTime = performance.now();
            await viewInstance.render(data);
            const endTime = performance.now();
            
            this.performanceMetrics.renderTimes.push({ viewName, duration: endTime - startTime });
            
            this.setLoadingState(viewName, false, true);
            this.dispatchEvent(VIEW_EVENTS.VIEW_RENDERED, { viewName });
            this.currentActiveView = viewName;
            
        } catch (error) {
            this.setLoadingState(viewName, false, false, error);
            this.dispatchEvent(VIEW_EVENTS.VIEW_ERROR, { viewName, error });
            console.error(`ViewManager: Error rendering view "${viewName}".`, error);
        } finally {
            this.dispatchEvent(VIEW_EVENTS.VIEW_LOADING_END, { viewName });
        }
    }

    /**
     * @brief Renders all registered views, respecting critical load order
     * @public
     * @async
     * @returns {Promise<void>}
     */
    async renderAllViews() {
        // Render critical views first and in parallel
        const criticalRenderPromises = VIEW_CONFIGURATION.CRITICAL_VIEWS
            .filter(viewName => this.viewRegistry.has(viewName))
            .map(viewName => this.renderView(viewName));
            
        await Promise.all(criticalRenderPromises);
        
        // Render non-critical views
        for (const viewName of this.viewRegistry.keys()) {
            if (!VIEW_CONFIGURATION.CRITICAL_VIEWS.includes(viewName)) {
                // These can be rendered lazily or deferred
                this.renderView(viewName); 
            }
        }
    }

    /**
     * @brief Sets up IntersectionObserver for lazy loading views
     * @private
     */
    setupLazyLoading() {
        const options = {
            rootMargin: VIEW_CONFIGURATION.LAZY_LOADING.rootMargin,
            threshold: VIEW_CONFIGURATION.LAZY_LOADING.threshold
        };

        this.lazyLoadingObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const viewElement = entry.target;
                    const viewName = viewElement.dataset.viewName;
                    
                    if (viewName && !this.viewLoadingStates.get(viewName)?.hasLoaded) {
                        console.info(`ViewManager: Lazy loading view "${viewName}".`);
                        this.renderView(viewName);
                        observer.unobserve(viewElement);
                    }
                }
            });
        }, options);
        
        // Attach observer to placeholder elements in the DOM
        document.querySelectorAll('[data-view-name]').forEach(el => this.lazyLoadingObserver.observe(el));
    }
    
    /**
     * @brief Dispatches a custom event
     * @private
     * @param {string} eventName - The name of the event
     * @param {Object} detail - The event payload
     */
    dispatchEvent(eventName, detail) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * @brief Sets the loading state for a view
     * @private
     * @param {string} viewName - The view name
     * @param {boolean} isLoading - Is the view currently loading?
     * @param {boolean} [hasLoaded=false] - Has the view completed loading?
     * @param {Error|null} [error=null] - Any error that occurred
     */
    setLoadingState(viewName, isLoading, hasLoaded = false, error = null) {
        this.viewLoadingStates.set(viewName, { isLoading, hasLoaded, error });
    }

    /**
     * @brief Gets the loading state of a specific view
     * @public
     * @param {string} viewName - The name of the view
     * @returns {boolean} True if the view is currently loading
     */
    isViewLoading(viewName) {
        const loadingState = this.viewLoadingStates.get(viewName);
        return loadingState ? loadingState.isLoading : false;
    }

    /**
     * @brief Gets performance metrics and statistics
     * @public
     * @returns {Object} Performance metrics object
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.viewModuleCache.size,
            loadingStates: Array.from(this.viewLoadingStates.entries()),
            currentView: this.currentActiveView
        };
    }

    /**
     * @brief Clears view module cache
     * @public
     * @returns {number} Number of items cleared from cache
     */
    clearCache() {
        const cacheSize = this.viewModuleCache.size;
        this.viewModuleCache.clear();
        console.info(`ViewManager: Cleared ${cacheSize} items from view cache.`);
        return cacheSize;
    }

    /**
     * @brief Cleans up resources when ViewManager is destroyed
     * @public
     */
    destroy() {
        // Abort all ongoing operations
        this.operationAbortController.abort();

        // Disconnect intersection observer
        if (this.lazyLoadingObserver) {
            this.lazyLoadingObserver.disconnect();
            this.lazyLoadingObserver = null;
        }

        // Clear all collections
        this.viewModuleCache.clear();
        this.viewLoadingStates.clear();

        // Reset state
        this.currentActiveView = null;

        console.info('ViewManager: View manager destroyed and resources cleaned up.');
    }
}

export default ViewManager;