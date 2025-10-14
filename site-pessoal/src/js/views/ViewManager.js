import { BaseView } from './BaseView.js';

/**
 * @brief Manages rendering of dynamic content sections.
 */
export class ViewManager extends BaseView {
    constructor(config = {}) {
        super(config);
        this.renderMethods = {
            timeline: this.renderTimeline.bind(this),
            cards: this.renderCards.bind(this),
            skills: this.renderSkills.bind(this),
        };
    }

    renderAll(sections = []) {
        if (!this.container) return;
        this.container.innerHTML = '';
        sections.forEach(section => this.renderSection(section));
    }

    renderSection(section) {
        const renderMethod = this.renderMethods[section.type];
        if (!renderMethod) {
            console.warn(`[ViewManager] No render method for type: "${section.type}"`);
            return;
        }

        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        sectionElement.className = `section section--${section.type}`;

        sectionElement.innerHTML = `
            <div class="container">
                <header class="section-header">
                    <h2 class="section-title">${this.escapeHtml(section.title)}</h2>
                    <p class="section-subtitle">${this.escapeHtml(section.subtitle)}</p>
                </header>
                <div class="section-content">
                    ${renderMethod(section.content)}
                </div>
            </div>
        `;
        this.container.appendChild(sectionElement);
    }

    renderTimeline(content) {
        return `<div class="timeline">
            ${(content.timeline || []).map(item => `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <p class="timeline-period">${this.escapeHtml(item.period)}</p>
                        <h3 class="timeline-title">${this.escapeHtml(item.title)}</h3>
                        <p class="timeline-description">${this.escapeHtml(item.description)}</p>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    renderCards(content) {
        return `<div class="cards-grid grid grid--2">
            ${(content || []).map(item => `
                <div class="card">
                    <div class="card-content">
                        <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
                        <p class="card-description">${this.escapeHtml(item.description)}</p>
                    </div>
                    <div class="card-footer">
                         ${(item.technologies || []).map(tech => `<span class="tag">${this.escapeHtml(tech)}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    renderSkills(content) {
        return `<div class="skills-container">
            ${(content.categories || []).map(cat => `
                <div class="skill-category">
                    <h3 class="category-title">${this.escapeHtml(cat.category)}</h3>
                    <div class="skills-list">
                        ${(cat.skills || []).map(skill => `
                            <div class="skill-item">
                                <div class="skill-header">
                                    <span class="skill-name">${this.escapeHtml(skill.name)}</span>
                                    <span class="skill-proficiency">${skill.proficiency}%</span>
                                </div>
                                <div class="skill-bar"><div class="skill-progress" style="width:${skill.proficiency}%;"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }
}