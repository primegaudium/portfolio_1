# Contributing Guide

Thank you for your interest in improving this portfolio! This guide will help you understand the project structure and best practices.

## 🏗️ Architecture Overview

### Core Modules

1. **main.js** - Entry point, orchestrates initialization
2. **renderer.js** - THREE.js setup, texture loading, WebGL rendering
3. **transitions.js** - Slide navigation, GSAP animations, timing
4. **navigation.js** - UI updates, overlay population, progress bars
5. **events.js** - Event listeners and user interactions
6. **slides-data.js** - Content data (easily editable)

### Data Flow

```
User Action → events.js → transitions.js → renderer.js → Visual Update
                ↓              ↓
         navigation.js    slider-config.js
```

## 📝 Code Style Guidelines

### JavaScript

- Use ES6+ features (const/let, arrow functions, template literals)
- Add JSDoc comments for all functions
- Use descriptive variable names
- Keep functions small and focused
- Handle errors gracefully

```javascript
/**
 * Brief description of what the function does
 * @param {type} paramName - Parameter description
 * @returns {type} Return value description
 */
export const functionName = (paramName) => {
    // Implementation
};
```

### CSS

- Use CSS custom properties for theming
- Follow BEM-like naming conventions
- Mobile-first responsive design
- Group related properties together

```css
.component-name {
    /* Layout */
    display: flex;
    
    /* Spacing */
    padding: var(--spacing-md);
    
    /* Typography */
    font-family: var(--font-sans);
    
    /* Visual */
    background: var(--color-bg);
    
    /* Animation */
    transition: opacity var(--transition-base);
}
```

## 🧪 Testing Checklist

### Before Committing

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS, Android)
- [ ] Check console for errors/warnings
- [ ] Verify all slides load correctly
- [ ] Test keyboard navigation (Space, Arrows)
- [ ] Test touch gestures (swipe)
- [ ] Verify responsive breakpoints (480px, 768px, 1024px)
- [ ] Check accessibility (screen reader, keyboard-only)
- [ ] Test with slow network (throttle to 3G)
- [ ] Verify all links work

### Performance Checks

- [ ] Images optimized (WebP preferred)
- [ ] Videos compressed
- [ ] No console errors
- [ ] Smooth 60fps animations
- [ ] Fast initial load (<3s)

## 🎨 Adding New Content

### Adding a New Slide

1. Add image/video to `assets/images/` or `assets/videos/`
2. Add slide data to `js/slides-data.js`:

```javascript
{
    id: "new-slide",
    title: "New Slide",
    media: "assets/images/new-slide.jpg",
    overlay: {
        type: "custom",
        // ... overlay data
    }
}
```

3. Create overlay HTML in `index.html`:

```html
<section class="slide-overlay overlay--custom" data-slide="6">
    <!-- Your content -->
</section>
```

4. Add styles in `css/overlay.css`:

```css
.overlay--custom {
    /* Your styles */
}
```

5. Add builder function in `js/navigation.js`:

```javascript
const _buildCustom = (o) => {
    // Build your overlay
};
```

### Updating Existing Content

Simply edit `js/slides-data.js` - no code changes needed!

## 🐛 Debugging Tips

### Common Issues

**Slide won't advance:**
- Check console for errors
- Verify `sliderEnabled` is true
- Check if textures loaded successfully

**Overlay not showing:**
- Verify `data-slide` attribute matches index
- Check CSS `opacity` and `pointer-events`
- Ensure content is populated in navigation.js

**Performance issues:**
- Check FPS in console
- Reduce image/video sizes
- Disable effects temporarily to isolate issue

### Debug Mode

Add to `js/main.js` for verbose logging:

```javascript
window.DEBUG = true;
```

## 🚀 Optimization Guidelines

### Images
- Use WebP format with JPEG fallback
- Optimize with tools like Squoosh or ImageOptim
- Target: <500KB per image
- Dimensions: 1920x1080 or similar

### Videos
- Use H.264 codec for compatibility
- Compress with HandBrake or FFmpeg
- Target: <5MB per video
- Consider using poster images

### Code
- Minimize DOM queries (cache selectors)
- Use event delegation where possible
- Debounce/throttle expensive operations
- Lazy load non-critical resources

## 📚 Resources

- [THREE.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## 🤝 Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (see checklist above)
5. Commit with descriptive messages
6. Push to your fork
7. Open a Pull Request with detailed description

## 💡 Ideas for Contributions

- Add new transition effects
- Improve accessibility features
- Optimize performance
- Add unit tests
- Improve documentation
- Fix bugs
- Add new overlay types

## 📧 Questions?

Feel free to open an issue or contact me at myselfharshr@gmail.com

---

Happy coding! 🎉
