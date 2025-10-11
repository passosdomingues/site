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
     * @param {ViewManager} viewManager - Instance of the ViewManager
     * @param {Object} controllers - Collection of sub-controller instances
     */
    constructor(models, viewManager, controllers) {
        if (!models || typeof models !== 'object') throw new Error(ERROR_MESSAGES.invalidModels);
        if (!viewManager) throw new Error(ERROR_MESSAGES.invalidViewManager);
        if (!controllers || typeof controllers !== 'object') throw new Error(ERROR_MESSAGES.invalidControllers);
        
        /** @private */
        this.models = models;
        /** @private */
        this.viewManager = viewManager;
        /** @private */
        this.controllers = controllers;
        
        /** @private */
        this.isInitialized = false;
        
        /** @private */
        this.eventAbortController = new AbortController();
    }

    /**
     * @brief Initializes the controller and its sub-components
     * @public
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If initialization fails at a critical step
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('MainController: Already initialized.');
            return;
        }

        console.info('MainController: Initializing...');

        try {
            // Initialize sub-controllers in parallel
            await this.initializeSubControllers();
            
            // Set up event listeners for inter-component communication
            this.setupEventListeners();

            // Global error handling setup
            this.setupGlobalErrorHandling();
            
            this.isInitialized = true;
            console.info('MainController: Initialization complete.');

        } catch (error) {
            console.error('MainController: Initialization failed.', error);
            // Propagate error to the main application bootstrapper
            throw new Error(`${ERROR_MESSAGES.controllerInitializationFailed}: ${error.message}`);
        }
    }
    
    /**
     * @brief Initializes all registered sub-controllers
     * @private
     * @async
     * @returns {Promise<void>}
     */
    async initializeSubControllers() {
        const controllerPromises = Object.values(this.controllers)
            .filter(controller => typeof controller.initialize === 'function')
            .map(controller => controller.initialize());
            
        await Promise.all(controllerPromises);
        console.info('MainController: All sub-controllers initialized.');
    }

    /**
     * @brief Sets up global event listeners for the application
     * @private
     */
    setupEventListeners() {
        try {
            const { signal } = this.eventAbortController;

            // Example of a custom event listener
            document.addEventListener('custom:navigateTo', (event) => {
                this.handleNavigation(event.detail.path);
            }, { signal });
            
            console.info('MainController: Core event listeners set up.');
        } catch (error) {
            console.error('MainController: Error setting up event listeners.', error);
            throw new Error(`${ERROR_MESSAGES.eventHandlerSetupFailed}: ${error.message}`);
        }
    }
    
    /**
     * @brief Configures global error handlers for uncaught exceptions
     * @private
     */
    setupGlobalErrorHandling() {
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleGlobalError.bind(this));
    }
    
    /**
     * @brief Handles global uncaught errors
     * @private
     * @param {ErrorEvent|PromiseRejectionEvent} event - The error or rejection event
     */
    handleGlobalError(event) {
        const error = event.reason || event.error;
        console.error("MainController: Unhandled global error:", error);
        // Here you would typically report the error to a service
    }

    /**
     * @brief Handles navigation logic
     * @private
     * @param {string} path - The path to navigate to
     */
    handleNavigation(path) {
        console.log(`MainController: Navigating to ${path}`);
        // Logic to update models and render views for the new path
        // e.g., this.viewManager.renderView('mainContent', { path });
    }

    /**
     * @brief Cleans up resources and event listeners
     * @public
     */
    destroy() {
        if (!this.isInitialized) return;
        
        console.info('MainController: Destroying controller...');
        
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