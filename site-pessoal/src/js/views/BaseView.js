import { eventBus } from '../core/EventBus.js';

/**
 * @brief Base view class for all views
 * @description Provides common functionality and lifecycle methods for views
 */
export class BaseView {
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
     * @description Called before first render, sets up initial state
     */
    async init() {
        if (this.isDestroyed) {
            throw new Error('BaseView: Cannot initialize destroyed view');
        }
        
        console.info(`BaseView: Initializing ${this.constructor.name}`);
    }

    /**
     * @brief Render the view
     * @description Main render method to be implemented by subclasses
     * @returns {Promise<void>}
     */
    async render() {
        if (this.isDestroyed) {
            throw new Error('BaseView: Cannot render destroyed view');
        }
        
        this.isRendered = true;
        console.info(`BaseView: Rendered ${this.constructor.name}`);
    }

    /**
     * @brief Update the view
     * @description Updates view with new data
     * @param {Object} data - Update data
     * @returns {Promise<void>}
     */
    async update(data) {
        if (!this.isRendered || this.isDestroyed) {
            console.warn(`BaseView: Cannot update ${this.constructor.name} - not rendered or destroyed`);
            return;
        }
        
        console.info(`BaseView: Updated ${this.constructor.name}`, data);
    }

    /**
     * @brief Register DOM element
     * @param {string} key - Element identifier
     * @param {HTMLElement} element - DOM element
     */
    registerElement(key, element) {
        this.elements.set(key, element);
    }

    /**
     * @brief Get registered element
     * @param {string} key - Element identifier
     * @returns {HTMLElement|undefined} Registered element
     */
    getElement(key) {
        return this.elements.get(key);
    }

    /**
     * @brief Add event listener to element
     * @param {HTMLElement|string} element - Element or element key
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event listener options
     */
    addEventListener(element, event, handler, options = {}) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (!actualElement) {
            console.warn(`BaseView: Element not found for event listener: ${element}`);
            return;
        }
        
        actualElement.addEventListener(event, handler, options);
        
        // Store for cleanup
        const handlerKey = `${typeof element === 'string' ? element : 'direct'}_${event}`;
        if (!this.eventHandlers.has(handlerKey)) {
            this.eventHandlers.set(handlerKey, []);
        }
        this.eventHandlers.get(handlerKey).push({ element: actualElement, handler, options });
    }

    /**
     * @brief Remove event listener
     * @param {HTMLElement|string} element - Element or element key
     * @param {string} event - Event type
     * @param {Function} handler - Event handler to remove
     */
    removeEventListener(element, event, handler) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (!actualElement) {
            return;
        }
        
        actualElement.removeEventListener(event, handler);
    }

    /**
     * @brief Show the view
     * @description Makes the view visible
     */
    show() {
        if (this.container) {
            this.container.style.display = '';
            this.container.style.visibility = 'visible';
        }
        
        this.eventBus.publish('view:shown', { view: this.constructor.name });
    }

    /**
     * @brief Hide the view
     * @description Hides the view
     */
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        
        this.eventBus.publish('view:hidden', { view: this.constructor.name });
    }

    /**
     * @brief Create DOM element with attributes
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string} textContent - Text content
     * @returns {HTMLElement} Created element
     */
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        // Set attributes
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
        
        // Set text content
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * @brief Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * @brief Add CSS class to element
     * @param {HTMLElement|string} element - Element or element key
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
     * @param {HTMLElement|string} element - Element or element key
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
     * @param {HTMLElement|string} element - Element or element key
     * @param {string} className - CSS class to toggle
     */
    toggleClass(element, className) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (actualElement) {
            actualElement.classList.toggle(className);
        }
    }

    /**
     * @brief Set element text content
     * @param {HTMLElement|string} element - Element or element key
     * @param {string} text - Text content
     */
    setText(element, text) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (actualElement) {
            actualElement.textContent = this.escapeHtml(text);
        }
    }

    /**
     * @brief Set element HTML content
     * @param {HTMLElement|string} element - Element or element key
     * @param {string} html - HTML content
     */
    setHTML(element, html) {
        const actualElement = typeof element === 'string' ? this.getElement(element) : element;
        
        if (actualElement) {
            actualElement.innerHTML = html;
        }
    }

    /**
     * @brief Destroy the view
     * @description Cleans up event listeners and references
     */
    destroy() {
        // Remove all event listeners
        this.eventHandlers.forEach((handlers, key) => {
            handlers.forEach(({ element, handler, options }) => {
                element.removeEventListener(key.split('_')[1], handler, options);
            });
        });
        
        this.eventHandlers.clear();
        this.elements.clear();
        
        this.isRendered = false;
        this.isDestroyed = true;
        
        console.info(`BaseView: Destroyed ${this.constructor.name}`);
    }
}