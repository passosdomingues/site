// Importa BaseView do mesmo diretório
import { BaseView } from './BaseView.js';

/**
 * @brief Hero section view
 * @description Renders the main hero section with personal information
 */
export class HeroView extends BaseView {
    constructor(config = {}) {
        super(config);
        // Recebe os dados 'personalInfo' do main.js
        this.heroData = config.heroData || {};
    }

    /**
     * @brief Initialize hero view
     */
    async init() {
        await super.init();
        
        // Remove o getDefaultHeroData()
        if (Object.keys(this.heroData).length === 0) {
            console.warn('HeroView: No heroData provided by main.js');
        }
        
        console.info('HeroView: Initialized with hero data');
    }

    /**
     * @brief Render hero section
     */
    async render() {
        await super.render();
        
        if (!this.container) {
            throw new Error('HeroView: Container not available');
        }

        const heroHTML = this.createHeroHTML();
        this.setHTML(this.container, heroHTML); // Use setHTML do BaseView
        
        // Register main elements
        this.registerElement('heroTitle', this.container.querySelector('.hero-title'));
        this.registerElement('heroSubtitle', this.container.querySelector('.hero-subtitle'));
        this.registerElement('heroDescription', this.container.querySelector('.hero-description'));
        
        this.setupEventListeners();
        
        this.eventBus.publish('hero:rendered', { data: this.heroData });
    }

    /**
     * @brief Create hero section HTML
     * @returns {string} The HTML
     */
    createHeroHTML() {
        // Lê os dados do UserData.js -> personalInfo
        const { name, title, summary } = this.heroData;

        if (!name || !title || !summary) {
            console.warn('HeroView: Data is incomplete. Using fallback HTML.');
            // Retorna o conteúdo estático do seu index.html como fallback
            return `
                <div class="hero-content">
                    <h1 class="hero-title">Rafael Passos Domingues</h1>
                    <p class="hero-subtitle">Physicist & Computer Scientist</p>
                    <p class="hero-description">
                        Researcher in Astrophysics, Data Science and Technology Innovation...
                    </p>
                </div>
            `;
        }

        // Gera o HTML dinâmico
        return `
            <div class="hero-content">
                <h1 class="hero-title">${this.escapeHtml(name)}</h1>
                <p class="hero-subtitle">${this.escapeHtml(title)}</p>
                <p class="hero-description">${this.escapeHtml(summary)}</p>
            </div>
        `;
    }

    /**
     * @brief Add animation to hero elements
     */
    animateHero() {
        const title = this.getElement('heroTitle');
        const subtitle = this.getElement('heroSubtitle');
        const description = this.getElement('heroDescription');
        
        if (title) this.addClass(title, 'hero-element--animated');
        if (subtitle) this.addClass(subtitle, 'hero-element--animated');
        if (description) this.addClass(description, 'hero-element--animated');
        
        this.eventBus.publish('hero:animated');
    }
}