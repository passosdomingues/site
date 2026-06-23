/**
 * @file ViewManager.js
 * @brief Orquestrador de views — decide qual renderer usar e gerencia o DOM.
 * @description Após o refactor, este arquivo NÃO contém lógica de renderização.
 *              Toda lógica de HTML fica nos renderers isolados em ./renderers/.
 *
 * PARA ADICIONAR UM NOVO TIPO DE SEÇÃO:
 *   1. Crie src/js/views/renderers/NovoRenderer.js
 *   2. Exporte do renderers/index.js
 *   3. Registre em this.renderers abaixo
 *   4. Adicione dados em PortfolioData.js
 */
import eventBus from '../core/EventBus.js';
import {
    renderTimeline,
    renderMetrics,
    renderCards,
    renderSkills,
    renderGallery,
} from './renderers/index.js';

class ViewManager {
    /**
     * @param {Object} config
     * @param {HTMLElement} config.container - Container principal das seções
     * @param {Object}      config.eventBus  - Event bus da aplicação
     */
    constructor(config = {}) {
        this.container = config.container;
        this.eventBus  = config.eventBus || eventBus;

        // Registro de renderers: tipo → função pura (content) → string HTML
        this.renderers = {
            timeline: renderTimeline,
            metrics:  renderMetrics,
            cards:    renderCards,
            skills:   renderSkills,
            gallery:  renderGallery,
        };

        this._setupScrollReveal();
        this.setupEventListeners();
    }

    /* ──────────────────────────────────────────
       EVENTOS
    ────────────────────────────────────────── */
    setupEventListeners() {
        this.eventBus.subscribe('section:updated', ({ sectionId, newContent }) => {
            this.renderSection({ id: sectionId, ...newContent });
        });
    }

    /* ──────────────────────────────────────────
       RENDERIZAÇÃO DE SEÇÃO
    ────────────────────────────────────────── */
    renderSection(section) {
        if (!this.container) {
            console.error('ViewManager: container não disponível');
            return;
        }

        const renderer = this.renderers[section.type];
        if (typeof renderer !== 'function') {
            console.warn(`ViewManager: renderer não encontrado para tipo "${section.type}". ` +
                `Tipos suportados: ${Object.keys(this.renderers).join(', ')}`);
            return;
        }

        try {
            // Número sequencial para o label da seção
            const sectionNumber = this.container.children.length + 1;

            // Wrapper alternado (para fundo zebrado entre seções)
            const wrapper = document.createElement('div');
            wrapper.className = 'section-wrapper';

            const sectionEl = document.createElement('section');
            sectionEl.id        = section.id;
            sectionEl.className = `portfolio-section section--${section.type} animate-on-scroll`;
            sectionEl.innerHTML = `
                <header class="section-header">
                    <div class="section-label">${String(sectionNumber).padStart(2, '0')}</div>
                    <h2 class="section-title">${this._esc(section.title)}</h2>
                    <p class="section-subtitle">${this._esc(section.subtitle)}</p>
                </header>
                ${renderer(section.content)}
            `;

            wrapper.appendChild(sectionEl);
            this.container.appendChild(wrapper);

            // Scroll reveal para seção e itens filhos
            this._observe(sectionEl);

            // Anima skill bars quando visíveis (só para seções de skills)
            if (section.type === 'skills') {
                sectionEl.querySelectorAll('.skill-progress').forEach(b => (b.style.width = '0%'));
            }

            this.eventBus.publish('view:section:rendered', {
                sectionId: section.id,
                element:   sectionEl,
            });

        } catch (err) {
            console.error(`ViewManager: erro ao renderizar seção "${section.id}"`, err);
            this.eventBus.publish('view:render:error', { sectionId: section.id, error: err });
        }
    }

    /* ──────────────────────────────────────────
       SCROLL REVEAL (IntersectionObserver)
    ────────────────────────────────────────── */
    _setupScrollReveal() {
        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                // Anima skill bars ao ficarem visíveis
                entry.target.querySelectorAll('.skill-progress[data-proficiency]').forEach(bar => {
                    bar.style.width = bar.dataset.proficiency + '%';
                });
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    }

    _observe(sectionEl) {
        this._observer.observe(sectionEl);
        sectionEl.querySelectorAll('.animate-on-scroll').forEach(el => this._observer.observe(el));
    }

    /* ──────────────────────────────────────────
       UTILS
    ────────────────────────────────────────── */
    _esc(text) {
        if (!text) return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    /** Alias público mantido para retrocompatibilidade */
    escapeHtml(text) { return this._esc(text); }

    clear() {
        if (this.container) this.container.innerHTML = '';
    }

    destroy() {
        this._observer?.disconnect();
        this.eventBus.unsubscribe('section:updated', () => {});
        this.clear();
    }
}

export { ViewManager };