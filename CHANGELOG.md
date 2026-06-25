# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-06-25

### 🔥 Complete Rebuild

Replaced the heavy WebGL/THREE.js/GSAP slider with a fast, responsive,
mobile-first static site. This fixes the long load times, lag, unresponsive
links, overlapping cards/text and weak mobile support.

#### Added
- New single-page layout (`index.html`) with semantic Hero, About, Projects, Skills, Leadership and Contact sections
- New `css/style.css`: CSS variables, glass cards, responsive grids, fluid `clamp()` typography
- New `js/app.js`: gradient loading screen, mobile hamburger nav, scroll reveal and active-nav via `IntersectionObserver`
- Animated CSS gradient backgrounds for Hero and Skills
- Project thumbnails (lazy-loaded) on Argos, HealthAssist and CodeSage cards
- `prefers-reduced-motion` support

#### Fixed
- Social and CTA buttons are now real `<a>` links and fully clickable
- Corrected the Argos project link (`https://argos-indol.vercel.app/`)
- Card/text alignment and overlap across all sections
- Text visibility (all content now sits in cards)

#### Removed
- WebGL slider, shaders, liquid background, GSAP and all slider JS
- Old `css/main.css`, `css/slider.css`, `css/overlay.css`
- Unused `assets/videos/slide-04-skills.mp4`
- Debug/test pages and stale slider-era docs

---

## [2.0.0] - 2026-05-15

### 🎨 Visual Improvements

#### Fixed
- **Preloader Colors**: Restored golden (#d4af37) and blue (#4a90e2) color scheme with enhanced glow effects
- **Hero Social Links**: Expanded hover area to include text, not just the arrow icon
- **About Page Layout**: Fixed glass panel overlap with header by adding proper top padding
- **Projects Headline**: Increased "Things I've Built" text size from 32-60px to 48-80px
- **CSS Import Warning**: Moved @import rules to the top of main.css to comply with CSS standards

#### Enhanced
- **Preloader Animation**: 
  - Larger center dot (4px radius) with golden glow effect
  - Alternating golden/blue colors for dot rings
  - Increased dot size (2.5px) with subtle glow for highlighted dots
  - Improved opacity and animation smoothness

- **Responsive Design**:
  - Better mobile touch targets (minimum 44px height)
  - Improved glass panel padding on mobile devices
  - Compact project card layout for small screens
  - Single column stats grid on very small screens

### 🚀 Performance Improvements

#### Added
- **FPS Monitoring**: Real-time frame rate tracking with low FPS warnings
- **Delta Time Calculation**: Smoother animations using time-based updates
- **Video Loading**: Increased timeout from 15s to 20s for better reliability
- **Utility Functions**: New utils.js with debounce, throttle, and performance helpers

#### Optimized
- **Event Binding**: Added double-binding prevention
- **Progress Updates**: Clamped progress values to 0-100 range
- **Error Handling**: Comprehensive try-catch blocks and validation

### 📚 Code Quality

#### Refactored
- **JSDoc Comments**: Added comprehensive documentation for all functions
- **Error Handling**: Improved error messages and validation throughout
- **Type Safety**: Added parameter validation and safe parsing
- **Code Organization**: Better separation of concerns and modular structure

#### Added
- **Utility Module**: New utils.js with reusable helper functions
  - debounce/throttle for performance
  - Accessibility helpers (screen reader announcements)
  - Safe element getters with error handling
  - Viewport detection and lazy loading utilities

- **Documentation**:
  - Comprehensive README.md with setup instructions
  - CHANGELOG.md for tracking changes
  - .editorconfig for consistent code style

### ♿ Accessibility

#### Improved
- **ARIA Labels**: Better navigation labels for screen readers
- **Keyboard Navigation**: Enhanced keyboard support documentation
- **Touch Targets**: Minimum 44px touch targets on mobile
- **Screen Reader Support**: Added utility for dynamic announcements

### 🐛 Bug Fixes

#### Fixed
- **Navigation Validation**: Added bounds checking for slide indices
- **Texture Loading**: Better error handling for missing textures
- **Element Queries**: Safe element getters with null checks
- **Progress Animation**: Prevented negative or >100% progress values

### 🔧 Technical Improvements

#### Enhanced
- **Renderer Initialization**: Detailed logging for debugging
- **Transition Logic**: Added validation for texture availability
- **Timer Management**: Better cleanup and state management
- **Event Handlers**: Improved event delegation and error handling

### 📱 Mobile Improvements

#### Added
- **Touch Gestures**: Improved swipe detection
- **Responsive Breakpoints**: Better layouts for 480px, 768px, 1024px
- **Mobile Optimization**: Reduced padding and improved spacing
- **Performance**: Optimized for mobile devices

### 🎯 Developer Experience

#### Added
- **Console Logging**: Detailed initialization and error logs
- **Warning System**: Helpful warnings for common issues
- **Code Comments**: Comprehensive inline documentation
- **Project Structure**: Clear file organization and naming

---

## [1.0.0] - Initial Release

### Features
- WebGL-powered slide transitions
- 6 interactive sections (Hero, About, Projects, Skills, Leadership, Contact)
- Glass morphism UI effects
- GSAP animations
- Responsive design
- Keyboard and touch navigation
