/**
 * @file NavigationController.js
 * @brief Navigation controller
 * @description Manages navigation state and interactions
 */

import eventBus from '../core/EventBus.js';
import { NavigationView } from '../views/NavigationView.js';

/**
 * @class NavigationController
 * @brief Handles navigation logic and scroll management
 */
export class NavigationController {
    /**
     * @brief Constructs NavigationController instance
     * @param {Object} dependencies - Controller dependencies
     * @param {Object} dependencies.eventBus - Event bus instance
     * @param {Object} dependencies.contentModel - Content model instance
     * @param {Object} dependencies.services - Service dependencies
     */
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
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            console.warn('NavigationController: Already initialized');
            return;
        }

        try {
            const navContainer = document.getElementById('nav-list');
            if (!navContainer) {
                throw new Error('NavigationController: nav-list element not found');
            }

            this.navigationView = new NavigationView({
                container: navContainer,
                eventBus: this.eventBus
            });

            this.setupEventListeners();

            if (this.contentModel && !this.contentModel.isInitialized) {
                await this.contentModel.initializeContentModel();
            }

            await this.renderNavigation();

            this.isInitialized = true;
            console.info('NavigationController: Initialized successfully');

        } catch (error) {
            console.error('NavigationController: Initialization failed', error);
            this.eventBus.publish('app:error', error);
        }
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        this.eventBus.subscribe('content:loaded', this.onContentLoaded);
        window.addEventListener('scroll', this.onScroll);
        
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
     * @async
     * @returns {Promise<void>}
     */
    async renderNavigation() {
        if (!this.navigationView || !this.contentModel) {
            return;
        }

        try {
            const sections = this.contentModel.getAllSections();
            this.navigationView.renderNavigation(sections);
            
            this.eventBus.publish('navigation:rendered', { sections });
            console.info('NavigationController: Navigation rendered');

        } catch (error) {
            console.error('NavigationController: Error rendering navigation', error);
        }
    }

    /**
     * @brief Update active navigation link based on scroll position
     */
    updateActiveNavigationLink() {
        if (!this.contentModel) return;

        const scrollPosition = window.scrollY + 100;
        const sections = this.contentModel.getAllSections();
        
        let activeSectionId = null;

        for (const section of sections) {
            const sectionElement = document.getElementById(section.id);
            if (sectionElement && scrollPosition >= sectionElement.offsetTop) {
                activeSectionId = section.id;
            }
        }

        if (activeSectionId) {
            this.navigationView.setActiveSection(activeSectionId);
            this.eventBus.publish('section:activated', { sectionId: activeSectionId });
        }
    }

    /**
     * @brief Handle navigation link clicks
     * @param {Object} data - Click data
     */
    handleNavigationClick(data) {
        const { sectionId } = data;
        
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