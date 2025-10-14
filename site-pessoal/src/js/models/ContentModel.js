/**
 * @file ContentModel.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Data model for portfolio content management
 * @description Handles content loading, caching, and provides data to controllers
 */

import { PORTFOLIO_DATA } from '../data/PortfolioData.js';

class ContentModel {
    /**
     * @brief Creates a ContentModel instance
     * @constructor
     */
    constructor() {
        /**
         * @private
         * @type {Object}
         * @brief Cache for content data
         */
        this.contentCache = new Map();
        
        /**
         * @private
         * @type {boolean}
         * @brief Tracks initialization state
         */
        this.isInitialized = false;
        
        /**
         * @private
         * @type {Object}
         * @brief Raw portfolio data
         */
        this.portfolioData = null;
    }

    /**
     * @brief Initializes the content model
     * @public
     * @returns {Promise<void>} Resolves when model is ready
     */
    async initialize() {
        try {
            console.info('ContentModel: Initializing content model...');
            
            // Load portfolio data
            this.portfolioData = PORTFOLIO_DATA;
            
            // Pre-process and cache content
            await this.preprocessContent();
            
            this.isInitialized = true;
            console.info('ContentModel: Successfully initialized content model');
            
        } catch (error) {
            console.error('ContentModel: Failed to initialize:', error);
            throw error;
        }
    }

    /**
     * @brief Pre-processes and caches content for performance
     * @private
     * @returns {Promise<void>} Resolves when preprocessing is complete
     */
    async preprocessContent() {
        if (!this.portfolioData) {
            throw new Error('ContentModel: Portfolio data not loaded');
        }

        // Cache user data
        this.contentCache.set('user', this.portfolioData.user);
        
        // Cache sections with additional metadata
        this.portfolioData.sections.forEach(section => {
            this.contentCache.set(`section-${section.id}`, section);
            
            // Pre-process section content based on type
            this.preprocessSectionContent(section);
        });

        // Cache visible sections in order
        const visibleSections = this.portfolioData.sections
            .filter(section => section.metadata.visible)
            .sort((a, b) => a.metadata.order - b.metadata.order);
        
        this.contentCache.set('visible-sections', visibleSections);
    }

    /**
     * @brief Pre-processes section content based on type
     * @private
     * @param {Object} section - Section data to preprocess
     */
    preprocessSectionContent(section) {
        switch (section.type) {
            case 'timeline':
                this.preprocessTimelineContent(section);
                break;
            case 'cards':
                this.preprocessCardsContent(section);
                break;
            case 'gallery':
                this.preprocessGalleryContent(section);
                break;
            case 'skills':
                this.preprocessSkillsContent(section);
                break;
        }
    }

    /**
     * @brief Pre-processes timeline content
     * @private
     * @param {Object} section - Timeline section data
     */
    preprocessTimelineContent(section) {
        if (section.content && section.content.timeline) {
            // Add unique IDs to timeline items
            section.content.timeline.forEach((item, index) => {
                item.id = `timeline-${section.id}-${index}`;
                item.sectionId = section.id;
            });
        }
    }

    /**
     * @brief Pre-processes cards content
     * @private
     * @param {Object} section - Cards section data
     */
    preprocessCardsContent(section) {
        if (section.content && Array.isArray(section.content)) {
            section.content.forEach((card, index) => {
                card.id = `card-${section.id}-${index}`;
                card.sectionId = section.id;
                
                // Ensure links array exists
                if (!card.links) {
                    card.links = [];
                }
            });
        }
    }

    /**
     * @brief Pre-processes gallery content
     * @private
     * @param {Object} section - Gallery section data
     */
    preprocessGalleryContent(section) {
        if (section.content && Array.isArray(section.content)) {
            section.content.forEach((image, index) => {
                image.id = `gallery-${section.id}-${index}`;
                image.sectionId = section.id;
                
                // Add lazy loading attributes
                image.loading = 'lazy';
            });
        }
    }

    /**
     * @brief Pre-processes skills content
     * @private
     * @param {Object} section - Skills section data
     */
    preprocessSkillsContent(section) {
        if (section.content && Array.isArray(section.content)) {
            section.content.forEach((category, categoryIndex) => {
                category.id = `skills-category-${section.id}-${categoryIndex}`;
                
                if (category.skills && Array.isArray(category.skills)) {
                    category.skills.forEach((skill, skillIndex) => {
                        skill.id = `skill-${section.id}-${categoryIndex}-${skillIndex}`;
                    });
                }
            });
        }
    }

    /**
     * @brief Gets user data
     * @public
     * @returns {Object} User data object
     */
    getUserData() {
        if (!this.isInitialized) {
            console.warn('ContentModel: Model not initialized, returning cached user data');
        }
        
        return this.contentCache.get('user') || this.portfolioData?.user || {};
    }

    /**
     * @brief Gets all sections
     * @public
     * @returns {Array} Array of all sections
     */
    getSections() {
        if (!this.isInitialized) {
            console.warn('ContentModel: Model not initialized, returning raw sections data');
            return this.portfolioData?.sections || [];
        }
        
        return this.contentCache.get('visible-sections') || [];
    }

    /**
     * @brief Gets a specific section by ID
     * @public
     * @param {string} sectionId - The section identifier
     * @returns {Object|null} Section data or null if not found
     */
    getSectionById(sectionId) {
        if (!this.isInitialized) {
            console.warn('ContentModel: Model not initialized, searching raw data');
            return this.portfolioData?.sections.find(s => s.id === sectionId) || null;
        }
        
        return this.contentCache.get(`section-${sectionId}`) || null;
    }

    /**
     * @brief Gets sections by type
     * @public
     * @param {string} type - The section type (timeline, cards, gallery, skills)
     * @returns {Array} Array of sections matching the type
     */
    getSectionsByType(type) {
        const sections = this.getSections();
        return sections.filter(section => section.type === type);
    }

    /**
     * @brief Gets the next section after the current one
     * @public
     * @param {string} currentSectionId - Current section ID
     * @returns {Object|null} Next section data or null if none
     */
    getNextSection(currentSectionId) {
        const sections = this.getSections();
        const currentIndex = sections.findIndex(s => s.id === currentSectionId);
        
        if (currentIndex === -1 || currentIndex >= sections.length - 1) {
            return null;
        }
        
        return sections[currentIndex + 1];
    }

    /**
     * @brief Gets the previous section before the current one
     * @public
     * @param {string} currentSectionId - Current section ID
     * @returns {Object|null} Previous section data or null if none
     */
    getPreviousSection(currentSectionId) {
        const sections = this.getSections();
        const currentIndex = sections.findIndex(s => s.id === currentSectionId);
        
        if (currentIndex <= 0) {
            return null;
        }
        
        return sections[currentIndex - 1];
    }

    /**
     * @brief Searches content across all sections
     * @public
     * @param {string} query - Search query
     * @returns {Array} Array of search results
     */
    searchContent(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];
        const sections = this.getSections();

        sections.forEach(section => {
            // Search in section title and subtitle
            if (section.title.toLowerCase().includes(searchTerm) || 
                section.subtitle.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'section',
                    sectionId: section.id,
                    title: section.title,
                    subtitle: section.subtitle,
                    matchField: 'title'
                });
            }

            // Search in section content based on type
            switch (section.type) {
                case 'timeline':
                    this.searchTimelineContent(section, searchTerm, results);
                    break;
                case 'cards':
                    this.searchCardsContent(section, searchTerm, results);
                    break;
                case 'skills':
                    this.searchSkillsContent(section, searchTerm, results);
                    break;
            }
        });

        return results;
    }

    /**
     * @brief Searches timeline content
     * @private
     * @param {Object} section - Timeline section
     * @param {string} searchTerm - Search term
     * @param {Array} results - Results array to populate
     */
    searchTimelineContent(section, searchTerm, results) {
        if (section.content && section.content.timeline) {
            section.content.timeline.forEach(item => {
                if (item.title.toLowerCase().includes(searchTerm) || 
                    item.description.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'timeline-item',
                        sectionId: section.id,
                        itemId: item.id,
                        title: item.title,
                        period: item.period,
                        matchField: 'timeline'
                    });
                }
            });
        }
    }

    /**
     * @brief Searches cards content
     * @private
     * @param {Object} section - Cards section
     * @param {string} searchTerm - Search term
     * @param {Array} results - Results array to populate
     */
    searchCardsContent(section, searchTerm, results) {
        if (section.content && Array.isArray(section.content)) {
            section.content.forEach(card => {
                if (card.title.toLowerCase().includes(searchTerm) || 
                    card.description.toLowerCase().includes(searchTerm) ||
                    card.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
                    results.push({
                        type: 'card',
                        sectionId: section.id,
                        cardId: card.id,
                        title: card.title,
                        tags: card.tags,
                        matchField: 'card'
                    });
                }
            });
        }
    }

    /**
     * @brief Searches skills content
     * @private
     * @param {Object} section - Skills section
     * @param {string} searchTerm - Search term
     * @param {Array} results - Results array to populate
     */
    searchSkillsContent(section, searchTerm, results) {
        if (section.content && Array.isArray(section.content)) {
            section.content.forEach(category => {
                if (category.category.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'skills-category',
                        sectionId: section.id,
                        categoryId: category.id,
                        title: category.category,
                        matchField: 'category'
                    });
                }

                if (category.skills && Array.isArray(category.skills)) {
                    category.skills.forEach(skill => {
                        if (skill.name.toLowerCase().includes(searchTerm) || 
                            skill.description.toLowerCase().includes(searchTerm)) {
                            results.push({
                                type: 'skill',
                                sectionId: section.id,
                                categoryId: category.id,
                                skillId: skill.id,
                                name: skill.name,
                                proficiency: skill.proficiency,
                                matchField: 'skill'
                            });
                        }
                    });
                }
            });
        }
    }

    /**
     * @brief Gets content statistics
     * @public
     * @returns {Object} Content statistics
     */
    getContentStats() {
        const sections = this.getSections();
        let totalItems = 0;
        let typeBreakdown = {};

        sections.forEach(section => {
            totalItems++;
            
            if (!typeBreakdown[section.type]) {
                typeBreakdown[section.type] = 0;
            }
            typeBreakdown[section.type]++;

            // Count items within sections
            switch (section.type) {
                case 'timeline':
                    if (section.content && section.content.timeline) {
                        totalItems += section.content.timeline.length;
                    }
                    break;
                case 'cards':
                    if (section.content && Array.isArray(section.content)) {
                        totalItems += section.content.length;
                    }
                    break;
                case 'gallery':
                    if (section.content && Array.isArray(section.content)) {
                        totalItems += section.content.length;
                    }
                    break;
                case 'skills':
                    if (section.content && Array.isArray(section.content)) {
                        section.content.forEach(category => {
                            totalItems++;
                            if (category.skills && Array.isArray(category.skills)) {
                                totalItems += category.skills.length;
                            }
                        });
                    }
                    break;
            }
        });

        return {
            totalSections: sections.length,
            totalItems,
            typeBreakdown,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * @brief Checks if model is initialized
     * @public
     * @returns {boolean} True if model is initialized
     */
    isModelInitialized() {
        return this.isInitialized;
    }

    /**
     * @brief Clears content cache
     * @public
     * @returns {number} Number of items cleared from cache
     */
    clearCache() {
        const cacheSize = this.contentCache.size;
        this.contentCache.clear();
        console.info(`ContentModel: Cleared ${cacheSize} items from content cache`);
        return cacheSize;
    }

    /**
     * @brief Destroys the model and cleans up resources
     * @public
     */
    destroy() {
        this.contentCache.clear();
        this.portfolioData = null;
        this.isInitialized = false;
        console.info('ContentModel: Model destroyed and resources cleaned up');
    }
}

export default ContentModel;