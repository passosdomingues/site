/**
 * @file ViewManager.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Advanced view management and rendering system for single-page applications.
 * @description Handles dynamic view loading, rendering, lifecycle management,
 * performance optimization, and error handling with comprehensive state tracking.
 */

const VIEW_CONFIGURATION = {
    CRITICAL_VIEWS: ["navigation", "hero", "footer"],
    LAZY_LOADING: { rootMargin: "50px 0px", threshold: 0.1, preloadBuffer: 3 },
    PERFORMANCE: { viewTransitionDuration: 300, loadingTimeout: 10000, cacheSize: 20, preloadDelay: 100 },
    ERROR_HANDLING: { maxRetryAttempts: 2, retryDelay: 1000, fallbackView: "error" }
};

const VIEW_EVENTS = {
    VIEW_CHANGED: "viewmanager:viewchanged",
    VIEW_LOADING_START: "viewmanager:loadingstart",
    VIEW_LOADING_END: "viewmanager:loadingend",
    VIEW_ERROR: "viewmanager:error",
    VIEW_RENDERED: "viewmanager:rendered"
};

class ViewManager {
    constructor() {
        this.viewRegistry = new Map();
        this.viewModuleCache = new Map();
        this.viewLoadingStates = new Map();
        this.currentActiveView = null;
        this.lazyLoadingObserver = null;
        this.performanceMetrics = { renderTimes: [], loadTimes: [] };
        this.operationAbortController = new AbortController();
    }

    initialize() {
        this.setupLazyLoading();
        console.info("ViewManager: Initialized and ready.");
    }

    registerView(viewName, viewInstance) {
        if (this.viewRegistry.has(viewName)) {
            console.warn(`ViewManager: View "${viewName}" is already registered. Overwriting.`);
        }
        this.viewRegistry.set(viewName, viewInstance);
        this.viewLoadingStates.set(viewName, { isLoading: false, hasLoaded: false, error: null });
    }

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

    async renderAllViews() {
        const criticalRenderPromises = VIEW_CONFIGURATION.CRITICAL_VIEWS
            .filter(viewName => this.viewRegistry.has(viewName))
            .map(viewName => this.renderView(viewName));
            
        await Promise.all(criticalRenderPromises);
        
        for (const viewName of this.viewRegistry.keys()) {
            if (!VIEW_CONFIGURATION.CRITICAL_VIEWS.includes(viewName)) {
                this.renderView(viewName); 
            }
        }
    }

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
        
        document.querySelectorAll('[data-view-name]').forEach(el => this.lazyLoadingObserver.observe(el));
    }
    
    dispatchEvent(eventName, detail) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    setLoadingState(viewName, isLoading, hasLoaded = false, error = null) {
        this.viewLoadingStates.set(viewName, { isLoading, hasLoaded, error });
    }

    isViewLoading(viewName) {
        const loadingState = this.viewLoadingStates.get(viewName);
        return loadingState ? loadingState.isLoading : false;
    }

    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.viewModuleCache.size,
            loadingStates: Array.from(this.viewLoadingStates.entries()),
            currentView: this.currentActiveView
        };
    }

    clearCache() {
        const cacheSize = this.viewModuleCache.size;
        this.viewModuleCache.clear();
        console.info(`ViewManager: Cleared ${cacheSize} items from view cache.`);
        return cacheSize;
    }

    destroy() {
        this.operationAbortController.abort();

        if (this.lazyLoadingObserver) {
            this.lazyLoadingObserver.disconnect();
            this.lazyLoadingObserver = null;
        }

        this.viewModuleCache.clear();
        this.viewLoadingStates.clear();
        this.currentActiveView = null;
        console.info('ViewManager: View manager destroyed and resources cleaned up.');
    }
}

export default ViewManager;