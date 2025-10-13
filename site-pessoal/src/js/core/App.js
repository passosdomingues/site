import eventBus from './EventBus.js';

/**
 * @brief Main application coordinator
 * @description Manages application lifecycle and coordinates MVC components
 */
export class App {
    constructor(config = {}) {
        this.config = config;
        this.controllers = new Map();
        this.services = new Map();
        this.isInitialized = false;
        this.eventBus = eventBus;
    }

    /**
     * @brief Initialize the application
     * @description Sets up all components in proper order
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('App: Application already initialized');
            return;
        }

        try {
            console.info('App: Starting application initialization...');
            
            // Initialize services first
            await this.initializeServices();
            
            // Initialize controllers
            await this.initializeControllers();
            
            // Start application
            await this.start();
            
            this.isInitialized = true;
            console.info('App: Application initialized successfully');
            
        } catch (error) {
            console.error('App: Initialization failed:', error);
            this.eventBus.publish('app:error', error);
            throw error;
        }
    }

    /**
     * @brief Initialize service modules
     * @description Loads and initializes all service modules
     * @returns {Promise<void>}
     */
    async initializeServices() {
        const services = this.config.services || {};
        
        for (const [serviceName, ServiceClass] of Object.entries(services)) {
            try {
                const serviceInstance = new ServiceClass({ eventBus: this.eventBus });
                this.services.set(serviceName, serviceInstance);
                
                if (typeof serviceInstance.init === 'function') {
                    await serviceInstance.init();
                }
                
                console.info(`App: Service ${serviceName} initialized`);
            } catch (error) {
                console.error(`App: Failed to initialize service ${serviceName}:`, error);
                throw error;
            }
        }
    }

    /**
     * @brief Initialize controller modules
     * @description Loads and initializes all controller modules
     * @returns {Promise<void>}
     */
    async initializeControllers() {
        const controllers = this.config.controllers || {};
        
        for (const [controllerName, ControllerClass] of Object.entries(controllers)) {
            try {
                const dependencies = this.buildControllerDependencies(controllerName);
                const controllerInstance = new ControllerClass(dependencies);
                this.controllers.set(controllerName, controllerInstance);
                
                if (typeof controllerInstance.init === 'function') {
                    await controllerInstance.init();
                }
                
                console.info(`App: Controller ${controllerName} initialized`);
            } catch (error) {
                console.error(`App: Failed to initialize controller ${controllerName}:`, error);
                throw error;
            }
        }
    }

    /**
     * @brief Build dependencies for controllers
     * @param {string} controllerName - Name of the controller
     * @returns {Object} Dependency object
     */
    buildControllerDependencies(controllerName) {
        const dependencies = {
            eventBus: this.eventBus,
            services: Object.fromEntries(this.services)
        };

        // Add specific service dependencies based on controller
        switch (controllerName) {
            case 'mainController':
                dependencies.contentModel = this.services.get('contentModel');
                break;
            case 'navigationController':
                dependencies.contentModel = this.services.get('contentModel');
                break;
        }

        return dependencies;
    }

    /**
     * @brief Start the application
     * @description Begins application execution
     * @returns {Promise<void>}
     */
    async start() {
        this.eventBus.publish('app:start');
        
        // Hide loading overlay
        this.eventBus.publish('ui:loading:hide');
        
        console.info('App: Application started');
    }

    /**
     * @brief Get a controller instance
     * @param {string} controllerName - Name of the controller
     * @returns {Object|null} Controller instance
     */
    getController(controllerName) {
        return this.controllers.get(controllerName) || null;
    }

    /**
     * @brief Get a service instance
     * @param {string} serviceName - Name of the service
     * @returns {Object|null} Service instance
     */
    getService(serviceName) {
        return this.services.get(serviceName) || null;
    }

    /**
     * @brief Gracefully shutdown the application
     * @description Cleans up resources and event listeners
     */
    async shutdown() {
        this.eventBus.publish('app:shutdown');
        
        // Cleanup controllers
        for (const [name, controller] of this.controllers) {
            if (typeof controller.destroy === 'function') {
                await controller.destroy();
            }
        }
        
        // Cleanup services
        for (const [name, service] of this.services) {
            if (typeof service.destroy === 'function') {
                await service.destroy();
            }
        }
        
        this.controllers.clear();
        this.services.clear();
        this.isInitialized = false;
        
        console.info('App: Application shutdown complete');
    }
}