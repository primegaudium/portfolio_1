// ========================================
// TRANSITIONS.JS — Harsh Raj Portfolio
// GSAP-powered slide transitions, auto-slide
// timer, and core navigation logic.
// ========================================

import { SLIDER_CONFIG } from "./slider-config.js";
import { slidesMeta } from "./slides-data.js";
import { shaderMaterial, slideTextures, texturesLoaded, getEffectIndex } from "./renderer.js";
import {
    updateCounter,
    updateNavigationState,
    updateSlideProgress,
    fadeSlideProgress,
    quickResetProgress,
    activateOverlay
} from "./navigation.js";

// ── Import liquid bg sync (lazy import avoids circular deps) ──
let _syncLiquidBg = null;
const getSyncFn = async () => {
    if (!_syncLiquidBg) {
        const mod = await import("./main.js");
        _syncLiquidBg = mod.syncLiquidBg;
    }
    return _syncLiquidBg;
};

// ────────────────────────────────────────
// STATE
// ────────────────────────────────────────
export let currentSlideIndex = 0;
export let isTransitioning = false;
export let sliderEnabled = false;

let progressAnimation = null;
let autoSlideTimer = null;

// ────────────────────────────────────────
// CONSTANTS (dynamic — read from config)
// ────────────────────────────────────────
const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;
const PROGRESS_UPDATE_MS = 50;

// ────────────────────────────────────────
// ENABLE / DISABLE
// ────────────────────────────────────────
export const enableSlider = () => {
    sliderEnabled = true;
};

export const disableSlider = () => {
    sliderEnabled = false;
    stopAutoSlideTimer();
};

// ────────────────────────────────────────
// TIMER
// ────────────────────────────────────────
export const startAutoSlideTimer = () => {
    if (!texturesLoaded || !sliderEnabled || slideTextures.length < 2) return;
    stopAutoSlideTimer();

    let progress = 0;
    const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_MS;

    progressAnimation = setInterval(() => {
        if (!sliderEnabled) {
            stopAutoSlideTimer();
            return;
        }

        progress += increment;
        updateSlideProgress(currentSlideIndex, progress);

        if (progress >= 100) {
            clearInterval(progressAnimation);
            progressAnimation = null;
            fadeSlideProgress(currentSlideIndex);
            if (!isTransitioning) handleSlideChange();
        }
    }, PROGRESS_UPDATE_MS);
};

export const stopAutoSlideTimer = () => {
    if (progressAnimation) {
        clearInterval(progressAnimation);
        progressAnimation = null;
    }
    if (autoSlideTimer) {
        clearTimeout(autoSlideTimer);
        autoSlideTimer = null;
    }
};

export const safeStartTimer = (delay = 0) => {
    stopAutoSlideTimer();
    if (!sliderEnabled || !texturesLoaded) return;

    if (delay > 0) {
        autoSlideTimer = setTimeout(() => {
            if (sliderEnabled) startAutoSlideTimer();
        }, delay);
    } else {
        startAutoSlideTimer();
    }
};

// ────────────────────────────────────────
// CORE NAVIGATION
// ────────────────────────────────────────
// ── In transitions.js, replace the navigateToSlide function ──
// The only change is in the texture null-check:
// Previously it returned early if either texture was falsy.
// Now: slideTextures is always pre-filled with placeholders,
// so the check just needs to confirm the array has entries.

// ── In transitions.js, replace the navigateToSlide function ──
// The only change is in the texture null-check:
// Previously it returned early if either texture was falsy.
// Now: slideTextures is always pre-filled with placeholders,
// so the check just needs to confirm the array has entries.

export const navigateToSlide = (targetIndex) => {
    if (isTransitioning || targetIndex === currentSlideIndex) return;

    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);

    // slideTextures is now always pre-filled with placeholders,
    // so this check is safe even during background loading.
    const currentTexture = slideTextures[currentSlideIndex];
    const targetTexture = slideTextures[targetIndex];
    if (!currentTexture || !targetTexture) return;

    isTransitioning = true;

    // Wire shader textures
    shaderMaterial.uniforms.uTexture1.value = currentTexture;
    shaderMaterial.uniforms.uTexture2.value = targetTexture;
    shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
    shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

    // Update UI immediately
    currentSlideIndex = targetIndex;
    updateCounter(currentSlideIndex);
    updateNavigationState(currentSlideIndex);
    activateOverlay(currentSlideIndex);

    // Sync liquid background
    getSyncFn().then((fn) => fn && fn(currentSlideIndex));

    // Settle textures + reset state after the transition completes.
    const finishTransition = () => {
        shaderMaterial.uniforms.uProgress.value = 0;
        shaderMaterial.uniforms.uTexture1.value = slideTextures[targetIndex];
        shaderMaterial.uniforms.uTexture1Size.value = slideTextures[targetIndex].userData.size;
        isTransitioning = false;
        safeStartTimer(100);
    };

    // GSAP transition — guarded so a failed CDN load (no global `gsap`)
    // or reduced-motion preference does not break navigation.
    const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof gsap === "undefined" || reduceMotion) {
        shaderMaterial.uniforms.uProgress.value = 1;
        finishTransition();
        return;
    }

    gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
            value: 1,
            duration: TRANSITION_DURATION(),
            ease: "power2.inOut",
            onComplete: finishTransition
        }
    );
};

export const handleSlideChange = () => {
    if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
    const nextIndex = (currentSlideIndex + 1) % slidesMeta.length;
    navigateToSlide(nextIndex);
};

export const navigatePrev = () => {
    if (isTransitioning || !sliderEnabled) return;
    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);
    const prevIndex = (currentSlideIndex - 1 + slidesMeta.length) % slidesMeta.length;
    navigateToSlide(prevIndex);
};

export const navigateNext = () => {
    if (isTransitioning || !sliderEnabled) return;
    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);
    handleSlideChange();
};

export const navigateTo = (index) => {
    if (
        isTransitioning ||
        !sliderEnabled ||
        index === currentSlideIndex ||
        index < 0 ||
        index >= slidesMeta.length
    ) return;
    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);
    navigateToSlide(index);
};

// ────────────────────────────────────────
// TOUCH / SWIPE
// ────────────────────────────────────────
/* ════════════════════════════════════════
   TOUCH HANDLER FIX
   
   In transitions.js, find the section at
   the bottom that looks like:
   
     let touchStartX = 0;
     let touchEndX = 0;
     export const handleTouchStart = ...
     export const handleTouchEnd = ...
   
   Replace that ENTIRE section with the
   code below.
   ════════════════════════════════════════ */

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

export const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
};

export const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // If the gesture is more vertical than horizontal
    // the user is scrolling a card — do nothing.
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // Require a meaningful horizontal swipe (60px)
    if (Math.abs(deltaX) < 60) return;

    if (deltaX < 0) navigateNext();
    else navigatePrev();
};