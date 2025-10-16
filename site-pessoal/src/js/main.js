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

// Importando a FooterView e os dados do usuário.
import { FooterView } from './views/FooterView.js';
import { USER_DATA } from './data/UserData.js';

class Application {
    constructor() {
        this.app = null;
        this.isInitialized = false;
        this.initializeApplication();
    }

    /**
     * @brief Initializes the core application and then sets up UI controls.
     */
    async initializeApplication() {
        try {
            console.info('Application: Starting initialization...');
            
            // Primeiro esconde o loading overlay
            this.hideLoadingOverlay();
            
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
            await this.app.initialize(); // CORREÇÃO: era init(), agora initialize()
            
            await this.setupGlobalUIControls();
            await this.initializeFooter();

            this.isInitialized = true;
            console.info('Application: Initialized successfully');

        } catch (error) {
            console.error('Application: Failed to initialize.', error);
            this.hideLoadingOverlay();
            this.showErrorMessage('Failed to load application. Please refresh the page.');
        }
    }

    /**
     * @brief Hides the loading overlay
     */
    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }

    /**
     * @brief Shows error message to user
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px;">Dismiss</button>
        `;
        document.body.appendChild(errorDiv);
    }
    
    /**
     * @brief Initializes and renders the footer view.
     */
    async initializeFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            console.warn('Application: Footer container not found.');
            return;
        }

        try {
            const footerView = new FooterView({
                container: footerContainer,
                footerData: USER_DATA
            });

            await footerView.render();
            console.info('Application: Footer initialized.');
        } catch (error) {
            console.error('Application: Error initializing footer.', error);
        }
    }

    /**
     * @brief Sets up global UI controls (theme toggle, accessibility buttons).
     */
    async setupGlobalUIControls() {
        // Verifica se os controles já existem
        if (document.querySelector('.app-controls')) {
            return;
        }

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'app-controls';
        controlsContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `;
        document.body.appendChild(controlsContainer);

        // --- Theme Toggle Button ---
        const themeManager = this.app.getService('themeManager');
        if (themeManager) {
            const themeToggleBtn = document.createElement('button');
            themeToggleBtn.className = 'app-control-button theme-toggle-btn';
            themeToggleBtn.style.cssText = `
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            `;
            
            const updateThemeIcon = () => {
                const isDark = themeManager.isDarkMode();
                themeToggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
                themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
            };
            
            themeToggleBtn.addEventListener('click', () => {
                themeManager.toggleTheme();
                updateThemeIcon();
            });
            
            controlsContainer.appendChild(themeToggleBtn);
            updateThemeIcon();
        }

        // --- Accessibility Controls ---
        const accessibilityManager = this.app.getService('accessibilityManager');
        if (accessibilityManager) {
            // High Contrast Toggle
            const contrastBtn = document.createElement('button');
            contrastBtn.className = 'app-control-button';
            contrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
            contrastBtn.textContent = '⚫';
            contrastBtn.style.cssText = `
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: var(--secondary-color);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            `;
            contrastBtn.addEventListener('click', () => {
                const current = document.body.classList.contains('high-contrast');
                accessibilityManager.toggleHighContrast(!current);
                contrastBtn.style.background = current ? 'var(--secondary-color)' : '#000000';
            });
            controlsContainer.appendChild(contrastBtn);

            // Font Size Controls
            const fontSizeContainer = document.createElement('div');
            fontSizeContainer.style.cssText = `
                display: flex;
                gap: 5px;
            `;

            const decreaseFontBtn = document.createElement('button');
            decreaseFontBtn.className = 'app-control-button';
            decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
            decreaseFontBtn.textContent = 'A-';
            decreaseFontBtn.style.cssText = `
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: var(--accent-color);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
            `;
            decreaseFontBtn.addEventListener('click', () => accessibilityManager.decreaseFontSize());

            const increaseFontBtn = document.createElement('button');
            increaseFontBtn.className = 'app-control-button';
            increaseFontBtn.setAttribute('aria-label', 'Increase font size');
            increaseFontBtn.textContent = 'A+';
            increaseFontBtn.style.cssText = `
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 50%;
                background: var(--accent-color);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
            `;
            increaseFontBtn.addEventListener('click', () => accessibilityManager.increaseFontSize());

            fontSizeContainer.appendChild(decreaseFontBtn);
            fontSizeContainer.appendChild(increaseFontBtn);
            controlsContainer.appendChild(fontSizeContainer);
        }

        console.info('Application: UI Controls initialized.');
    }

    /**
     * @brief Destroy application
     */
    async destroy() {
        if (this.app && typeof this.app.shutdown === 'function') {
            await this.app.shutdown();
        }
        this.isInitialized = false;
    }
}

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Application();
    });
} else {
    new Application();
}