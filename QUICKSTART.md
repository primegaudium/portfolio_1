# Quick Start Guide

Get your portfolio up and running in 5 minutes!

## 🚀 Super Quick Start

```bash
# 1. Navigate to your project folder
cd harsh-raj-portfolio

# 2. Start a local server
python -m http.server 8000

# 3. Open in browser
# Visit: http://localhost:8000
```

That's it! Your portfolio is now running locally.

---

## 📝 Customize Your Content

### Step 1: Update Personal Information

Edit `js/slides-data.js` and update:

```javascript
// Your name and title
headline: "Your Name",
subheadline: "Your Role · Your Title",

// Your bio
bio: "Your bio text here...",

// Your education
education: [
    {
        degree: "Your Degree",
        institution: "Your University",
        period: "Year Range"
    }
],

// Your contact info
links: [
    { label: "your.email@example.com", url: "mailto:your.email@example.com", type: "email" },
    { label: "github.com/yourusername", url: "https://github.com/yourusername", type: "github" },
    // ... more links
]
```

### Step 2: Add Your Projects

In the same file, update the projects array:

```javascript
projects: [
    {
        name: "Your Project Name",
        tagline: "Short Description",
        description: "Longer description of what it does...",
        tech: ["Tech1", "Tech2", "Tech3"],
        url: "https://your-project-url.com",
        highlight: true  // Featured project
    },
    // ... more projects
]
```

### Step 3: Update Skills

```javascript
categories: [
    {
        name: "Category Name",
        skills: ["Skill1", "Skill2", "Skill3"]
    },
    // ... more categories
]
```

### Step 4: Replace Images

1. Add your images to `assets/images/`
2. Update the `media` paths in `js/slides-data.js`:

```javascript
media: "assets/images/your-image.jpg"
```

**Recommended sizes:**
- Images: 1920x1080 (landscape)
- Format: WebP or JPG
- Size: < 500KB each

---

## 🎨 Customize Colors

Edit `css/main.css`:

```css
:root {
    --color-bg: #000000;           /* Background */
    --color-text: #ffffff;         /* Main text */
    --color-accent: #ffffff;       /* Accent color */
    --color-text-muted: rgba(255, 255, 255, 0.75);  /* Secondary text */
    /* ... more colors */
}
```

---

## ⚙️ Adjust Settings

Edit `js/slider-config.js`:

```javascript
settings: {
    transitionDuration: 2.5,    // Slide transition speed (seconds)
    autoSlideSpeed: 10000,      // Auto-advance timing (milliseconds)
    currentEffect: "glass",     // Visual effect type
    // ... more settings
}
```

---

## 🌐 Deploy Online

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Drag your project folder
3. Done!

### GitHub Pages

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/portfolio.git
git push -u origin main

# Enable Pages in repository settings
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Test Your Changes

### Browser Testing
- Open in Chrome, Firefox, Safari
- Test on mobile device
- Check console for errors (F12)

### Performance Check
- Open DevTools (F12)
- Go to Console tab
- Look for FPS and load time metrics

### Accessibility Check
- Test keyboard navigation (Tab, Space, Arrows)
- Test with screen reader
- Check color contrast

---

## 🐛 Common Issues

### Issue: Slides won't advance
**Fix:** Check browser console for errors. Ensure all images/videos exist.

### Issue: Images not loading
**Fix:** Check file paths in `js/slides-data.js`. Paths should be relative.

### Issue: Preloader stuck
**Fix:** Check network tab in DevTools. May be waiting for slow resource.

### Issue: Layout looks broken
**Fix:** Clear browser cache (Ctrl+Shift+R). Check CSS files loaded.

---

## 📚 Learn More

- **Full Documentation:** [README.md](README.md)
- **All Changes:** [CHANGELOG.md](CHANGELOG.md)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Testing Guide:** [TESTING.md](TESTING.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 💡 Pro Tips

### Optimize Images
```bash
# Use online tools:
# - Squoosh.app
# - TinyPNG.com
# - ImageOptim (Mac)
```

### Test Performance
```bash
# Run Lighthouse audit in Chrome DevTools
# Target scores:
# - Performance: > 90
# - Accessibility: > 90
# - Best Practices: > 90
```

### Backup Your Work
```bash
# Use Git for version control
git add .
git commit -m "Updated content"
git push
```

---

## 🎯 Next Steps

1. ✅ Customize content
2. ✅ Replace images
3. ✅ Test locally
4. ✅ Deploy online
5. ✅ Share with world!

---

## 🆘 Need Help?

- **Issues:** Check [TESTING.md](TESTING.md) troubleshooting section
- **Questions:** Open an issue on GitHub
- **Email:** myselfharshr@gmail.com

---

**Happy building! 🎉**

Your portfolio is ready to impress. Make it yours!
