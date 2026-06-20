// ========================================
// PRELOADER.JS — Harsh Raj Portfolio
// SliderLoadingManager verbatim from licensed source,
// adapted to use the #preloader-overlay element
// already present in index.html instead of
// creating one dynamically.
// ========================================

export class SliderLoadingManager {
    constructor() {
        this.overlay = document.getElementById("preloader-overlay");
        this.canvas = document.getElementById("preloader-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.animationId = null;
        this.startTime = null;
        this.duration = 3000;

        this.startAnimation();
    }

    startAnimation() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        let time = 0;
        let lastTime = 0;

        const dotRings = [
            { radius: 20, count: 8 },
            { radius: 35, count: 12 },
            { radius: 50, count: 16 },
            { radius: 65, count: 20 },
            { radius: 80, count: 24 }
        ];

        const colors = {
            primary: "#d4af37",  // Golden
            accent: "#4a90e2",   // Blue
            tertiary: "#ffffff"  // White accent
        };

        const easeInOutSine = (t) =>
            -(Math.cos(Math.PI * t) - 1) / 2;

        const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const smoothstep = (edge0, edge1, x) => {
            const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        };

        const hexToRgb = (hex) => {
            if (hex.startsWith("#")) {
                return [
                    parseInt(hex.slice(1, 3), 16),
                    parseInt(hex.slice(3, 5), 16),
                    parseInt(hex.slice(5, 7), 16)
                ];
            }
            const match = hex.match(/\d+/g);
            return match
                ? [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])]
                : [255, 255, 255];
        };

        const interpolateColor = (color1, color2, t, opacity = 1) => {
            const rgb1 = hexToRgb(color1);
            const rgb2 = hexToRgb(color2);
            const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
            const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
            const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        const animate = (timestamp) => {
            if (!this.startTime) this.startTime = timestamp;
            if (!lastTime) lastTime = timestamp;

            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            time += deltaTime * 0.001;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Centre dot
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            const rgb = hexToRgb(colors.tertiary);
            this.ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.95)`;
            this.ctx.fill();
            
            // Add glow effect to center
            const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
            gradient.addColorStop(0, `rgba(${hexToRgb(colors.primary)[0]}, ${hexToRgb(colors.primary)[1]}, ${hexToRgb(colors.primary)[2]}, 0.3)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(centerX - 12, centerY - 12, 24, 24);

            // Dot rings
            dotRings.forEach((ring, ringIndex) => {
                for (let i = 0; i < ring.count; i++) {
                    const angle = (i / ring.count) * Math.PI * 2;
                    const pulseTime = time * 2 - ringIndex * 0.4;

                    const radiusPulse =
                        easeInOutSine((Math.sin(pulseTime) + 1) / 2) * 6 - 3;

                    const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
                    const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);

                    const opacityPhase = (Math.sin(pulseTime + i * 0.2) + 1) / 2;
                    const opacityBase = 0.4 + easeInOutSine(opacityPhase) * 0.6;
                    const highlightPhase = (Math.sin(pulseTime) + 1) / 2;
                    const highlightIntensity = easeInOutCubic(highlightPhase);

                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);

                    // Alternate between golden and blue colors
                    const useGolden = (ringIndex + i) % 2 === 0;
                    const baseColor = useGolden ? colors.primary : colors.accent;
                    const highlightColor = useGolden ? colors.accent : colors.primary;

                    const colorBlend = smoothstep(0.2, 0.8, highlightIntensity);
                    this.ctx.fillStyle = interpolateColor(
                        baseColor,
                        highlightColor,
                        colorBlend,
                        opacityBase
                    );
                    this.ctx.fill();
                    
                    // Add subtle glow for highlighted dots
                    if (highlightIntensity > 0.7) {
                        const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, 6);
                        const glowRgb = hexToRgb(highlightColor);
                        glowGradient.addColorStop(0, `rgba(${glowRgb[0]}, ${glowRgb[1]}, ${glowRgb[2]}, ${opacityBase * 0.3})`);
                        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        this.ctx.fillStyle = glowGradient;
                        this.ctx.fillRect(x - 6, y - 6, 12, 12);
                    }
                }
            });

            // Continue animation until manually stopped
            // (removed auto-complete after duration)
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    complete() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.overlay) {
            // Use the CSS class from slider.css instead of inline styles
            this.overlay.classList.add("fade-out");

            setTimeout(() => {
                this.overlay?.remove();

                // Reveal the slider wrapper
                setTimeout(() => {
                    const sliderWrapper = document.querySelector(".slider-wrapper");
                    if (sliderWrapper) {
                        sliderWrapper.classList.add("loaded");
                    }
                }, 500);
            }, 800);
        }
    }
}