// ========================================
// UTILS.JS — Harsh Raj Portfolio
// Utility functions for performance and
// accessibility improvements
// ========================================

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttles a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Checks if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safely parses an integer with fallback
 * @param {string} value - Value to parse
 * @param {number} fallback - Fallback value
 * @returns {number} Parsed integer or fallback
 */
export const safeParseInt = (value, fallback = 0) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
};

/**
 * Clamps a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Announces text to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'u-sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

/**
 * Checks if an element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * Lazy loads an image
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
export const lazyLoadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Gets a safe element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
export const getSafeElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id "${id}" not found`);
    }
    return element;
};

/**
 * Formats a number with leading zeros
 * @param {number} num - Number to format
 * @param {number} length - Desired length
 * @returns {string} Formatted number string
 */
export const padNumber = (num, length = 2) => {
    return String(num).padStart(length, '0');
};
