/**
 * @file Accessibility manager service
 * @brief Handles accessibility features like font sizing and screen reader announcements
 */

import eventBus from '../core/EventBus.js';

/**
 * @class AccessibilityManager
 * @brief Manages accessibility features and user preferences
 */
export class AccessibilityManager {
    /**
     * @brief Constructs AccessibilityManager instance
     * @param {Object} dependencies - Service dependencies
     * @param {Object} dependencies.eventBus - Event bus instance
     */
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
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) return;

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
     * @brief Set up event listeners for keyboard shortcuts
     */
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown);
        
        this.eventBus.subscribe('accessibility:increaseFont', this.increaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:decreaseFont', this.decreaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:resetFont', this.resetFontSize.bind(this));
    }

    /**
     * @brief Handle keyboard events for accessibility shortcuts
     * @param {KeyboardEvent} event - Keyboard event object
     */
    handleKeydown(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }

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

        if ((event.ctrlKey || event.metaKey) && event.key === 't') {
            event.preventDefault();
            this.eventBus.publish('theme:toggle');
            return;
        }
    }

    /**
     * @brief Set up focus management for route changes
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
     * @brief Announce page load to screen readers
     */
    announcePageLoad() {
        setTimeout(() => {
            this.announceContent('Portfolio website loaded successfully');
        }, 500);
    }

    /**
     * @brief Announce content to screen readers
     * @param {string} message - Message to announce
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
     * @brief Increase font size within allowed limits
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
     * @brief Decrease font size within allowed limits
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
     * @brief Reset font size to default (100%)
     */
    resetFontSize() {
        if (this.currentFontSize !== 100) {
            this.currentFontSize = 100;
            this.applyFontSize();
            this.announceContent('Font size reset to default');
        }
    }

    /**
     * @brief Apply current font size to document and save preference
     */
    applyFontSize() {
        document.documentElement.style.fontSize = `${this.currentFontSize}%`;
        localStorage.setItem('app-font-size', this.currentFontSize.toString());
        
        this.eventBus.publish('accessibility:fontSize:changed', { 
            size: this.currentFontSize 
        });
    }

    /**
     * @brief Get current font size percentage
     * @returns {number} Current font size percentage
     */
    getCurrentFontSize() {
        return this.currentFontSize;
    }

    /**
     * @brief Check if user prefers reduced motion
     * @returns {boolean} Reduced motion preference status
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * @brief Destroy accessibility manager and clean up resources
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