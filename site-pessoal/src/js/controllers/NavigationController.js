import { NavigationView } from '../views/NavigationView.js';

/**
 * @brief Manages the navigation state and interactions.
 */
export class NavigationController {
    constructor(dependencies) {
        this.eventBus = dependencies.eventBus;
        this.contentModel = dependencies.services.contentModel;

        this.navigationView = new NavigationView({
            container: document.getElementById('navigation-container')
        });

        this.handleNavigationClick = this.handleNavigationClick.bind(this);
    }

    async init() {
        const navLinks = this.contentModel.getNavigationLinks();
        this.navigationView.render(navLinks);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.eventBus.subscribe('navigation:clicked', this.handleNavigationClick);
    }

    handleNavigationClick({ sectionId }) {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            const headerHeight = document.getElementById('main-header')?.offsetHeight || 0;
            const targetPosition = sectionElement.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}