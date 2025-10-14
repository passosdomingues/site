/**
 * @file Footer view
 * @brief Renders application footer with links and copyright information
 */

import { BaseView } from './BaseView.js';

/**
 * @class FooterView
 * @brief Handles footer rendering and interactions
 */
export class FooterView extends BaseView {
    /**
     * @brief Constructs FooterView instance
     * @param {Object} config - Configuration object
     * @param {Object} config.footerData - Data used to render footer
     */
    constructor(config = {}) {
        super(config);
        this.footerData = config.footerData || {};
        this.currentYear = new Date().getFullYear();
    }

    /**
     * @brief Initialize footer view with default data
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();
        
        if (Object.keys(this.footerData).length === 0) {
            this.footerData = this.getDefaultFooterData();
        }
        
        console.info('FooterView: Initialized');
    }

    /**
     * @brief Render footer into container
     * @async
     * @returns {Promise<void>}
     */
    async render() {
        await super.render();
        
        if (!this.container) {
            throw new Error('FooterView: Container is not available for rendering.');
        }

        const footerHTML = this.createFooterHTML();
        this.setHTML(this.container, footerHTML);
        
        this.setupEventListeners();
        
        this.eventBus.publish('footer:rendered', { data: this.footerData });
    }

    /**
     * @brief Create main footer HTML structure
     * @returns {string} Complete HTML string for footer
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
     * @brief Create info section HTML
     * @returns {string} HTML for info section
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
     * @brief Create links section HTML
     * @returns {string} HTML for navigation links section
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
     * @brief Create social media links section HTML
     * @returns {string} HTML for social links section
     */
    createSocialSection() {
        if (!this.footerData.social) return '';
        
        const socialHTML = this.footerData.social.map(social => `
            <a href="${this.escapeHtml(social.url)}" 
               class="footer-social-link"
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${this.escapeHtml(social.name)}">
                <span class="footer-social-icon" aria-hidden="true">${social.icon || '🔗'}</span>
                <span class="footer-social-name sr-only">${this.escapeHtml(social.name)}</span>
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
     * @brief Create copyright section HTML
     * @returns {string} HTML for copyright section
     */
    createCopyrightSection() {
        return `
            <div class="footer-copyright">
                <p class="footer-text">
                    &copy; ${this.currentYear} ${this.escapeHtml(this.footerData.name)}. 
                    ${this.escapeHtml(this.footerData.copyrightText) || 'All rights reserved.'}
                </p>
                ${this.footerData.additionalText ? `
                    <p class="footer-additional-text">${this.escapeHtml(this.footerData.additionalText)}</p>
                ` : ''}
            </div>
        `;
    }

    /**
     * @brief Set up event listeners for footer elements
     */
    setupEventListeners() {
        const footerLinks = this.container.querySelectorAll('.footer-link, .footer-social-link');
        footerLinks.forEach(link => {
            this.addEventListener(link, 'click', (event) => {
                this.onFooterLinkClick(event, link);
            });
        });
    }

    /**
     * @brief Handle clicks on footer links
     * @param {Event} event - Click event object
     * @param {HTMLElement} link - Clicked link element
     */
    onFooterLinkClick(event, link) {
        const url = link.getAttribute('href');
        const isExternal = link.target === '_blank';
        
        this.eventBus.publish('footer:link:clicked', {
            url,
            isExternal,
            text: link.textContent.trim(),
            element: link
        });
        
        console.info('FooterView: Footer link clicked', { url, isExternal });
    }

    /**
     * @brief Get default data for footer
     * @returns {Object} Object containing default footer content
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
                        { label: 'GitHub', url: 'https://github.com/passosdomingues', external: true },
                        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rafaelpassosdomingues/', external: true },
                        { label: 'CV/Resume', url: '/path-to-cv.pdf', external: true }
                    ]
                }
            ],
            social: [
                { name: 'GitHub', url: 'https://github.com/passosdomingues', icon: '🐙' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rafaelpassosdomingues/', icon: '💼' },
                { name: 'Email', url: 'mailto:rafaelpassosdomingues@gmail.com', icon: '✉️' }
            ]
        };
    }

    /**
     * @brief Update copyright year in rendered footer
     */
    updateCopyrightYear() {
        const newYear = new Date().getFullYear();
        if (this.currentYear === newYear) return;

        this.currentYear = newYear;
        const copyrightElement = this.container.querySelector('.footer-copyright .footer-text');
        
        if (copyrightElement) {
            copyrightElement.innerHTML = `&copy; ${this.currentYear} ${this.escapeHtml(this.footerData.name)}. ${this.escapeHtml(this.footerData.copyrightText) || 'All rights reserved.'}`;
        }
    }

    /**
     * @brief Update footer with new data and re-render if necessary
     * @async
     * @param {Object} newData - New data to merge with existing footer data
     * @returns {Promise<void>}
     */
    async update(newData) {
        await super.update(newData);
        
        this.footerData = { ...this.footerData, ...newData };
        
        if (this.isRendered) {
            await this.render();
        }
    }
}