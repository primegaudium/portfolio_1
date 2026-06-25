# Deployment Guide

This portfolio is a static site (`index.html` + `css/style.css` + `js/app.js`).
There is no build step — just serve the files.

## Vercel (current host)

The site auto-deploys on every push to `main`.

- **Framework preset:** Other / None
- **Build command:** (none)
- **Output directory:** `./`

`vercel.json` already sets clean URLs, long-cache headers for `/assets/*`,
and basic security headers (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`).

To deploy manually:
```bash
npm install -g vercel
vercel --prod
```

## Other static hosts

The same files work anywhere static files are served. Set the publish/output
directory to the project root (`./`); no build command is needed.

- **Netlify:** drag-and-drop the folder, or connect the repo with an empty build command and publish dir `./`.
- **GitHub Pages:** push to `main`, then Settings → Pages → Deploy from branch (`main`, `/root`).
- **Cloudflare Pages / Firebase Hosting / S3 + CloudFront:** point the static origin at the repo root.

## Custom domain

Add the domain in your host's dashboard and update DNS as instructed
(typically an `A` record for the apex and a `CNAME` for `www`).

## Pre-deploy checklist

- [ ] External links work (projects, socials, certs)
- [ ] `assets/Harsh-Raj-Resume.pdf` opens from the Resume button
- [ ] Looks correct on mobile and desktop
- [ ] No console errors
- [ ] Lighthouse Performance / Accessibility / Best Practices / SEO all green
