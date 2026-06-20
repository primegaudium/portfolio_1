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
import { accessibilityManager } from "./accessibility.js";
import { performanceMonitor } from "./performance.js";

// ────────────────────────────────────────
// BOOT SEQUENCE
// ────────────────────────────────────────
window.addEventListener("load", async () => {
    const bootStartTime = performance.now();
    console.log("🚀 Portfolio loading started...");

    // Detect WebGL support up front so we can degrade gracefully.
    const supportsWebGL = (() => {
        try {
            const c = document.createElement("canvas");
            return !!(window.WebGLRenderingContext &&
                (c.getContext("webgl") || c.getContext("experimental-webgl")));
        } catch (e) {
            return false;
        }
    })();

    // Always reveal the slide content, even if the WebGL background never loads.
    // This guarantees the portfolio text is readable on any device.
    const revealContent = () => {
        const wrapper = document.querySelector(".slider-wrapper");
        if (wrapper) wrapper.classList.add("loaded");
        document.getElementById("preloader-overlay")?.remove();
    };

    // 0 — Initialize accessibility features
    console.log("♿ Initializing accessibility...");
    accessibilityManager.initialize();

    // 1 — Populate all overlay content from slides-data
    console.log("📝 Populating overlays...");
    populateOverlays();

    // 2 — Build the bottom navigation bar
    console.log("🧭 Creating navigation...");
    createSlidesNavigation();

    // 3 — Set initial counter display (slide 01 / 06)
    updateCounter(0);

    // 4 — Activate the first overlay
    activateOverlay(0);

    // 5 — Set up Tweakpane controls panel
    console.log("🎛️ Setting up controls...");
    await setupPane();

    // 6 — Wire all event listeners
    console.log("🔌 Binding events...");
    bindAllEvents();

    // 7 — Start preloader animation
    console.log("⏳ Starting preloader...");
    const loadingManager = new SliderLoadingManager();
    const loadStartTime = Date.now();

    // If WebGL is unavailable, skip the heavy renderer and show content now.
    if (!supportsWebGL) {
        console.warn("⚠️ WebGL unavailable — showing static content fallback.");
        loadingManager.complete();
        enableSlider();
        revealContent();
        accessibilityManager.announce("Portfolio loaded in reduced mode. Use arrow keys or space to navigate.");
        return;
    }

    // 8 — Initialise THREE.js renderer + load textures
    //     (heaviest async step — runs while preloader plays)
    try {
        console.log("🎨 Initializing THREE.js renderer...");
        const textureLoadStart = performance.now();
        const ready = await initializeRenderer();
        performanceMonitor.recordTextureLoadTime(textureLoadStart);
        console.log(`✅ Renderer initialized: ${ready}`);

        if (ready) {
            // Ensure minimum loading time of 2 seconds for smooth UX
            const loadDuration = Date.now() - loadStartTime;
            const minLoadTime = 2000;
            const remainingTime = Math.max(0, minLoadTime - loadDuration);
            
            console.log(`⏱️ Load took ${loadDuration}ms, waiting ${remainingTime}ms more...`);

            setTimeout(() => {
                // 9 — Complete the preloader (will trigger fade-out)
                console.log("✨ Completing preloader...");
                loadingManager.complete();
                
                // 10 — Enable transitions and start auto-slide timer
                console.log("🎬 Enabling slider...");
                enableSlider();
                safeStartTimer(500);
                
                // Record total load time
                performanceMonitor.recordLoadTime(bootStartTime);
                
                // Log performance report
                setTimeout(() => {
                    performanceMonitor.logReport();
                }, 1000);
                
                console.log("🎉 Portfolio fully loaded!");
                
                // Announce to screen readers
                accessibilityManager.announce("Portfolio loaded. Use arrow keys or space to navigate between slides.");
            }, remainingTime);
        } else {
            console.error("❌ Renderer failed to initialise.");
            // Still complete preloader even on error
            loadingManager.complete();
        }
    } catch (error) {
        console.error("❌ Error during initialization:", error);
        console.error("Stack trace:", error.stack);
        loadingManager.complete();
        // Guarantee the content is visible even after a fatal renderer error.
        revealContent();
    }

});