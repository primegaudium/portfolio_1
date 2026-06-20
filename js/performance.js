// ========================================
// PERFORMANCE.JS — Harsh Raj Portfolio
// Performance monitoring and optimization utilities
// ========================================

/**
 * Performance monitor class for tracking metrics
 */
export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            loadTime: 0,
            textureLoadTime: 0,
            memoryUsage: 0
        };
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsUpdateTime = this.lastTime;
    }

    /**
     * Updates FPS counter
     * @param {number} currentTime - Current timestamp
     */
    updateFPS(currentTime) {
        this.frameCount++;
        const elapsed = currentTime - this.fpsUpdateTime;
        
        if (elapsed >= 1000) {
            this.metrics.fps = Math.round(this.frameCount * 1000 / elapsed);
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;
            
            // Warn if FPS drops below 30
            if (this.metrics.fps < 30) {
                console.warn(`⚠️ Low FPS: ${this.metrics.fps}`);
            }
        }
        
        this.metrics.frameTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
    }

    /**
     * Records load time
     * @param {number} startTime - Start timestamp
     */
    recordLoadTime(startTime) {
        this.metrics.loadTime = performance.now() - startTime;
        console.log(`⏱️ Total load time: ${this.metrics.loadTime.toFixed(2)}ms`);
    }

    /**
     * Records texture load time
     * @param {number} startTime - Start timestamp
     */
    recordTextureLoadTime(startTime) {
        this.metrics.textureLoadTime = performance.now() - startTime;
        console.log(`🖼️ Texture load time: ${this.metrics.textureLoadTime.toFixed(2)}ms`);
    }

    /**
     * Gets memory usage if available
     * @returns {Object|null} Memory info or null
     */
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
                total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
                limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
            };
        }
        return null;
    }

    /**
     * Logs performance report
     */
    logReport() {
        console.group('📊 Performance Report');
        console.log(`FPS: ${this.metrics.fps}`);
        console.log(`Frame Time: ${this.metrics.frameTime.toFixed(2)}ms`);
        console.log(`Load Time: ${this.metrics.loadTime.toFixed(2)}ms`);
        console.log(`Texture Load Time: ${this.metrics.textureLoadTime.toFixed(2)}ms`);
        
        const memory = this.getMemoryUsage();
        if (memory) {
            console.log(`Memory: ${memory.used}MB / ${memory.total}MB (Limit: ${memory.limit}MB)`);
        }
        console.groupEnd();
    }

    /**
     * Gets current metrics
     * @returns {Object} Current metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
}

/**
 * Image optimization helper
 */
export class ImageOptimizer {
    /**
     * Checks if WebP is supported
     * @returns {Promise<boolean>} True if WebP is supported
     */
    static async supportsWebP() {
        if (!self.createImageBitmap) return false;
        
        const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
        const blob = await fetch(webpData).then(r => r.blob());
        return createImageBitmap(blob).then(() => true, () => false);
    }

    /**
     * Gets optimal image format
     * @param {string} imagePath - Original image path
     * @returns {Promise<string>} Optimal image path
     */
    static async getOptimalFormat(imagePath) {
        const supportsWebP = await this.supportsWebP();
        if (supportsWebP && !imagePath.endsWith('.webp')) {
            const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            // Check if WebP version exists
            try {
                const response = await fetch(webpPath, { method: 'HEAD' });
                if (response.ok) return webpPath;
            } catch (e) {
                // WebP version doesn't exist, use original
            }
        }
        return imagePath;
    }
}

/**
 * Resource preloader
 */
export class ResourcePreloader {
    constructor() {
        this.queue = [];
        this.loaded = 0;
        this.total = 0;
    }

    /**
     * Adds resource to preload queue
     * @param {string} url - Resource URL
     * @param {string} type - Resource type ('image', 'video', 'font')
     */
    add(url, type = 'image') {
        this.queue.push({ url, type });
        this.total++;
    }

    /**
     * Preloads all queued resources
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<void>}
     */
    async loadAll(onProgress) {
        const promises = this.queue.map(async (resource) => {
            try {
                await this._loadResource(resource);
                this.loaded++;
                if (onProgress) {
                    onProgress(this.loaded, this.total);
                }
            } catch (error) {
                console.warn(`Failed to preload ${resource.url}:`, error);
            }
        });

        await Promise.all(promises);
    }

    /**
     * Loads a single resource
     * @private
     * @param {Object} resource - Resource object
     * @returns {Promise<void>}
     */
    async _loadResource(resource) {
        switch (resource.type) {
            case 'image':
                return this._loadImage(resource.url);
            case 'video':
                return this._loadVideo(resource.url);
            case 'font':
                return this._loadFont(resource.url);
            default:
                throw new Error(`Unknown resource type: ${resource.type}`);
        }
    }

    /**
     * Loads an image
     * @private
     * @param {string} url - Image URL
     * @returns {Promise<HTMLImageElement>}
     */
    _loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Loads a video
     * @private
     * @param {string} url - Video URL
     * @returns {Promise<HTMLVideoElement>}
     */
    _loadVideo(url) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.onloadeddata = () => resolve(video);
            video.onerror = reject;
            video.src = url;
        });
    }

    /**
     * Loads a font
     * @private
     * @param {string} url - Font URL
     * @returns {Promise<void>}
     */
    async _loadFont(url) {
        if (document.fonts && document.fonts.load) {
            await document.fonts.load(url);
        }
    }

    /**
     * Gets load progress
     * @returns {number} Progress percentage (0-100)
     */
    getProgress() {
        return this.total > 0 ? (this.loaded / this.total) * 100 : 0;
    }
}

/**
 * Adaptive quality manager
 */
export class AdaptiveQuality {
    constructor() {
        this.currentQuality = 'high';
        this.fpsHistory = [];
        this.maxHistoryLength = 60; // 1 second at 60fps
    }

    /**
     * Updates quality based on FPS
     * @param {number} fps - Current FPS
     * @returns {string} Recommended quality level
     */
    updateQuality(fps) {
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > this.maxHistoryLength) {
            this.fpsHistory.shift();
        }

        const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

        if (avgFps < 30 && this.currentQuality !== 'low') {
            this.currentQuality = 'low';
            console.log('🔽 Reducing quality to maintain performance');
        } else if (avgFps > 50 && this.currentQuality !== 'high') {
            this.currentQuality = 'high';
            console.log('🔼 Increasing quality');
        } else if (avgFps >= 30 && avgFps <= 50 && this.currentQuality !== 'medium') {
            this.currentQuality = 'medium';
        }

        return this.currentQuality;
    }

    /**
     * Gets quality settings
     * @returns {Object} Quality settings
     */
    getSettings() {
        const settings = {
            high: {
                pixelRatio: Math.min(window.devicePixelRatio, 2),
                antialias: true,
                shadowQuality: 'high'
            },
            medium: {
                pixelRatio: 1.5,
                antialias: true,
                shadowQuality: 'medium'
            },
            low: {
                pixelRatio: 1,
                antialias: false,
                shadowQuality: 'low'
            }
        };

        return settings[this.currentQuality];
    }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
