import eventBus from '../core/EventBus.js';

/**
 * @brief Accessibility manager service
 * @description Handles accessibility features, keyboard navigation, and font size adjustments
 */
export class AccessibilityManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.isInitialized = false;
        this.focusTrapped = false;
        this.currentFontSize = 100; // percentage
        this.minFontSize = 80;
        this.maxFontSize = 150;
        this.fontSizeStep = 10;

        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleEscapeKey = this.handleEscapeKey.bind(this);
        this.handleTabKey = this.handleTabKey.bind(this);
        this.handleActionKey = this.handleActionKey.bind(this);
    }

    /**
     * @brief Initialize accessibility manager
     */
    async init() {
        if (this.isInitialized) return;

        // Load saved font size preference
        const savedFontSize = localStorage.getItem('app-font-size');
        if (savedFontSize) {
            this.currentFontSize = parseInt(savedFontSize);
            this.applyFontSize();
        }

        this.setupEventListeners();
        this.setupFocusManagement();
        this.announcePageLoad();
        
        this.isInitialized = true;
        console.info('AccessibilityManager: Initialized with font size:', this.currentFontSize + '%');
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown);
        
        // Observe DOM changes for new interactive elements
        this.setupMutationObserver();
        
        // Listen for accessibility events
        this.eventBus.subscribe('accessibility:increaseFont', this.increaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:decreaseFont', this.decreaseFontSize.bind(this));
        this.eventBus.subscribe('accessibility:resetFont', this.resetFontSize.bind(this));
    }

    /**
     * @brief Handle keyboard events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeydown(event) {
        // Skip keyboard handling if user is typing in an input
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }

        // Check for Ctrl/Cmd + Plus/Minus for font size
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

        // Check for Ctrl/Cmd + 0 to reset font size
        if ((event.ctrlKey || event.metaKey) && event.key === '0') {
            event.preventDefault();
            this.resetFontSize();
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
        }
    }

    /**
     * @brief Handle escape key
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleEscapeKey(event) {
        // Close any open modals, menus, or navigation
        this.eventBus.publish('accessibility:escape', { event });
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.nav-menu.active');
        if (mobileMenu) {
            this.eventBus.publish('navigation:mobile:close');
        }
    }

    /**
     * @brief Handle tab key for focus trapping
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleTabKey(event) {
        if (!this.focusTrapped) return;

        // Get all focusable elements within the trapped container
        const focusableElements = this.getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If Shift + Tab on first element, move to last element
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } 
        // If Tab on last element, move to first element
        else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * @brief Get all focusable elements
     * @returns {Array} Array of focusable elements
     */
    getFocusableElements() {
        return Array.from(document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    }

    /**
     * @brief Handle action keys (Enter/Space)
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleActionKey(event) {
        const element = event.target;
        
        // Ensure buttons and links can be activated with space/enter
        if (element.tagName === 'BUTTON' || 
            (element.tagName === 'A' && element.getAttribute('href')) ||
            element.getAttribute('role') === 'button') {
            
            // Don't prevent default for links to allow normal navigation
            if (element.tagName !== 'A') {
                event.preventDefault();
            }
            
            element.click();
        }
    }

    /**
     * @brief Set up focus management
     */
    setupFocusManagement() {
        // Add skip link functionality
        this.setupSkipLinks();
        
        // Manage focus for dynamic content
        this.eventBus.subscribe('view:section:rendered', (data) => {
            setTimeout(() => {
                this.manageFocusForNewContent(data.element);
            }, 100);
        });

        // Manage focus for route changes
        this.eventBus.subscribe('router:navigated', (data) => {
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
     * @brief Set up skip links
     */
    setupSkipLinks() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href')?.replace('#', '');
                const target = document.getElementById(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    
                    // Announce to screen readers
                    this.announceContent(`Navigated to ${targetId.replace('-', ' ')}`);
                }
            });
        }
    }

    /**
     * @brief Manage focus for new content
     * @param {HTMLElement} element - Newly added element
     */
    manageFocusForNewContent(element) {
        // If the element is a heading or important content, focus it for screen readers
        const heading = element.querySelector('h1, h2, h3, [role="main"]');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
            
            // Announce to screen readers
            const headingText = heading.textContent || 'New content';
            this.announceContent(`${headingText} loaded`);
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
     * @brief Enhance accessibility of elements
     * @param {Element} element - Element to enhance
     */
    enhanceAccessibility(element) {
        // Add ARIA labels to interactive elements without text
        if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label')) {
            const text = element.textContent.trim();
            const icon = element.querySelector('i, svg, img');
            if (!text && icon) {
                // Button with only an icon
                const iconType = icon.tagName.toLowerCase();
                let label = 'Button';
                if (iconType === 'i' && icon.className.includes('fa-')) {
                    label = icon.className.replace('fa-', '').replace('fas', '').trim() + ' button';
                }
                element.setAttribute('aria-label', label);
            } else if (text) {
                element.setAttribute('aria-label', text);
            }
        }

        // Ensure images have alt attributes
        if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
            // Try to get alt from data attributes or generate from context
            const caption = element.closest('figure')?.querySelector('figcaption')?.textContent;
            const context = element.closest('[aria-label], [aria-labelledby]');
            const altText = caption || 
                          context?.getAttribute('aria-label') || 
                          'Decorative image';
            element.setAttribute('alt', altText);
        }

        // Add role to divs that act as buttons
        if (element.tagName === 'DIV' && 
            element.onclick && 
            !element.getAttribute('role') &&
            !element.querySelector('button, a')) {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
        }
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
            announcer = this.createAnnouncer();
        }
        
        // Clear previous message
        announcer.textContent = '';
        
        // Add new message with a slight delay for screen readers
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * @brief Create ARIA live region announcer
     * @returns {HTMLElement} Announcer element
     */
    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('sr-only');
        document.body.appendChild(announcer);
        return announcer;
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
        } else {
            this.announceContent('Maximum font size reached');
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
        } else {
            this.announceContent('Minimum font size reached');
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
        
        // Notify about font size change
        this.eventBus.publish('accessibility:fontSize:changed', { 
            size: this.currentFontSize 
        });
    }

    /**
     * @brief Enable focus trapping
     * @param {HTMLElement} container - Container to trap focus within
     */
    enableFocusTrap(container) {
        this.focusTrapped = true;
        this.trapContainer = container;
        
        // Store previously focused element
        this.previouslyFocused = document.activeElement;
        
        // Focus first element in container
        const focusableElements = this.getFocusableElements().filter(el => 
            container.contains(el)
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
        
        // Restore focus to previously focused element
        if (this.previouslyFocused && document.body.contains(this.previouslyFocused)) {
            this.previouslyFocused.focus();
        }
        
        this.eventBus.publish('accessibility:focus:trap:disabled');
    }

    /**
     * @brief Get current font size
     * @returns {number} Current font size percentage
     */
    getCurrentFontSize() {
        return this.currentFontSize;
    }

    /**
     * @brief Check if reduced motion is preferred
     * @returns {boolean} Reduced motion preference
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * @brief Check if high contrast is preferred
     * @returns {boolean} High contrast preference
     */
    prefersHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }

    /**
     * @brief Destroy accessibility manager
     */
    destroy() {
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Remove event bus subscriptions
        this.eventBus.unsubscribe('accessibility:increaseFont');
        this.eventBus.unsubscribe('accessibility:decreaseFont');
        this.eventBus.unsubscribe('accessibility:resetFont');
        this.eventBus.unsubscribe('view:section:rendered');
        this.eventBus.unsubscribe('router:navigated');
        
        this.isInitialized = false;
        console.info('AccessibilityManager: Destroyed');
    }
}