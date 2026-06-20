// ========================================
// EVENTS.JS — Harsh Raj Portfolio
// All event listeners in one place.
// Verbatim behaviour from licensed source.
// ========================================

import { handleResize } from "./renderer.js";
import { quickResetProgress } from "./navigation.js";
import {
    navigateNext,
    navigatePrev,
    navigateTo,
    handleSlideChange,
    stopAutoSlideTimer,
    safeStartTimer,
    sliderEnabled,
    isTransitioning,
    currentSlideIndex,
    handleTouchStart,
    handleTouchEnd
} from "./transitions.js";

// Track if events have been bound to prevent double-binding
let eventsBound = false;

// ────────────────────────────────────────
// CLICK — advance slide (ignore nav bar
// and overlay interactive elements)
// ────────────────────────────────────────
export const bindClick = () => {
    document.addEventListener("click", (e) => {
        // Let the nav bar handle its own clicks
        if (e.target.closest(".slides-navigation")) return;

        // CTA buttons inside overlays — navigate to target slide
        const ctaBtn = e.target.closest("[data-slide-target]");
        if (ctaBtn) {
            const target = parseInt(ctaBtn.dataset.slideTarget, 10);
            if (!isNaN(target)) {
                navigateTo(target);
            }
            return;
        }

        // Links inside overlays — let them open normally
        if (e.target.closest("a")) return;

        // Anywhere else on the canvas area — next slide
        if (!isTransitioning && sliderEnabled) {
            stopAutoSlideTimer();
            quickResetProgress(currentSlideIndex);
            handleSlideChange();
        }
    });
};

// ────────────────────────────────────────
// NAV BAR — individual item clicks
// ────────────────────────────────────────
export const bindNavClicks = () => {
    // Nav items are created dynamically by navigation.js,
    // so we use event delegation on the container.
    const navContainer = document.getElementById("slidesNav");
    if (!navContainer) return;

    navContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest(".slide-nav-item");
        if (!item) return;

        const targetIndex = parseInt(item.dataset.slideIndex, 10);
        if (!isNaN(targetIndex) && !isTransitioning && sliderEnabled) {
            navigateTo(targetIndex);
        }
    });
};

// ────────────────────────────────────────
// KEYBOARD
// ────────────────────────────────────────
export const bindKeyboard = () => {
    document.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "Space":
            case "ArrowRight":
                e.preventDefault();
                navigateNext();
                break;

            case "ArrowLeft":
                e.preventDefault();
                navigatePrev();
                break;

            case "KeyH":
                e.preventDefault();
                console.log("⚠️ Visual effects controls are disabled");
                break;

            default:
                break;
        }
    });
};

// ────────────────────────────────────────
// TOUCH — swipe support
// ────────────────────────────────────────
export const bindTouch = () => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
};

// ────────────────────────────────────────
// RESIZE
// ────────────────────────────────────────
export const bindResize = () => {
    window.addEventListener("resize", handleResize);
};

// ────────────────────────────────────────
// VISIBILITY — pause/resume on tab switch
// ────────────────────────────────────────
export const bindVisibility = () => {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoSlideTimer();
        } else if (sliderEnabled && !isTransitioning) {
            safeStartTimer();
        }
    });
};

// ────────────────────────────────────────
// BIND ALL — called once from main.js
// ────────────────────────────────────────
export const bindAllEvents = () => {
    if (eventsBound) {
        console.warn("Events already bound, skipping");
        return;
    }
    
    try {
        bindClick();
        bindNavClicks();
        bindKeyboard();
        bindTouch();
        bindResize();
        bindVisibility();
        eventsBound = true;
        console.log("✅ All events bound successfully");
    } catch (error) {
        console.error("❌ Error binding events:", error);
    }
};