import { BaseView } from './BaseView.js';
import { SVG_ICONS } from './renderers/SvgIcons.js';

/**
 * @file FooterView.js
 * @brief Rodapé — links sociais com ícones, brand, copyright dinâmico.
 */
export class FooterView extends BaseView {
    constructor(config = {}) {
        super(config);
        this.footerData = config.footerData || {};
    }

    async init() {
        await super.init();
    }

    async render() {
        await super.render();
        if (!this.container) return;
        this.container.innerHTML = this.createFooterHTML();
    }

    createFooterHTML() {
        const { personalInfo, socialLinks, contact } = this.footerData;
        const year = new Date().getFullYear();

        const socials = [
            { url: socialLinks?.github,   icon: 'github',   label: 'GitHub'   },
            { url: socialLinks?.linkedin, icon: 'linkedin',  label: 'LinkedIn' },
            { url: socialLinks?.lattes,   icon: 'graduate', label: 'Lattes' },
            { url: `mailto:${contact?.email}`, icon: 'envelope', label: 'E-mail' },
            { url: contact?.whatsapp,     icon: 'whatsapp', label: 'WhatsApp' },
        ].filter(s => s.url);

        const socialHTML = socials.map(s => `
            <li class="footer-social-item">
                <a href="${this.escapeHtml(s.url)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="${this.escapeHtml(s.label)}"
                   title="${this.escapeHtml(s.label)}">
                    ${SVG_ICONS[s.icon] || ''}
                </a>
            </li>
        `).join('');

        return `
            <div class="footer-brand-col">
                <div class="footer-brand">
                    Rafael<span>.</span>
                </div>
                <div class="footer-tagline">
                    ${this.escapeHtml(personalInfo?.subtitle || 'T-Shaped Developer')}
                </div>
            </div>
            <ul class="footer-social-links" role="list" aria-label="Links sociais">
                ${socialHTML}
            </ul>
            <div class="footer-copyright">
                © ${year} Rafael Passos Domingues<br>
                <small>Alfenas – MG, Brasil</small>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }
}