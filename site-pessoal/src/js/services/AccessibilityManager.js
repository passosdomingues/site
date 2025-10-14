import eventBus from '../core/EventBus.js';

/**
 * @brief Accessibility manager service
 */
export class AccessibilityManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.isInitialized = false;
        this.currentFontSize = 100;
        this.minFontSize = 80;
        this.maxFontSize = 150;
        this.fontSizeStep = 10;

        this.handleKeydown = this.handleKeydown.bind(this);
    }

    /**
     * @brief Initialize accessibility manager
     */
    async init() {
        if (this.isInitialized) return;

        // Load saved preferences
        const savedFontSize = localStorage.getItem('app-font-size');
        if (savedFontSize) {
            this.currentFontSize = parseInt(savedFontSize);
            this.applyFontSize();
        }

        this.setupEventListeners();
        this.setupFocusManagement();
        this.announcePageLoad();
        
        this.isInitialized = true;
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown);
        
        this.eventBus.subscribe('accessibility:increaseFont', this.increaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:decreaseFont', this.decreaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:resetFont', this.resetFontSize.bind(this));
    }

    /**
     * @brief Handle keyboard events
     */
    handleKeydown(event) {
        // Skip if user is typing
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }

        // Font size controls
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
            event.preventDefault();
            this.increaseFontSize();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === '-') {
            event.preventDefault();
            this.decreaseFontSize();
            return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key === '0') {
            event.preventDefault();
            this.resetFontSize();
            return;
        }

        // Theme toggle with Ctrl+T
        if ((event.ctrlKey || event.metaKey) && event.key === 't') {
            event.preventDefault();
            this.eventBus.publish('theme:toggle');
            return;
        }
    }

    /**
     * @brief Set up focus management
     */
    setupFocusManagement() {
        // Manage focus for route changes
        this.eventBus.subscribe('router:navigated', () => {
            setTimeout(() => {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                }
            }, 100);
        });
    }

    /**
     * @brief Announce page load to screen readers
     */
    announcePageLoad() {
        setTimeout(() => {
            this.announceContent('Portfolio website loaded successfully');
        }, 500);
    }

    /**
     * @brief Announce content to screen readers
     */
    announceContent(message) {
        let announcer = document.getElementById('a11y-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.classList.add('sr-only');
            document.body.appendChild(announcer);
        }
        
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * @brief Increase font size
     */
    increaseFontSize() {
        const newSize = Math.min(this.currentFontSize + this.fontSizeStep, this.maxFontSize);
        if (newSize !== this.currentFontSize) {
            this.currentFontSize = newSize;
            this.applyFontSize();
            this.announceContent(`Font size increased to ${newSize}%`);
        }
    }

    /**
     * @brief Decrease font size
     */
    decreaseFontSize() {
        const newSize = Math.max(this.currentFontSize - this.fontSizeStep, this.minFontSize);
        if (newSize !== this.currentFontSize) {
            this.currentFontSize = newSize;
            this.applyFontSize();
            this.announceContent(`Font size decreased to ${newSize}%`);
        }
    }

    /**
     * @brief Reset font size to default
     */
    resetFontSize() {
        if (this.currentFontSize !== 100) {
            this.currentFontSize = 100;
            this.applyFontSize();
            this.announceContent('Font size reset to default');
        }
    }

    /**
     * @brief Apply current font size to document
     */
    applyFontSize() {
        document.documentElement.style.fontSize = `${this.currentFontSize}%`;
        localStorage.setItem('app-font-size', this.currentFontSize.toString());
        
        this.eventBus.publish('accessibility:fontSize:changed', { 
            size: this.currentFontSize 
        });
    }

    /**
     * @brief Get current font size
     */
    getCurrentFontSize() {
        return this.currentFontSize;
    }

    /**
     * @brief Check if reduced motion is preferred
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * @brief Destroy accessibility manager
     */
    destroy() {
        document.removeEventListener('keydown', this.handleKeydown);
        this.eventBus.unsubscribe('accessibility:increaseFont');
        this.eventBus.unsubscribe('accessibility:decreaseFont');
        this.eventBus.unsubscribe('accessibility:resetFont');
        this.eventBus.unsubscribe('router:navigated');
        this.isInitialized = false;
    }
}