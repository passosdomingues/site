/**
 * @file UserModel.js
 * @brief Model responsible for managing user-specific data
 * @description Consumes data from UserData.js to provide personal information
 */

import eventBus from '../core/EventBus.js';
import { USER_DATA } from '../data/UserData.js';

/**
 * @class UserModel
 * @brief Manages user's personal and contact data
 */
class UserModel {
    /**
     * @brief Constructs UserModel instance
     * @param {Object} config - Configuration object
     * @param {Object} config.eventBus - Event bus instance
     */
    constructor(config = {}) {
        this.eventBus = config.eventBus || eventBus;
        this.userData = {};
        this.isInitialized = false;
    }

    /**
     * @brief Initialize model by loading user data
     * @async
     * @returns {Promise<void>}
     */
    async init() {
        if (this.isInitialized) {
            console.warn('UserModel: Already initialized.');
            return;
        }
        
        console.info('UserModel: Initializing with user data...');
        this.userData = USER_DATA;
        this.isInitialized = true;
        this.eventBus.publish('user:loaded', { userName: this.userData.personalInfo.name });
        console.info('UserModel: Initialization complete.');
    }

    /**
     * @brief Get full user data object
     * @returns {Object} Complete user data
     */
    getUserData() {
        return this.userData;
    }

    /**
     * @brief Get user's personal information
     * @returns {Object} Personal info including name and title
     */
    getPersonalInfo() {
        return this.userData.personalInfo || {};
    }

    /**
     * @brief Get user's contact information
     * @returns {Object} Contact details including email and phone
     */
    getContactInfo() {
        return this.userData.contact || {};
    }

    /**
     * @brief Get user's social links
     * @returns {Object} Social media links
     */
    getSocialLinks() {
        return this.userData.socialLinks || {};
    }
}

export { UserModel };