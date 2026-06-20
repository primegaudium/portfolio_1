// ========================================
// TRANSITIONS.JS — Harsh Raj Portfolio
// GSAP-powered slide transitions, auto-slide
// timer, and core navigation logic.
// Verbatim from licensed source, refactored
// into exported functions.
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
import { accessibilityManager } from "./accessibility.js";

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

/**
 * Starts the auto-slide timer with progress animation
 */
export const startAutoSlideTimer = () => {
    if (!texturesLoaded || !sliderEnabled || slideTextures.length < 2) {
        console.warn("Cannot start timer: prerequisites not met");
        return;
    }
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

/**
 * Stops the auto-slide timer and clears all intervals
 */
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

/**
 * Safely starts the timer after a delay
 * @param {number} delay - Delay in milliseconds before starting
 */
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

/**
 * Navigates to a specific slide with GSAP transition
 * @param {number} targetIndex - The target slide index
 */
export const navigateToSlide = (targetIndex) => {
    if (isTransitioning || targetIndex === currentSlideIndex) return;
    
    if (targetIndex < 0 || targetIndex >= slideTextures.length) {
        console.error(`Invalid slide index: ${targetIndex}`);
        return;
    }

    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);

    const currentTexture = slideTextures[currentSlideIndex];
    const targetTexture = slideTextures[targetIndex];
    if (!currentTexture || !targetTexture) {
        console.error("Texture not loaded for transition");
        return;
    }

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
    
    // Announce slide change to screen readers
    const slideTitle = slidesMeta[targetIndex]?.title || 'Slide';
    accessibilityManager.announceSlideChange(targetIndex, slidesMeta.length, slideTitle);

    // GSAP transition — verbatim from licensed source
    gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
            value: 1,
            duration: TRANSITION_DURATION(),
            ease: "power2.inOut",
            onComplete: () => {
                shaderMaterial.uniforms.uProgress.value = 0;
                shaderMaterial.uniforms.uTexture1.value = targetTexture;
                shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                isTransitioning = false;
                safeStartTimer(100);
            }
        }
    );
};

/**
 * Handles automatic slide change (next slide)
 */
export const handleSlideChange = () => {
    if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
    const nextIndex = (currentSlideIndex + 1) % slidesMeta.length;
    navigateToSlide(nextIndex);
};

/**
 * Navigates to the previous slide
 */
export const navigatePrev = () => {
    if (isTransitioning || !sliderEnabled) return;
    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);
    const prevIndex = (currentSlideIndex - 1 + slidesMeta.length) % slidesMeta.length;
    navigateToSlide(prevIndex);
};

/**
 * Navigates to the next slide
 */
export const navigateNext = () => {
    if (isTransitioning || !sliderEnabled) return;
    stopAutoSlideTimer();
    quickResetProgress(currentSlideIndex);
    handleSlideChange();
};

/**
 * Navigate to a specific slide index (used by CTA buttons in overlays)
 * @param {number} index - Target slide index
 */
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
let touchStartX = 0;
let touchEndX = 0;

export const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
};

export const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    _handleSwipe();
};

const _handleSwipe = () => {
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < 50) return;   // minimum swipe distance

    if (delta < 0) {
        // Swipe left → next
        navigateNext();
    } else {
        // Swipe right → previous
        navigatePrev();
    }
};