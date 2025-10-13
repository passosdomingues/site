import BaseView from './BaseView.js';

/**
 * @brief Footer view
 * @description Renders application footer with links and copyright
 */
export class FooterView extends BaseView {
    constructor(config = {}) {
        super(config);
        this.footerData = config.footerData || {};
        this.currentYear = new Date().getFullYear();
    }

    /**
     * @brief Initialize footer view
     */
    async init() {
        await super.init();
        
        if (Object.keys(this.footerData).length === 0) {
            this.footerData = this.getDefaultFooterData();
        }
        
        console.info('FooterView: Initialized');
    }

    /**
     * @brief Render footer
     */
    async render() {
        await super.render();
        
        if (!this.container) {
            throw new Error('FooterView: Container not available');
        }

        const footerHTML = this.createFooterHTML();
        this.container.innerHTML = footerHTML;
        
        this.setupEventListeners();
        
        this.eventBus.publish('footer:rendered', { data: this.footerData });
    }

    /**
     * @brief Create footer HTML
     * @returns {string} HTML string
     */
    createFooterHTML() {
        return `
            <footer class="main-footer">
                <div class="footer-content">
                    <div class="footer-section footer-section--info">
                        ${this.createInfoSection()}
                    </div>
                    ${this.footerData.links ? this.createLinksSection() : ''}
                    ${this.footerData.social ? this.createSocialSection() : ''}
                    <div class="footer-section footer-section--copyright">
                        ${this.createCopyrightSection()}
                    </div>
                </div>
            </footer>
        `;
    }

    /**
     * @brief Create info section
     * @returns {string} Info section HTML
     */
    createInfoSection() {
        return `
            <div class="footer-info">
                <h3 class="footer-title">${this.escapeHtml(this.footerData.name)}</h3>
                <p class="footer-description">${this.escapeHtml(this.footerData.description)}</p>
            </div>
        `;
    }

    /**
     * @brief Create links section
     * @returns {string} Links section HTML
     */
    createLinksSection() {
        if (!this.footerData.links) return '';
        
        const linksHTML = this.footerData.links.map(linkGroup => `
            <div class="footer-link-group">
                <h4 class="footer-link-group-title">${this.escapeHtml(linkGroup.title)}</h4>
                <ul class="footer-link-list">
                    ${linkGroup.links.map(link => `
                        <li class="footer-link-item">
                            <a href="${this.escapeHtml(link.url)}" 
                               class="footer-link"
                               ${link.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                                ${this.escapeHtml(link.label)}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
        
        return `<div class="footer-section footer-section--links">${linksHTML}</div>`;
    }

    /**
     * @brief Create social links section
     * @returns {string} Social links HTML
     */
    createSocialSection() {
        if (!this.footerData.social) return '';
        
        const socialHTML = this.footerData.social.map(social => `
            <a href="${this.escapeHtml(social.url)}" 
               class="footer-social-link"
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${this.escapeHtml(social.name)}">
                <span class="footer-social-icon">${social.icon || '🔗'}</span>
                <span class="footer-social-name">${this.escapeHtml(social.name)}</span>
            </a>
        `).join('');
        
        return `
            <div class="footer-section footer-section--social">
                <h4 class="footer-social-title">Connect</h4>
                <div class="footer-social-links">${socialHTML}</div>
            </div>
        `;
    }

    /**
     * @brief Create copyright section
     * @returns {string} Copyright HTML
     */
    createCopyrightSection() {
        return `
            <div class="footer-copyright">
                <p class="footer-text">
                    &copy; ${this.currentYear} ${this.escapeHtml(this.footerData.name)}. 
                    ${this.footerData.copyrightText || 'All rights reserved.'}
                </p>
                ${this.footerData.additionalText ? `
                    <p class="footer-additional-text">${this.escapeHtml(this.footerData.additionalText)}</p>
                ` : ''}
            </div>
        `;
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        // Add click listeners to footer links
        const footerLinks = this.container.querySelectorAll('.footer-link, .footer-social-link');
        footerLinks.forEach(link => {
            this.addEventListener(link, 'click', (event) => {
                this.onFooterLinkClick(event, link);
            });
        });
    }

    /**
     * @brief Handle footer link clicks
     * @param {Event} event - Click event
     * @param {HTMLElement} link - Clicked link element
     */
    onFooterLinkClick(event, link) {
        const url = link.getAttribute('href');
        const isExternal = link.getAttribute('target') === '_blank';
        
        this.eventBus.publish('footer:link:clicked', {
            url,
            isExternal,
            text: link.textContent,
            event
        });
        
        console.info('FooterView: Footer link clicked', { url, isExternal });
    }

    /**
     * @brief Get default footer data
     * @returns {Object} Default footer data
     */
    getDefaultFooterData() {
        return {
            name: 'Rafael Passos Domingues',
            description: 'Physicist and Computer Scientist specializing in Astrophysics Research and Technology Innovation.',
            copyrightText: 'All rights reserved.',
            links: [
                {
                    title: 'Navigation',
                    links: [
                        { label: 'Home', url: '#hero-section' },
                        { label: 'About', url: '#about' },
                        { label: 'Research', url: '#astrophysics-research' },
                        { label: 'Projects', url: '#deep-learning-projects' }
                    ]
                },
                {
                    title: 'Resources',
                    links: [
                        { label: 'GitHub', url: 'https://github.com', external: true },
                        { label: 'LinkedIn', url: 'https://linkedin.com', external: true },
                        { label: 'CV/Resume', url: '#', external: false }
                    ]
                }
            ],
            social: [
                {
                    name: 'GitHub',
                    url: 'https://github.com',
                    icon: '🐙'
                },
                {
                    name: 'LinkedIn',
                    url: 'https://linkedin.com',
                    icon: '💼'
                },
                {
                    name: 'Email',
                    url: 'mailto:contact@example.com',
                    icon: '✉️'
                }
            ]
        };
    }

    /**
     * @brief Update copyright year
     */
    updateCopyrightYear() {
        this.currentYear = new Date().getFullYear();
        const copyrightElement = this.container.querySelector('.footer-copyright .footer-text');
        
        if (copyrightElement) {
            copyrightElement.textContent = 
                `© ${this.currentYear} ${this.footerData.name}. ${this.footerData.copyrightText || 'All rights reserved.'}`;
        }
    }

    /**
     * @brief Update footer data
     * @param {Object} newData - New footer data
     */
    async update(newData) {
        await super.update(newData);
        
        this.footerData = { ...this.footerData, ...newData };
        
        if (this.isRendered) {
            await this.render();
        }
    }
}