/**
 * @file SectionController.js
 * @brief Section controller for individual section management
 * @description Handles section-specific logic and interactions
 */

import eventBus from '../core/EventBus.js';

/**
 * @class SectionController
 * @brief Manages individual section behavior and data loading
 */
export class SectionController {
    /**
     * @brief Constructs SectionController instance
     * @param {Object} dependencies - Controller dependencies
     * @param {Object} dependencies.eventBus - Event bus instance
     * @param {Object} dependencies.contentModel - Content model instance
     * @param {Object} dependencies.services - Service dependencies
     */
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.contentModel = dependencies.contentModel;
        this.services = dependencies.services || {};
        
        this.activeSection = null;
        this.isInitialized = false;
    }

    /**
     * @brief Initialize section controller
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            return;
        }

        this.setupEventListeners();
        this.isInitialized = true;
        console.info('SectionController: Initialized');
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        this.eventBus.subscribe('section:activated', this.onSectionActivated.bind(this));
        this.eventBus.subscribe('section:request:data', this.onSectionDataRequest.bind(this));
    }

    /**
     * @brief Handle section activation
     * @param {Object} data - Section data
     */
    onSectionActivated(data) {
        this.activeSection = data.sectionId;
        this.loadSectionData(data.sectionId);
    }

    /**
     * @brief Handle section data request
     * @param {Object} data - Request data
     */
    onSectionDataRequest(data) {
        this.loadSectionData(data.sectionId);
    }

    /**
     * @brief Load section data
     * @param {string} sectionId - Section identifier
     */
    async loadSectionData(sectionId) {
        if (!this.contentModel) return;

        try {
            const section = this.contentModel.getSection(sectionId);
            if (section) {
                this.eventBus.publish('section:data:loaded', {
                    sectionId,
                    data: section
                });
            }
        } catch (error) {
            console.error(`SectionController: Error loading data for section ${sectionId}`, error);
            this.eventBus.publish('section:error', { sectionId, error });
        }
    }

    /**
     * @brief Get active section
     * @returns {string|null} Active section ID
     */
    getActiveSection() {
        return this.activeSection;
    }

    /**
     * @brief Check if section is visible
     * @param {string} sectionId - Section identifier
     * @returns {boolean} Visibility status
     */
    isSectionVisible(sectionId) {
        if (!this.contentModel) return false;
        
        const section = this.contentModel.getSection(sectionId);
        return section ? section.metadata.visible : false;
    }

    /**
     * @brief Show/hide section
     * @param {string} sectionId - Section identifier
     * @param {boolean} visible - Visibility flag
     */
    setSectionVisibility(sectionId, visible) {
        if (this.contentModel) {
            this.contentModel.setSectionVisibility(sectionId, visible);
            this.eventBus.publish('section:visibility:changed', { sectionId, visible });
        }
    }

    /**
     * @brief Destroy controller
     */
    destroy() {
        this.eventBus.unsubscribe('section:activated', this.onSectionActivated);
        this.eventBus.unsubscribe('section:request:data', this.onSectionDataRequest);
        
        this.activeSection = null;
        this.isInitialized = false;
        
        console.info('SectionController: Destroyed');
    }
}