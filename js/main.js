// ========================================
// MAIN.JS — Harsh Raj Portfolio
// Entry point. Imports and initialises all
// modules in the correct order.
// ========================================

import { SliderLoadingManager } from "./preloader.js";
import { initializeRenderer } from "./renderer.js";
import { setupPane } from "./controls.js";
import {
    createSlidesNavigation,
    updateCounter,
    populateOverlays,
    activateOverlay
} from "./navigation.js";
import {
    enableSlider,
    safeStartTimer
} from "./transitions.js";
import { bindAllEvents } from "./events.js";
import { LiquidBackground } from "./liquid-bg.js";
import { enableStaticFallback } from "./fallback.js";

// ── Skills slide index (0-based) ──
const SKILLS_SLIDE_INDEX = 3;

// ── Liquid background instance ──
export const liquidBg = new LiquidBackground();

// ────────────────────────────────────────
// BOOT SEQUENCE
// ────────────────────────────────────────
window.addEventListener("load", async () => {

    // 1 — Start preloader animation immediately
    const loadingManager = new SliderLoadingManager();

    // 2 — Populate all overlay content from slides-data
    populateOverlays();

    // 3 — Build the bottom navigation bar
    createSlidesNavigation();

    // 4 — Set initial counter display (slide 01 / 06)
    updateCounter(0);

    // 5 — Activate the first overlay
    activateOverlay(0);

    // 6 — Wire all event listeners
    bindAllEvents();

    // 7 — Initialise THREE.js renderer + load textures
    let ready = false;
    try {
        ready = await initializeRenderer();
    } catch (err) {
        console.error("main.js: renderer failed to initialise.", err);
    }

    // 8 — Init liquid background (creates its canvas in the DOM)
    try {
        liquidBg.init();
    } catch (err) {
        console.warn("main.js: liquid background failed to init.", err);
    }

    if (ready) {
        // 9 — Enable transitions and start auto-slide timer
        enableSlider();
        safeStartTimer(500);
    } else {
        console.error("main.js: renderer not ready — enabling static fallback.");
        // Graceful degradation: keep all slides reachable without WebGL.
        try {
            enableStaticFallback();
        } catch (err) {
            console.error("main.js: static fallback failed.", err);
        }
    }

    // 10 — Set up Tweakpane debug panel LAST, fully detached from boot.
    //      It is optional (H key) and must never block the slider.
    setupPane().catch((err) =>
        console.warn("main.js: debug panel setup skipped.", err)
    );

});

// ────────────────────────────────────────
// LIQUID BG ACTIVATION
// Called by transitions.js whenever the
// active slide changes.
// ────────────────────────────────────────
export const syncLiquidBg = (slideIndex) => {
    if (slideIndex === SKILLS_SLIDE_INDEX) {
        liquidBg.show();
    } else {
        liquidBg.hide();
    }
};