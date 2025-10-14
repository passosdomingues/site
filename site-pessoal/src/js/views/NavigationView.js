/**
 * @file Navigation view
 * @brief Renders and manages navigation UI
 */

import eventBus from '../core/EventBus.js';

/**
 * @class NavigationView
 * @brief Handles navigation rendering and mobile menu functionality
 */
export class NavigationView {
    /**
     * @brief Constructs NavigationView instance
     * @param {Object} config - Configuration object
     * @param {HTMLElement} config.container - Navigation container element
     * @param {Object} config.eventBus - Event bus instance
     */
    constructor(config = {}) {
        this.container = config.container;
        this.eventBus = config.eventBus || eventBus;
        
        this.isMobileMenuOpen = false;
        
        this.handleNavClick = this.handleNavClick.bind(this);
        this.setupEventListeners();
    }

    /**
     * @brief Set up event listeners for navigation
     */
    setupEventListeners() {
        this.container.addEventListener('click', this.handleNavClick);
        
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * @brief Handle navigation click events
     * @param {Event} event - Click event
     */
    handleNavClick(event) {
        const link = event.target.closest('.nav-link');
        if (!link) return;

        event.preventDefault();
        
        const sectionId = link.getAttribute('href')?.replace('#', '');
        if (sectionId) {
            this.eventBus.publish('navigation:clicked', { sectionId });
            
            if (this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    /**
     * @brief Handle window resize for responsive behavior
     */
    handleResize() {
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.toggleMobileMenu(false);
        }
    }

    /**
     * @brief Render navigation menu
     * @param {Array} sections - Array of section objects
     */
    renderNavigation(sections) {
        if (!this.container) return;

        const visibleSections = sections.filter(section => section.metadata.visible);
        
        const navHTML = visibleSections.map(section => `
            <li class="nav-item">
                <a href="#${section.id}" 
                   class="nav-link" 
                   data-section-id="${section.id}">
                    ${this.escapeHtml(section.title)}
                </a>
            </li>
        `).join('');

        this.container.innerHTML = navHTML;
        
        this.eventBus.publish('navigation:view:rendered', { sections: visibleSections });
    }

    /**
     * @brief Set active section in navigation
     * @param {string} sectionId - ID of active section
     */
    setActiveSection(sectionId) {
        this.container.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = this.container.querySelector(`[data-section-id="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * @brief Toggle mobile menu state
     * @param {boolean} force - Force open/close state
     */
    toggleMobileMenu(force) {
        this.isMobileMenuOpen = force !== undefined ? force : !this.isMobileMenuOpen;
        
        const navContainer = this.container.closest('.main-navigation-container');
        if (navContainer) {
            navContainer.classList.toggle('nav-mobile-open', this.isMobileMenuOpen);
        }
        
        this.eventBus.publish('navigation:mobile:toggled', { isOpen: this.isMobileMenuOpen });
    }

    /**
     * @brief Update navigation item
     * @param {string} sectionId - Section identifier
     * @param {Object} updates - Update data
     */
    updateNavigationItem(sectionId, updates) {
        const navItem = this.container.querySelector(`[data-section-id="${sectionId}"]`);
        if (navItem && updates.title) {
            navItem.textContent = updates.title;
        }
    }

    /**
     * @brief Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * @brief Destroy navigation view and clean up resources
     */
    destroy() {
        this.container.removeEventListener('click', this.handleNavClick);
        window.removeEventListener('resize', this.handleResize);
        
        console.info('NavigationView: Destroyed');
    }
}