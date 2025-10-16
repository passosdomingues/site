/**
 * @brief Main application entry point.
 * @description Initializes and coordinates all MVC components, including UI controls for theme and accessibility.
 */
import { App } from './core/App.js';

// --- Import Models (trated as Services) ---
import { ContentModel } from './models/ContentModel.js';
import { UserModel } from './models/UserModel.js';

// --- Import All Services ---
import { ThemeManager } from './services/ThemeManager.js';
import { AccessibilityManager } from './services/AccessibilityManager.js';
import { PerformanceMonitor } from './services/PerformanceMonitor.js';
import { ErrorReporter } from './services/ErrorReporter.js'; // <-- ESTAVA FALTANDO

// --- Import All Controllers ---
import { MainController } from './controllers/MainController.js';
import { NavigationController } from './controllers/NavigationController.js';
import { SectionController } from './controllers/SectionController.js'; // <-- ESTAVA FALTANDO

// --- Import "Orphaned" Views ---
import { HeroView } from './views/HeroView.js';
import { FooterView } from './views/FooterView.js';

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
            
            // O appConfig CORRIGIDO, agora incluindo TODOS os serviços e controladores
            // que são gerenciados pelo App.js
            const appConfig = {
                services: {
                    contentModel: ContentModel,
                    userModel: UserModel,
                    themeManager: ThemeManager,
                    accessibilityManager: AccessibilityManager,
                    performanceMonitor: PerformanceMonitor,
                    errorReporter: ErrorReporter // <-- ADICIONADO
                },
                controllers: {
                    mainController: MainController,
                    navigationController: NavigationController,
                    sectionController: SectionController // <-- ADICIONADO
                }
            };
            
            this.app = new App(appConfig);
            
            // 1. Espera o App (o "Gerente") inicializar todos os Models, Services, e Controllers do appConfig
            await this.app.initialize();
            console.info('Application: Core components initialized successfully.');

            // 2. Agora o "Maestro" (main.js) inicializa as Views estáticas (Hero e Footer)
            //    usando os dados que os Models (UserModel) carregaram.
            await this.initializeHero();
            await this.initializeFooter();

            // 3. Finalmente, configura os controles da UI
            this.setupUIControls();
            
            console.info('Application: Fully initialized.');

        } catch (error) {
            console.error('Application: Critical initialization failed.', error);
        }
    }

    /**
     * @brief Initializes the Hero view.
     * @description (Este método estava faltando)
     */
    async initializeHero() {
        try {
            const userModel = this.app.services.userModel;
            const heroContainer = document.getElementById('hero-section'); // ID do index.html

            if (!userModel || !userModel.isInitialized || !heroContainer) {
                console.error('Application: HeroView dependencies not met.');
                return;
            }

            // Pega os dados do UserModel (que carregou UserData.js)
            const userData = userModel.getUserData();
            
            const heroView = new HeroView({
                container: heroContainer,
                heroData: userData.personalInfo // Passa SÓ a parte 'personalInfo'
            });

            await heroView.init();
            await heroView.render();
            console.info('Application: HeroView initialized.');

        } catch (error) {
            console.error('Application: Failed to initialize HeroView.', error);
        }
    }

    /**
     * @brief Initializes the footer view.
     * @description (Este método estava faltando)
     */
    async initializeFooter() {
        try {
            const userModel = this.app.services.userModel;
            const footerContainer = document.getElementById('footer-container'); // ID do index.html

            if (!userModel || !userModel.isInitialized || !footerContainer) {
                console.error('Application: FooterView dependencies not met.');
                return;
            }

            // Pega os dados do UserModel (que carregou UserData.js)
            const userData = userModel.getUserData();
            
            const footerView = new FooterView({
                container: footerContainer,
                footerData: userData // Passa TODOS os dados (personalInfo, socialLinks)
            });

            await footerView.init();
            await footerView.render();
            console.info('Application: FooterView initialized.');

        } catch (error) {
            console.error('Application: Failed to initialize FooterView.', error);
        }
    }

    /**
     * @brief Initializes UI controls (theme toggle, accessibility).
     * @description (Seu método original, sem alterações)
     */
    setupUIControls() {
        const controlsContainer = document.getElementById('app-controls');
        if (!controlsContainer) {
            console.warn('Application: UI controls container not found.');
            return;
        }
        
        // --- Theme Toggle ---
        const themeManager = this.app.services.themeManager;
        
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'btn btn--icon app-control-button';
        themeToggleBtn.setAttribute('aria-label', 'Toggle light/dark mode');
        
        const updateThemeIcon = () => {
            // Seus ícones <i class="..."> indicam Font Awesome, mantive isso.
            themeToggleBtn.innerHTML = themeManager.isDarkMode() ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
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