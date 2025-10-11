/**
 * @file MainController.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Main application controller implementing MVC orchestrator pattern.
 */
const ERROR_MESSAGES = {
    invalidModels: 'MainController requires a valid models object for initialization.',
    invalidViewManager: 'MainController requires a valid ViewManager instance.',
    invalidControllers: 'MainController requires a valid controllers object for initialization.',
    controllerInitializationFailed: 'Failed to initialize sub-controllers.',
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
        this.isInitialized = true;
        console.info('MainController: Initialization complete.');
    }
}

export default MainController;
