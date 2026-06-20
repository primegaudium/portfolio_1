// ========================================
// ACCESSIBILITY.JS — Harsh Raj Portfolio
// Accessibility enhancements and ARIA support
// ========================================

/**
 * Accessibility manager for the portfolio
 */
export class AccessibilityManager {
    constructor() {
        this.reducedMotion = this.checkReducedMotion();
        this.highContrast = this.checkHighContrast();
        this.setupListeners();
    }

    /**
     * Checks if user prefers reduced motion
     * @returns {boolean} True if reduced motion is preferred
     */
    checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Checks if user prefers high contrast
     * @returns {boolean} True if high contrast is preferred
     */
    checkHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }

    /**
     * Sets up media query listeners
     */
    setupListeners() {
        // Listen for reduced motion changes
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.applyMotionPreferences();
        });

        // Listen for contrast changes
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        contrastQuery.addEventListener('change', (e) => {
            this.highContrast = e.matches;
            this.applyContrastPreferences();
        });
    }

    /**
     * Applies motion preferences
     */
    applyMotionPreferences() {
        if (this.reducedMotion) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
            console.log('♿ Reduced motion enabled');
        } else {
            document.documentElement.style.removeProperty('--transition-fast');
            document.documentElement.style.removeProperty('--transition-base');
            document.documentElement.style.removeProperty('--transition-slow');
        }
    }

    /**
     * Applies contrast preferences
     */
    applyContrastPreferences() {
        if (this.highContrast) {
            document.body.classList.add('high-contrast');
            console.log('♿ High contrast mode enabled');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    /**
     * Announces message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
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
    }

    /**
     * Updates slide announcement for screen readers
     * @param {number} currentSlide - Current slide index
     * @param {number} totalSlides - Total number of slides
     * @param {string} slideTitle - Title of current slide
     */
    announceSlideChange(currentSlide, totalSlides, slideTitle) {
        const message = `Slide ${currentSlide + 1} of ${totalSlides}: ${slideTitle}`;
        this.announce(message, 'polite');
    }

    /**
     * Adds skip to content link
     */
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#sliderWrapper';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 100000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Enhances keyboard navigation
     */
    enhanceKeyboardNav() {
        // Add visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    /**
     * Adds ARIA labels to navigation
     */
    enhanceNavigation() {
        const navItems = document.querySelectorAll('.slide-nav-item');
        navItems.forEach((item, index) => {
            if (!item.getAttribute('aria-label')) {
                item.setAttribute('aria-label', `Go to slide ${index + 1}`);
            }
        });
    }

    /**
     * Validates color contrast
     * @param {string} foreground - Foreground color (hex)
     * @param {string} background - Background color (hex)
     * @returns {Object} Contrast ratio and WCAG compliance
     */
    checkContrast(foreground, background) {
        const getLuminance = (hex) => {
            const rgb = parseInt(hex.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;
            
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const l1 = getLuminance(foreground);
        const l2 = getLuminance(background);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

        return {
            ratio: ratio.toFixed(2),
            wcagAA: ratio >= 4.5,
            wcagAAA: ratio >= 7,
            wcagAALarge: ratio >= 3,
            wcagAAALarge: ratio >= 4.5
        };
    }

    /**
     * Initializes all accessibility features
     */
    initialize() {
        this.applyMotionPreferences();
        this.applyContrastPreferences();
        this.addSkipLink();
        this.enhanceKeyboardNav();
        console.log('♿ Accessibility features initialized');
    }
}

/**
 * Focus trap utility for modals/overlays
 */
export class FocusTrap {
    constructor(element) {
        this.element = element;
        this.focusableElements = null;
        this.firstFocusable = null;
        this.lastFocusable = null;
    }

    /**
     * Activates the focus trap
     */
    activate() {
        this.focusableElements = this.element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), ' +
            'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (this.focusableElements.length === 0) return;

        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

        this.element.addEventListener('keydown', this.handleKeyDown);
        this.firstFocusable.focus();
    }

    /**
     * Deactivates the focus trap
     */
    deactivate() {
        this.element.removeEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Handles keyboard navigation within trap
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }
}

// Export singleton instance
export const accessibilityManager = new AccessibilityManager();
