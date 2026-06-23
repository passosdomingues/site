import eventBus from '../core/EventBus.js';

/**
 * @file ViewManager.js
 * @brief Gerenciador de views — renderiza seções do portfólio pelo tipo.
 * @description Refatorado: suporte a 'metrics', timeline com ícones, cards com badges,
 *              gallery com item featured, skills animadas, Intersection Observer para scroll reveal.
 */
class ViewManager {
    constructor(config = {}) {
        this.container = config.container;
        this.eventBus = config.eventBus || eventBus;

        this.renderMethods = {
            timeline:  this.renderTimeline.bind(this),
            cards:     this.renderCards.bind(this),
            skills:    this.renderSkills.bind(this),
            gallery:   this.renderGallery.bind(this),
            metrics:   this.renderMetrics.bind(this),  // NOVO
        };

        this._setupScrollReveal();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.eventBus.subscribe('section:updated', this.onSectionUpdated.bind(this));
    }

    onSectionUpdated(data) {
        this.renderSection(data.sectionId, data.newContent);
    }

    /* ──────────────────────────────────────────
       RENDER SECTION (wrapper)
    ────────────────────────────────────────── */
    renderSection(section) {
        if (!this.container) return;

        try {
            const wrapper = document.createElement('div');
            wrapper.className = 'section-wrapper';

            const sectionEl = document.createElement('section');
            sectionEl.id = section.id;
            sectionEl.className = `portfolio-section section--${section.type} animate-on-scroll`;

            const renderFn = this.renderMethods[section.type];
            if (typeof renderFn !== 'function') {
                console.warn(`ViewManager: Tipo de seção desconhecido: "${section.type}"`);
                return;
            }

            const sectionNumber = this.container.children.length + 1;
            const content = renderFn(section.content);

            sectionEl.innerHTML = `
                <header class="section-header">
                    <div class="section-label">${String(sectionNumber).padStart(2,'0')}</div>
                    <h2 class="section-title">${this.escapeHtml(section.title)}</h2>
                    <p class="section-subtitle">${this.escapeHtml(section.subtitle)}</p>
                </header>
                ${content}
            `;

            wrapper.appendChild(sectionEl);
            this.container.appendChild(wrapper);

            // Ativa scroll reveal para os elementos filhos
            this._observeSection(sectionEl);

            // Anima skill bars quando visível
            if (section.type === 'skills') {
                this._animateSkillBars(sectionEl);
            }

            this.eventBus.publish('view:section:rendered', {
                sectionId: section.id,
                element: sectionEl
            });

        } catch (error) {
            console.error(`ViewManager: Erro ao renderizar seção "${section.id}"`, error);
            this.eventBus.publish('view:render:error', { sectionId: section.id, error });
        }
    }

    /* ──────────────────────────────────────────
       TIMELINE
    ────────────────────────────────────────── */
    renderTimeline(content) {
        if (!content?.timeline) return '';

        const items = content.timeline.map((item, idx) => `
            <div class="timeline-item animate-on-scroll" style="transition-delay: ${idx * 0.1}s">
                <div class="timeline-icon">${item.icon || '📌'}</div>
                <div class="timeline-content">
                    <div class="timeline-period">${this.escapeHtml(item.period)}</div>
                    <h3 class="timeline-title">${this.escapeHtml(item.title)}</h3>
                    <p class="timeline-description">${this.escapeHtml(item.description)}</p>
                    ${item.highlights?.length ? `
                        <div class="highlights-list">
                            ${item.highlights.map(h =>
                                `<span class="highlight-tag">${this.escapeHtml(h)}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        return `<div class="timeline">${items}</div>`;
    }

    /* ──────────────────────────────────────────
       METRICS (nova seção)
    ────────────────────────────────────────── */
    renderMetrics(content) {
        if (!Array.isArray(content)) return '';

        const cards = content.map((m, idx) => `
            <div class="metric-card animate-on-scroll" style="transition-delay: ${idx * 0.08}s">
                <span class="metric-icon">${m.icon || '📊'}</span>
                <div class="metric-value">${this.escapeHtml(m.value)}</div>
                <div class="metric-label">${this.escapeHtml(m.label)}</div>
            </div>
        `).join('');

        return `<div class="metrics-grid">${cards}</div>`;
    }

    /* ──────────────────────────────────────────
       CARDS
    ────────────────────────────────────────── */
    renderCards(content) {
        if (!Array.isArray(content)) return '';

        const statusClass = (status) => {
            if (!status) return '';
            const s = status.toLowerCase();
            if (s.includes('registro')) return 'status-em-registro';
            if (s.includes('pesquisa')) return 'status-pesquisa';
            if (s.includes('ativo') || s.includes('ongoing')) return 'status-ativo';
            return '';
        };

        const cards = content.map((item, idx) => `
            <div class="card animate-on-scroll" style="transition-delay: ${idx * 0.07}s">
                ${item.highlight ? `<div class="card-highlight-badge">🔖 ${this.escapeHtml(item.highlight)}</div>` : ''}
                <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
                <p class="card-description">${this.escapeHtml(item.description)}</p>
                ${item.links?.length ? `
                    <div class="card-links">
                        ${item.links.map(l => `
                            <a href="${this.escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i>
                                ${this.escapeHtml(l.label)}
                            </a>
                        `).join('')}
                    </div>
                ` : ''}
                ${item.tags?.length ? `
                    <div class="tags-container">
                        ${item.tags.map(t => `<span class="tag">${this.escapeHtml(t)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="card-meta">
                    <span>${this.escapeHtml(item.date || '')}</span>
                    <span class="card-status ${statusClass(item.status)}">
                        ${this.escapeHtml(item.status || '')}
                    </span>
                </div>
            </div>
        `).join('');

        return `<div class="cards-grid">${cards}</div>`;
    }

    /* ──────────────────────────────────────────
       SKILLS
    ────────────────────────────────────────── */
    renderSkills(content) {
        if (!Array.isArray(content)) return '';

        const categories = content.map(cat => {
            const skills = cat.skills.map(skill => {
                const hasPct = typeof skill.proficiency === 'number';
                const links = skill.links?.length ? `
                    <div class="skill-links">
                        ${skill.links.map(l =>
                            `<a href="${this.escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(l.label)}</a>`
                        ).join(' · ')}
                    </div>
                ` : '';

                return `
                    <div class="skill-item">
                        <div class="skill-header">
                            <span class="skill-name">${this.escapeHtml(skill.name)}</span>
                            ${hasPct ? `<span class="skill-percent">${skill.proficiency}%</span>` : ''}
                        </div>
                        ${hasPct ? `
                            <div class="skill-bar">
                                <div class="skill-progress"
                                     data-proficiency="${skill.proficiency}"
                                     style="width: 0%">
                                </div>
                            </div>
                        ` : ''}
                        <p class="skill-description">${this.escapeHtml(skill.description)}</p>
                        ${links}
                    </div>
                `;
            }).join('');

            return `
                <div class="skill-category">
                    <h3 class="category-title">${this.escapeHtml(cat.category)}</h3>
                    <div class="skills-list">${skills}</div>
                </div>
            `;
        }).join('');

        return `<div class="skills-categories">${categories}</div>`;
    }

    /* ──────────────────────────────────────────
       GALLERY
    ────────────────────────────────────────── */
    renderGallery(content) {
        if (!Array.isArray(content)) return '';

        const [first, ...rest] = content;

        // Primeiro item como destaque se tiver description/links
        let featuredHtml = '';
        let regularItems = content;

        if (first?.description || first?.links?.length) {
            featuredHtml = `
                <div class="gallery-item-featured">
                    ${first.imageUrl ? `
                        <img src="${this.escapeHtml(first.imageUrl)}"
                             alt="${this.escapeHtml(first.caption || '')}"
                             class="gallery-featured-image"
                             loading="lazy">
                    ` : ''}
                    <div class="gallery-featured-info">
                        ${first.caption ? `<div class="gallery-featured-title">${this.escapeHtml(first.caption)}</div>` : ''}
                        ${first.description ? `<p class="gallery-featured-desc">${this.escapeHtml(first.description)}</p>` : ''}
                        ${first.links?.length ? `
                            <div class="gallery-featured-links">
                                ${first.links.map(l =>
                                    `<a href="${this.escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(l.label)}</a>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            regularItems = rest;
        }

        const gridItems = regularItems.map(item => `
            <div class="gallery-item">
                <img src="${this.escapeHtml(item.imageUrl || '')}"
                     alt="${this.escapeHtml(item.caption || '')}"
                     class="gallery-image"
                     loading="lazy">
                ${item.caption ? `<div class="gallery-caption">${this.escapeHtml(item.caption)}</div>` : ''}
            </div>
        `).join('');

        return `
            <div class="gallery-grid">
                ${featuredHtml}
                ${gridItems}
            </div>
        `;
    }

    /* ──────────────────────────────────────────
       SCROLL REVEAL (Intersection Observer)
    ────────────────────────────────────────── */
    _setupScrollReveal() {
        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Para skill bars: animar quando ficar visível
                    const bars = entry.target.querySelectorAll('.skill-progress[data-proficiency]');
                    bars.forEach(bar => {
                        bar.style.width = bar.dataset.proficiency + '%';
                    });
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    }

    _observeSection(sectionEl) {
        // Observa a seção principal
        this._observer.observe(sectionEl);
        // Observa itens filhos com animate-on-scroll
        sectionEl.querySelectorAll('.animate-on-scroll').forEach(el => {
            this._observer.observe(el);
        });
    }

    _animateSkillBars(sectionEl) {
        // Skill bars começam em 0 e animam quando visíveis via observer
        const bars = sectionEl.querySelectorAll('.skill-progress');
        bars.forEach(bar => { bar.style.width = '0%'; });
    }

    /* ──────────────────────────────────────────
       UTILS
    ────────────────────────────────────────── */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clear() {
        if (this.container) this.container.innerHTML = '';
    }

    destroy() {
        this._observer?.disconnect();
        this.eventBus.unsubscribe('section:updated', this.onSectionUpdated);
        this.clear();
    }
}

export { ViewManager };