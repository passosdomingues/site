/**
 * @file ContentModel.js
 * @author Rafael Passos Domingues
 * @brief Model responsible for managing the website's portfolio content.
 * @description Consumes data from PortfolioData.js and provides structured access
 * to sections for the application's views and controllers.
 */

import eventBus from '../core/EventBus.js';
import { PORTFOLIO_DATA } from '../data/PortfolioData.js';

/**
 * @class ContentModel
 * @description Manages the portfolio's section data.
 */
class ContentModel {
    /**
     * @brief Constructs the ContentModel instance.
     * @param {Object} [config={}] - The configuration object.
     * @param {Object} [config.eventBus] - The application's event bus.
     */
    constructor(config = {}) {
        this.eventBus = config.eventBus || eventBus;
        this.sections = new Map();
        this.isInitialized = false;
    }

    /**
     * @brief Initializes the model by loading and structuring the portfolio data.
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            console.warn('ContentModel: Already initialized.');
            return;
        }

        console.info('ContentModel: Initializing with portfolio data...');
        const portfolioSections = PORTFOLIO_DATA.sections || [];
        
        portfolioSections.forEach(section => {
            this.sections.set(section.id, section);
        });
        
        this.isInitialized = true;
        this.eventBus.publish('content:loaded', { totalSections: this.sections.size });
        console.info('ContentModel: Initialization complete. Content loaded.');
    }
    
    /**
     * @brief Retrieves a single section by its unique ID.
     * @param {string} sectionId - The ID of the section to retrieve.
     * @returns {Object|undefined} The section object or undefined if not found.
     */
    getSection(sectionId) {
        return this.sections.get(sectionId);
    }
    
    /**
     * @brief Retrieves all sections, sorted by their defined order.
     * @returns {Array<Object>} A sorted array of all section objects.
     */
    getAllSections() {
        return Array.from(this.sections.values())
            .sort((a, b) => (a.metadata.order || 0) - (b.metadata.order || 0));
    }
    
    /**
     * @brief Destroys the content model and cleans up resources.
     */
    destroy() {
        this.sections.clear();
        this.isInitialized = false;
        console.info('ContentModel: Destroyed.');
    }
}

export { ContentModel };