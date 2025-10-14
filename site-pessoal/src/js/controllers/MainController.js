/**
 * @file MainController.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Main application controller implementing MVC orchestrator pattern.
 * @description Acts as the central orchestrator in the MVC pattern,
 * connecting models, views, and sub-controllers while managing initialization flow,
 * error handling, and inter-component communication.
 */

// Constants

/**
 * @constant {Object} ERROR_MESSAGES
 * @brief Standardized error messages for application error handling
 */
const ERROR_MESSAGES = {
    invalidModels: 'MainController requires a valid models object for initialization.',
    invalidViewManager: 'MainController requires a valid ViewManager instance.',
    invalidControllers: 'MainController requires a valid controllers object for initialization.',
    controllerInitializationFailed: 'Failed to initialize sub-controllers.',
    renderFailure: 'Critical failure during application rendering.',
    eventHandlerSetupFailed: 'Failed to set up event handlers between components.'
};

/**
 * @class MainController
 * @brief Central application controller managing MVC component orchestration
 * @description Coordinates between models, views, and controllers to ensure
 * proper data flow, initialization sequence, and inter-component communication
 */
class MainController {
    /**
     * @brief Creates an instance of MainController
     * @constructor
     * @param {Object} models - Collection of main application model instances
     * @param {Object} viewManager - Instance of ViewManager for general view operations
     * @param {Object} [controllers={}] - Collection of sub-controller instances (optional, can be set later)
     * @throws {TypeError} When models or viewManager parameters are invalid or missing
     */
    constructor(models, viewManager, controllers = {}) {
        this.validateDependencies(models, viewManager);
        
        /**
         * @private
         * @type {Object}
         * @brief Collection of application data models
         */
        this.models = models;

        /**
         * @private
         * @type {ViewManager}
         * @brief Instance of ViewManager for general view operations
         */
        this.viewManager = viewManager;
        
        /**
         * @private
         * @type {Object}
         * @brief Collection of sub-controller instances keyed by controller name
         */
        this.controllers = controllers; // Sub-controllers are now managed by App.js and passed here
        
        /**
         * @private
         * @type {boolean}
         * @brief Tracks initialization state of the controller
         */
        this.isInitialized = false;
        
        /**
         * @private
         * @type {AbortController}
         * @brief Manages cleanup of event listeners for proper memory management
         */
        this.eventAbortController = new AbortController();
        
        // Bind methods to maintain context
        this.handleNavigationEvent = this.handleNavigationEvent.bind(this);
        this.handleHeroEvent = this.handleHeroEvent.bind(this);
        this.handleSectionEvent = this.handleSectionEvent.bind(this);
        this.handleGlobalError = this.handleGlobalError.bind(this);
        this.handleInitializationError = this.handleInitializationError.bind(this);
    }

    /**
     * @brief Validates the models and viewManager dependencies
     * @private
     * @param {Object} models - Models object to validate
     * @param {Object} viewManager - ViewManager instance to validate
     * @throws {TypeError} When models or viewManager are invalid or missing
     */
    validateDependencies(models, viewManager) {
        if (typeof models !== 'object' || models === null || !models.user || !models.content) {
            throw new TypeError(ERROR_MESSAGES.invalidModels);
        }
        if (!viewManager || typeof viewManager.renderView !== 'function') {
            throw new TypeError(ERROR_MESSAGES.invalidViewManager);
        }
    }

    /**
     * @brief Sets the sub-controllers for MainController after they have been instantiated.
     * @public
     * @param {Object} controllers - An object containing instantiated sub-controllers.
     */
    setControllers(controllers) {
        if (typeof controllers !== 'object' || controllers === null) {
            throw new TypeError(ERROR_MESSAGES.invalidControllers);
        }
        this.controllers = { ...this.controllers, ...controllers };
        console.info('MainController: Sub-controllers set.');
    }

    /**
     * @brief Main application entry point
     * @public
     * @description Orchestrates the complete application initialization sequence including
     * DOM view connection, controller initialization, rendering, and event system setup
     * @returns {Promise<void>} Resolves when application is fully initialized
     * @throws {Error} When critical initialization steps fail
     */
    async initializeApplication() {
        try {
            // MainController no longer handles sub-controller initialization or view connection directly.
            // These are now handled by App.js and passed as dependencies or managed by App.js itself.
            // The MainController's role here is to ensure its own internal state is ready.
            this.isInitialized = true;
            console.info('MainController: Application successfully initialized and ready.');
            this.dispatchApplicationReadyEvent();
        } catch (error) {
            await this.handleInitializationError(error);
            throw error;
        }
    }

    /**
     * @brief Renders the initial content for all primary views
     * @public
     * @async
     * @description Fetches initial data from models and triggers the first render of all views.
     *              Delegates section rendering to SectionController.
     */
    async renderInitialContent() {
        if (!this.isInitialized) {
            console.error('MainController: Cannot render initial content, controller not initialized.');
            return;
        }

        console.info('MainController: Rendering initial page content...');
        try {
            // Obter dados do usuário e do conteúdo com fallback
            let userData, sectionsData;
            
            try {
                userData = await this.models.user.getUserData();
                sectionsData = await this.models.content.getSections();
            } catch (error) {
                console.warn('MainController: Using fallback data due to initialization error:', error);
                userData = {
                    name: 'Rafael Passos Domingues',
                    title: 'Physicist & Computer Scientist',
                    summary: 'Researcher and Developer',
                    profileImage: 'assets/images/profile.jpg'
                };
                sectionsData = this.getFallbackSections();
            }

            // The MainController now delegates section rendering to the SectionController
            // The SectionController will handle rendering the sections into the #main-content container
            if (this.controllers.section) {
                await this.controllers.section.renderSections(sectionsData);
            } else {
                console.warn('MainController: SectionController not available to render sections.');
                // Fallback if SectionController is not available
                this.showErrorFallback(new Error('Section content controller not initialized.'));
            }

            console.info('MainController: Initial content rendering completed (delegated sections).');
            
            // Mark the main content as initialized to trigger CSS visibility
            const mainContentElement = document.getElementById('main-content');
            if (mainContentElement) {
                mainContentElement.setAttribute('data-main-initialized', 'true');
            }
            
        } catch (error) {
            console.error('MainController: Failed to render initial content.', error);
            this.showErrorFallback(error);
        }
    }

    // Adicione este método para fallback
    getFallbackSections() {
        return [
            {
                id: 'about',
                title: 'About Me',
                subtitle: 'My academic and professional journey',
                type: 'timeline',
                metadata: { visible: true, order: 1 }
            },
            {
                id: 'projects', 
                title: 'Projects',
                subtitle: 'Technical and scientific works',
                type: 'cards',
                metadata: { visible: true, order: 2 }
            }
        ];
    }

    // Método para mostrar fallback em caso de erro
    showErrorFallback(error) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-fallback">
                    <h2>Content Temporarily Unavailable</h2>
                    <p>Some content could not be loaded. Please refresh the page or try again later.</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        Reload Page
                    </button>
                    <details class="error-details">
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            `;
        }
    }

    /**
     * @brief Handles route change events from the Router.
     * @public
     * @param {Object} routeData - Data about the current route, including viewName and viewData.
     * @returns {Promise<void>}
     */
    async handleRouteChange(routeData) {
        console.info(`MainController: Handling route change to view: ${routeData.viewName}`);
        // MainController's role is to orchestrate which sub-controller handles the route.
        // For 'section' views, it should delegate to SectionController.
        if (routeData.viewName === 'section') {
            if (this.controllers.section) {
                await this.controllers.section.handleSectionChange({ detail: { sectionId: routeData.viewData.sectionId } });
            } else {
                console.error('MainController: SectionController not available to handle section route.');
                this.showErrorFallback(new Error('Section content controller not initialized for route change.'));
            }
        } else {
            // For other views (e.g., hero, footer, navigation), if they are dynamic and need re-rendering
            // MainController might trigger ViewManager or specific controllers.
            // Given the current setup, hero, navigation, and footer are largely static or managed by their own controllers.
            console.warn(`MainController: Route for ${routeData.viewName} not explicitly handled. Consider delegating to a specific controller.`);
            // Fallback: If ViewManager is meant to render generic views, use it.
            // await this.viewManager.renderView(routeData.viewName, routeData.viewData);
        }
    }

    /**
     * @brief Executes the ordered sequence of initialization steps
     * @private
     * @returns {Promise<void>} Resolves when all initialization steps complete successfully
     */
    async executeInitializationSequence() {
        // MainController no longer directly manages view connection or sub-controller initialization.
        // These are now handled by App.js.
        // This method can be simplified or removed if MainController's initialization is just setting its own state.
        console.debug('MainController: executeInitializationSequence called, but most steps are now in App.js.');
        // Ensure event handlers are set up if MainController needs to listen to global events
        this.setupEventHandlers();
        this.setupGlobalErrorHandling();
    }

    /**
     * @brief Renders all main application sections with appropriate data.
     * @private
     * @async
     * @returns {Promise<void>} Resolves when all views are successfully rendered.
     * @throws {Error} When required data is unavailable or rendering fails.
     */
    async renderApplicationContent() {
        // This method is now largely superseded by renderInitialContent and handleRouteChange
        // which delegate to SectionController. This method can be removed or refactored.
        console.warn('MainController: renderApplicationContent is deprecated. Use renderInitialContent or handleRouteChange.');
    }

    /**
     * @brief Sets up global event listeners for application-wide events
     * @private
     */
    setupEventHandlers() {
        const signal = this.eventAbortController.signal;

        // Example: Listen for navigation events if MainController needs to react to them
        window.addEventListener('navigation:navigate', this.handleNavigationEvent, { signal });
        window.addEventListener('hero:action', this.handleHeroEvent, { signal });
        window.addEventListener('section:activated', this.handleSectionEvent, { signal });

        console.debug('MainController: Global event handlers set up.');
    }

    /**
     * @brief Handles navigation events (e.g., from NavigationView)
     * @private
     * @param {CustomEvent} event - The navigation event
     */
    handleNavigationEvent(event) {
        console.log('MainController: Navigation event received:', event.detail);
        // Example: Route to a specific section or view based on navigation
        // this.router.navigate(event.detail.path);
    }

    /**
     * @brief Handles hero section events (e.g., button clicks)
     * @private
     * @param {CustomEvent} event - The hero action event
     */
    handleHeroEvent(event) {
        console.log('MainController: Hero action event received:', event.detail);
        // Example: Scroll to a section or open a modal
    }

    /**
     * @brief Handles section activation events (e.g., from SectionView IntersectionObserver)
     * @private
     * @param {CustomEvent} event - The section activated event
     */
    handleSectionEvent(event) {
        console.log('MainController: Section activated event received:', event.detail);
        // Example: Update URL hash or analytics
    }

    /**
     * @brief Sets up global error handling for the application
     * @private
     */
    setupGlobalErrorHandling() {
        const signal = this.eventAbortController.signal;

        window.addEventListener('error', this.handleGlobalError, { signal });
        window.addEventListener('unhandledrejection', this.handleGlobalError, { signal });

        console.debug('MainController: Global error handling set up.');
    }

    /**
     * @brief Handles global errors and unhandled promise rejections
     * @private
     * @param {ErrorEvent|PromiseRejectionEvent} event - The error or rejection event
     */
    handleGlobalError(event) {
        console.error('MainController: Global error caught:', event);
        // this.performanceMetrics.errorCount++; // Assuming performanceMetrics is defined elsewhere

        // Optionally, show a user-friendly error message for critical errors
        if (this.shouldShowUserError(event)) {
            this.showUserFriendlyError();
        }
    }

    /**
     * @brief Determines if a user-facing error message should be displayed
     * @private
     * @param {ErrorEvent|PromiseRejectionEvent} errorEvent - The error or rejection event
     * @returns {boolean} True if a user-facing error should be shown
     */
    shouldShowUserError(errorEvent) {
        // Only show user-facing errors for critical application failures
        const criticalErrors = [
            'TypeError',
            'ReferenceError',
            'SyntaxError'
        ];
        
        const error = errorEvent.error || errorEvent.reason;
        if (!error) return false;

        return criticalErrors.some(errType => error.name === errType);
    }

    /**
     * @brief Displays a user-friendly error message on the UI
     * @private
     */
    showUserFriendlyError() {
        const errorContainer = document.getElementById('app-error-message');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <p>An unexpected error occurred. Please refresh the page.</p>
                    <button onclick="window.location.reload()" class="btn btn-sm btn-primary">Reload</button>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    /**
     * @brief Handles initialization errors by logging and potentially showing a critical fallback
     * @private
     * @param {Error} error - The error that occurred during initialization
     */
    async handleInitializationError(error) {
        console.error('MainController: Initialization error:', error);
        // Potentially delegate to a global error reporter or show a critical fallback UI
        // For now, re-throwing to let App.js handle the critical fallback
        throw error;
    }

    /**
     * @brief Dispatches an event indicating the application is ready
     * @private
     */
    dispatchApplicationReadyEvent() {
        const event = new CustomEvent('app:mainControllerReady', {
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
        console.debug('MainController: Dispatched app:mainControllerReady event.');
    }

    /**
     * @brief Destroys the controller and cleans up resources
     * @public
     * @description Properly tears down the controller to prevent memory leaks
     */
    destroy() {
        // Abort all event listeners
        this.eventAbortController.abort();
        
        // Clean up controllers (if MainController had any direct sub-controllers)
        Object.values(this.controllers).forEach(controller => {
            if (typeof controller.destroy === 'function') {
                controller.destroy();
            }
        });
        
        // Clean up views (if MainController had any direct views)
        // Views are now managed by App.js or specific sub-controllers, so MainController doesn't destroy them directly.
        
        // Remove global error handlers
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handleGlobalError);
        
        this.isInitialized = false;
        console.info('MainController: Controller destroyed and resources cleaned up.');
    }

    /**
     * @brief Gets the current initialization state of the controller
     * @public
     * @returns {boolean} True if controller is fully initialized
     */
    getInitializationState() {
        return this.isInitialized;
    }

    /**
     * @brief Gets a reference to a specific sub-controller
     * @public
     * @param {string} controllerName - Name of the controller to retrieve
     * @returns {Object|null} The controller instance or null if not found
     */
    getController(controllerName) {
        return this.controllers[controllerName] || null;
    }
}

export default MainController;

