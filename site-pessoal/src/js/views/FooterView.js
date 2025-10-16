import { BaseView } from './BaseView.js';

/**
 * @brief Footer view
 * @description Renders the application footer using data from UserData.
 */
export class FooterView extends BaseView {
    /**
     * @brief Constructs a FooterView instance.
     * @param {Object} [config={}] - The configuration object.
     * @param {HTMLElement} config.container - The container element for the footer.
     * @param {Object} [config.footerData] - The user data to render.
     */
    constructor(config = {}) {
        super(config);
        this.footerData = config.footerData || {};
        this.currentYear = new Date().getFullYear();
    }

    /**
     * @brief Render the footer into its container.
     * @returns {Promise<void>}
     */
    async render() {
        await super.render();
        
        if (!this.container) {
            console.error('FooterView: Container is not defined.');
            return;
        }

        if (Object.keys(this.footerData).length === 0) {
            console.warn('FooterView: footerData is empty. Nothing to render.');
            return;
        }

        const footerHTML = this.createFooterHTML();
        this.setHTML(this.container, footerHTML);
        console.info('FooterView: Rendered successfully.');
    }
    
    /**
     * @brief Creates the social links HTML.
     * @returns {string} The HTML string for social links.
     */
    createSocialLinksHTML() {
        const { socialLinks } = this.footerData;
        if (!socialLinks) return '';

        // Mapeia chaves para ícones da Font Awesome
        const iconMap = {
            github: 'fab fa-github',
            linkedin: 'fab fa-linkedin',
            instagram: 'fab fa-instagram'
        };

        const links = Object.entries(socialLinks).map(([key, url]) => {
            const iconClass = iconMap[key] || 'fas fa-link';
            const name = key.charAt(0).toUpperCase() + key.slice(1); // Capitaliza o nome
            return `
                <li class="footer-social-item">
                    <a href="${this.escapeHtml(url)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="footer-social-link" 
                       aria-label="Visit my ${name} profile">
                        <i class="${iconClass}" aria-hidden="true"></i>
                    </a>
                </li>
            `;
        }).join('');

        return `<ul class="footer-social-list">${links}</ul>`;
    }

    /**
     * @brief Creates the main footer HTML structure.
     * @returns {string} The complete HTML for the footer.
     */
    createFooterHTML() {
        const { personalInfo, resumeUrl } = this.footerData;
        
        return `
            <div class="footer-container">
                <div class="footer-info">
                    <p class="footer-copyright">
                        &copy; ${this.currentYear} ${this.escapeHtml(personalInfo.name)}. All rights reserved.
                    </p>
                    ${resumeUrl ? `
                        <a href="${this.escapeHtml(resumeUrl)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="footer-resume-link">
                           View CV Lattes
                        </a>
                    ` : ''}
                </div>
                <div class="footer-social">
                    ${this.createSocialLinksHTML()}
                </div>
            </div>
        `;
    }
}