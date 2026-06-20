// ========================================
// RENDERER.JS — Harsh Raj Portfolio
// THREE.js scene setup, shader material
// creation, texture loading, and render loop.
// ========================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { SLIDER_CONFIG } from "./slider-config.js";
import { vertexShader, fragmentShader } from "./shaders.js";
import { slidesMeta } from "./slides-data.js";
import { performanceMonitor } from "./performance.js";

// ── Shared state (exported for other modules) ──
export let renderer = null;
export let scene = null;
export let camera = null;
export let shaderMaterial = null;
export let slideTextures = [];
export let texturesLoaded = false;

// ── Effect index map ──
export const getEffectIndex = (effectName) => {
    const map = {
        glass: 0,
        frost: 1,
        ripple: 2,
        plasma: 3,
        timeshift: 4
    };
    return map[effectName] ?? 0;
};

// ────────────────────────────────────────
// Universal media loader
// Auto-detects image vs video by extension.
// Images  → THREE.TextureLoader
// Videos  → THREE.VideoTexture (hidden <video>)
// Both fall back to a dark placeholder if
// the file is missing or times out.
// ────────────────────────────────────────
const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)$/i;

const _placeholder = () => {
    const t = new THREE.DataTexture(
        new Uint8Array([10, 10, 10, 255]), 1, 1, THREE.RGBAFormat
    );
    t.needsUpdate = true;
    t.userData = { size: new THREE.Vector2(1920, 1080) };
    return t;
};

const _loadImage = (src) =>
    new Promise((resolve) => {
        const loader = new THREE.TextureLoader();
        const timeout = setTimeout(() => {
            console.warn(`Timeout loading image "${src}" — using placeholder.`);
            resolve(_placeholder());
        }, 10000);

        loader.load(
            src,
            (texture) => {
                clearTimeout(timeout);
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                texture.userData = {
                    size: new THREE.Vector2(texture.image.width, texture.image.height)
                };
                resolve(texture);
            },
            undefined,
            () => {
                clearTimeout(timeout);
                console.warn(`Could not load image "${src}" — using placeholder.`);
                resolve(_placeholder());
            }
        );
    });

const _loadVideo = (src) =>
    new Promise((resolve) => {
        const video = document.createElement("video");
        video.src = src;
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";
        video.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";
        document.body.appendChild(video);

        let resolved = false;

        const done = (texture) => {
            if (resolved) return;
            resolved = true;
            resolve(texture);
        };

        const onReady = () => {
            video.play().catch(() => {
                console.warn(`Autoplay blocked for: ${src}`);
            });
            const texture = new THREE.VideoTexture(video);
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBAFormat;
            texture.userData = {
                size: new THREE.Vector2(video.videoWidth || 1920, video.videoHeight || 1080)
            };
            done(texture);
        };

        if (video.readyState >= 2) {
            onReady();
        } else {
            video.addEventListener("loadeddata", onReady, { once: true });
            video.addEventListener("error", () => {
                console.warn(`Could not load video "${src}" — using placeholder.`);
                done(_placeholder());
            }, { once: true });
        }

        // 20s timeout for video (increased from 15s)
        setTimeout(() => {
            if (!resolved) {
                console.warn(`Timeout loading video "${src}" — using placeholder.`);
                done(_placeholder());
            }
        }, 20000);
    });

// Public loader — call this for any media type
const loadMediaTexture = (src) =>
    VIDEO_EXTENSIONS.test(src) ? _loadVideo(src) : _loadImage(src);

// ────────────────────────────────────────
// Build the uniform object
// ────────────────────────────────────────
const buildUniforms = () => {
    const s = SLIDER_CONFIG.settings;
    return {
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
        uEffectType: { value: getEffectIndex(s.currentEffect) },

        // Global
        uGlobalIntensity: { value: s.globalIntensity },
        uSpeedMultiplier: { value: s.speedMultiplier },
        uDistortionStrength: { value: s.distortionStrength },
        uColorEnhancement: { value: s.colorEnhancement },

        // Glass
        uGlassRefractionStrength: { value: s.glassRefractionStrength },
        uGlassChromaticAberration: { value: s.glassChromaticAberration },
        uGlassBubbleClarity: { value: s.glassBubbleClarity },
        uGlassEdgeGlow: { value: s.glassEdgeGlow },
        uGlassLiquidFlow: { value: s.glassLiquidFlow },

        // Frost
        uFrostIntensity: { value: s.frostIntensity },
        uFrostCrystalSize: { value: s.frostCrystalSize },
        uFrostIceCoverage: { value: s.frostIceCoverage },
        uFrostTemperature: { value: s.frostTemperature },
        uFrostTexture: { value: s.frostTexture },

        // Ripple
        uRippleFrequency: { value: s.rippleFrequency },
        uRippleAmplitude: { value: s.rippleAmplitude },
        uRippleWaveSpeed: { value: s.rippleWaveSpeed },
        uRippleRippleCount: { value: s.rippleRippleCount },
        uRippleDecay: { value: s.rippleDecay },

        // Plasma
        uPlasmaIntensity: { value: s.plasmaIntensity },
        uPlasmaSpeed: { value: s.plasmaSpeed },
        uPlasmaEnergyIntensity: { value: s.plasmaEnergyIntensity },
        uPlasmaContrastBoost: { value: s.plasmaContrastBoost },
        uPlasmaTurbulence: { value: s.plasmaTurbulence },

        // Timeshift
        uTimeshiftDistortion: { value: s.timeshiftDistortion },
        uTimeshiftBlur: { value: s.timeshiftBlur },
        uTimeshiftFlow: { value: s.timeshiftFlow },
        uTimeshiftChromatic: { value: s.timeshiftChromatic },
        uTimeshiftTurbulence: { value: s.timeshiftTurbulence }
    };
};

// ────────────────────────────────────────
// Update all shader uniforms from config
// (called by controls.js on Tweakpane change)
// ────────────────────────────────────────
export const updateShaderUniforms = () => {
    if (!shaderMaterial) return;
    const u = shaderMaterial.uniforms;
    const s = SLIDER_CONFIG.settings;

    const set = (key, val) => { if (u[key]) u[key].value = val; };

    set("uGlobalIntensity", s.globalIntensity);
    set("uSpeedMultiplier", s.speedMultiplier);
    set("uDistortionStrength", s.distortionStrength);
    set("uColorEnhancement", s.colorEnhancement);

    set("uGlassRefractionStrength", s.glassRefractionStrength);
    set("uGlassChromaticAberration", s.glassChromaticAberration);
    set("uGlassBubbleClarity", s.glassBubbleClarity);
    set("uGlassEdgeGlow", s.glassEdgeGlow);
    set("uGlassLiquidFlow", s.glassLiquidFlow);

    set("uFrostIntensity", s.frostIntensity);
    set("uFrostCrystalSize", s.frostCrystalSize);
    set("uFrostIceCoverage", s.frostIceCoverage);
    set("uFrostTemperature", s.frostTemperature);
    set("uFrostTexture", s.frostTexture);

    set("uRippleFrequency", s.rippleFrequency);
    set("uRippleAmplitude", s.rippleAmplitude);
    set("uRippleWaveSpeed", s.rippleWaveSpeed);
    set("uRippleRippleCount", s.rippleRippleCount);
    set("uRippleDecay", s.rippleDecay);

    set("uPlasmaIntensity", s.plasmaIntensity);
    set("uPlasmaSpeed", s.plasmaSpeed);
    set("uPlasmaEnergyIntensity", s.plasmaEnergyIntensity);
    set("uPlasmaContrastBoost", s.plasmaContrastBoost);
    set("uPlasmaTurbulence", s.plasmaTurbulence);

    set("uTimeshiftDistortion", s.timeshiftDistortion);
    set("uTimeshiftBlur", s.timeshiftBlur);
    set("uTimeshiftFlow", s.timeshiftFlow);
    set("uTimeshiftChromatic", s.timeshiftChromatic);
    set("uTimeshiftTurbulence", s.timeshiftTurbulence);
};

// ────────────────────────────────────────
// Main initialiser — called once from main.js
// ────────────────────────────────────────
export const initializeRenderer = async () => {
    console.log("🔧 initializeRenderer: Starting...");
    const canvas = document.querySelector(".webgl-canvas");
    if (!canvas) {
        console.error("❌ renderer.js: .webgl-canvas not found in DOM.");
        return false;
    }
    console.log("✓ Canvas found");

    // ── Scene & camera ──
    console.log("🎬 Creating scene and camera...");
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    console.log("✓ Scene and camera created");

    // ── Renderer ──
    console.log("🖼️ Creating WebGL renderer...");
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    console.log("✓ Renderer created");

    // ── Shader material ──
    console.log("🎨 Building shader material...");
    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: buildUniforms(),
        vertexShader,
        fragmentShader
    });
    console.log("✓ Shader material created");

    // ── Full-screen quad ──
    console.log("📐 Creating geometry...");
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);
    console.log("✓ Mesh added to scene");

    // ── Load all slide textures ──
    console.log(`📸 Loading ${slidesMeta.length} textures...`);
    for (let i = 0; i < slidesMeta.length; i++) {
        console.log(`  Loading texture ${i + 1}/${slidesMeta.length}: ${slidesMeta[i].media}`);
        try {
            const texture = await loadMediaTexture(slidesMeta[i].media);
            slideTextures.push(texture);
            console.log(`  ✓ Texture ${i + 1} loaded`);
        } catch (error) {
            console.error(`  ❌ Failed to load texture ${i + 1}:`, error);
            slideTextures.push(_placeholder());
        }
    }
    console.log("✓ All textures loaded");

    // ── Wire first two textures ──
    if (slideTextures.length >= 2) {
        console.log("🔗 Wiring first two textures to shader...");
        shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
        shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
        shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
        texturesLoaded = true;
        console.log("✓ Textures wired");
    }

    // ── Render loop ──
    console.log("🔄 Starting render loop...");
    
    const render = (currentTime) => {
        requestAnimationFrame(render);
        
        // Update performance metrics
        performanceMonitor.updateFPS(currentTime);
        
        // Render the scene
        renderer.render(scene, camera);
    };
    render(performance.now());
    console.log("✓ Render loop started");

    console.log("✅ initializeRenderer: Complete!");
    return true;
};

// ────────────────────────────────────────
// Resize handler — call from events.js
// ────────────────────────────────────────
export const handleResize = () => {
    if (!renderer || !shaderMaterial) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    shaderMaterial.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
    );
};