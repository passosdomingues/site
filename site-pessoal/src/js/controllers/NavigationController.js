import eventBus from '../core/EventBus.js';
import { NavigationView } from '../views/NavigationView.js';

/**
 * @brief Navigation controller
 * @description Manages navigation state and interactions
 */
export class NavigationController {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.contentModel = dependencies.contentModel;
        this.services = dependencies.services || {};
        
        this.navigationView = null;
        this.isInitialized = false;

        this.onContentLoaded = this.onContentLoaded.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    /**
     * @brief Initialize navigation controller
     * @description Sets up navigation view and scroll handling
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Cria e injeta o container de nav antes do main-content
            let navContainer = document.querySelector('.main-navigation-container');
            if (!navContainer) {
                navContainer = document.createElement('div');
                navContainer.className = 'main-navigation-container';
                const mainContent = document.getElementById('main-content');
                document.body.insertBefore(navContainer, mainContent || document.body.firstChild);
            }

            // Obtém seções antes de criar a view
            let sections = [];
            if (this.contentModel) {
                if (!this.contentModel.isInitialized) {
                    await this.contentModel.initializeContentModel();
                }
                sections = this.contentModel.getAllSections();
            }

            this.navigationView = new NavigationView({
                container: navContainer,
                eventBus: this.eventBus,
                sections
            });

            await this.navigationView.init();
            await this.navigationView.render();

            this.setupEventListeners();

            this.isInitialized = true;
            console.info('NavigationController: Inicializado com sucesso.');

        } catch (error) {
            console.error('NavigationController: Falha na inicialização', error);
            this.eventBus.publish('app:error', error);
        }
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        this.eventBus.subscribe('content:loaded', this.onContentLoaded);
        window.addEventListener('scroll', this.onScroll);
        
        // Handle navigation clicks
        this.eventBus.subscribe('navigation:clicked', this.handleNavigationClick.bind(this));
    }

    /**
     * @brief Handle content loaded event
     */
    onContentLoaded() {
        this.renderNavigation();
    }

    /**
     * @brief Handle scroll events for active section detection
     */
    onScroll() {
        this.updateActiveNavigationLink();
    }

    /**
     * @brief Render navigation menu
     */
    async renderNavigation() {
        // Navegação agora é renderizada no init() via NavigationView
        // Este método é mantido para retrocompatibilidade com eventos
        console.info('NavigationController: renderNavigation() chamado (já renderizado no init).');
    }

    /**
     * @brief Update active navigation link based on scroll position
     */
    updateActiveNavigationLink() {
        // Scroll spy agora é gerenciado via IntersectionObserver no NavigationView
    }

    /**
     * @brief Handle navigation link clicks
     * @param {Object} data - Click data
     */
    handleNavigationClick(data) {
        const { sectionId } = data;
        
        // Scroll to section
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }

        this.eventBus.publish('navigation:clicked:processed', { sectionId });
    }

    /**
     * @brief Toggle mobile navigation menu
     */
    toggleMobileMenu() {
        if (this.navigationView) {
            this.navigationView.toggleMobileMenu();
        }
    }

    /**
     * @brief Destroy controller and clean up
     */
    destroy() {
        this.eventBus.unsubscribe('content:loaded', this.onContentLoaded);
        this.eventBus.unsubscribe('navigation:clicked', this.handleNavigationClick);
        window.removeEventListener('scroll', this.onScroll);
        
        this.navigationView = null;
        this.isInitialized = false;
        
        console.info('NavigationController: Destroyed');
    }
}