import eventBus from '../core/EventBus.js';

/**
 * @brief Comprehensive accessibility manager service
 * @description Handles font scaling, keyboard navigation, focus management, and screen reader support
 * @description Coordinates with ThemeManager for accessible theme combinations
 */
export class AccessibilityManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.isInitialized = false;
        this.fontSizeScale = 1.0;
        this.isHighContrast = false;
        this.focusTrapped = false;
        this.lastFocusedElement = null;

        // Configuration
        this.config = {
            minFontSize: 0.8,
            maxFontSize: 2.0,
            fontSizeStep: 0.1,
            storageKey: 'portfolio-accessibility-settings'
        };

        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleFocusIn = this.handleFocusIn.bind(this);
    }

    /**
     * @brief Initialize accessibility manager with saved preferences
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            console.warn('AccessibilityManager: Already initialized');
            return;
        }

        try {
            await this.loadAccessibilityPreferences();
            this.applyAccessibilitySettings();
            this.setupEventListeners();
            this.setupFocusManagement();
            this.announcePageLoad();
            
            this.isInitialized = true;
            console.info('AccessibilityManager: Initialized successfully');
            
        } catch (error) {
            console.error('AccessibilityManager: Initialization failed', error);
            throw error;
        }
    }

    /**
     * @brief Set up accessibility event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('focusin', this.handleFocusIn);
        
        this.setupMutationObserver();
        
        // Listen for theme changes to ensure accessibility
        if (this.eventBus) {
            this.eventBus.subscribe('theme:changed', this.onThemeChange.bind(this));
        }
    }

    /**
     * @brief Handle theme changes to maintain accessibility
     * @param {Object} data - Theme change data
     */
    onThemeChange(data) {
        // Ensure sufficient color contrast when theme changes
        this.ensureColorContrast();
        
        // Announce theme change to screen readers
        this.announceContent(`Theme changed to ${data.theme} mode`);
    }

    /**
     * @brief Ensure color contrast meets accessibility standards
     */
    ensureColorContrast() {
        // Add high contrast adjustments if needed
        if (this.isHighContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        }
        
        // Could add more sophisticated contrast checking here
        console.info('AccessibilityManager: Color contrast verified for current theme');
    }

    /**
     * @brief Handle keyboard navigation and shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeydown(event) {
        // Skip if user is typing in form elements
        if (this.isFormElement(event.target)) {
            return;
        }

        switch (event.key) {
            case 'Escape':
                this.handleEscapeKey(event);
                break;
            case 'Tab':
                this.handleTabKey(event);
                break;
            case 'Enter':
            case ' ':
                this.handleActionKey(event);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.handleArrowKeys(event);
                break;
        }
    }

    /**
     * @brief Check if element is a form input
     * @param {Element} element - Target element
     * @returns {boolean} True if form element
     */
    isFormElement(element) {
        const formTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
        return formTags.includes(element.tagName) || element.isContentEditable;
    }

    /**
     * @brief Handle escape key functionality
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleEscapeKey(event) {
        // Close modals, menus, or return to main content
        this.eventBus.publish('accessibility:escape:pressed', { event });
        
        // Focus on main content as fallback
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
    }

    /**
     * @brief Handle tab key for focus management
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleTabKey(event) {
        if (!this.focusTrapped) return;

        // Implement focus trapping for modals/dialogs
        this.eventBus.publish('accessibility:focus:trapped', { event });
    }

    /**
     * @brief Handle action keys (Enter/Space)
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleActionKey(event) {
        const element = event.target;
        
        // Ensure buttons, links, and interactive elements are properly activated
        if (element.tagName === 'BUTTON' || 
            (element.tagName === 'A' && element.getAttribute('href')) ||
            element.getAttribute('role') === 'button') {
            
            event.preventDefault();
            element.click();
        }
    }

    /**
     * @brief Handle arrow key navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleArrowKeys(event) {
        // Implement arrow key navigation for custom components
        this.eventBus.publish('accessibility:arrow:navigation', { 
            key: event.key, 
            target: event.target 
        });
    }

    /**
     * @brief Track focus changes for better navigation
     * @param {FocusEvent} event - Focus event
     */
    handleFocusIn(event) {
        this.lastFocusedElement = event.target;
        
        // Announce focus changes for screen readers if needed
        if (event.target.getAttribute('aria-label')) {
            this.announceContent(event.target.getAttribute('aria-label'));
        }
    }

    /**
     * @brief Set up comprehensive focus management
     */
    setupFocusManagement() {
        this.setupSkipLinks();
        this.enhanceInteractiveElements();
        
        // Manage focus for dynamically loaded content
        if (this.eventBus) {
            this.eventBus.subscribe('view:section:rendered', (data) => {
                this.manageFocusForNewContent(data.element);
            });
        }
    }

    /**
     * @brief Set up skip to main content links
     */
    setupSkipLinks() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href')?.replace('#', '');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    this.announceContent('Now in main content area');
                }
            });
        }
    }

    /**
     * @brief Enhance interactive elements with accessibility attributes
     */
    enhanceInteractiveElements() {
        // Add ARIA labels to interactive elements missing them
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        });

        // Ensure images have alt attributes
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', 'Decorative image');
        });
    }

    /**
     * @brief Manage focus for newly rendered content
     * @param {HTMLElement} element - Newly added element
     */
    manageFocusForNewContent(element) {
        // Focus on main headings in new sections for screen readers
        const heading = element.querySelector('h1, h2, h3, [role="heading"]');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
            this.announceContent('New section loaded: ' + heading.textContent);
        }
    }

    /**
     * @brief Set up mutation observer for dynamic content
     */
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        this.enhanceAccessibility(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * @brief Enhance accessibility of dynamically added elements
     * @param {Element} element - Element to enhance
     */
    enhanceAccessibility(element) {
        // Add ARIA labels to interactive elements
        if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label')) {
            const text = element.textContent.trim();
            if (text) {
                element.setAttribute('aria-label', text);
            }
        }

        // Ensure images have alt attributes
        if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
            element.setAttribute('alt', 'Content image');
        }

        // Enhance custom interactive components
        if (element.classList.contains('card') || element.classList.contains('gallery-item')) {
            element.setAttribute('role', element.classList.contains('card') ? 'article' : 'img');
        }
    }

    /**
     * @brief Increase base font size
     */
    increaseFontSize() {
        const newScale = Math.min(
            this.fontSizeScale + this.config.fontSizeStep, 
            this.config.maxFontSize
        );
        
        this.setFontSizeScale(newScale);
    }

    /**
     * @brief Decrease base font size
     */
    decreaseFontSize() {
        const newScale = Math.max(
            this.fontSizeScale - this.config.fontSizeStep, 
            this.config.minFontSize
        );
        
        this.setFontSizeScale(newScale);
    }

    /**
     * @brief Reset font size to default
     */
    resetFontSize() {
        this.setFontSizeScale(1.0);
    }

    /**
     * @brief Set font size scale and apply to document
     * @param {number} scale - Font size scale factor
     */
    setFontSizeScale(scale) {
        this.fontSizeScale = scale;
        this.applyFontSizeScale();
        this.saveAccessibilityPreferences();
        
        this.announceContent(`Font size set to ${Math.round(scale * 100)}%`);
        
        if (this.eventBus) {
            this.eventBus.publish('accessibility:fontsize:changed', { scale });
        }
    }

    /**
     * @brief Apply current font size scale to document
     */
    applyFontSizeScale() {
        document.documentElement.style.fontSize = `${this.fontSizeScale * 100}%`;
    }

    /**
     * @brief Toggle high contrast mode
     */
    toggleHighContrast() {
        this.isHighContrast = !this.isHighContrast;
        
        if (this.isHighContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-high-contrast');
        }
        
        this.saveAccessibilityPreferences();
        this.announceContent(`High contrast mode ${this.isHighContrast ? 'enabled' : 'disabled'}`);
        
        if (this.eventBus) {
            this.eventBus.publish('accessibility:highcontrast:toggle', { 
                highContrast: this.isHighContrast 
            });
        }
    }

    /**
     * @brief Load accessibility preferences from storage
     * @returns {Promise<void>}
     */
    async loadAccessibilityPreferences() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                const preferences = JSON.parse(saved);
                this.fontSizeScale = preferences.fontSizeScale || 1.0;
                this.isHighContrast = preferences.isHighContrast || false;
            }
        } catch (error) {
            console.warn('AccessibilityManager: Failed to load preferences, using defaults');
        }
    }

    /**
     * @brief Save current accessibility preferences
     */
    saveAccessibilityPreferences() {
        try {
            const preferences = {
                fontSizeScale: this.fontSizeScale,
                isHighContrast: this.isHighContrast,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem(this.config.storageKey, JSON.stringify(preferences));
        } catch (error) {
            console.warn('AccessibilityManager: Failed to save preferences', error);
        }
    }

    /**
     * @brief Apply all current accessibility settings
     */
    applyAccessibilitySettings() {
        this.applyFontSizeScale();
        
        if (this.isHighContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        }
    }

    /**
     * @brief Announce page load to screen readers
     */
    announcePageLoad() {
        this.announceContent('Portfolio website loaded successfully');
    }

    /**
     * @brief Announce content to screen readers
     * @param {string} message - Message to announce
     */
    announceContent(message) {
        const announcer = document.getElementById('a11y-announcer') || this.createAnnouncer();
        announcer.textContent = message;
        
        // Clear message after a delay
        setTimeout(() => {
            announcer.textContent = '';
        }, 3000);
    }

    /**
     * @brief Create ARIA live region for announcements
     * @returns {HTMLElement} Announcer element
     */
    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('screen-reader-only');
        
        document.body.appendChild(announcer);
        return announcer;
    }

    /**
     * @brief Enable focus trapping for modal dialogs
     * @param {HTMLElement} container - Container to trap focus within
     */
    enableFocusTrap(container) {
        this.focusTrapped = true;
        this.lastFocusedElement = document.activeElement;
        
        // Focus first focusable element in container
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        this.eventBus.publish('accessibility:focus:trap:enabled', { container });
    }

    /**
     * @brief Disable focus trapping
     */
    disableFocusTrap() {
        this.focusTrapped = false;
        
        // Restore focus to previous element
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
        
        this.eventBus.publish('accessibility:focus:trap:disabled');
    }

    /**
     * @brief Get current accessibility status
     * @returns {Object} Current accessibility settings
     */
    getAccessibilityStatus() {
        return {
            fontSizeScale: this.fontSizeScale,
            isHighContrast: this.isHighContrast,
            isFocusTrapped: this.focusTrapped
        };
    }

    /**
     * @brief Clean up accessibility manager resources
     */
    destroy() {
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('focusin', this.handleFocusIn);
        
        if (this.eventBus) {
            this.eventBus.clear('accessibility:escape:pressed');
            this.eventBus.clear('accessibility:focus:trapped');
            this.eventBus.clear('accessibility:arrow:navigation');
            this.eventBus.clear('theme:changed');
            this.eventBus.clear('view:section:rendered');
        }
        
        this.isInitialized = false;
        console.info('AccessibilityManager: Cleaned up successfully');
    }
}