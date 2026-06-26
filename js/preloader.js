// ========================================
// PRELOADER.JS — Enhanced Aesthetic Version
// Amber → Cyan animated ring loader
// ========================================

export class SliderLoadingManager {
    constructor() {
        this.overlay = document.getElementById("preloader-overlay");
        this.canvas = document.getElementById("preloader-canvas");
        this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
        this.animationId = null;
        this.startTime = null;
        this.duration = 3000;

        // If the preloader markup is absent or 2D context is unavailable,
        // skip straight to revealing the slider instead of throwing.
        if (!this.canvas || !this.ctx) {
            this.complete();
            return;
        }

        this.startAnimation();
    }

    startAnimation() {
        const ctx = this.ctx;
        const canvas = this.canvas;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        let lastTime = 0;
        let elapsed = 0;

        const dotRings = [
            { radius: 20, count: 8 },
            { radius: 36, count: 12 },
            { radius: 52, count: 16 },
            { radius: 68, count: 20 },
            { radius: 84, count: 24 }
        ];

        const colors = {
            amber: [245, 166, 35],
            cyan: [0, 212, 255]
        };

        const easeInOutSine = (t) =>
            -(Math.cos(Math.PI * t) - 1) / 2;

        const easeInOutCubic = (t) =>
            t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const smoothstep = (edge0, edge1, x) => {
            const t = Math.max(
                0,
                Math.min(1, (x - edge0) / (edge1 - edge0))
            );
            return t * t * (3 - 2 * t);
        };

        const animate = (timestamp) => {
            if (!this.startTime) this.startTime = timestamp;
            if (!lastTime) lastTime = timestamp;

            const delta = timestamp - lastTime;
            lastTime = timestamp;
            elapsed += delta;

            const time = elapsed * 0.001;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Subtle glow
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(245,166,35,0.4)";

            // Center dot
            ctx.beginPath();
            ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(245,166,35,0.9)";
            ctx.fill();

            // Dot rings
            dotRings.forEach((ring, ringIndex) => {
                for (let i = 0; i < ring.count; i++) {
                    const angle =
                        (i / ring.count) * Math.PI * 2;

                    const pulseTime =
                        time * 2 - ringIndex * 0.4;

                    const radiusPulse =
                        easeInOutSine(
                            (Math.sin(pulseTime) + 1) / 2
                        ) *
                        6 -
                        3;

                    const x =
                        centerX +
                        Math.cos(angle) *
                        (ring.radius + radiusPulse);

                    const y =
                        centerY +
                        Math.sin(angle) *
                        (ring.radius + radiusPulse);

                    const opacityPhase =
                        (Math.sin(
                            pulseTime + i * 0.2
                        ) +
                            1) /
                        2;

                    const opacityBase =
                        0.3 +
                        easeInOutSine(opacityPhase) *
                        0.7;

                    const highlightPhase =
                        (Math.sin(pulseTime) + 1) / 2;

                    const highlightIntensity =
                        easeInOutCubic(
                            highlightPhase
                        );

                    const colorBlend = smoothstep(
                        0.2,
                        0.8,
                        highlightIntensity
                    );

                    const r = Math.round(
                        colors.amber[0] +
                        (colors.cyan[0] -
                            colors.amber[0]) *
                        colorBlend
                    );

                    const g = Math.round(
                        colors.amber[1] +
                        (colors.cyan[1] -
                            colors.amber[1]) *
                        colorBlend
                    );

                    const b = Math.round(
                        colors.amber[2] +
                        (colors.cyan[2] -
                            colors.amber[2]) *
                        colorBlend
                    );

                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r},${g},${b},${opacityBase})`;
                    ctx.fill();
                }
            });

            // Reset glow for arc
            ctx.shadowBlur = 0;

            // Progress arc
            const progress = Math.min(
                (timestamp - this.startTime) /
                this.duration,
                1
            );

            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                100,
                -Math.PI / 2,
                -Math.PI / 2 +
                progress * Math.PI * 2
            );

            ctx.strokeStyle = `rgba(245,166,35,${0.15 + progress * 0.35
                })`;

            ctx.lineWidth = 1;
            ctx.stroke();

            if (
                timestamp - this.startTime >=
                this.duration
            ) {
                this.complete();
                return;
            }

            this.animationId =
                requestAnimationFrame(animate);
        };

        this.animationId =
            requestAnimationFrame(animate);
    }

    complete() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.overlay) {
            this.overlay.classList.add("fade-out");

            setTimeout(() => {
                this.overlay?.remove();

                setTimeout(() => {
                    const sliderWrapper =
                        document.querySelector(
                            ".slider-wrapper"
                        );
                    if (sliderWrapper) {
                        sliderWrapper.classList.add(
                            "loaded"
                        );
                    }
                }, 500);
            }, 800);
        }
    }
}