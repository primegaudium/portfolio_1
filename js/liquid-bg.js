// ========================================
// LIQUID-BG.JS — Harsh Raj Portfolio
// Interactive liquid gradient background
// by Cameron Knight — free to use.
// Stripped of all UI controls.
// Runs only on the Skills slide (index 3).
// ========================================

import * as THREE from "three";

// ────────────────────────────────────────
// TOUCH TEXTURE
// ────────────────────────────────────────
class TouchTexture {
    constructor() {
        this.size = 64;
        this.width = this.height = this.size;
        this.maxAge = 64;
        this.radius = 0.25 * this.size;
        this.speed = 1 / this.maxAge;
        this.trail = [];
        this.last = null;
        this._init();
    }

    _init() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = this.size;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.texture = new THREE.Texture(this.canvas);
    }

    update() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.size, this.size);
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i];
            const f = p.force * this.speed * (1 - p.age / this.maxAge);
            p.x += p.vx * f;
            p.y += p.vy * f;
            p.age++;
            if (p.age > this.maxAge) this.trail.splice(i, 1);
            else this._drawPoint(p);
        }
        this.texture.needsUpdate = true;
    }

    addTouch(pt) {
        let force = 0, vx = 0, vy = 0;
        if (this.last) {
            const dx = pt.x - this.last.x, dy = pt.y - this.last.y;
            if (!dx && !dy) return;
            const d = Math.sqrt(dx * dx + dy * dy);
            vx = dx / d; vy = dy / d;
            force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
        }
        this.last = { x: pt.x, y: pt.y };
        this.trail.push({ x: pt.x, y: pt.y, age: 0, force, vx, vy });
    }

    _drawPoint(p) {
        const ctx = this.ctx;
        const pos = { x: p.x * this.size, y: (1 - p.y) * this.size };
        let intensity = 1;
        if (p.age < this.maxAge * 0.3) {
            intensity = Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2));
        } else {
            const t = 1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
            intensity = -t * (t - 2);
        }
        intensity *= p.force;
        const col = `${((p.vx + 1) / 2) * 255},${((p.vy + 1) / 2) * 255},${intensity * 255}`;
        const off = this.size * 5;
        ctx.shadowOffsetX = off; ctx.shadowOffsetY = off;
        ctx.shadowBlur = this.radius;
        ctx.shadowColor = `rgba(${col},${0.2 * intensity})`;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,0,0,1)";
        ctx.arc(pos.x - off, pos.y - off, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ────────────────────────────────────────
// SHADERS
// ────────────────────────────────────────
const _vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const _frag = `
uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform float uSpeed;
uniform float uIntensity;
uniform sampler2D uTouchTexture;
uniform float uGrainIntensity;
uniform vec3  uDarkBase;
uniform float uGradientSize;

varying vec2 vUv;
#define PI 3.14159265359

float grain(vec2 uv, float t) {
  vec2 g = uv * uResolution * 0.5;
  return fract(sin(dot(g + t, vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
}

vec3 getColor(vec2 uv, float t) {
  float r = uGradientSize;

  vec2 c1  = vec2(0.5+sin(t*uSpeed*0.40)*0.40, 0.5+cos(t*uSpeed*0.50)*0.40);
  vec2 c2  = vec2(0.5+cos(t*uSpeed*0.60)*0.50, 0.5+sin(t*uSpeed*0.45)*0.50);
  vec2 c3  = vec2(0.5+sin(t*uSpeed*0.35)*0.45, 0.5+cos(t*uSpeed*0.55)*0.45);
  vec2 c4  = vec2(0.5+cos(t*uSpeed*0.50)*0.40, 0.5+sin(t*uSpeed*0.40)*0.40);
  vec2 c5  = vec2(0.5+sin(t*uSpeed*0.70)*0.35, 0.5+cos(t*uSpeed*0.60)*0.35);
  vec2 c6  = vec2(0.5+cos(t*uSpeed*0.45)*0.50, 0.5+sin(t*uSpeed*0.65)*0.50);
  vec2 c7  = vec2(0.5+sin(t*uSpeed*0.55)*0.38, 0.5+cos(t*uSpeed*0.48)*0.42);
  vec2 c8  = vec2(0.5+cos(t*uSpeed*0.65)*0.36, 0.5+sin(t*uSpeed*0.52)*0.44);
  vec2 c9  = vec2(0.5+sin(t*uSpeed*0.42)*0.41, 0.5+cos(t*uSpeed*0.58)*0.39);
  vec2 c10 = vec2(0.5+cos(t*uSpeed*0.48)*0.37, 0.5+sin(t*uSpeed*0.62)*0.43);
  vec2 c11 = vec2(0.5+sin(t*uSpeed*0.68)*0.33, 0.5+cos(t*uSpeed*0.44)*0.46);
  vec2 c12 = vec2(0.5+cos(t*uSpeed*0.38)*0.39, 0.5+sin(t*uSpeed*0.56)*0.41);

  float i1  = 1.0-smoothstep(0.0,r,length(uv-c1));
  float i2  = 1.0-smoothstep(0.0,r,length(uv-c2));
  float i3  = 1.0-smoothstep(0.0,r,length(uv-c3));
  float i4  = 1.0-smoothstep(0.0,r,length(uv-c4));
  float i5  = 1.0-smoothstep(0.0,r,length(uv-c5));
  float i6  = 1.0-smoothstep(0.0,r,length(uv-c6));
  float i7  = 1.0-smoothstep(0.0,r,length(uv-c7));
  float i8  = 1.0-smoothstep(0.0,r,length(uv-c8));
  float i9  = 1.0-smoothstep(0.0,r,length(uv-c9));
  float i10 = 1.0-smoothstep(0.0,r,length(uv-c10));
  float i11 = 1.0-smoothstep(0.0,r,length(uv-c11));
  float i12 = 1.0-smoothstep(0.0,r,length(uv-c12));

  vec3 col = vec3(0.0);

  // Alternate orange and teal/blue across all 12 centers
  // with purple/blue mixed in for the rich blended look
  col += uColor1*(0.55+0.45*sin(t*uSpeed*1.0 ))*i1;   // orange
  col += uColor2*(0.55+0.45*cos(t*uSpeed*1.2 ))*i2;   // dark teal
  col += uColor3*(0.55+0.45*sin(t*uSpeed*0.8 ))*i3;   // orange
  col += uColor4*(0.55+0.45*cos(t*uSpeed*1.3 ))*i4;   // blue-purple
  col += uColor5*(0.55+0.45*sin(t*uSpeed*1.1 ))*i5;   // orange
  col += uColor6*(0.55+0.45*cos(t*uSpeed*0.9 ))*i6;   // dark teal
  col += uColor1*(0.55+0.45*sin(t*uSpeed*1.4 ))*i7;
  col += uColor4*(0.55+0.45*cos(t*uSpeed*1.5 ))*i8;
  col += uColor3*(0.55+0.45*sin(t*uSpeed*1.6 ))*i9;
  col += uColor2*(0.55+0.45*cos(t*uSpeed*1.7 ))*i10;
  col += uColor5*(0.55+0.45*sin(t*uSpeed*1.8 ))*i11;
  col += uColor6*(0.55+0.45*cos(t*uSpeed*1.9 ))*i12;

  // Rotational radial overlays — deepen the purple/pink blend
  vec2 rv1 = uv - 0.5;
  float a1  = t*uSpeed*0.15;
  rv1 = vec2(rv1.x*cos(a1)-rv1.y*sin(a1), rv1.x*sin(a1)+rv1.y*cos(a1)) + 0.5;
  float ri1 = 1.0-smoothstep(0.0,0.8,length(rv1-0.5));

  vec2 rv2 = uv - 0.5;
  float a2  = -t*uSpeed*0.12;
  rv2 = vec2(rv2.x*cos(a2)-rv2.y*sin(a2), rv2.x*sin(a2)+rv2.y*cos(a2)) + 0.5;
  float ri2 = 1.0-smoothstep(0.0,0.8,length(rv2-0.5));

  col += mix(uColor1, uColor3, ri1) * 0.45;   // orange radial
  col += mix(uColor4, uColor2, ri2) * 0.40;   // blue-purple radial

  col  = clamp(col, vec3(0.0), vec3(1.0)) * uIntensity;

  // Saturation boost — makes colours pop
  float lum = dot(col, vec3(0.299,0.587,0.114));
  col = mix(vec3(lum), col, 1.35);
  col = pow(col, vec3(0.92));

  // Floor brightness to base colour
  float bri = length(col);
  col = mix(uDarkBase, col, max(bri*1.2, 0.15));

  float maxB = 1.0;
  float b = length(col);
  if (b > maxB) col *= maxB/b;
  return col;
}

void main() {
  vec2 uv = vUv;

  // Mouse/touch ripple
  vec4 touch = texture2D(uTouchTexture, uv);
  float vx = -(touch.r*2.0-1.0);
  float vy = -(touch.g*2.0-1.0);
  float tI = touch.b;
  uv.x += vx*0.8*tI;
  uv.y += vy*0.8*tI;

  float dist = length(uv-0.5);
  float rip  = sin(dist*20.0-uTime*3.0)*0.04*tI
             + sin(dist*15.0-uTime*2.0)*0.03*tI;
  uv += vec2(rip);

  vec3 color = getColor(uv, uTime);
  color += grain(uv, uTime) * uGrainIntensity;

  // Subtle colour shift over time
  float ts = uTime*0.5;
  color.r += sin(ts)     *0.02;
  color.g += cos(ts*1.4) *0.02;
  color.b += sin(ts*1.2) *0.02;

  float bri2 = length(color);
  color = mix(uDarkBase, color, max(bri2*1.2, 0.15));
  color = clamp(color, vec3(0.0), vec3(1.0));
  float b = length(color);
  if (b > 1.0) color *= 1.0/b;

  gl_FragColor = vec4(color, 1.0);
}`;

// ────────────────────────────────────────
// LIQUID BACKGROUND
// ────────────────────────────────────────
export class LiquidBackground {
    constructor() {
        this._canvas = null;
        this._renderer = null;
        this._scene = null;
        this._camera = null;
        this._clock = null;
        this._touch = null;
        this._mesh = null;
        this._uniforms = null;
        this._animId = null;
        this._active = false;
        this._bound = {
            mouse: this._onMouse.bind(this),
            touch: this._onTouch.bind(this),
            resize: this._onResize.bind(this),
        };
    }

    init() {
        // Canvas sits between WebGL canvas and overlays
        this._canvas = document.createElement("canvas");
        this._canvas.id = "liquid-bg-canvas";
        this._canvas.style.cssText = `
            position:absolute; inset:0;
            width:100%; height:100%;
            z-index:1;
            opacity:0;
            transition:opacity 1.2s ease;
            pointer-events:none;
        `;
        const wrapper = document.getElementById("sliderWrapper");
        const overlays = wrapper.querySelector(".slide-overlays");
        wrapper.insertBefore(this._canvas, overlays);

        // Renderer
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas, antialias: false, alpha: false,
            powerPreference: "high-performance",
        });
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x0a0e27);

        this._camera = new THREE.PerspectiveCamera(
            45, window.innerWidth / window.innerHeight, 0.1, 10000
        );
        this._camera.position.z = 50;

        this._clock = new THREE.Clock();
        this._touch = new TouchTexture();

        // ── PALETTE ──────────────────────────────────────────
        // Matches scheme 5 from the demo colour adjuster:
        //   #F15A22  orange
        //   #004238  dark teal
        //   #2429C2  blue-purple
        // The rich purple/pink midtones emerge from orange × blue-purple overlap.
        this._uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTouchTexture: { value: this._touch.texture },
            uGrainIntensity: { value: 0.08 },       // film grain — same as demo
            uSpeed: { value: 1.5 },         // demo scheme 5 speed
            uIntensity: { value: 1.8 },         // vivid
            uGradientSize: { value: 0.45 },        // smaller = tighter blobs, more blending
            // Base: very dark navy so low-energy areas don't go grey
            uDarkBase: { value: new THREE.Vector3(0.039, 0.055, 0.153) }, // #0a0e27

            // Color 1/3/5 — orange  #F15A22 → 0.945, 0.353, 0.133
            uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            // Color 2/6  — dark teal  #004238 → 0.0, 0.259, 0.220
            uColor2: { value: new THREE.Vector3(0.000, 0.259, 0.220) },
            // Color 3/5  — orange again (creates more warm coverage)
            uColor3: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            // Color 4    — blue-purple  #2429C2 → 0.141, 0.161, 0.761
            uColor4: { value: new THREE.Vector3(0.141, 0.161, 0.761) },
            // Color 5    — orange
            uColor5: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            // Color 6    — dark teal
            uColor6: { value: new THREE.Vector3(0.000, 0.259, 0.220) },
        };

        // Full-screen quad
        const fov = this._camera.fov * (Math.PI / 180);
        const h = Math.abs(this._camera.position.z * Math.tan(fov / 2) * 2);
        const w = h * this._camera.aspect;
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.ShaderMaterial({
            uniforms: this._uniforms,
            vertexShader: _vert,
            fragmentShader: _frag,
        });
        this._mesh = new THREE.Mesh(geo, mat);
        this._scene.add(this._mesh);

        window.addEventListener("resize", this._bound.resize);
    }

    show() {
        if (this._active) return;
        this._active = true;
        this._canvas.style.opacity = "1";
        this._clock.start();
        window.addEventListener("mousemove", this._bound.mouse);
        window.addEventListener("touchmove", this._bound.touch, { passive: true });
        this._loop();
    }

    hide() {
        if (!this._active) return;
        this._active = false;
        this._canvas.style.opacity = "0";
        window.removeEventListener("mousemove", this._bound.mouse);
        window.removeEventListener("touchmove", this._bound.touch);
        if (this._animId) { cancelAnimationFrame(this._animId); this._animId = null; }
    }

    _loop() {
        if (!this._active) return;
        this._animId = requestAnimationFrame(() => this._loop());
        this._uniforms.uTime.value += Math.min(this._clock.getDelta(), 0.1);
        this._touch.update();
        this._renderer.render(this._scene, this._camera);
    }

    _onMouse(e) {
        this._touch.addTouch({
            x: e.clientX / window.innerWidth,
            y: 1 - e.clientY / window.innerHeight,
        });
    }

    _onTouch(e) {
        const t = e.touches[0];
        this._touch.addTouch({
            x: t.clientX / window.innerWidth,
            y: 1 - t.clientY / window.innerHeight,
        });
    }

    _onResize() {
        const w = window.innerWidth, h = window.innerHeight;
        this._camera.aspect = w / h;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(w, h);
        this._uniforms.uResolution.value.set(w, h);
        const fov = this._camera.fov * (Math.PI / 180);
        const ph = Math.abs(this._camera.position.z * Math.tan(fov / 2) * 2);
        const pw = ph * this._camera.aspect;
        this._mesh.geometry.dispose();
        this._mesh.geometry = new THREE.PlaneGeometry(pw, ph);
    }
}