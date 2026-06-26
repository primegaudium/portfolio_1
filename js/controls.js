// ========================================
// CONTROLS.JS — Harsh Raj Portfolio
// Tweakpane panel, effect folders, preset
// logic and randomize button.
// Verbatim from licensed source, refactored
// into an exported setupPane() function.
// ========================================

import { SLIDER_CONFIG } from "./slider-config.js";
import { shaderMaterial, updateShaderUniforms, getEffectIndex } from "./renderer.js";

// ── Module-level state ──
let Pane = null;
let pane = null;
let isApplyingPreset = false;
let effectFolders = {};

// ────────────────────────────────────────
// PUBLIC ENTRY POINT
//
// Tweakpane is a NON-ESSENTIAL debug panel (toggled with the H key).
// It must never block the boot sequence. We therefore load it lazily
// via dynamic import from a CORS-enabled CDN (esm.sh). The previous
// static import from cdn.skypack.dev sent no Access-Control-Allow-Origin
// header, which failed the entire module graph and froze the preloader.
// Any failure here is caught and ignored so the slider still loads.
// ────────────────────────────────────────
export const setupPane = async () => {
    try {
        if (!Pane) {
            const mod = await import("https://esm.sh/tweakpane@4.0.4");
            Pane = mod.Pane;
        }
    } catch (err) {
        console.warn("controls.js: Tweakpane failed to load — skipping debug panel.", err);
        return;
    }

    pane = new Pane({ title: "Visual Effects Controls" });

    // 1 — General settings
    const generalFolder = pane.addFolder({ title: "General Settings" });
    generalFolder.addBinding(SLIDER_CONFIG.settings, "globalIntensity", { label: "Global Intensity", min: 0.1, max: 2.0, step: 0.1 });
    generalFolder.addBinding(SLIDER_CONFIG.settings, "speedMultiplier", { label: "Speed Multiplier", min: 0.1, max: 3.0, step: 0.1 });
    generalFolder.addBinding(SLIDER_CONFIG.settings, "distortionStrength", { label: "Distortion", min: 0.1, max: 3.0, step: 0.1 });
    generalFolder.addBinding(SLIDER_CONFIG.settings, "colorEnhancement", { label: "Color Enhancement", min: 0.5, max: 2.0, step: 0.1 });

    // 2 — Timing
    const timingFolder = pane.addFolder({ title: "Timing" });
    timingFolder.addBinding(SLIDER_CONFIG.settings, "transitionDuration", { label: "Transition Duration", min: 0.5, max: 5.0, step: 0.1 });
    timingFolder.addBinding(SLIDER_CONFIG.settings, "autoSlideSpeed", { label: "Auto Slide Speed", min: 2000, max: 10000, step: 500 });

    // 3 — Effect selection
    const effectFolder = pane.addFolder({ title: "Effect Selection" });
    effectFolder.addBinding(SLIDER_CONFIG.settings, "currentEffect", {
        label: "Effect Type",
        options: { Glass: "glass", Frost: "frost", Ripple: "ripple", Plasma: "plasma", Timeshift: "timeshift" }
    });
    effectFolder.addButton({ title: "Randomize Effect" }).on("click", _randomizeEffect);

    // 4 — Effect presets
    const presetsFolder = pane.addFolder({ title: "Effect Presets" });
    presetsFolder.addBinding(SLIDER_CONFIG.settings, "currentEffectPreset", {
        label: "Preset",
        options: _getPresetOptions(SLIDER_CONFIG.settings.currentEffect)
    });

    // 5 — Per-effect setting folders (all built up front, visibility toggled)
    _setupEffectFolders();
    _updateEffectFolderVisibility(SLIDER_CONFIG.settings.currentEffect);

    // 6 — Event handling
    pane.on("change", (event) => {
        if (isApplyingPreset) return;

        if (event.target.key === "currentEffect") {
            _handleEffectChange(SLIDER_CONFIG.settings.currentEffect);
        } else if (event.target.key === "currentEffectPreset") {
            _applyEffectPreset(
                SLIDER_CONFIG.settings.currentEffect,
                SLIDER_CONFIG.settings.currentEffectPreset
            );
        } else {
            // Mark preset as Custom if a specific setting was manually changed
            const k = event.target.key;
            if (
                !k.includes("currentEffect") &&
                !k.includes("global") &&
                !k.includes("Duration") &&
                !k.includes("Speed")
            ) {
                SLIDER_CONFIG.settings.currentEffectPreset = "Custom";
                pane.refresh();
            }
            updateShaderUniforms();
        }
    });

    // Hide panel by default (H key toggles it — wired in events.js)
    const paneEl = document.querySelector(".tp-dfwv");
    if (paneEl) paneEl.style.display = "none";
};

// ────────────────────────────────────────
// PRESET HELPERS
// ────────────────────────────────────────
const _getPresetOptions = (effectName) => {
    const presets = SLIDER_CONFIG.effectPresets[effectName];
    if (!presets) return { Default: "Default", Custom: "Custom" };
    return Object.keys(presets).reduce((acc, key) => {
        acc[key] = key;
        return acc;
    }, { Custom: "Custom" });
};

const _applyEffectPreset = (effectName, presetName) => {
    const preset = SLIDER_CONFIG.effectPresets[effectName]?.[presetName];
    if (!preset) return;
    isApplyingPreset = true;
    Object.assign(SLIDER_CONFIG.settings, preset);
    updateShaderUniforms();
    pane.refresh();
    setTimeout(() => { isApplyingPreset = false; }, 100);
};

// ────────────────────────────────────────
// EFFECT CHANGE
// ────────────────────────────────────────
const _handleEffectChange = (newEffect) => {
    if (shaderMaterial) {
        shaderMaterial.uniforms.uEffectType.value = getEffectIndex(newEffect);
    }

    _updateEffectFolderVisibility(newEffect);

    // Rebuild preset dropdown for new effect
    const presetsFolder = pane.children.find((c) => c.title === "Effect Presets");
    if (presetsFolder) {
        const oldBinding = presetsFolder.children.find((c) => c.key === "currentEffectPreset");
        if (oldBinding) presetsFolder.remove(oldBinding);
        presetsFolder.addBinding(SLIDER_CONFIG.settings, "currentEffectPreset", {
            label: "Preset",
            options: _getPresetOptions(newEffect)
        });
    }

    SLIDER_CONFIG.settings.currentEffectPreset = "Default";
    _applyEffectPreset(newEffect, "Default");
    pane.refresh();
};

// ────────────────────────────────────────
// RANDOMIZE
// ────────────────────────────────────────
const _randomizeEffect = () => {
    const effects = ["glass", "frost", "ripple", "plasma", "timeshift"];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    SLIDER_CONFIG.settings.currentEffect = randomEffect;

    // Global
    SLIDER_CONFIG.settings.globalIntensity = 0.5 + Math.random() * 1.5;
    SLIDER_CONFIG.settings.speedMultiplier = 0.5 + Math.random() * 2.0;
    SLIDER_CONFIG.settings.distortionStrength = 0.5 + Math.random() * 2.0;
    SLIDER_CONFIG.settings.colorEnhancement = 0.7 + Math.random() * 1.3;

    // Effect-specific
    if (randomEffect === "glass") {
        SLIDER_CONFIG.settings.glassRefractionStrength = 0.5 + Math.random() * 2.0;
        SLIDER_CONFIG.settings.glassChromaticAberration = 0.3 + Math.random() * 2.0;
        SLIDER_CONFIG.settings.glassBubbleClarity = 0.5 + Math.random() * 1.5;
        SLIDER_CONFIG.settings.glassEdgeGlow = Math.random() * 2.0;
        SLIDER_CONFIG.settings.glassLiquidFlow = 0.3 + Math.random() * 2.5;
    } else if (randomEffect === "frost") {
        SLIDER_CONFIG.settings.frostIntensity = 0.5 + Math.random() * 2.5;
        SLIDER_CONFIG.settings.frostCrystalSize = 0.3 + Math.random() * 1.7;
        SLIDER_CONFIG.settings.frostIceCoverage = 0.3 + Math.random() * 1.5;
        SLIDER_CONFIG.settings.frostTemperature = 0.3 + Math.random() * 2.5;
        SLIDER_CONFIG.settings.frostTexture = 0.5 + Math.random() * 1.5;
    } else if (randomEffect === "ripple") {
        SLIDER_CONFIG.settings.rippleFrequency = 10.0 + Math.random() * 40.0;
        SLIDER_CONFIG.settings.rippleAmplitude = 0.03 + Math.random() * 0.15;
        SLIDER_CONFIG.settings.rippleWaveSpeed = 0.3 + Math.random() * 2.5;
        SLIDER_CONFIG.settings.rippleRippleCount = 0.2 + Math.random() * 1.8;
        SLIDER_CONFIG.settings.rippleDecay = 0.3 + Math.random() * 1.7;
    } else if (randomEffect === "plasma") {
        SLIDER_CONFIG.settings.plasmaIntensity = 0.6 + Math.random() * 2.2;
        SLIDER_CONFIG.settings.plasmaSpeed = 0.3 + Math.random() * 1.7;
        SLIDER_CONFIG.settings.plasmaEnergyIntensity = Math.random();
        SLIDER_CONFIG.settings.plasmaContrastBoost = Math.random() * 0.8;
        SLIDER_CONFIG.settings.plasmaTurbulence = 0.3 + Math.random() * 2.5;
    } else if (randomEffect === "timeshift") {
        SLIDER_CONFIG.settings.timeshiftDistortion = 0.4 + Math.random() * 1.8;
        SLIDER_CONFIG.settings.timeshiftBlur = 0.4 + Math.random() * 1.6;
        SLIDER_CONFIG.settings.timeshiftFlow = 0.4 + Math.random() * 1.6;
        SLIDER_CONFIG.settings.timeshiftChromatic = 0.3 + Math.random() * 1.7;
        SLIDER_CONFIG.settings.timeshiftTurbulence = 0.4 + Math.random() * 1.6;
    }

    SLIDER_CONFIG.settings.currentEffectPreset = "Custom";
    _handleEffectChange(randomEffect);
    updateShaderUniforms();
    pane.refresh();
};

// ────────────────────────────────────────
// PER-EFFECT FOLDERS
// ────────────────────────────────────────
const _setupEffectFolders = () => {
    // Glass
    effectFolders.glass = pane.addFolder({ title: "Glass Settings" });
    effectFolders.glass.addBinding(SLIDER_CONFIG.settings, "glassRefractionStrength", { label: "Refraction Strength", min: 0.1, max: 3.0, step: 0.1 });
    effectFolders.glass.addBinding(SLIDER_CONFIG.settings, "glassChromaticAberration", { label: "Chromatic Aberration", min: 0.1, max: 3.0, step: 0.1 });
    effectFolders.glass.addBinding(SLIDER_CONFIG.settings, "glassBubbleClarity", { label: "Bubble Clarity", min: 0.1, max: 2.0, step: 0.1 });
    effectFolders.glass.addBinding(SLIDER_CONFIG.settings, "glassEdgeGlow", { label: "Edge Glow", min: 0.0, max: 2.0, step: 0.1 });
    effectFolders.glass.addBinding(SLIDER_CONFIG.settings, "glassLiquidFlow", { label: "Liquid Flow", min: 0.1, max: 3.0, step: 0.1 });

    // Frost
    effectFolders.frost = pane.addFolder({ title: "Frost Settings" });
    effectFolders.frost.addBinding(SLIDER_CONFIG.settings, "frostIntensity", { label: "Frost Intensity", min: 0.5, max: 3.0, step: 0.1 });
    effectFolders.frost.addBinding(SLIDER_CONFIG.settings, "frostCrystalSize", { label: "Crystal Size", min: 0.3, max: 2.0, step: 0.1 });
    effectFolders.frost.addBinding(SLIDER_CONFIG.settings, "frostIceCoverage", { label: "Ice Coverage", min: 0.1, max: 2.0, step: 0.1 });
    effectFolders.frost.addBinding(SLIDER_CONFIG.settings, "frostTemperature", { label: "Temperature", min: 0.1, max: 3.0, step: 0.1 });
    effectFolders.frost.addBinding(SLIDER_CONFIG.settings, "frostTexture", { label: "Texture Detail", min: 0.3, max: 2.0, step: 0.1 });

    // Ripple
    effectFolders.ripple = pane.addFolder({ title: "Ripple Settings" });
    effectFolders.ripple.addBinding(SLIDER_CONFIG.settings, "rippleFrequency", { label: "Frequency", min: 10.0, max: 50.0, step: 1.0 });
    effectFolders.ripple.addBinding(SLIDER_CONFIG.settings, "rippleAmplitude", { label: "Amplitude", min: 0.02, max: 0.2, step: 0.01 });
    effectFolders.ripple.addBinding(SLIDER_CONFIG.settings, "rippleWaveSpeed", { label: "Wave Speed", min: 0.2, max: 3.0, step: 0.1 });
    effectFolders.ripple.addBinding(SLIDER_CONFIG.settings, "rippleRippleCount", { label: "Ripple Count", min: 0.1, max: 2.0, step: 0.1 });
    effectFolders.ripple.addBinding(SLIDER_CONFIG.settings, "rippleDecay", { label: "Decay Rate", min: 0.2, max: 2.0, step: 0.1 });

    // Plasma
    effectFolders.plasma = pane.addFolder({ title: "Plasma Settings" });
    effectFolders.plasma.addBinding(SLIDER_CONFIG.settings, "plasmaIntensity", { label: "Plasma Intensity", min: 0.5, max: 3.0, step: 0.1 });
    effectFolders.plasma.addBinding(SLIDER_CONFIG.settings, "plasmaSpeed", { label: "Plasma Speed", min: 0.2, max: 2.0, step: 0.1 });
    effectFolders.plasma.addBinding(SLIDER_CONFIG.settings, "plasmaEnergyIntensity", { label: "Energy Intensity", min: 0.0, max: 1.0, step: 0.05 });
    effectFolders.plasma.addBinding(SLIDER_CONFIG.settings, "plasmaContrastBoost", { label: "Contrast Boost", min: 0.0, max: 1.0, step: 0.05 });
    effectFolders.plasma.addBinding(SLIDER_CONFIG.settings, "plasmaTurbulence", { label: "Turbulence", min: 0.1, max: 3.0, step: 0.1 });

    // Timeshift
    effectFolders.timeshift = pane.addFolder({ title: "Timeshift Settings" });
    effectFolders.timeshift.addBinding(SLIDER_CONFIG.settings, "timeshiftDistortion", { label: "Distortion", min: 0.3, max: 3.0, step: 0.1 });
    effectFolders.timeshift.addBinding(SLIDER_CONFIG.settings, "timeshiftBlur", { label: "Blur Amount", min: 0.3, max: 3.0, step: 0.1 });
    effectFolders.timeshift.addBinding(SLIDER_CONFIG.settings, "timeshiftFlow", { label: "Flow Speed", min: 0.3, max: 3.0, step: 0.1 });
    effectFolders.timeshift.addBinding(SLIDER_CONFIG.settings, "timeshiftChromatic", { label: "Chromatic Glitch", min: 0.0, max: 3.0, step: 0.1 });
    effectFolders.timeshift.addBinding(SLIDER_CONFIG.settings, "timeshiftTurbulence", { label: "Turbulence", min: 0.3, max: 3.0, step: 0.1 });
};

const _updateEffectFolderVisibility = (currentEffect) => {
    Object.keys(effectFolders).forEach((name) => {
        if (effectFolders[name]) {
            effectFolders[name].hidden = name !== currentEffect;
        }
    });
};