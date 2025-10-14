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
     * @param {string} section.id - The unique ID for the section element.
     * @param {string} section.type - The type of section (e.g., 'timeline', 'cards').
     * @param {string} section.title - The main title of the section.
     * @param {string} section.subtitle - The subtitle of the section.
     * @param {object} section.content - The content data for the section body.
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
     * @brief Renders the HTML for an enhanced timeline section.
     * @param {object} content - The timeline content data.
     * @param {Array<object>} content.timeline - An array of timeline items.
     * @returns {string} The generated HTML string for the timeline.
     */
    renderTimeline(content) {
        if (!content.timeline) return '';

        const timelineItems = content.timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-period">
                    <span class="timeline-icon">${item.icon || '📅'}</span>
                    <span>${this.escapeHtml(item.period)}</span>
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${this.escapeHtml(item.title)}</h3>
                    <p class="timeline-description">${this.escapeHtml(item.description)}</p>
                    
                    ${item.achievements && item.achievements.length > 0 ? `
                        <div class="achievements-list">
                            <h4 class="achievements-title">Key Achievements:</h4>
                            <ul class="achievements">
                                ${item.achievements.map(achievement => `
                                    <li class="achievement">${this.escapeHtml(achievement)}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="highlights-list">
                        ${item.highlights.map(h => `
                            <span class="tag tag--primary">${this.escapeHtml(h)}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        return `<div class="timeline">${timelineItems}</div>`;
    }

    /**
     * @brief Renders the HTML for an enhanced cards section.
     * @param {Array<object>} content - An array of card items.
     * @returns {string} The generated HTML string for the cards grid.
     */
    renderCards(content) {
        if (!Array.isArray(content)) return '';

        const cards = content.map(item => `
            <div class="card ${item.featured ? 'card--featured' : ''}">
                <div class="card-header">
                    <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
                    <p class="card-subtitle">${this.escapeHtml(item.subtitle || '')}</p>
                </div>
                
                <div class="card-content">
                    <p class="card-description">${this.escapeHtml(item.description)}</p>
                    
                    ${item.detailedDescription ? `<p class="card-detailed-description">${this.escapeHtml(item.detailedDescription)}</p>` : ''}
                    
                    ${item.technologies && item.technologies.length > 0 ? `
                        <div class="technologies-container">
                            <h4 class="technologies-title">Technologies Used:</h4>
                            <div class="technologies-list">
                                ${item.technologies.map(tech => `<span class="tag tag--secondary">${this.escapeHtml(tech)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="card-footer">
                    ${item.links && item.links.length > 0 ? `
                        <div class="card-links">
                            ${item.links.map(link => `
                                <a href="${this.escapeHtml(link.url)}" class="btn btn--outline btn--sm" target="_blank" rel="noopener noreferrer">
                                    ${this.escapeHtml(link.label)}
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="card-meta">
                        <div class="tags-container">
                            ${(item.tags || []).map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                        
                        <div class="meta-info">
                            <span class="card-date">${this.escapeHtml(item.date)}</span>
                            <span class="status status--${item.status?.toLowerCase()}">${this.escapeHtml(item.status)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        return `<div class="cards-grid grid grid--2">${cards}</div>`;
    }

    /**
     * @brief Renders the HTML for a skills section.
     * @param {object} content - The skills content object.
     * @param {Array<object>} content.categories - An array of skill categories.
     * @returns {string} The generated HTML string for the skills section.
     */
    renderSkills(content) {
        if (!content.categories || !Array.isArray(content.categories)) return '';

        const categories = content.categories.map(category => `
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
                                <div class="skill-progress" style="width: ${skill.proficiency}%;" data-proficiency="${skill.proficiency}"></div>
                            </div>
                            <p class="skill-description">${this.escapeHtml(skill.description)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        return `<div class="skills-categories">${categories}</div>`;
    }
    
    /**
     * @brief Renders the HTML for a gallery section.
     * @param {Array<object>} content - An array of gallery items.
     * @returns {string} The generated HTML string for the gallery.
     */
    renderGallery(content) {
        if (!Array.isArray(content)) return '';

        const items = content.map(item => {
            const src = item.imageUrl || (item.image && item.image.src) || (item.images && item.images[0]?.src) || '';
            const alt = item.alt || item.caption || item.title || 'Gallery image';
            const caption = item.caption || (item.image && item.image.caption) || '';

            // Handle cases where an item has multiple images.
            const multipleImages = (item.images?.length > 1) ? item.images.map(img => `
                <div class="gallery-subitem">
                    <img src="${this.escapeHtml(img.src)}" alt="${this.escapeHtml(img.alt || alt)}" class="gallery-image" loading="lazy">
                    ${img.caption ? `<div class="gallery-caption">${this.escapeHtml(img.caption)}</div>` : ''}
                </div>
            `).join('') : '';

            return `
                <div class="gallery-item">
                    ${src ? `<img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt)}" class="gallery-image" loading="lazy">` : ''}
                    ${multipleImages}
                    ${caption ? `<div class="gallery-caption">${this.escapeHtml(caption)}</div>` : ''}
                </div>
            `;
        }).join('');

        return `<div class="gallery-grid">${items}</div>`;
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

    /**
     * @brief Clears all rendered content from the container.
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * @brief Cleans up resources used by the ViewManager.
     */
    destroy() {
        this.eventBus.unsubscribe('section:updated', this.onSectionUpdated);
        this.clear();
        console.info('ViewManager: Destroyed.');
    }
}

export { ViewManager };