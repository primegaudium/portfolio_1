// ========================================
// EVENTS.JS — Harsh Raj Portfolio
// All event listeners in one place.
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

// ── Pointer capability ──
// A "fine" pointer (mouse/trackpad) means PC-style click zones apply.
// Touch/coarse-pointer devices keep tap-to-advance + swipe.
const _hasFinePointer = () =>
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

// Fraction of the viewport width treated as the "previous" zone (left side).
const PREV_ZONE_RATIO = 0.35;

// ────────────────────────────────────────
// Shared advance logic — used by both
// the wrapper listener and canvas fallback
// ────────────────────────────────────────
const _tryAdvance = () => {
    if (!isTransitioning && sliderEnabled) {
        stopAutoSlideTimer();
        quickResetProgress(currentSlideIndex);
        handleSlideChange();
    }
};

// On PC: left zone → previous slide, right zone → next slide.
const _clickNavigate = (clientX) => {
    if (isTransitioning || !sliderEnabled) return;

    if (clientX < window.innerWidth * PREV_ZONE_RATIO) {
        navigatePrev();
    } else {
        navigateNext();
    }
};

// ────────────────────────────────────────
// CLICK — wrapper listener (catches all
// overlay and canvas clicks in one place)
// ────────────────────────────────────────
export const bindClick = () => {
    const wrapper = document.getElementById("sliderWrapper");
    if (!wrapper) return;

    wrapper.addEventListener("click", (e) => {
        // ── Nav bar handles itself ──
        if (e.target.closest(".slides-navigation")) return;

        // ── CTA buttons → navigate to target slide ──
        const ctaBtn = e.target.closest("[data-slide-target]");
        if (ctaBtn) {
            const target = parseInt(ctaBtn.dataset.slideTarget, 10);
            navigateTo(target);
            return;
        }

        // ── Real links (<a href="...">) → follow the link, don't advance ──
        const link = e.target.closest("a[href]");
        if (link) return;

        // ── PC: click left/right half to go prev/next.
        //    Touch: keep simple tap-to-advance. ──
        if (_hasFinePointer()) {
            _clickNavigate(e.clientX);
        } else {
            _tryAdvance();
        }

    });

    // ── Canvas fallback: some overlay regions have pointer-events:none
    //    (e.g. .projects-left "Things I've Built" text), letting clicks
    //    fall through to the canvas. Catch them here too. ──
    const canvas = document.querySelector(".webgl-canvas");
    if (canvas) {
        canvas.addEventListener("click", (e) => {
            if (_hasFinePointer()) _clickNavigate(e.clientX);
            else _tryAdvance();
        });
    }
};

// ────────────────────────────────────────
// NAV BAR — individual item clicks
// ────────────────────────────────────────
export const bindNavClicks = () => {
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
                _togglePane();
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
// TWEAKPANE TOGGLE
// ────────────────────────────────────────
const _togglePane = () => {
    const paneEl = document.querySelector(".tp-dfwv");
    if (!paneEl) return;
    paneEl.style.display = paneEl.style.display === "none" ? "block" : "none";
};

// ────────────────────────────────────────
// BIND ALL — called once from main.js
// ────────────────────────────────────────
export const bindAllEvents = () => {
    bindClick();
    bindNavClicks();
    bindKeyboard();
    bindTouch();
    bindResize();
    bindVisibility();
};