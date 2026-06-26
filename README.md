# Harsh Raj — Portfolio

A single-page, full-screen WebGL slider portfolio. Six slides (Hero, About,
Projects, Skills, Leadership, Contact) are rendered over a Three.js shader
canvas with animated glass / frost / ripple / plasma / timeshift transitions,
GSAP-driven motion, a typewriter heading effect, an interactive liquid-gradient
background on the Skills slide, and an optional Tweakpane debug panel.

**Live:** https://portfolio-out.vercel.app/

---

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Local development](#local-development)
- [Deployment](#deployment)
- [Third-party dependencies & the import map](#third-party-dependencies--the-import-map)
- [Self-hosting Three.js (detailed)](#self-hosting-threejs-detailed)
- [Image compression](#image-compression)
- [Accessibility](#accessibility)
- [Editing content](#editing-content)
- [Troubleshooting](#troubleshooting)

---

## Tech stack

| Concern        | Choice                                                            |
| -------------- | ---------------------------------------------------------------- |
| Markup         | Plain HTML (`index.html`)                                        |
| Styling        | Vanilla CSS, split by concern (see below)                       |
| Logic          | Vanilla JavaScript **ES modules** (no bundler, no framework)    |
| 3D / shaders   | [Three.js](https://threejs.org/) (pinned via import map)        |
| Animation      | [GSAP](https://gsap.com/) 3.12.5 (CDN)                          |
| Debug panel    | [Tweakpane](https://tweakpane.github.io/docs/) 4.0.4 (lazy)     |
| Icons          | [Simple Icons](https://simpleicons.org/) CDN (with fallback)   |
| Hosting        | [Vercel](https://vercel.com/) (static)                          |

There is **no build step** — the browser loads the ES modules directly.

---

## Project structure

```
.
├── index.html              # Entry point, import map, SVG glass filter, slide markup
├── vercel.json             # Security headers (Content-Security-Policy)
├── css/
│   ├── main.css            # Design tokens, reset, fonts, utilities
│   ├── slider.css          # WebGL canvas, nav bar, counters, preloader, tweakpane
│   ├── overlay.css         # Per-slide content panels
│   ├── deploy-fix.css      # Final layout/polish overrides (loaded last → wins)
│   └── mobile.css          # Responsive breakpoints (1024 / 768 / 480)
├── js/
│   ├── main.js             # Boot sequence (entry module)
│   ├── slides-data.js      # ← ALL portfolio content lives here
│   ├── slider-config.js    # Effect settings & presets
│   ├── renderer.js         # Three.js setup + parallel texture loading
│   ├── shaders.js          # GLSL vertex/fragment shaders for transitions
│   ├── transitions.js      # Slide navigation, auto-slide timer, swipe
│   ├── navigation.js       # Builds nav bar + populates overlay DOM
│   ├── overlay.js          # Typewriter heading effect
│   ├── controls.js         # Tweakpane debug panel (lazy-loaded, optional)
│   ├── events.js           # Centralised event listeners
│   ├── liquid-bg.js        # Interactive liquid background (Skills slide)
│   ├── preloader.js        # Animated canvas loader
│   └── fallback.js         # Static (no-WebGL) graceful-degradation switcher
└── assets/
    ├── images/             # Slide backgrounds + about photo
    ├── icons/              # favicon + icon fallback
    ├── RESUME.tex          # Source of truth for portfolio content
    └── resume_final.pdf
```

---

## How it works

### Boot sequence (`js/main.js`)

On `window.load`:

1. Start the preloader animation.
2. Populate every overlay's DOM from `slides-data.js`.
3. Build the bottom navigation bar and set the counter.
4. Activate the first overlay and wire all event listeners.
5. Initialise the Three.js renderer and begin loading textures in parallel.
6. Initialise the liquid background.
7. If the renderer is ready → enable transitions + the auto-slide timer.
   If it failed → **enable the static fallback** so all slides stay reachable.
8. Lazy-load the Tweakpane debug panel **last and fully detached** — it can
   never block boot.

### Resilience

- **Tweakpane is lazy-loaded** via dynamic `import()` in a `try/catch`. (A
  previous static import from `cdn.skypack.dev` had no CORS header and froze
  the entire page — see git history.)
- **The renderer and liquid background are wrapped** so a single failure can't
  hang the preloader.
- **`fallback.js`** provides a CSS-only slide switcher (click / arrow keys /
  space / swipe / nav bar) with a per-slide image background when WebGL is
  unavailable.

---

## Local development

Because the site uses ES modules, you **must serve it over HTTP** (opening
`index.html` via `file://` will fail CORS for module imports).

Pick any static server:

```bash
# Python 3
python -m http.server 8000

# Node (npx, no install)
npx serve .

# VS Code
# Install the "Live Server" extension and click "Go Live".
```

Then open http://localhost:8000.

> **Note:** the `Content-Security-Policy` in `vercel.json` only applies on
> Vercel. Locally there is no CSP, so behaviour can differ slightly. After CSP
> changes, always verify on a Vercel preview deployment.

---

## Deployment

The project is a static site on Vercel. Any push to `main` (or a merged MR)
triggers a deploy. Manual deploy:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Security headers (including the CSP that whitelists CDNs) are defined in
`vercel.json`.

---

## Third-party dependencies & the import map

Runtime dependencies are loaded from CDNs and governed by the CSP in
`vercel.json`:

| Library      | Source                                   | Loaded by                      |
| ------------ | ---------------------------------------- | ------------------------------ |
| Three.js     | `https://esm.sh/three@0.160.0`           | import map → `renderer.js`, `liquid-bg.js` |
| GSAP         | `https://cdnjs.cloudflare.com/.../gsap`  | `<script>` in `index.html`     |
| Tweakpane    | `https://esm.sh/tweakpane@4.0.4`         | lazy `import()` in `controls.js` |
| Simple Icons | `https://cdn.simpleicons.org/...`        | `navigation.js` (with fallback) |

Three.js is **pinned and indirected through an import map** in `index.html`:

```html
<script type="importmap">
{
  "imports": {
    "three": "https://esm.sh/three@0.160.0"
  }
}
</script>
```

Modules then import the bare specifier:

```js
import * as THREE from "three";
```

This gives a single source of truth for the version and makes self-hosting a
one-line change (see next section).

---

## Self-hosting Three.js (detailed)

Self-hosting removes the `esm.sh` runtime dependency entirely: faster, no
third-party uptime/CORS risk, and it works offline. The import map means **no
JavaScript changes are required** — you only swap the map URL for a local path.

### Step 1 — Download the matching Three.js module

Use the **same version the import map pins** (`0.160.0`) to avoid API breaks.

```bash
mkdir -p js/vendor

# Download the ES-module build (single self-contained file)
curl -L -o js/vendor/three.module.js \
  https://unpkg.com/three@0.160.0/build/three.module.js
```

Alternatively, via npm if you prefer a verified install:

```bash
npm pack three@0.160.0          # produces three-0.160.0.tgz
tar -xzf three-0.160.0.tgz      # extracts ./package/
cp package/build/three.module.js js/vendor/three.module.js
rm -rf package three-0.160.0.tgz
```

> The portfolio only uses the **core** Three.js module (`WebGLRenderer`,
> `Scene`, `OrthographicCamera`, `PerspectiveCamera`, `ShaderMaterial`,
> `PlaneGeometry`, `Mesh`, `TextureLoader`, `DataTexture`, `VideoTexture`,
> `Texture`, `Vector2`, `Vector3`, `Color`, `Clock`). All of these live in the
> single `three.module.js` file — no addons/examples are needed.

### Step 2 — Point the import map at the local file

In `index.html`, change the import map value from the CDN URL to the local path:

```html
<script type="importmap">
{
  "imports": {
    "three": "/js/vendor/three.module.js"
  }
}
</script>
```

> Use a **root-relative** path (`/js/vendor/...`) so it resolves correctly from
> any route on Vercel. The `import * as THREE from "three";` lines in
> `renderer.js` and `liquid-bg.js` stay exactly as they are.

### Step 3 — Tighten the Content-Security-Policy

In `vercel.json`, you can now remove `https://esm.sh` from `script-src` and
`connect-src` **only if you also self-host Tweakpane** (which still uses
`esm.sh`). If you keep Tweakpane on the CDN, leave `esm.sh` in place.

To also self-host Tweakpane:

```bash
curl -L -o js/vendor/tweakpane.min.js \
  https://unpkg.com/tweakpane@4.0.4/dist/tweakpane.min.js
```

Then in `js/controls.js` replace the dynamic import URL:

```js
// from
const mod = await import("https://esm.sh/tweakpane@4.0.4");
// to
const mod = await import("/js/vendor/tweakpane.min.js");
```

Once **both** are local, update the CSP in `vercel.json` to drop `esm.sh`:

```json
"script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
"connect-src 'self'"
```

(Leave `https://cdnjs.cloudflare.com` unless you also self-host GSAP.)

### Step 4 — Verify

1. Run a local server (`python -m http.server 8000`) and open the site.
2. Open DevTools → **Network**. Confirm `three.module.js` loads from your own
   origin and there are **no requests to `esm.sh`**.
3. Confirm the slider renders and the Skills slide's liquid background works.
4. Deploy a Vercel **preview** and re-check (CSP only applies on Vercel).

### Step 5 — Commit

```bash
git add js/vendor/three.module.js index.html vercel.json
git commit -m "chore: self-host Three.js, drop esm.sh runtime dependency"
```

### Upgrading later

To move to a new Three.js version, re-run Step 1 with the new version number
and keep the import-map key the same. Test against the shader code in
`shaders.js` / `liquid-bg.js`, since major releases occasionally change GLSL or
renderer defaults.

---

## Image compression

Slide backgrounds dominate load time. A helper script compresses them to
≤500 KB with minimal quality loss and keeps `*.orig.*` backups:

```bash
pip install Pillow
python compress-images.py
# review results, then delete the *.orig.* backups and redeploy
```

`check-assets.js` (`node check-assets.js`) prints the exact, case-sensitive
filenames Vercel will serve — useful when a slide image 404s only in
production.

---

## Accessibility

- Inactive slides are `aria-hidden` and `inert` (skipped by screen readers and
  keyboard focus).
- An SR-only `aria-live` region announces the current slide.
- The active nav button is marked `aria-current="true"`.
- `prefers-reduced-motion` is honoured: the typewriter and long transition
  delays are disabled, and headings appear instantly.

---

## Editing content

**All portfolio text lives in `js/slides-data.js`.** Edit the `slides` array to
change copy, projects, skills, certifications, roles, the research entry, or
contact details. `assets/RESUME.tex` is the canonical source — keep the two in
sync. No rebuild is needed; just refresh.

To add/remove a slide, update both `slides-data.js` and the matching
`<section class="slide-overlay" data-slide="N">` block in `index.html`.

---

## Troubleshooting

| Symptom                                   | Likely cause / fix                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| Stuck on the loading screen               | A blocked/failed module import. Check the console; verify CDN URLs and the CSP.    |
| Slides show but won't advance             | Renderer failed → static fallback should engage. Check console for WebGL errors.  |
| Skill/cert icons missing                  | Simple Icons CDN 404 → they fall back to `assets/icons/fallback.svg` automatically.|
| Blank/black background, no slider         | WebGL unsupported/disabled. The static fallback paints slide images instead.       |
| Module import errors locally              | You opened `file://`. Serve over HTTP instead (see Local development).             |
| Works locally, breaks on Vercel           | Almost always the CSP in `vercel.json`. Add the required origin and redeploy.      |
