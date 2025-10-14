import { ContentModel } from './models/ContentModel.js';
import { ViewManager } from './views/ViewManager.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';

/**
 * @brief Main application entry point.
 * @description Initializes the application, sets up UI components,
 * and manages the application lifecycle.
 */
class Application {
    /**
     * @brief Constructs the main Application class.
     */
    constructor() {
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application, services, and controllers.
     */
    async initializeApplication() {
        try {
            console.info('Application: Starting initialization...');

            // Initialize services
            const themeManager = new ThemeManager();
            const accessibilityManager = new AccessibilityManager();
            await themeManager.init();
            await accessibilityManager.init();
            
            // Initialize model and load data
            const contentModel = new ContentModel();
            // CORREÇÃO: Chama o método correto do seu ContentModel.js
            await contentModel.initializeContentModel(); 

            // Initialize view and render content
            const viewManager = new ViewManager({
                container: document.getElementById('sections-container')
            });
            
            const sections = contentModel.getAllSections();
            sections.forEach(section => viewManager.renderSection(section));

            this.setupMobileNavigation();
            this.setupUiControls(themeManager, accessibilityManager);
            this.setupScrollEffects();
            
            this.showMainContent();
            console.info('Application: All components initialized successfully.');

        } catch (error) {
            console.error('Application: Critical initialization failed.', error);
            this.showErrorState();
        }
    }
    
    /**
     * @brief Shows the main application content and hides the loading overlay.
     */
    showMainContent() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const mainContainer = document.getElementById('main-container');

        if (loadingOverlay) {
            loadingOverlay.classList.add('critical-hidden');
        }
        
        if (mainContainer) {
            mainContainer.classList.remove('critical-hidden');
        }
    }

    /**
     * @brief Displays an error message if the application fails to load.
     */
    showErrorState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `<h1>Error</h1><p>Failed to load portfolio.</p>`;
        }
    }

    /**
     * @brief Sets up event listeners and functionality for mobile navigation.
     */
    setupMobileNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navOverlay = document.getElementById('nav-overlay');
        
        const toggleMenu = (isOpen) => {
            menuToggle.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);
            navOverlay.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => toggleMenu(!navMenu.classList.contains('active')));
        navOverlay.addEventListener('click', () => toggleMenu(false));
        navMenu.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') toggleMenu(false);
        });
    }

    /**
     * @brief Sets up the UI controls for theme and accessibility.
     */
    setupUiControls(themeManager, accessibilityManager) {
        const controlsContainer = document.getElementById('app-controls');
        if (!controlsContainer) return;

        const themeBtn = this.createControlButton('🌙', 'Toggle theme', () => {
            const newTheme = themeManager.toggleTheme();
            themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
        
        controlsContainer.appendChild(themeBtn);
        controlsContainer.appendChild(this.createControlButton('A+', 'Increase font size', () => accessibilityManager.increaseFontSize()));
        controlsContainer.appendChild(this.createControlButton('A-', 'Decrease font size', () => accessibilityManager.decreaseFontSize()));
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
     * @brief Sets up scroll-related effects.
     */
    setupScrollEffects() {
        const header = document.getElementById('main-header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
            if (window.scrollY > lastScrollY) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }
}

// Initialize the application when the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    new Application();
});