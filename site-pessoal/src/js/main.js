/**
 * @brief Main application entry point.
 * @description Initializes and coordinates all MVC components, including UI controls for theme and accessibility.
 */
import { App } from './core/App.js';
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { ContentModel } from './models/ContentModel.js';
import { UserModel } from './models/UserModel.js';
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';

// **NOVO**: Importando a FooterView e os dados do usuário.
import { FooterView } from './views/FooterView.js';
import { USER_DATA } from './data/UserData.js';


class Application {
    constructor() {
        this.app = null;
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application and then sets up UI controls.
     */
    async initializeApplication() {
        try {
            console.info('Application: Starting initialization...');
            const appConfig = {
                services: {
                    contentModel: ContentModel,
                    userModel: UserModel,
                    themeManager: ThemeManager,
                    accessibilityManager: AccessibilityManager,
                    performanceMonitor: PerformanceMonitor
                },
                controllers: {
                    mainController: MainController,
                    navigationController: NavigationController
                }
            };
            
            this.app = new App(appConfig);
            await this.app.init();
            
            this.setupGlobalUIControls();

            // **NOVO**: Inicializa e renderiza o rodapé.
            this.initializeFooter();

        } catch (error) {
            console.error('Application: Failed to initialize.', error);
            // Optionally, display a user-friendly error message on the page
        }
    }
    
    /**
     * @brief Initializes and renders the footer view.
     */
    initializeFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            console.error('Application: Footer container not found.');
            return;
        }

        const footerView = new FooterView({
            container: footerContainer,
            footerData: USER_DATA // Passa os dados do usuário para a view
        });

        footerView.render().catch(error => {
            console.error('Application: Failed to render footer.', error);
        });
        
        console.info('Application: Footer initialized.');
    }


    /**
     * @brief Sets up global UI controls (theme toggle, accessibility buttons).
     */
    setupGlobalUIControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'app-controls';
        document.body.appendChild(controlsContainer);

        // --- Theme Toggle Button ---
        const themeManager = this.app.services.themeManager;
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'btn btn--icon app-control-button theme-toggle-btn';
        
        const updateThemeIcon = () => {
            const isDark = themeManager.isDarkMode();
            themeToggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
            // Using a simple text-based icon for now for a cleaner look
            themeToggleBtn.innerHTML = isDark ? '☀️' : '🌙';
        };
        
        themeToggleBtn.addEventListener('click', () => {
            themeManager.toggleTheme();
            updateThemeIcon();
        });
        
        controlsContainer.appendChild(themeToggleBtn);
        updateThemeIcon(); // Set initial icon

        // --- Accessibility Buttons ---
        const accessibilityManager = this.app.services.accessibilityManager;
        
        const increaseFontBtn = document.createElement('button');
        increaseFontBtn.className = 'btn btn--icon app-control-button';
        increaseFontBtn.setAttribute('aria-label', 'Increase font size');
        increaseFontBtn.innerHTML = 'A+';
        increaseFontBtn.addEventListener('click', () => accessibilityManager.increaseFontSize());
        controlsContainer.appendChild(increaseFontBtn);

        const decreaseFontBtn = document.createElement('button');
        decreaseFontBtn.className = 'btn btn--icon app-control-button';
        decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseFontBtn.innerHTML = 'A-';
        decreaseFontBtn.addEventListener('click', () => accessibilityManager.decreaseFontSize());
        controlsContainer.appendChild(decreaseFontBtn);

        console.info('Application: UI Controls initialized.');
    }
}

document.addEventListener('DOMContentLoaded', () => new Application());