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

    // 6 — Set up Tweakpane controls panel
    setupPane();

    // 7 — Wire all event listeners
    bindAllEvents();

    // 8 — Initialise THREE.js renderer + load textures
    const ready = await initializeRenderer();

    // 9 — Init liquid background (creates its canvas in the DOM)
    liquidBg.init();

    if (ready) {
        // 10 — Enable transitions and start auto-slide timer
        enableSlider();
        safeStartTimer(500);
    } else {
        console.error("main.js: renderer failed to initialise.");
    }

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