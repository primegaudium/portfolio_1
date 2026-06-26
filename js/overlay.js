// ========================================
// OVERLAY.JS — Harsh Raj Portfolio
// Typewriter effect for main slide headings.
// Triggered each time a slide becomes active.
// ========================================

// ────────────────────────────────────────
// CONFIG
// Per-slide: element ID, delay before
// typing starts (ms), chars per second.
// Delay is set slightly after the CSS
// transition-delay for each heading so
// the element has already faded/slid in.
// ────────────────────────────────────────
const HEADING_CONFIG = [
    // Slide 0 — Hero: "Harsh Raj"
    { id: "hero-name", startDelay: 2300, cps: 14 },
    // Slide 1 — About: "Curious builder.\nAnalytical thinker."
    { id: "about-headline", startDelay: 2200, cps: 18 },
    // Slide 2 — Projects: "Things I've Built"
    { id: "projects-headline", startDelay: 2200, cps: 16 },
    // Slide 3 — Skills: "My Stack"
    { id: "skills-headline", startDelay: 2200, cps: 14 },
    // Slide 4 — Leadership: "Beyond the Code"
    { id: "leadership-headline", startDelay: 2200, cps: 16 },
    // Slide 5 — Contact: "Let's Build\nSomething."
    { id: "contact-headline", startDelay: 2350, cps: 14 },
];

// ── Store original text once (populated by navigation.js) ──
// Key: element id → original full string (with real \n chars)
const _originals = {};

// ── Active timers so we can cancel on fast slide changes ──
const _timers = {};

// ────────────────────────────────────────
// PUBLIC: call once after populateOverlays()
// Reads and caches the original text of
// every heading so we can replay it.
// ────────────────────────────────────────
export const cacheHeadings = () => {
    HEADING_CONFIG.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) _originals[id] = el.textContent;
    });
};

// ────────────────────────────────────────
// PUBLIC: call from activateOverlay(index)
// Cancels any running typewriter for the
// previous slide, then starts one for the
// new slide's heading.
// ────────────────────────────────────────
export const triggerTypewriter = (slideIndex) => {
    // Cancel ALL running typewriters first
    Object.keys(_timers).forEach(_cancelTimers);

    const cfg = HEADING_CONFIG[slideIndex];
    if (!cfg) return;

    const el = document.getElementById(cfg.id);
    if (!el) return;

    const fullText = _originals[cfg.id];
    if (!fullText) return;

    // Accessibility: if the user prefers reduced motion, show the
    // heading instantly instead of animating it character-by-character.
    const reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
        el.textContent = fullText;
        return;
    }

    // Clear the element immediately so there's no flash
    el.textContent = "";

    // Schedule the typewriter to start after CSS transition settles
    _timers[cfg.id] = [
        setTimeout(() => _type(el, fullText, cfg.cps, cfg.id), cfg.startDelay)
    ];
};

// ────────────────────────────────────────
// INTERNAL: character-by-character typing
// Handles real newline chars (\n) that
// headings with white-space:pre-line use.
// Appends a blinking cursor span while
// typing, removes it when done.
// ────────────────────────────────────────
const _type = (el, text, cps, id) => {
    const interval = 1000 / cps;
    let i = 0;

    // Add cursor element
    const cursor = document.createElement("span");
    cursor.className = "typewriter-cursor";
    cursor.setAttribute("aria-hidden", "true");
    el.appendChild(cursor);

    const tick = () => {
        if (i < text.length) {
            // Insert character before cursor
            const char = text[i];
            cursor.insertAdjacentText("beforebegin", char);
            i++;
            const t = setTimeout(tick, interval);
            if (!_timers[id]) _timers[id] = [];
            _timers[id].push(t);
        } else {
            // Done — remove cursor after a brief pause
            const t = setTimeout(() => {
                cursor.remove();
                delete _timers[id];
            }, 800);
            if (!_timers[id]) _timers[id] = [];
            _timers[id].push(t);
        }
    };

    tick();
};

// ────────────────────────────────────────
// INTERNAL: cancel all timers for an id
// ────────────────────────────────────────
const _cancelTimers = (id) => {
    if (_timers[id]) {
        _timers[id].forEach(clearTimeout);
        delete _timers[id];
    }
    // Also restore full text immediately so it's not left mid-word
    const cfg = HEADING_CONFIG.find((c) => c.id === id);
    if (cfg) {
        const el = document.getElementById(id);
        if (el && _originals[id] !== undefined) {
            el.textContent = _originals[id];
        }
    }
};