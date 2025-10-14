/**
 * @file Base view class for all views
 * @brief Provides common functionality and lifecycle methods for views
 */

import eventBus from '../core/EventBus.js';

/**
 * @class BaseView
 * @brief Abstract base class providing common view functionality
 */
export class BaseView {
    /**
     * @brief Constructs BaseView instance
     * @param {Object} config - Configuration object
     * @param {HTMLElement} config.container - Main DOM container for the view
     * @param {Object} config.eventBus - Event bus instance for communication
     */
    constructor(config = {}) {
        this.container = config.container;
        this.eventBus = config.eventBus || eventBus;
        this.isRendered = false;
        this.isDestroyed = false;
        
        this.elements = new Map();
        this.eventHandlers = new Map();
    }

    /**
     * @brief Initialize the view
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isDestroyed) {
            throw new Error('BaseView: Cannot initialize a destroyed view.');
        }
        
        console.info(`BaseView: Initializing ${this.constructor.name}`);
    }

    /**
     * @brief Render the view (to be implemented by subclasses)
     * @async
     * @returns {Promise<void>}
     */
    async render() {
        if (this.isDestroyed) {
            throw new Error('BaseView: Cannot render a destroyed view.');
        }
        
        this.isRendered = true;
        console.info(`BaseView: Rendered ${this.constructor.name}`);
    }

    /**
     * @brief Update the view with new data
     * @async
     * @param {Object} data - Data for the update
     * @returns {Promise<void>}
     */
    async update(data) {
        if (!this.isRendered || this.isDestroyed) {
            console.warn(`BaseView: Cannot update ${this.constructor.name} - not rendered or is destroyed.`);
            return;
        }
        
        console.info(`BaseView: Updated ${this.constructor.name}`, data);
    }

    /**
     * @brief Register DOM element for easy access
     * @param {string} key - Identifier for the element
     * @param {HTMLElement} element - DOM element to register
     */
    registerElement(key, element) {
        this.elements.set(key, element);
    }

    /**
     * @brief Get registered DOM element
     * @param {string} key - Identifier for the element
     * @returns {HTMLElement|undefined} Registered element or undefined if not found
     */
    getElement(key) {
        return this.elements.get(key);
    }

    /**
     * @brief Add event listener to element and track for cleanup
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} event - Event type (e.g., 'click')
     * @param {Function} handler - Event handler function
     * @param {Object} options - Event listener options
     */
    addEventListener(element, event, handler, options = {}) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (!actualElement) {
            console.warn(`BaseView: Element not found for event listener: ${element}`);
            return;
        }
        
        actualElement.addEventListener(event, handler, options);
        
        const handlerKey = `${typeof element === 'string' ? element : 'direct'}_${event}`;
        if (!this.eventHandlers.has(handlerKey)) {
            this.eventHandlers.set(handlerKey, []);
        }
        this.eventHandlers.get(handlerKey).push({ element: actualElement, handler, options });
    }

    /**
     * @brief Remove specific event listener from element
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} event - Event type
     * @param {Function} handler - Handler function to remove
     */
    removeEventListener(element, event, handler) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (actualElement) {
            actualElement.removeEventListener(event, handler);
        }
    }

    /**
     * @brief Show the view by making container visible
     */
    show() {
        if (this.container) {
            this.container.style.display = '';
            this.container.style.visibility = 'visible';
        }
        
        this.eventBus.publish('view:shown', { view: this.constructor.name });
    }

    /**
     * @brief Hide the view by hiding container
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        
        this.eventBus.publish('view:hidden', { view: this.constructor.name });
    }

    /**
     * @brief Create DOM element with specified attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string} textContent - Text content for the element
     * @returns {HTMLElement} Created DOM element
     */
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * @brief Escape HTML to prevent XSS vulnerabilities
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML string
     */
    escapeHtml(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * @brief Add CSS class to element
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} className - CSS class to add
     */
    addClass(element, className) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        if (actualElement) {
            actualElement.classList.add(className);
        }
    }

    /**
     * @brief Remove CSS class from element
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} className - CSS class to remove
     */
    removeClass(element, className) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        if (actualElement) {
            actualElement.classList.remove(className);
        }
    }

    /**
     * @brief Toggle CSS class on element
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} className - CSS class to toggle
     */
    toggleClass(element, className) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        if (actualElement) {
            actualElement.classList.toggle(className);
        }
    }

    /**
     * @brief Set text content of element safely
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} text - Text content to set
     */
    setText(element, text) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        if (actualElement) {
            actualElement.textContent = text;
        }
    }

    /**
     * @brief Set inner HTML of element (use with caution)
     * @param {HTMLElement|string} element - Element or its registered key
     * @param {string} html - HTML string to set
     */
    setHTML(element, html) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        if (actualElement) {
            actualElement.innerHTML = html;
        }
    }

    /**
     * @brief Destroy view and clean up resources
     */
    destroy() {
        if (this.isDestroyed) return;

        this.eventHandlers.forEach((handlers) => {
            handlers.forEach(({ element, handler, options }) => {
                const eventName = [...element.getAttributeNames()].find(attr => attr.startsWith('on'))?.substring(2);
                if (eventName) {
                    element.removeEventListener(eventName, handler, options);
                }
            });
        });
        
        this.eventHandlers.clear();
        this.elements.clear();
        
        this.isRendered = false;
        this.isDestroyed = true;
        
        console.info(`BaseView: Destroyed ${this.constructor.name}`);
    }
}