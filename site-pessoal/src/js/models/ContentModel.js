/**
 * @file ContentModel.js
 * @author Rafael Passos Domingues
 * @version 3.1.0
 * @brief Model responsible for managing all dynamic content of the website.
 * @description Centralized content management system that consumes data from PortfolioData.js
 */

import eventBus from '../core/EventBus.js';
import { PORTFOLIO_DATA } from '../data/PortfolioData.js';

/**
 * @constant {Object} CONTENT_TYPES
 * @brief Defines available content display types and their configurations
 */
const CONTENT_TYPES = {
    TIMELINE: {
        identifier: 'timeline',
        displayName: 'Timeline',
        supportsPagination: false,
        maxItems: null,
        layout: 'vertical'
    },
    CARDS: {
        identifier: 'cards',
        displayName: 'Card Grid',
        supportsPagination: true,
        maxItems: 12,
        layout: 'grid'
    },
    GALLERY: {
        identifier: 'gallery',
        displayName: 'Image Gallery',
        supportsPagination: true,
        maxItems: 24,
        layout: 'masonry'
    },
    SKILLS: {
        identifier: 'skills',
        displayName: 'Skills Matrix',
        supportsPagination: false,
        maxItems: null,
        layout: 'matrix'
    }
};

/**
 * @constant {Object} VALIDATION_RULES
 * @brief Validation rules for content structure and data integrity
 */
const VALIDATION_RULES = {
    SECTION: {
        requiredFields: ['id', 'title', 'type'],
        idPattern: /^[a-z-]+$/,
        maxTitleLength: 100,
        maxSubtitleLength: 200
    },
    PROJECT: {
        requiredFields: ['id', 'title', 'description'],
        maxTitleLength: 80,
        maxDescriptionLength: 300
    }
};

/**
 * @class ContentModel
 * @brief Centralized content management system for the application
 */
class ContentModel {
    /**
     * @brief Creates an instance of ContentModel
     * @constructor
     * @param {Object} options - Configuration options for content model
     */
    constructor(options = {}) {
        const {
            enableCaching = true,
            cacheTimeout = 300000,
            enableValidation = true
        } = options;

        this.sections = [];
        this.projects = [];
        this.experiences = [];
        this.contentCache = new Map();
        
        this.configuration = {
            enableCaching,
            cacheTimeout,
            enableValidation,
            maxCacheSize: 100
        };

        this.isInitialized = false;
        this.initializeContentModel();
    }

    /**
     * @brief Initializes the content model with portfolio data
     * @private
     * @returns {Promise<void>}
     */
    async initializeContentModel() {
        try {
            await this.loadAllContent();
            this.isInitialized = true;
            console.info('ContentModel: Successfully initialized with portfolio data.');
        } catch (error) {
            console.error('ContentModel: Failed to initialize:', error);
            throw error;
        }
    }

    /**
     * @brief Loads all content from the centralized portfolio data
     * @private
     * @returns {Promise<void>}
     */
    async loadAllContent() {
        try {
            // Load sections
            if (this.configuration.enableValidation) {
                this.validateSectionsContent(PORTFOLIO_DATA.sections);
            }
            this.sections = PORTFOLIO_DATA.sections;
            this.cacheContent('sections', this.sections);

            // Load projects
            this.projects = PORTFOLIO_DATA.projects || [];
            this.cacheContent('projects', this.projects);

            // Load experiences
            this.experiences = PORTFOLIO_DATA.experiences || [];
            this.cacheContent('experiences', this.experiences);

            console.debug(`ContentModel: Loaded ${this.sections.length} sections, ${this.projects.length} projects, ${this.experiences.length} experiences.`);
        } catch (error) {
            console.error('ContentModel: Failed to load portfolio data:', error);
            throw error;
        }
    }

    /**
     * @brief Validates sections content against defined rules
     * @private
     * @param {Array} sections - Array of section objects to validate
     * @throws {Error} When section validation fails
     */
    validateSectionsContent(sections) {
        if (!Array.isArray(sections)) {
            throw new Error('Sections content must be an array');
        }

        sections.forEach((section, index) => {
            // Check required fields
            VALIDATION_RULES.SECTION.requiredFields.forEach(field => {
                if (!section[field]) {
                    throw new Error(`Section at index ${index} missing required field: ${field}`);
                }
            });

            // Validate ID pattern
            if (!VALIDATION_RULES.SECTION.idPattern.test(section.id)) {
                throw new Error(`Section ID '${section.id}' must contain only lowercase letters and hyphens`);
            }

            // Validate title length
            if (section.title.length > VALIDATION_RULES.SECTION.maxTitleLength) {
                throw new Error(`Section title '${section.title}' exceeds maximum length of ${VALIDATION_RULES.SECTION.maxTitleLength} characters`);
            }

            // Validate content type
            const validTypes = Object.values(CONTENT_TYPES).map(type => type.identifier);
            if (!validTypes.includes(section.type)) {
                throw new Error(`Invalid content type '${section.type}' for section '${section.id}'. Valid types: ${validTypes.join(', ')}`);
            }
        });
    }

    /**
     * @brief Caches content for optimized retrieval
     * @private
     * @param {string} cacheKey - Unique identifier for the cached content
     * @param {*} content - Content to be cached
     */
    cacheContent(cacheKey, content) {
        if (!this.configuration.enableCaching) return;

        if (this.contentCache.size >= this.configuration.maxCacheSize) {
            const firstKey = this.contentCache.keys().next().value;
            this.contentCache.delete(firstKey);
        }

        const cacheEntry = {
            data: content,
            timestamp: Date.now(),
            expires: Date.now() + this.configuration.cacheTimeout
        };

        this.contentCache.set(cacheKey, cacheEntry);
    }

    /**
     * @brief Retrieves cached content if valid
     * @private
     * @param {string} cacheKey - Key of the content to retrieve
     * @returns {*|null} Cached content or null if not found/expired
     */
    getCachedContent(cacheKey) {
        if (!this.configuration.enableCaching) return null;

        const cacheEntry = this.contentCache.get(cacheKey);
        if (!cacheEntry) return null;

        if (Date.now() > cacheEntry.expires) {
            this.contentCache.delete(cacheKey);
            return null;
        }

        return cacheEntry.data;
    }

    /**
     * @brief Retrieves all sections with optional filtering
     * @public
     * @param {Object} filters - Optional filters for section retrieval
     * @returns {Array} Array of section objects
     */
    getSections(filters = {}) {
        const cacheKey = `sections-${JSON.stringify(filters)}`;
        const cachedResult = this.getCachedContent(cacheKey);
        
        if (cachedResult) {
            return cachedResult;
        }

        let filteredSections = [...this.sections];

        if (filters.type) {
            filteredSections = filteredSections.filter(section => section.type === filters.type);
        }

        if (filters.visible !== undefined) {
            filteredSections = filteredSections.filter(section => 
                section.metadata.visible === filters.visible
            );
        }

        filteredSections.sort((a, b) => {
            if (a.metadata.priority !== b.metadata.priority) {
                return a.metadata.priority - b.metadata.priority;
            }
            return a.metadata.order - b.metadata.order;
        });

        this.cacheContent(cacheKey, filteredSections);
        return filteredSections;
    }

    /**
     * @brief Retrieves a specific section by its identifier
     * @public
     * @param {string} sectionId - Unique identifier of the section
     * @returns {Object|undefined} Section object or undefined if not found
     */
    getSectionById(sectionId) {
        const cacheKey = `section-${sectionId}`;
        const cachedResult = this.getCachedContent(cacheKey);
        
        if (cachedResult) {
            return cachedResult;
        }

        const section = this.sections.find(sec => sec.id === sectionId);
        this.cacheContent(cacheKey, section);
        
        return section;
    }

    /**
     * @brief Retrieves all projects with optional filtering
     * @public
     * @param {Object} filters - Optional filters for project retrieval
     * @returns {Array} Array of project objects
     */
    getProjects(filters = {}) {
        let filteredProjects = [...this.projects];

        if (filters.category) {
            filteredProjects = filteredProjects.filter(project => 
                project.category === filters.category
            );
        }

        if (filters.status) {
            filteredProjects = filteredProjects.filter(project => 
                project.status === filters.status
            );
        }

        return filteredProjects;
    }

    /**
     * @brief Retrieves all experiences with optional filtering
     * @public
     * @param {Object} filters - Optional filters for experience retrieval
     * @returns {Array} Array of experience objects
     */
    getExperiences(filters = {}) {
        let filteredExperiences = [...this.experiences];

        if (filters.institution) {
            filteredExperiences = filteredExperiences.filter(experience => 
                experience.institution === filters.institution
            );
        }

        return filteredExperiences;
    }

    /**
     * @brief Gets hobbies content
     * @public
     * @returns {Object} Hobbies content
     */
    getHobbies() {
        return PORTFOLIO_DATA.hobbies || {};
    }

    /**
     * @brief Gets all content data for initial rendering
     * @public
     * @returns {Object} Object containing all content data
     */
    getAllContent() {
        return {
            sections: this.getSections(),
            projects: this.getProjects(),
            experiences: this.getExperiences(),
            hobbies: this.getHobbies()
        };
    }

    /**
     * @brief Gets basic content for graceful degradation
     * @public
     * @returns {Object} Basic content data
     */
    getBasicContent() {
        const aboutSection = this.getSectionById('about');
        return {
            introduction: aboutSection?.content?.introduction || 'Physicist and Computer Scientist passionate about technology and innovation.',
            sections: this.getSections().slice(0, 3)
        };
    }

    /**
     * @brief Clears content cache
     * @public
     * @returns {number} Number of items cleared from cache
     */
    clearCache() {
        const cacheSize = this.contentCache.size;
        this.contentCache.clear();
        console.info(`ContentModel: Cleared ${cacheSize} items from cache.`);
        return cacheSize;
    }

    /**
     * @brief Destroys the content model and cleans up resources
     * @public
     */
    destroy() {
        this.clearCache();
        this.isInitialized = false;
        console.info('ContentModel: Content model destroyed.');
    }
}

export { ContentModel, CONTENT_TYPES };