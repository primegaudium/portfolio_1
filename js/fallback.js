// ========================================
// FALLBACK.JS — Harsh Raj Portfolio
// Graceful degradation when the WebGL
// renderer is unavailable (no WebGL support,
// blocked CDN, GPU crash, etc.).
//
// Provides a CSS-only slide switcher so all
// slides remain reachable, and paints a
// per-slide image background so the page
// never looks empty without the shader.
// ========================================

import { slides } from "./slides-data.js";
import { updateCounter, updateNavigationState, activateOverlay } from "./navigation.js";

let index = 0;
let bgEl = null;
let active = false;

const _count = () => slides.length;

const _paintBackground = (i) => {
    if (!bgEl) return;
    const media = slides[i]?.media;
    // Only paint image media (skip empty / video sources).
    if (media && /\.(jpg|jpeg|png|webp|avif)$/i.test(media)) {
        bgEl.style.backgroundImage = `url("${media}")`;
        bgEl.style.opacity = "1";
    } else {
        bgEl.style.opacity = "0";
    }
};

const _go = (i) => {
    const total = _count();
    index = ((i % total) + total) % total;
    _paintBackground(index);
    updateCounter(index);
    updateNavigationState(index);
    activateOverlay(index);
};

const _next = () => _go(index + 1);
const _prev = () => _go(index - 1);

// ── Touch / swipe ──
let sx = 0, sy = 0;
const _touchStart = (e) => {
    sx = e.changedTouches[0].screenX;
    sy = e.changedTouches[0].screenY;
};
const _touchEnd = (e) => {
    const dx = e.changedTouches[0].screenX - sx;
    const dy = e.changedTouches[0].screenY - sy;
    if (Math.abs(dy) > Math.abs(dx)) return;   // vertical scroll
    if (Math.abs(dx) < 60) return;             // too small
    dx < 0 ? _next() : _prev();
};

// ────────────────────────────────────────
// PUBLIC: enable fallback navigation.
// Safe to call once; no-op if already active.
// ────────────────────────────────────────
export const enableStaticFallback = () => {
    if (active) return;
    active = true;

    const wrapper = document.getElementById("sliderWrapper");
    if (!wrapper) return;

    // Mark the DOM so CSS can react (e.g. hide the dead WebGL canvas).
    wrapper.classList.add("static-fallback");

    // Create a background layer behind the overlays.
    bgEl = document.createElement("div");
    bgEl.className = "fallback-bg";
    const overlays = wrapper.querySelector(".slide-overlays");
    wrapper.insertBefore(bgEl, overlays);

    // Wire navigation — guarded against double-advance from real links.
    wrapper.addEventListener("click", (e) => {
        if (e.target.closest(".slides-navigation")) return;
        const cta = e.target.closest("[data-slide-target]");
        if (cta) { _go(parseInt(cta.dataset.slideTarget, 10) || 0); return; }
        if (e.target.closest("a[href]")) return;
        _next();
    });

    const nav = document.getElementById("slidesNav");
    if (nav) {
        nav.addEventListener("click", (e) => {
            const item = e.target.closest(".slide-nav-item");
            if (!item) return;
            const t = parseInt(item.dataset.slideIndex, 10);
            if (!Number.isNaN(t)) _go(t);
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.code === "ArrowRight") { e.preventDefault(); _next(); }
        else if (e.code === "ArrowLeft") { e.preventDefault(); _prev(); }
    });

    document.addEventListener("touchstart", _touchStart, { passive: true });
    document.addEventListener("touchend", _touchEnd, { passive: true });

    // Paint the first slide immediately.
    _go(0);

    console.warn("fallback.js: running in static (no-WebGL) mode.");
};
