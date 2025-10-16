// Importa BaseView do mesmo diretório (como sua 'tree' mostra)
import { BaseView } from './BaseView.js';

// Ícones SVG que você pediu
const ICONS = {
    github: `
        <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61C6.41 15.165 5.58 14.65 5.58 14.65c-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z"/>
        </svg>`,
    linkedin: `
        <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M19.75 0H4.25C1.905 0 0 1.905 0 4.25v15.5C0 22.095 1.905 24 4.25 24h15.5C22.095 24 24 22.095 24 19.75V4.25C24 1.905 22.095 0 19.75 0zM8.1 19.125H5.06V8.55h3.04v10.575zM6.58 7.11c-.965 0-1.75-.785-1.75-1.75s.785-1.75 1.75-1.75 1.75.785 1.75 1.75-.785 1.75-1.75 1.75zm13.007 12.015h-3.04v-5.1c0-1.215-.025-2.775-1.69-2.775-1.69 0-1.95 1.32-1.95 2.685v5.19H9.86V8.55h2.91v1.33h.04c.4-.76 1.38-1.55 2.87-1.55 3.07 0 3.64 2.02 3.64 4.65v5.34h.01z"/>
        </svg>`,
    instagram: `
        <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.305-1.455.717-2.126 1.387S.935 3.356.63 4.14C.333 4.905.13 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.26 2.148.558 2.913.306.783.718 1.455 1.387 2.126s1.343.92 2.126 1.387c.765.297 1.636.498 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.26 2.913-.558.783-.306 1.455-.718 2.126-1.387s.92-1.343 1.387-2.126c.297-.765.498-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.26-2.148-.558-2.913-.306-.783-.718-1.455-1.387-2.126S20.644.935 19.86.63c-.765-.297-1.636-.498-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.07 1.17.05 1.805.248 2.227.415.562.217.96.477 1.382.896.417.417.678.82.896 1.382.167.422.365 1.057.413 2.227.055 1.265.07 1.646.07 4.85s-.015 3.585-.07 4.85c-.05 1.17-.248 1.805-.413 2.227-.218.562-.477.96-.896 1.382-.417.417-.82.678-1.382.896-.422.167-1.057.365-2.227.413-1.265.055-1.646.07-4.85.07s-3.585-.015-4.85-.07c-1.17-.05-1.805-.248-2.227-.413-.562-.218-.96-.477-1.382-.896-.417-.417-.678-.82-.896-1.382-.167-.422-.365 1.057-.413-2.227-.055-1.265-.07-1.646-.07-4.85s.015-3.585.07-4.85c.05-1.17.248 1.805.413 2.227.218.562.477.96.896 1.382.417.417.82.678 1.382.896.422.167 1.057.365 2.227.413 1.265.055 1.646.07 4.85.07zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.027c-2.127 0-3.865-1.738-3.865-3.865s1.738-3.865 3.865-3.865 3.865 1.738 3.865 3.865-1.738 3.865-3.865 3.865zm6.406-11.845c-.796 0-1.44.645-1.44 1.44s.645 1.44 1.44 1.44 1.44-.645 1.44-1.44c.002-.795-.644-1.44-1.44-1.44z"/>
        </svg>`
};

/**
 * @brief Footer view
 * @description Renders the application footer with links and copyright information.
 */
export class FooterView extends BaseView {
    /**
     * @brief Constructs a FooterView instance.
     * @param {Object} [config={}] - The configuration object.
     * @param {Object} [config.footerData] - Os dados do usuário (vindos do UserModel).
     */
    constructor(config = {}) {
        super(config);
        // Recebe os dados do main.js (vindos do UserData.js)
        this.footerData = config.footerData || {};
        this.currentYear = new Date().getFullYear();
    }

    /**
     * @brief Initialize the footer view.
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();
        
        // Remove o getDefaultFooterData()
        if (Object.keys(this.footerData).length === 0) {
            console.warn('FooterView: No footerData provided by main.js');
        }
        
        console.info('FooterView: Initialized');
    }

    /**
     * @brief Render the footer into its container.
     * @returns {Promise<void>}
     */
    async render() {
        await super.render();
        
        if (!this.container) {
            throw new Error('FooterView: Container is not available for rendering.');
        }

        const footerHTML = this.createFooterHTML();
        this.setHTML(this.container, footerHTML); // setHTML vem do BaseView
        
        this.setupEventListeners();
    }

    /**
     * @brief Creates the HTML for the footer section
     * @returns {string} The HTML string
     */
    createFooterHTML() {
        // Lê os dados do UserData.js (via this.footerData)
        const { socialLinks, personalInfo } = this.footerData;
        
        if (!socialLinks || !personalInfo) {
            console.warn('FooterView: User data for footer is incomplete.');
            return '<p class="footer-text">Erro ao carregar rodapé.</p>';
        }

        const socialLinksHtml = `
            <ul class="footer-social-links">
                ${socialLinks.linkedin ? `
                    <li class="footer-social-item">
                        <a href="${this.escapeHtml(socialLinks.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                            ${ICONS.linkedin} <span class="sr-only">LinkedIn</span>
                        </a>
                    </li>
                ` : ''}
                ${socialLinks.github ? `
                    <li class="footer-social-item">
                        <a href="${this.escapeHtml(socialLinks.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                            ${ICONS.github} <span class="sr-only">GitHub</span>
                        </a>
                    </li>
                ` : ''}
                ${socialLinks.instagram ? `
                    <li class="footer-social-item">
                        <a href="https://instagram.com/${this.escapeHtml(socialLinks.instagram.replace('@', ''))}" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile">
                            ${ICONS.instagram} <span class="sr-only">Instagram</span>
                        </a>
                    </li>
                ` : ''}
            </ul>
        `;

        // Conteúdo final do rodapé
        return `
            <div class="footer-social">
                ${socialLinksHtml}
            </div>
            <div class="footer-copyright">
                <p class="footer-text" id="footer-copyright-text">
                    &copy; ${this.currentYear} ${this.escapeHtml(personalInfo.name)}. Todos os direitos reservados.
                </p>
            </div>
        `;
    }

    /**
     * @brief Update the copyright year in the rendered footer.
     */
    updateCopyrightYear() {
        const newYear = new Date().getFullYear();
        if (this.currentYear === newYear) return;

        this.currentYear = newYear;
        // Seleciona pelo ID para garantir
        const copyrightElement = this.container.querySelector('#footer-copyright-text');
        
        if (copyrightElement && this.footerData.personalInfo) {
            copyrightElement.innerHTML = `&copy; ${this.currentYear} ${this.escapeHtml(this.footerData.personalInfo.name)}. Todos os direitos reservados.`;
        }
    }
}