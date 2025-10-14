import eventBus from '../core/EventBus.js';

/**
 * @brief Manages accessibility features for the application.
 * @description This includes font size adjustments, focus management for navigation,
 * and screen reader announcements.
 */
export class AccessibilityManager {
    /**
     * @brief Constructs a new AccessibilityManager instance.
     * @param {object} [dependencies={}] - The dependencies for the manager.
     * @param {object} [dependencies.eventBus] - The event bus instance for communication.
     */
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.isInitialized = false;
        this.currentFontSize = 100; // Represented as a percentage
        this.minFontSize = 80;
        this.maxFontSize = 150;
        this.fontSizeStep = 10;

        this.handleKeydown = this.handleKeydown.bind(this);
    }

    /**
     * @brief Initializes the accessibility manager.
     * @description Loads user preferences, sets up event listeners and focus management,
     * and makes an initial announcement for screen readers.
     */
    async init() {
        if (this.isInitialized) return;

        const savedFontSize = localStorage.getItem('app-font-size');
        if (savedFontSize) {
            this.currentFontSize = parseInt(savedFontSize, 10);
            this.applyFontSize();
        }

        this.setupEventListeners();
        this.setupFocusManagement();
        this.announcePageLoad();
        
        this.isInitialized = true;
    }

    /**
     * @brief Sets up global event listeners for accessibility features.
     * @description Listens for keyboard shortcuts and custom events for font size changes.
     */
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown);
        
        this.eventBus.subscribe('accessibility:increaseFont', this.increaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:decreaseFont', this.decreaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:resetFont', this.resetFontSize.bind(this));
    }

    /**
     * @brief Handles keydown events for accessibility shortcuts.
     * @description Implements shortcuts for font size (Ctrl/Meta +/-, 0) and theme toggling (Ctrl/Meta + T).
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    handleKeydown(event) {
        const isTyping = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable;
        if (isTyping) {
            return;
        }

        const isCtrlOrMeta = event.ctrlKey || event.metaKey;

        if (isCtrlOrMeta && (event.key === '+' || event.key === '=')) {
            event.preventDefault();
            this.increaseFontSize();
        } else if (isCtrlOrMeta && event.key === '-') {
            event.preventDefault();
            this.decreaseFontSize();
        } else if (isCtrlOrMeta && event.key === '0') {
            event.preventDefault();
            this.resetFontSize();
        } else if (isCtrlOrMeta && event.key === 't') {
            event.preventDefault();
            this.eventBus.publish('theme:toggle');
        }
    }

    /**
     * @brief Sets up focus management for single-page application navigation.
     * @description On route change, it moves focus to the main content area.
     */
    setupFocusManagement() {
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
     * @brief Announces that the page has loaded to screen readers.
     */
    announcePageLoad() {
        setTimeout(() => {
            this.announceContent('Portfolio website loaded successfully');
        }, 500);
    }

    /**
     * @brief Announces a message to screen readers using an ARIA live region.
     * @param {string} message - The message to be announced.
     */
    announceContent(message) {
        const announcerId = 'a11y-announcer';
        let announcer = document.getElementById(announcerId);

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = announcerId;
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.classList.add('sr-only'); // This class should hide the element visually
            document.body.appendChild(announcer);
        }
        
        // Set text content after a short delay to ensure it's announced
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * @brief Increases the global font size by one step.
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
     * @brief Decreases the global font size by one step.
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
     * @brief Resets the font size to the default value (100%).
     */
    resetFontSize() {
        if (this.currentFontSize !== 100) {
            this.currentFontSize = 100;
            this.applyFontSize();
            this.announceContent('Font size reset to default');
        }
    }

    /**
     * @brief Applies the current font size to the document.
     * @description Sets the font size on the <html> element, saves the preference
     * to localStorage, and publishes an event.
     */
    applyFontSize() {
        document.documentElement.style.fontSize = `${this.currentFontSize}%`;
        localStorage.setItem('app-font-size', this.currentFontSize.toString());
        
        this.eventBus.publish('accessibility:fontSize:changed', { 
            size: this.currentFontSize 
        });
    }

    /**
     * @brief Gets the current font size.
     * @returns {number} The current font size percentage.
     */
    getCurrentFontSize() {
        return this.currentFontSize;
    }

    /**
     * @brief Checks if the user prefers reduced motion.
     * @returns {boolean} True if reduced motion is preferred.
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * @brief Cleans up resources used by the AccessibilityManager.
     * @description Removes event listeners to prevent memory leaks.
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