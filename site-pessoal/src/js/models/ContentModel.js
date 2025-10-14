import { PORTFOLIO_DATA } from '../data/PortfolioData.js';

/**
 * @brief Manages the portfolio's content.
 */
export class ContentModel {
    constructor() {
        this.sections = [];
        this.user = {};
        this.isInitialized = false;
    }

    /**
     * @brief Initializes the content model by loading data.
     */
    async init() {
        if (this.isInitialized) return;
        try {
            this.sections = PORTFOLIO_DATA.sections || [];
            this.user = PORTFOLIO_DATA.user || {};
            this.isInitialized = true;
            console.info('ContentModel: Content loaded successfully.');
        } catch (error) {
            console.error('ContentModel: Failed to load content data.', error);
            throw error;
        }
    }

    getUserData() {
        return this.user;
    }

    getAllSections() {
        return [...this.sections].sort((a, b) => a.metadata.order - b.metadata.order);
    }
    
    getNavigationLinks() {
        return this.getAllSections()
            .filter(s => s.metadata.visibleInNav !== false)
            .map(s => ({ id: s.id, title: s.title }));
    }
}