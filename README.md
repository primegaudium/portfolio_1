# Harsh Raj - Portfolio Website

A fast, responsive, mobile-first personal portfolio. Pure HTML, CSS and vanilla
JavaScript with zero runtime dependencies.

## 🚀 Features

- **Lightweight & fast**: No WebGL, no frameworks, no build step. One stylesheet + one small script.
- **Loading screen**: Gradient `HR` monogram with a spinner ring.
- **Six sections**: Hero, About, Projects, Skills, Leadership, and Contact.
- **Glass-morphism cards**: Aligned, responsive grids — no overlap.
- **Animated gradient backgrounds**: Hero and Skills use CSS gradient animation.
- **Fully responsive**: Mobile hamburger nav drawer and fluid `clamp()` typography.
- **Scroll reveal + active nav**: Powered by `IntersectionObserver`.
- **Accessible**: Semantic HTML, ARIA labels, and `prefers-reduced-motion` support.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+, vanilla)
- **Fonts**: Space Grotesk, Inter (Google Fonts)
- **Hosting**: Vercel (static)
- **Build**: None required

## 📁 Project Structure

```
├── index.html          # Single-page site with all sections
├── css/
│   └── style.css       # All styles, variables, responsive rules
├── js/
│   └── app.js          # Preloader, mobile nav, scroll reveal, active nav
└── assets/
    ├── images/         # Section images / og image
    └── Harsh-Raj-Resume.pdf
```

## 🎨 Customization

### Updating content
Edit the section markup directly in `index.html` (projects, skills, certs,
leadership and contact are plain HTML blocks).

### Changing colors
Modify the CSS variables at the top of `css/style.css`:
```css
:root {
  --bg: #0a0a0f;
  --text: #f2f2f5;
  --accent: #7c5cff;
  --accent-2: #00d4ff;
  /* ... */
}
```

## 🚀 Running Locally

Any static server works, for example:
```bash
python -m http.server 8000
# or
npm install && npm run dev   # static server on :8000
npm run format               # format with Prettier
```
Then open `http://localhost:8000`.

## 📱 Browser Support

Chrome/Edge, Firefox, Safari (latest) and mobile browsers (iOS Safari, Chrome Mobile).

## 📝 License

Content and code © 2026 Harsh Raj.

## 📧 Contact

- **Email**: myselfharshr@gmail.com
- **GitHub**: [@primetree2](https://github.com/primetree2)
- **LinkedIn**: [harsh-raj-820117173](https://linkedin.com/in/harsh-raj-820117173)

---

Built with ❤️ by Harsh Raj
