# Harsh Raj - Portfolio Website

A modern, interactive portfolio website featuring WebGL-powered transitions and glass morphism UI effects.

## 🚀 Features

- **WebGL Background Effects**: Stunning liquid glass transitions powered by THREE.js
- **6 Interactive Sections**: Hero, About, Projects, Skills, Leadership, and Contact
- **Glass Morphism UI**: Modern frosted glass panels with SVG displacement filters
- **Smooth Animations**: GSAP-powered slide transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Space/Arrow keys for easy navigation
- **Touch Support**: Swipe gestures for mobile devices
- **Accessibility**: ARIA labels and semantic HTML
- **Performance Optimized**: Lazy loading, debouncing, and efficient rendering

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: THREE.js
- **Animations**: GSAP (GreenSock Animation Platform)
- **Fonts**: PP Neue Montreal, PP Supply Mono, Cormorant Garamond
- **Build**: No build process required - pure vanilla JavaScript

## 📁 Project Structure

```
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Global styles and variables
│   ├── overlay.css        # Overlay content styles
│   └── slider.css         # Slider and navigation styles
├── js/
│   ├── main.js            # Entry point and initialization
│   ├── preloader.js       # Loading animation
│   ├── renderer.js        # THREE.js setup and rendering
│   ├── shaders.js         # WebGL shader code
│   ├── slider-config.js   # Configuration settings
│   ├── slides-data.js     # Content data for all slides
│   ├── navigation.js      # Navigation and overlay population
│   ├── transitions.js     # Slide transitions and timing
│   ├── events.js          # Event listeners
│   ├── controls.js        # Visual effects controls (disabled)
│   ├── liquid-bg.js       # Liquid background effects
│   └── utils.js           # Utility functions
└── assets/
    ├── images/            # Slide background images
    └── videos/            # Slide background videos
```

## 🎨 Customization

### Updating Content

Edit `js/slides-data.js` to update:
- Personal information
- Projects
- Skills
- Certifications
- Leadership roles
- Contact information

### Changing Colors

Modify CSS variables in `css/main.css`:
```css
:root {
    --color-bg: #000000;
    --color-text: #ffffff;
    --color-accent: #ffffff;
    /* ... more variables */
}
```

### Adjusting Transitions

Edit `js/slider-config.js`:
```javascript
settings: {
    transitionDuration: 2.5,  // Transition speed
    autoSlideSpeed: 10000,    // Auto-advance timing
    // ... more settings
}
```

## 🚀 Running Locally

### Option 1: Python HTTP Server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```

### Option 3: VS Code Live Server
Install the "Live Server" extension and click "Go Live"

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: WebGL support required

## ⚡ Performance Tips

1. **Images**: Use optimized images (WebP format recommended)
2. **Videos**: Compress videos and use appropriate codecs
3. **Lazy Loading**: Images and videos load on demand
4. **Reduced Motion**: Respects user's motion preferences

## 🐛 Known Issues

- Video loading may timeout on slow connections (fallback to placeholder)
- Some older browsers may not support all CSS features

## 📝 License

This portfolio is based on a licensed slider component. The content and customizations are © 2026 Harsh Raj.

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and adapt for your own use!

## 📧 Contact

- **Email**: myselfharshr@gmail.com
- **GitHub**: [@primetree2](https://github.com/primetree2)
- **LinkedIn**: [harsh-raj-820117173](https://linkedin.com/in/harsh-raj-820117173)

---

Built with ❤️ by Harsh Raj
