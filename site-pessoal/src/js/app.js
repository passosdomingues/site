/**
 * @file app.js
 * @brief Main application entry point with robust initialization
 */

import MainController from './controllers/MainController.js';
import ViewManager from './modules/ViewManager.js';
import ThemeManager from './modules/ThemeManager.js';
import AccessibilityManager from './modules/AccessibilityManager.js';

import ContentModel from './models/ContentModel.js';
import UserModel from './models/UserModel.js';

class App {
    constructor() {
        this.viewManager = null;
        this.themeManager = null;
        this.accessibilityManager = null;
        this.mainController = null;
        this.isInitialized = false;
        this.eventAbortController = new AbortController();
    }

    async initializeApplication() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            console.info('App: Starting application initialization...');

            // 1. Validar compatibilidade do navegador
            if (!this.checkBrowserCompatibility()) {
                this.handleBrowserIncompatibility();
                return;
            }

            // 2. Inicializar gerenciadores de infraestrutura
            await this.initializeInfrastructureManagers();

            // 3. Inicializar modelos de dados
            await this.initializeDataModels();

            // 4. Inicializar controlador principal
            await this.initializeMainController();

            // 5. Renderizar conteúdo inicial
            await this.renderInitialContent();

            // 6. Configurar eventos globais
            this.setupGlobalEventListeners();

            // 7. Finalizar inicialização
            await this.finalizeInitialization();

            console.info('App: Application initialized successfully');

        } catch (error) {
            console.error('App: Initialization failed:', error);
            await this.handleInitializationFailure(error);
        }
    }

    checkBrowserCompatibility() {
        const requiredFeatures = {
            promises: typeof Promise !== 'undefined',
            modules: 'noModule' in HTMLScriptElement.prototype,
            fetch: typeof fetch !== 'undefined',
            intersectionObserver: typeof IntersectionObserver !== 'undefined'
        };

        const missingFeatures = Object.entries(requiredFeatures)
            .filter(([, supported]) => !supported)
            .map(([feature]) => feature);

        if (missingFeatures.length > 0) {
            console.warn('Missing browser features:', missingFeatures);
            return false;
        }

        return true;
    }

    handleBrowserIncompatibility() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="browser-compatibility-error">
                    <div class="error-container">
                        <h1>Browser Update Recommended</h1>
                        <p>Your browser doesn't support all features required for this application.</p>
                        <p>Please update to a modern browser like Chrome, Firefox, Safari, or Edge.</p>
                        <button onclick="window.location.reload()" class="btn btn-primary">
                            Try Anyway
                        </button>
                    </div>
                </div>
            `;
        }
    }

    async initializeInfrastructureManagers() {
        console.info('App: Initializing infrastructure managers...');

        // ViewManager primeiro - é crítico
        this.viewManager = new ViewManager();
        await this.viewManager.initialize();

        // Outros gerenciadores em paralelo
        [this.themeManager, this.accessibilityManager] = await Promise.all([
            this.initializeManager(ThemeManager),
            this.initializeManager(AccessibilityManager)
        ]);
    }

    async initializeManager(ManagerClass) {
        try {
            const manager = new ManagerClass();
            if (typeof manager.initialize === 'function') {
                await manager.initialize();
            }
            return manager;
        } catch (error) {
            console.warn(`Failed to initialize ${ManagerClass.name}:`, error);
            return null;
        }
    }

    async initializeDataModels() {
        console.info('App: Initializing data models...');

        this.models = {
            content: new ContentModel(),
            user: new UserModel()
        };

        // Inicialização tolerante a falhas
        await Promise.allSettled([
            this.models.content.initialize?.().catch(error => 
                console.warn('ContentModel initialization warning:', error)
            ),
            this.models.user.initialize?.().catch(error =>
                console.warn('UserModel initialization warning:', error)
            )
        ]);
    }

    async initializeMainController() {
        console.info('App: Initializing main controller...');

        this.mainController = new MainController(this.models, {
            viewManager: this.viewManager,
            themeManager: this.themeManager,
            accessibilityManager: this.accessibilityManager
        });

        await this.mainController.initializeApplication();
    }

    async renderInitialContent() {
        console.info('App: Rendering initial content...');
        
        if (this.mainController && this.mainController.getInitializationState()) {
            await this.mainController.renderInitialContent();
        } else {
            throw new Error('MainController not ready for rendering');
        }
    }

    setupGlobalEventListeners() {
        const signal = this.eventAbortController.signal;

        // Gerenciar mudanças de rota
        window.addEventListener('popstate', this.handlePopState.bind(this), { signal });

        // Gerenciar visibilidade da página
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this), { signal });

        // Gerenciar status online/offline
        window.addEventListener('online', this.handleOnlineStatus.bind(this), { signal });
        window.addEventListener('offline', this.handleOfflineStatus.bind(this), { signal });
    }

    handlePopState(event) {
        // Navegação do browser (avançar/voltar)
        console.debug('App: Pop state event', event.state);
    }

    handleVisibilityChange() {
        const isVisible = !document.hidden;
        console.debug('App: Visibility changed:', isVisible);
    }

    handleOnlineStatus() {
        console.info('App: Online - resuming normal operation');
    }

    handleOfflineStatus() {
        console.warn('App: Offline - some features may be unavailable');
    }

    async finalizeInitialization() {
        // Esconder loading indicator
        this.hideLoadingOverlay();

        // Marcar aplicação como inicializada
        this.isInitialized = true;
        
        // Disparar evento de aplicação pronta
        window.dispatchEvent(new CustomEvent('app:initialized', {
            detail: { timestamp: Date.now() }
        }));

        console.info('App: Initialization sequence completed');
    }

    hideLoadingOverlay() {
        const loadingIndicator = document.querySelector('.content-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.hidden = true;
            }, 300);
        }
    }

    async handleInitializationFailure(error) {
        console.error('App: Critical initialization failure:', error);

        // Fallback extremo
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: system-ui;">
                <h1>Application Failed to Load</h1>
                <p>We're experiencing technical difficulties. Please try again later.</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin: 1rem;">
                    Reload Application
                </button>
                <details style="margin-top: 1rem; text-align: left;">
                    <summary>Technical Details</summary>
                    <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;">${error.message}</pre>
                </details>
            </div>
        `;
    }

    destroy() {
        this.eventAbortController.abort();
        
        if (this.mainController) this.mainController.destroy();
        if (this.viewManager) this.viewManager.destroy();
        
        this.isInitialized = false;
        console.info('App: Application destroyed');
    }
}

// Bootstrap da aplicação
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    
    // Expor para debugging em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        window.app = app;
    }

    try {
        await app.initializeApplication();
    } catch (error) {
        console.error('App: Bootstrap failed:', error);
    }
});

export default App;