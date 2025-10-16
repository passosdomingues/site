import eventBus from '../core/EventBus.js';

/**
 * @brief Accessibility manager service
 * @description Handles accessibility features and keyboard navigation
 */
export class AccessibilityManager {
    constructor(dependencies = {}) {
        this.eventBus = dependencies.eventBus || eventBus;
        this.isInitialized = false;
        this.focusTrapped = false;
        this.focusableElements = [];
        this.currentFocusIndex = 0;
        this.announce = this.announce.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleFocusIn = this.handleFocusIn.bind(this);
        
        // Configuração padrão para elementos focáveis
        this.focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
            'details',
            'details summary'
        ];
    }

    /**
     * @brief Initialize accessibility manager
     */
    async init() {
        if (this.isInitialized) return;

        this.setupEventListeners();
        this.setupFocusManagement();
        this.createAnnouncer();
        this.announcePageLoad();
        this.setupSkipLinks();
        
        this.isInitialized = true;
        console.info('AccessibilityManager: Initialized');
    }

    /**
     * @brief Set up event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeydown);
        document.addEventListener('focusin', this.handleFocusIn);
        
        this.eventBus.subscribe('accessibility:announce', this.announce);
        this.eventBus.subscribe('accessibility:trapFocus', this.trapFocus.bind(this));
        this.eventBus.subscribe('accessibility:releaseFocus', this.releaseFocus.bind(this));
        this.eventBus.subscribe('accessibility:focusElement', this.focusElement.bind(this));

        this.setupMutationObserver();
    }

    /**
     * @brief Set up MutationObserver to watch for DOM changes
     */
    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            let shouldUpdateFocusable = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (this.isFocusable(node) || node.querySelector(this.focusableSelectors.join(','))) {
                                shouldUpdateFocusable = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdateFocusable) {
                this.updateFocusableElements();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * @brief Set up focus management
     */
    setupFocusManagement() {
        this.updateFocusableElements();
        
        // Garante que o foco seja visível para usuários de teclado
        const style = document.createElement('style');
        style.textContent = `
            :focus {
                outline: 2px solid #4A90E2 !important;
                outline-offset: 2px !important;
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * @brief Set up skip links for keyboard navigation
     */
    setupSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        
        const mainSkipLink = document.createElement('a');
        mainSkipLink.href = '#main-content';
        mainSkipLink.className = 'skip-link sr-only';
        mainSkipLink.textContent = 'Skip to main content';
        mainSkipLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.focusElement('#main-content');
        });

        skipLinks.appendChild(mainSkipLink);
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    /**
     * @brief Handle focus in events
     * @param {FocusEvent} event - Focus event
     */
    handleFocusIn(event) {
        // Atualiza elementos focáveis quando o foco muda
        this.updateFocusableElements();
        
        // Publica evento de mudança de foco
        this.eventBus.publish('accessibility:focusChanged', {
            element: event.target,
            previousElement: event.relatedTarget
        });
    }

    /**
     * @brief Handle keyboard events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeydown(event) {
        // Ignora eventos em inputs e textareas, exceto Escape
        if ((event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') && event.key !== 'Escape') {
            return;
        }

        switch (event.key) {
            case 'Escape':
                this.handleEscape(event);
                break;
            case 'Tab':
                this.handleTab(event);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.handleArrowKeys(event);
                break;
            case 'Enter':
            case ' ':
                this.handleActionKeys(event);
                break;
        }
    }

    /**
     * @brief Handle Escape key
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleEscape(event) {
        this.eventBus.publish('accessibility:escape', event);
        
        // Fecha modais ou menus abertos
        const activeModals = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
        if (activeModals.length > 0) {
            const lastModal = activeModals[activeModals.length - 1];
            this.eventBus.publish('modal:close', { element: lastModal });
        }
    }

    /**
     * @brief Handle Tab key for focus trapping
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleTab(event) {
        if (!this.focusTrapped || this.focusableElements.length === 0) {
            this.eventBus.publish('accessibility:tab', event);
            return;
        }

        event.preventDefault();

        if (event.shiftKey) {
            this.currentFocusIndex--;
            if (this.currentFocusIndex < 0) {
                this.currentFocusIndex = this.focusableElements.length - 1;
            }
        } else {
            this.currentFocusIndex++;
            if (this.currentFocusIndex >= this.focusableElements.length) {
                this.currentFocusIndex = 0;
            }
        }

        this.focusableElements[this.currentFocusIndex]?.focus();
    }

    /**
     * @brief Handle arrow keys for navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleArrowKeys(event) {
        const target = event.target;
        const role = target.getAttribute('role');
        
        // Navegação em menus, radiogroups, etc.
        if (role === 'menuitem' || role === 'tab' || role === 'radio') {
            event.preventDefault();
            this.eventBus.publish('accessibility:arrowNavigation', {
                event,
                direction: event.key,
                element: target,
                role
            });
        }
    }

    /**
     * @brief Handle Enter and Space keys
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleActionKeys(event) {
        const target = event.target;
        const role = target.getAttribute('role');
        
        if (role === 'button' || target.tagName === 'BUTTON') {
            event.preventDefault();
            target.click();
        }
    }

    /**
     * @brief Update list of focusable elements
     */
    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll(this.focusableSelectors.join(',')))
            .filter(element => {
                return element.offsetWidth > 0 && 
                       element.offsetHeight > 0 && 
                       !element.hasAttribute('disabled') &&
                       getComputedStyle(element).visibility !== 'hidden';
            });
        
        // Ordena por tabindex
        this.focusableElements.sort((a, b) => {
            const aIndex = parseInt(a.getAttribute('tabindex') || '0');
            const bIndex = parseInt(b.getAttribute('tabindex') || '0');
            return aIndex - bIndex;
        });
    }

    /**
     * @brief Check if element is focusable
     * @param {Element} element - Element to check
     * @returns {boolean} True if focusable
     */
    isFocusable(element) {
        return this.focusableElements.includes(element) ||
               element.matches(this.focusableSelectors.join(','));
    }

    /**
     * @brief Trap focus within a specific element
     * @param {HTMLElement} container - Container element to trap focus in
     */
    trapFocus(container) {
        this.focusTrapped = true;
        this.trapContainer = container;
        
        // Atualiza elementos focáveis apenas dentro do container
        this.focusableElements = Array.from(container.querySelectorAll(this.focusableSelectors.join(',')))
            .filter(element => {
                return element.offsetWidth > 0 && 
                       element.offsetHeight > 0 && 
                       !element.hasAttribute('disabled');
            });
        
        this.currentFocusIndex = 0;
        
        // Foca no primeiro elemento
        if (this.focusableElements.length > 0) {
            this.focusableElements[0].focus();
        }
    }

    /**
     * @brief Release focus trap
     */
    releaseFocus() {
        this.focusTrapped = false;
        this.trapContainer = null;
        this.updateFocusableElements();
    }

    /**
     * @brief Focus on specific element
     * @param {string|HTMLElement} element - Element to focus (selector or element)
     */
    focusElement(element) {
        let target;
        
        if (typeof element === 'string') {
            target = document.querySelector(element);
        } else {
            target = element;
        }
        
        if (target && typeof target.focus === 'function') {
            target.focus();
            
            // Scroll para o elemento se necessário
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * @brief Announce a message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Priority: 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        let announcer = document.getElementById('a11y-announcer');
        if (!announcer) {
            announcer = this.createAnnouncer();
        }
        
        announcer.setAttribute('aria-live', priority);
        
        // Clear previous message
        announcer.textContent = '';
        
        // Use setTimeout to ensure the clear happens and the new message is announced
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
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        return announcer;
    }

    /**
     * @brief Announce page load
     */
    announcePageLoad() {
        const pageTitle = document.title || 'Page';
        this.announce(`${pageTitle} loaded successfully.`);
    }

    /**
     * @brief Set ARIA attributes on element
     * @param {HTMLElement} element - Target element
     * @param {Object} attributes - ARIA attributes to set
     */
    setAriaAttributes(element, attributes) {
        Object.keys(attributes).forEach(key => {
            if (attributes[key] === null || attributes[key] === false) {
                element.removeAttribute(key);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
    }

    /**
     * @brief Toggle ARIA expanded state
     * @param {HTMLElement} element - Target element
     * @param {boolean} isExpanded - Expanded state
     */
    toggleExpanded(element, isExpanded) {
        this.setAriaAttributes(element, {
            'aria-expanded': isExpanded
        });
    }

    /**
     * @brief Destroy accessibility manager
     */
    destroy() {
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('focusin', this.handleFocusIn);
        
        this.eventBus.unsubscribe('accessibility:announce', this.announce);
        this.eventBus.unsubscribe('accessibility:trapFocus', this.trapFocus);
        this.eventBus.unsubscribe('accessibility:releaseFocus', this.releaseFocus);
        this.eventBus.unsubscribe('accessibility:focusElement', this.focusElement);
        
        this.eventBus.clear('accessibility:escape');
        this.eventBus.clear('accessibility:tab');
        this.eventBus.clear('accessibility:arrowNavigation');
        this.eventBus.clear('accessibility:focusChanged');
        
        if (this.observer) {
            this.observer.disconnect();
        }

        const announcer = document.getElementById('a11y-announcer');
        if (announcer) {
            announcer.remove();
        }

        const skipLinks = document.querySelector('.skip-links');
        if (skipLinks) {
            skipLinks.remove();
        }

        this.isInitialized = false;
        console.info('AccessibilityManager: Destroyed');
    }
}

export { AccessibilityManager };