/**
 * @file MainController.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Main application controller implementing MVC orchestrator pattern.
 * @description Acts as the central orchestrator in the MVC pattern,
 * connecting models, views, and sub-controllers while managing initialization flow,
 * error handling, and inter-component communication.
 */

const ERROR_MESSAGES = {
    invalidModels: 'MainController requires a valid models object for initialization.',
    invalidViewManager: 'MainController requires a valid ViewManager instance.',
    invalidControllers: 'MainController requires a valid controllers object for initialization.',
    controllerInitializationFailed: 'Failed to initialize sub-controllers.',
    renderFailure: 'Critical failure during application rendering.',
    eventHandlerSetupFailed: 'Failed to set up event handlers between components.'
};

class MainController {
    constructor(models, viewManager, controllers) {
        if (!models || typeof models !== 'object') throw new Error(ERROR_MESSAGES.invalidModels);
        if (!viewManager) throw new Error(ERROR_MESSAGES.invalidViewManager);
        if (!controllers || typeof controllers !== 'object') throw new Error(ERROR_MESSAGES.invalidControllers);
        
        this.models = models;
        this.viewManager = viewManager;
        this.controllers = controllers;
        this.isInitialized = false;
        this.eventAbortController = new AbortController();
    }

    async initialize() {
        if (this.isInitialized) {
            console.warn('MainController: Already initialized.');
            return;
        }

        console.info('MainController: Initializing...');

        try {
            await this.initializeSubControllers();
            this.setupEventListeners();
            this.setupGlobalErrorHandling();
            this.isInitialized = true;
            console.info('MainController: Initialization complete.');
        } catch (error) {
            console.error('MainController: Initialization failed.', error);
            throw new Error(`${ERROR_MESSAGES.controllerInitializationFailed}: ${error.message}`);
        }
    }
    
    async initializeSubControllers() {
        const controllerPromises = Object.values(this.controllers)
            .filter(controller => typeof controller.initialize === 'function')
            .map(controller => controller.initialize());
        await Promise.all(controllerPromises);
        console.info('MainController: All sub-controllers initialized.');
    }

    setupEventListeners() {
        try {
            const { signal } = this.eventAbortController;
            document.addEventListener('custom:navigateTo', (event) => {
                this.handleNavigation(event.detail.path);
            }, { signal });
            console.info('MainController: Core event listeners set up.');
        } catch (error) {
            console.error('MainController: Error setting up event listeners.', error);
            throw new Error(`${ERROR_MESSAGES.eventHandlerSetupFailed}: ${error.message}`);
        }
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleGlobalError.bind(this));
    }
    
    handleGlobalError(event) {
        const error = event.reason || event.error;
        console.error("MainController: Unhandled global error:", error);
    }

    handleNavigation(path) {
        console.log(`MainController: Navigating to ${path}`);
    }

    destroy() {
        if (!this.isInitialized) return;
        
        console.info('MainController: Destroying controller...');
        this.eventAbortController.abort();
        
        Object.values(this.controllers).forEach(controller => {
            if (typeof controller.destroy === 'function') {
                controller.destroy();
            }
        });
        
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handleGlobalError);
        
        this.isInitialized = false;
        console.info('MainController: Controller destroyed and resources cleaned up.');
    }

    getInitializationState() {
        return this.isInitialized;
    }

    getController(controllerName) {
        return this.controllers[controllerName] || null;
    }
}

export default MainController;