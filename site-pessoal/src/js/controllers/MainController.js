/**
 * @file MainController.js
 * @brief Main application controller - refatorado para usar ViewManager
 */

class MainController {
    constructor(models, services = {}) {
        this.validateModels(models);
        
        this.models = models;
        this.services = services;
        this.controllers = {};
        this.isInitialized = false;
        this.eventAbortController = new AbortController();
    }

    validateModels(models) {
        if (!models || typeof models !== 'object') {
            throw new Error('MainController requires valid models object');
        }
        
        const required = ['user', 'content'];
        const missing = required.filter(model => !(model in models));
        
        if (missing.length > 0) {
            throw new Error(`Missing required models: ${missing.join(', ')}`);
        }
    }

    async initializeApplication() {
        if (this.isInitialized) return;

        try {
            console.info('MainController: Starting application initialization...');
            
            await this.initializeSubControllers();
            await this.setupEventHandlers();
            await this.setupGlobalErrorHandling();
            
            this.isInitialized = true;
            this.dispatchApplicationReadyEvent();
            
            console.info('MainController: Application initialized successfully');
            
        } catch (error) {
            console.error('MainController: Initialization failed:', error);
            await this.handleInitializationError(error);
            throw error;
        }
    }

    async initializeSubControllers() {
        // Inicialização básica dos sub-controladores
        this.controllers.navigation = new NavigationController();
        this.controllers.section = new SectionController(this.models);
        
        const initPromises = Object.values(this.controllers).map(controller =>
            controller.initialize?.().catch(error => 
                console.warn('Controller initialization warning:', error)
            )
        );
        
        await Promise.allSettled(initPromises);
    }

    async renderInitialContent() {
        if (!this.isInitialized) {
            throw new Error('MainController not initialized');
        }

        if (!this.services.viewManager) {
            throw new Error('ViewManager service not available');
        }

        console.info('MainController: Rendering initial content...');

        try {
            // Buscar dados com fallback
            const [userData, sectionsData] = await Promise.allSettled([
                this.models.user.getUserData().catch(() => this.getFallbackUserData()),
                this.models.content.getSections().catch(() => this.getFallbackSections())
            ]);

            const user = userData.status === 'fulfilled' ? userData.value : userData.reason;
            const sections = sectionsData.status === 'fulfilled' ? sectionsData.value : sectionsData.reason;

            // Definir views para renderização inicial
            const initialViews = [
                { viewName: 'navigation', data: { user, sections }, container: 'navigation' },
                { viewName: 'hero', data: user, container: 'hero' },
                { viewName: 'footer', data: user, container: 'footer' }
            ];

            // Renderizar através do ViewManager
            await this.services.viewManager.renderInitialContent(initialViews);

            // Inicializar seção principal se disponível
            if (sections.length > 0 && this.controllers.section) {
                const initialSection = sections[0]?.id || 'about';
                this.controllers.section.handleSectionChange({ detail: { sectionId: initialSection } });
            }

            // Marcar conteúdo como inicializado
            this.markContentAsInitialized();
            
            console.info('MainController: Initial content rendered successfully');

        } catch (error) {
            console.error('MainController: Failed to render initial content:', error);
            this.showErrorFallback(error);
        }
    }

    getFallbackUserData() {
        return {
            name: 'Rafael Passos Domingues',
            title: 'Physicist & Computer Scientist',
            summary: 'Researcher and Developer specializing in Astrophysics and Data Science',
            profileImage: '/src/images/profile.jpg'
        };
    }

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

    markContentAsInitialized() {
        const mainContent = document.getElementById('main-content');
        const appContainer = document.getElementById('app');
        
        if (mainContent) mainContent.setAttribute('data-main-initialized', 'true');
        if (appContainer) appContainer.setAttribute('data-app-initialized', 'true');
        
        // Esconder loading indicator
        const loadingIndicator = document.querySelector('.content-loading-indicator');
        if (loadingIndicator) loadingIndicator.hidden = true;
    }

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
                    <details style="margin-top: 1rem;">
                        <summary>Technical Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                </div>
            `;
        }
    }

    setupEventHandlers() {
        const signal = this.eventAbortController.signal;
        
        // Configurar handlers de evento básicos
        window.addEventListener('navigation:change', (event) => {
            this.handleNavigationChange(event.detail);
        }, { signal });

        window.addEventListener('section:change', (event) => {
            this.handleSectionChange(event.detail);
        }, { signal });
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    handleNavigationChange(detail) {
        if (detail.sectionId && this.controllers.navigation) {
            this.controllers.navigation.navigateToSection(detail.sectionId);
        }
    }

    handleSectionChange(detail) {
        if (detail.sectionId && this.controllers.section) {
            this.controllers.section.handleSectionChange(detail);
        }
    }

    dispatchApplicationReadyEvent() {
        window.dispatchEvent(new CustomEvent('application:ready', {
            detail: {
                timestamp: Date.now(),
                version: '3.0.0'
            }
        }));
    }

    async handleInitializationError(error) {
        console.error('MainController: Initialization error:', error);
        
        // Fallback básico
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: system-ui;">
                <h1>Application Loading Issue</h1>
                <p>We're having trouble loading the application. Please try again later.</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem;">
                    Reload Application
                </button>
            </div>
        `;
    }

    destroy() {
        this.eventAbortController.abort();
        Object.values(this.controllers).forEach(controller => {
            if (typeof controller.destroy === 'function') {
                controller.destroy();
            }
        });
        this.isInitialized = false;
    }

    getInitializationState() {
        return this.isInitialized;
    }
}

export default MainController;