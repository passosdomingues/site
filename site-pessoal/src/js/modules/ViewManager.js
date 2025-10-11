/**
 * @file ViewManager.js
 * @brief Advanced view management and rendering system
 * @description Handles dynamic view loading with proper initialization sequencing
 */

const VIEW_CONFIGURATION = {
    CRITICAL_VIEWS: ['navigation', 'hero', 'footer'],
    LAZY_LOADING: {
        rootMargin: '50px 0px',
        threshold: 0.1
    },
    PERFORMANCE: {
        viewTransitionDuration: 300,
        loadingTimeout: 10000,
        cacheSize: 20
    }
};

class ViewManager {
    constructor(configuration = {}) {
        // Configuração básica - sem acesso ao DOM no construtor
        this.configuration = { ...VIEW_CONFIGURATION, ...configuration };
        this.viewModuleCache = new Map();
        this.currentActiveView = null;
        this.isInitialized = false;
        
        // Elementos do DOM serão definidos posteriormente
        this.containers = {
            navigation: null,
            hero: null,
            main: null,
            footer: null
        };
    }

    /**
     * @brief Inicialização segura após DOM estar pronto
     */
    async initialize() {
        if (this.isInitialized) return;

        console.info('ViewManager: Initializing with DOM containers...');
        
        // Conectar aos contêineres do DOM de forma segura
        this.containers.navigation = document.getElementById('primary-navigation');
        this.containers.hero = document.querySelector('.hero-content-container');
        this.containers.main = document.getElementById('dynamic-content');
        this.containers.footer = document.querySelector('.global-footer .container');
        
        // Validar contêineres críticos
        if (!this.containers.main) {
            throw new Error('ViewManager: Main content container not found');
        }

        await this.preloadCriticalViews();
        this.isInitialized = true;
        
        console.info('ViewManager: Successfully initialized');
    }

    /**
     * @brief Pré-carrega views críticas
     */
    async preloadCriticalViews() {
        const promises = this.configuration.CRITICAL_VIEWS.map(viewName =>
            this.preloadViewModule(viewName)
        );
        
        await Promise.allSettled(promises);
    }

    /**
     * @brief Carrega e renderiza views específicas
     */
    async loadAndRender(viewName, data = {}, containerKey = 'main') {
        if (!this.isInitialized) {
            throw new Error('ViewManager must be initialized before rendering');
        }

        const container = this.containers[containerKey];
        if (!container) {
            console.warn(`ViewManager: Container ${containerKey} not found for view ${viewName}`);
            return;
        }

        try {
            this.showLoadingState(container);
            const viewModule = await this.loadViewModule(viewName);
            const content = await viewModule.render(data);
            
            await this.renderToContainer(container, content, viewName);
            await this.initializeViewModule(viewModule, data);
            
            this.hideLoadingState(container);
            console.debug(`ViewManager: Successfully rendered ${viewName}`);
            
        } catch (error) {
            this.hideLoadingState(container);
            console.error(`ViewManager: Failed to render ${viewName}:`, error);
            await this.renderErrorFallback(container, error, viewName);
        }
    }

    /**
     * @brief Carrega módulo de view com cache
     */
    async loadViewModule(viewName) {
        // Verificar cache primeiro
        if (this.viewModuleCache.has(viewName)) {
            return this.viewModuleCache.get(viewName);
        }

        try {
            // Importação dinâmica com caminho absoluto
            const module = await import(`/src/views/${viewName}.js`);
            this.viewModuleCache.set(viewName, module);
            return module;
            
        } catch (error) {
            console.error(`ViewManager: Failed to load view module ${viewName}:`, error);
            throw new Error(`Cannot load view: ${viewName}`);
        }
    }

    /**
     * @brief Pré-carrega módulo sem renderizar
     */
    async preloadViewModule(viewName) {
        try {
            await this.loadViewModule(viewName);
            console.debug(`ViewManager: Preloaded ${viewName}`);
        } catch (error) {
            console.warn(`ViewManager: Failed to preload ${viewName}:`, error);
        }
    }

    /**
     * @brief Renderiza conteúdo no container
     */
    async renderToContainer(container, content, viewName) {
        if (typeof content !== 'string') {
            throw new Error(`View ${viewName} render method must return string`);
        }

        // Transição suave
        container.style.opacity = '0';
        container.innerHTML = content;
        
        await new Promise(resolve => setTimeout(resolve, 50));
        container.style.opacity = '1';
        container.style.transition = 'opacity 0.3s ease-in-out';
    }

    /**
     * @brief Inicializa módulo de view se disponível
     */
    async initializeViewModule(viewModule, data) {
        if (typeof viewModule.init === 'function') {
            try {
                await viewModule.init(data);
            } catch (error) {
                console.warn('ViewManager: View init method failed:', error);
            }
        }
    }

    /**
     * @brief Estados de loading
     */
    showLoadingState(container) {
        container.setAttribute('aria-busy', 'true');
    }

    hideLoadingState(container) {
        container.removeAttribute('aria-busy');
    }

    /**
     * @brief Fallback para erros
     */
    async renderErrorFallback(container, error, viewName) {
        const errorContent = `
            <div class="view-error" role="alert">
                <h3>Content Loading Error</h3>
                <p>Unable to load ${viewName} content. Please try refreshing the page.</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    Reload Page
                </button>
            </div>
        `;
        container.innerHTML = errorContent;
    }

    /**
     * @brief Renderiza conteúdo inicial da aplicação
     */
    async renderInitialContent(viewsToRender) {
        if (!this.isInitialized) {
            throw new Error('ViewManager not initialized');
        }

        const renderPromises = viewsToRender.map(({ viewName, data, container }) =>
            this.loadAndRender(viewName, data, container)
        );

        await Promise.allSettled(renderPromises);
    }

    /**
     * @brief Limpeza de recursos
     */
    destroy() {
        this.viewModuleCache.clear();
        this.isInitialized = false;
    }
}

export default ViewManager;