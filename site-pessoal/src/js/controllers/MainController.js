import { HeroView } from '../views/HeroView.js';
import { FooterView } from '../views/FooterView.js';
import { ViewManager } from '../views/ViewManager.js';

/**
 * @brief Main application controller.
 * @description Orchestrates the main views (Hero, Footer, Sections) and UI controls.
 */
export class MainController {
    constructor(dependencies) {
        this.eventBus = dependencies.eventBus;
        this.contentModel = dependencies.services.contentModel;
        this.themeManager = dependencies.services.themeManager;
        this.accessibilityManager = dependencies.services.accessibilityManager;

        // Instantiate all the views this controller manages
        this.heroView = new HeroView({ container: document.getElementById('hero-section') });
        this.footerView = new FooterView({ container: document.getElementById('main-footer') });
        this.viewManager = new ViewManager({ container: document.getElementById('sections-container') });
    }

    async init() {
        this.renderAllViews();
        this.setupUIControls();
        this.hideLoadingOverlay();
    }

    /**
     * @brief Renders all views managed by this controller.
     */
    renderAllViews() {
        // Render hero and footer with data from the model
        const userData = this.contentModel.getUserData();
        this.heroView.render({
            title: userData.name,
            subtitle: userData.title,
            description: 'Researcher in Astrophysics, Data Science and Technology Innovation. Combining scientific rigor with computational expertise to solve complex problems and drive innovation.',
            cta: [
                { label: 'View Research', url: '#about', type: 'primary' },
                { label: 'Contact Me', url: '#contact', type: 'secondary' }
            ]
        });
        this.footerView.render({ name: userData.name });

        // Render all dynamic sections using ViewManager
        const sections = this.contentModel.getAllSections();
        this.viewManager.renderAll(sections);
    }

    /**
     * @brief Sets up the floating UI controls for theme and accessibility.
     */
    setupUIControls() {
        const container = document.getElementById('app-controls');
        if (!container) return;
        container.innerHTML = ''; // Clear existing

        const themeBtn = this.createControlButton(
            this.themeManager.isDarkMode() ? '🌙' : '☀️',
            'Toggle Theme',
            () => {
                this.themeManager.toggleTheme();
                themeBtn.textContent = this.themeManager.isDarkMode() ? '🌙' : '☀️';
            }
        );

        const increaseFontBtn = this.createControlButton('A+', 'Increase Font Size', () => this.accessibilityManager.increaseFontSize());
        const decreaseFontBtn = this.createControlButton('A-', 'Decrease Font Size', () => this.accessibilityManager.decreaseFontSize());

        container.append(themeBtn, increaseFontBtn, decreaseFontBtn);
    }
    
    createControlButton(text, ariaLabel, onClick) {
        const button = document.createElement('button');
        button.className = 'app-control-button';
        button.setAttribute('aria-label', ariaLabel);
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    /**
     * @brief Hides the initial loading screen to show the main content.
     */
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        const mainContainer = document.getElementById('main-container');
        if (overlay) {
            overlay.classList.add('critical-hidden');
        }
        if (mainContainer) {
            mainContainer.classList.remove('critical-hidden');
        }
    }
}