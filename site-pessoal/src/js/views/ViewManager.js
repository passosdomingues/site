import eventBus from '../core/EventBus.js';

/**
 * @brief Manages the rendering of different content sections into the DOM.
 * @description Handles rendering of various section types like timelines, cards, skills, and galleries.
 */
class ViewManager {
    /**
     * @brief Creates a new ViewManager instance.
     * @param {object} [config={}] - Configuration object.
     * @param {HTMLElement} [config.container] - The main container element where sections will be rendered.
     * @param {object} [config.eventBus] - The event bus instance for communication.
     */
    constructor(config = {}) {
        this.container = config.container;
        this.eventBus = config.eventBus || eventBus;
        
        this.renderMethods = {
            timeline: this.renderTimeline.bind(this),
            cards: this.renderCards.bind(this),
            skills: this.renderSkills.bind(this),
            gallery: this.renderGallery.bind(this),
        };

        this.setupEventListeners();
    }

    /**
     * @brief Sets up event listeners for the ViewManager.
     */
    setupEventListeners() {
        this.eventBus.subscribe('section:updated', this.onSectionUpdated.bind(this));
    }

    /**
     * @brief Handles section update events from the event bus.
     * @param {object} data - The event data.
     * @param {string} data.sectionId - The ID of the section to update.
     * @param {object} data.newContent - The new content for the section.
     */
    onSectionUpdated(data) {
        this.renderSection(data.sectionId, data.newContent);
    }

    /**
     * @brief Renders a single section into the container.
     * @param {object} section - The section data object to render.
     */
    renderSection(section) {
        if (!this.container) {
            console.error('ViewManager: Container element is not available.');
            return;
        }

        try {
            const sectionElement = document.createElement('section');
            sectionElement.id = section.id;
            sectionElement.className = `section section--${section.type}`;

            const renderMethod = this.renderMethods[section.type];
            if (typeof renderMethod !== 'function') {
                console.warn(`ViewManager: No render method found for type "${section.type}".`);
                return;
            }

            const sectionContent = renderMethod(section.content);
            
            sectionElement.innerHTML = `
                <div class="section-container">
                    <header class="section-header">
                        <h2 class="section-title">${this.escapeHtml(section.title)}</h2>
                        <p class="section-subtitle">${this.escapeHtml(section.subtitle)}</p>
                    </header>
                    ${sectionContent}
                </div>
            `;

            this.container.appendChild(sectionElement);
            
            this.eventBus.publish('view:section:rendered', { 
                sectionId: section.id,
                element: sectionElement 
            });

        } catch (error) {
            console.error(`ViewManager: Error rendering section ${section.id}`, error);
            this.eventBus.publish('view:render:error', { sectionId: section.id, error });
        }
    }

    /**
     * @brief Renders the HTML for a timeline section.
     * @param {object} content - The timeline content data.
     * @returns {string} The generated HTML string.
     */
    renderTimeline(content) {
        if (!content.timeline) return '';
        const items = content.timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <p class="timeline-period">${this.escapeHtml(item.period)}</p>
                    <h3 class="timeline-title">${this.escapeHtml(item.title)}</h3>
                    <p class="timeline-description">${this.escapeHtml(item.description)}</p>
                    <div class="timeline-highlights">
                        ${item.highlights.map(h => `<span class="tag">${this.escapeHtml(h)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        return `<div class="timeline">${items}</div>`;
    }

    /**
     * @brief Renders the HTML for a cards section.
     * @param {Array<object>} content - An array of card items.
     * @returns {string} The generated HTML string.
     */
    renderCards(content) {
        if (!Array.isArray(content)) return '';
        const cards = content.map(item => `
            <div class="card">
                <div class="card-content">
                    <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
                    <p class="card-description">${this.escapeHtml(item.description)}</p>
                    <div class="card-tags">
                        ${item.technologies.map(tech => `<span class="tag">${this.escapeHtml(tech)}</span>`).join('')}
                    </div>
                </div>
                <div class="card-footer">
                    <a href="${this.escapeHtml(item.link)}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">View Project</a>
                    <span class="card-date">${this.escapeHtml(item.date)}</span>
                </div>
            </div>
        `).join('');
        return `<div class="cards-grid">${cards}</div>`;
    }

    /**
     * @brief Renders the HTML for a skills section. (CORRIGIDO)
     * @param {object} content - The skills content object.
     * @returns {string} The generated HTML string.
     */
    renderSkills(content) {
        if (!content.categories || !Array.isArray(content.categories)) return '';
        const categoriesHtml = content.categories.map(category => `
            <div class="skill-category">
                <h3 class="category-title">${this.escapeHtml(category.category)}</h3>
                <div class="skills-list">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-header">
                                <span class="skill-name">${this.escapeHtml(skill.name)}</span>
                                <span class="skill-proficiency">${skill.proficiency}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.proficiency}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        return `<div class="skills-container">${categoriesHtml}</div>`;
    }
    
    /**
     * @brief Renders the HTML for a gallery section. (CORRIGIDO)
     * @param {Array<object>} content - An array of gallery items.
     * @returns {string} The generated HTML string.
     */
    renderGallery(content) {
        if (!Array.isArray(content)) return '';
        const itemsHtml = content.map(item => `
            <div class="gallery-item">
                <img src="${this.escapeHtml(item.imageUrl)}" alt="${this.escapeHtml(item.caption)}" class="gallery-image" loading="lazy">
                <div class="gallery-caption">${this.escapeHtml(item.caption)}</div>
            </div>
        `).join('');
        return `<div class="gallery-grid">${itemsHtml}</div>`;
    }

    /**
     * @brief Escapes a string for safe insertion into HTML.
     * @param {string} text - The text to escape.
     * @returns {string} The escaped, HTML-safe text.
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export { ViewManager };