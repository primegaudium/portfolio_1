// ========================================
// RENDERER.JS — Harsh Raj Portfolio
// Parallel texture loading:
// - All images fire simultaneously
// - Slider enables when slide 0 is ready
// - Remaining slides load in background
// ========================================

import * as THREE from "three";
import { SLIDER_CONFIG } from "./slider-config.js";
import { vertexShader, fragmentShader } from "./shaders.js";
import { slidesMeta } from "./slides-data.js";

export let renderer = null;
export let scene = null;
export let camera = null;
export let shaderMaterial = null;
export let slideTextures = [];
export let texturesLoaded = false;

export const getEffectIndex = (effectName) =>
    ({ glass: 0, frost: 1, ripple: 2, plasma: 3, timeshift: 4 })[effectName] ?? 0;

const _placeholder = () => {
    const t = new THREE.DataTexture(
        new Uint8Array([10, 10, 10, 255]), 1, 1, THREE.RGBAFormat
    );
    t.needsUpdate = true;
    t.userData = { size: new THREE.Vector2(1920, 1080) };
    return t;
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)$/i;

const _loadImage = (src) =>
    new Promise((resolve) => {
        const loader = new THREE.TextureLoader();
        const timer = setTimeout(() => {
            console.warn(`Timeout: "${src}"`);
            resolve(_placeholder());
        }, 25000);
        loader.load(
            src,
            (texture) => {
                clearTimeout(timer);
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                texture.userData = {
                    size: new THREE.Vector2(texture.image.width, texture.image.height)
                };
                resolve(texture);
            },
            undefined,
            () => { clearTimeout(timer); console.warn(`Failed: "${src}"`); resolve(_placeholder()); }
        );
    });

const _loadVideo = (src) =>
    new Promise((resolve) => {
        const video = document.createElement("video");
        Object.assign(video, {
            src, crossOrigin: "anonymous", loop: true, muted: true,
            playsInline: true, autoplay: true, preload: "auto"
        });
        video.style.cssText =
            "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";
        document.body.appendChild(video);
        let resolved = false;
        const done = (tex) => { if (!resolved) { resolved = true; resolve(tex); } };
        const onReady = () => {
            video.play().catch(() => { });
            const t = new THREE.VideoTexture(video);
            t.minFilter = t.magFilter = THREE.LinearFilter;
            t.format = THREE.RGBAFormat;
            t.userData = { size: new THREE.Vector2(video.videoWidth || 1920, video.videoHeight || 1080) };
            done(t);
        };
        if (video.readyState >= 2) onReady();
        else {
            video.addEventListener("loadeddata", onReady, { once: true });
            video.addEventListener("error", () => done(_placeholder()), { once: true });
        }
        setTimeout(() => done(_placeholder()), 20000);
    });

const _loadMedia = (src) => {
    if (!src) return Promise.resolve(_placeholder());
    return VIDEO_EXTENSIONS.test(src) ? _loadVideo(src) : _loadImage(src);
};

const _buildUniforms = () => {
    const s = SLIDER_CONFIG.settings;
    return {
        uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
        uEffectType: { value: getEffectIndex(s.currentEffect) },
        uGlobalIntensity: { value: s.globalIntensity },
        uSpeedMultiplier: { value: s.speedMultiplier },
        uDistortionStrength: { value: s.distortionStrength },
        uColorEnhancement: { value: s.colorEnhancement },
        uGlassRefractionStrength: { value: s.glassRefractionStrength },
        uGlassChromaticAberration: { value: s.glassChromaticAberration },
        uGlassBubbleClarity: { value: s.glassBubbleClarity },
        uGlassEdgeGlow: { value: s.glassEdgeGlow },
        uGlassLiquidFlow: { value: s.glassLiquidFlow },
        uFrostIntensity: { value: s.frostIntensity },
        uFrostCrystalSize: { value: s.frostCrystalSize },
        uFrostIceCoverage: { value: s.frostIceCoverage },
        uFrostTemperature: { value: s.frostTemperature },
        uFrostTexture: { value: s.frostTexture },
        uRippleFrequency: { value: s.rippleFrequency },
        uRippleAmplitude: { value: s.rippleAmplitude },
        uRippleWaveSpeed: { value: s.rippleWaveSpeed },
        uRippleRippleCount: { value: s.rippleRippleCount },
        uRippleDecay: { value: s.rippleDecay },
        uPlasmaIntensity: { value: s.plasmaIntensity },
        uPlasmaSpeed: { value: s.plasmaSpeed },
        uPlasmaEnergyIntensity: { value: s.plasmaEnergyIntensity },
        uPlasmaContrastBoost: { value: s.plasmaContrastBoost },
        uPlasmaTurbulence: { value: s.plasmaTurbulence },
        uTimeshiftDistortion: { value: s.timeshiftDistortion },
        uTimeshiftBlur: { value: s.timeshiftBlur },
        uTimeshiftFlow: { value: s.timeshiftFlow },
        uTimeshiftChromatic: { value: s.timeshiftChromatic },
        uTimeshiftTurbulence: { value: s.timeshiftTurbulence },
    };
};

export const updateShaderUniforms = () => {
    if (!shaderMaterial) return;
    const u = shaderMaterial.uniforms, s = SLIDER_CONFIG.settings;
    const set = (k, v) => { if (u[k]) u[k].value = v; };
    set("uGlobalIntensity", s.globalIntensity); set("uSpeedMultiplier", s.speedMultiplier);
    set("uDistortionStrength", s.distortionStrength); set("uColorEnhancement", s.colorEnhancement);
    set("uGlassRefractionStrength", s.glassRefractionStrength);
    set("uGlassChromaticAberration", s.glassChromaticAberration);
    set("uGlassBubbleClarity", s.glassBubbleClarity); set("uGlassEdgeGlow", s.glassEdgeGlow);
    set("uGlassLiquidFlow", s.glassLiquidFlow); set("uFrostIntensity", s.frostIntensity);
    set("uFrostCrystalSize", s.frostCrystalSize); set("uFrostIceCoverage", s.frostIceCoverage);
    set("uFrostTemperature", s.frostTemperature); set("uFrostTexture", s.frostTexture);
    set("uRippleFrequency", s.rippleFrequency); set("uRippleAmplitude", s.rippleAmplitude);
    set("uRippleWaveSpeed", s.rippleWaveSpeed); set("uRippleRippleCount", s.rippleRippleCount);
    set("uRippleDecay", s.rippleDecay); set("uPlasmaIntensity", s.plasmaIntensity);
    set("uPlasmaSpeed", s.plasmaSpeed); set("uPlasmaEnergyIntensity", s.plasmaEnergyIntensity);
    set("uPlasmaContrastBoost", s.plasmaContrastBoost); set("uPlasmaTurbulence", s.plasmaTurbulence);
    set("uTimeshiftDistortion", s.timeshiftDistortion); set("uTimeshiftBlur", s.timeshiftBlur);
    set("uTimeshiftFlow", s.timeshiftFlow); set("uTimeshiftChromatic", s.timeshiftChromatic);
    set("uTimeshiftTurbulence", s.timeshiftTurbulence);
};

export const initializeRenderer = async () => {
    const canvas = document.querySelector(".webgl-canvas");
    if (!canvas) { console.error("renderer.js: canvas not found"); return false; }

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: _buildUniforms(), vertexShader, fragmentShader
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

    const tick = () => { requestAnimationFrame(tick); renderer.render(scene, camera); };
    tick();

    // Pre-fill placeholders — index access always safe
    slideTextures = slidesMeta.map(() => _placeholder());
    shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
    shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
    shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
    shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;

    // Fire ALL requests simultaneously — no slide waits for another
    const allLoaded = slidesMeta.map((meta, i) =>
        _loadMedia(meta.media).then((texture) => {
            slideTextures[i] = texture;
            if (!shaderMaterial) return;
            const u = shaderMaterial.uniforms;
            if (i === 0) { u.uTexture1.value = texture; u.uTexture1Size.value = texture.userData.size; }
            if (i === 1) { u.uTexture2.value = texture; u.uTexture2Size.value = texture.userData.size; }
        })
    );

    // Enable slider as soon as slide 0 is ready
    await allLoaded[0];
    texturesLoaded = true;

    // Rest finish silently in the background
    Promise.all(allLoaded).then(() => console.log("renderer.js: all textures loaded."));

    return true;
};

export const handleResize = () => {
    if (!renderer || !shaderMaterial) return;
    renderer.setSize(window.innerWidth, window.innerHeight);
    shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
};