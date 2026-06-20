# Deployment Guide

Step-by-step guide for deploying your portfolio to various platforms.

## 📋 Pre-Deployment Checklist

### Content
- [ ] Update personal information in `js/slides-data.js`
- [ ] Replace placeholder images with your own
- [ ] Update project descriptions and links
- [ ] Verify all external links work
- [ ] Update contact information
- [ ] Check for typos and grammar

### Optimization
- [ ] Optimize all images (use WebP if possible)
- [ ] Compress videos
- [ ] Remove unused assets
- [ ] Test on slow network (3G)
- [ ] Run Lighthouse audit (score > 90)

### Testing
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify accessibility
- [ ] Check console for errors
- [ ] Test all interactive elements

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros:** Free, fast, automatic HTTPS, easy setup
**Best for:** Quick deployment, automatic updates

#### Steps:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   cd your-portfolio-folder
   vercel
   ```

3. **Or Deploy via GitHub**
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

4. **Configuration**
   - No build step needed (static site)
   - Root directory: `./`
   - Output directory: `./`

5. **Custom Domain** (optional)
   - Go to project settings
   - Add your domain
   - Update DNS records as instructed

### Option 2: Netlify

**Pros:** Free, drag-and-drop, form handling
**Best for:** Simple deployment, built-in features

#### Steps:

1. **Via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to the upload area
   - Done!

2. **Via Git**
   - Push code to GitHub/GitLab/Bitbucket
   - Connect repository in Netlify
   - Configure build settings:
     - Build command: (leave empty)
     - Publish directory: `./`
   - Deploy

3. **Custom Domain**
   - Go to Domain settings
   - Add custom domain
   - Update DNS records

### Option 3: GitHub Pages

**Pros:** Free, integrated with GitHub
**Best for:** Open source portfolios

#### Steps:

1. **Create Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages"
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

3. **Access Site**
   - URL: `https://username.github.io/portfolio/`
   - May take a few minutes to deploy

4. **Custom Domain** (optional)
   - Add CNAME file with your domain
   - Update DNS records

### Option 4: AWS S3 + CloudFront

**Pros:** Scalable, professional, full control
**Best for:** Production sites, high traffic

#### Steps:

1. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create bucket (e.g., `my-portfolio`)
   - Enable static website hosting
   - Set index document: `index.html`

2. **Upload Files**
   ```bash
   aws s3 sync . s3://my-portfolio --exclude ".git/*"
   ```

3. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::my-portfolio/*"
     }]
   }
   ```

4. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Set default root object: `index.html`

5. **Custom Domain**
   - Add CNAME in CloudFront
   - Update Route 53 or your DNS provider

### Option 5: Firebase Hosting

**Pros:** Free, fast CDN, easy CLI
**Best for:** Google ecosystem integration

#### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Project**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**
   - Public directory: `./`
   - Single-page app: No
   - Overwrite index.html: No

4. **Deploy**
   ```bash
   firebase deploy
   ```

5. **Custom Domain**
   ```bash
   firebase hosting:channel:deploy production
   ```

## 🔧 Configuration Files

### vercel.json (Vercel)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### netlify.toml (Netlify)
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### .htaccess (Apache)
```apache
# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## 🌐 Custom Domain Setup

### DNS Configuration

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

**For GitHub Pages:**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: CNAME
Name: www
Value: username.github.io
```

## 🔒 Security Headers

Add these headers for better security:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com; font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com https://assets.codepen.io; img-src 'self' data:; connect-src 'self';

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📊 Analytics Setup (Optional)

### Google Analytics

Add before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🐛 Troubleshooting

### Issue: Assets not loading
**Solution:** Check file paths are relative, not absolute

### Issue: CORS errors
**Solution:** Ensure CDN resources have proper CORS headers

### Issue: Slow load times
**Solution:** Optimize images, enable compression, use CDN

### Issue: 404 on refresh
**Solution:** Configure server for SPA routing (not needed for this project)

### Issue: HTTPS mixed content
**Solution:** Ensure all resources use HTTPS URLs

## 🔄 Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 📈 Post-Deployment

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure analytics
- [ ] Set up error tracking (Sentry)
- [ ] Monitor performance (Lighthouse CI)

### SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Verify site ownership
- [ ] Check mobile usability
- [ ] Test structured data

### Maintenance
- [ ] Regular content updates
- [ ] Monitor performance metrics
- [ ] Check for broken links
- [ ] Update dependencies
- [ ] Backup regularly

## 🎉 Launch Checklist

- [ ] Domain configured and working
- [ ] HTTPS enabled
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Analytics working
- [ ] Social media links work
- [ ] Contact form works (if applicable)
- [ ] Mobile responsive
- [ ] Fast load times
- [ ] SEO optimized

---

**Congratulations on deploying your portfolio! 🚀**

For questions or issues, refer to the platform-specific documentation or open an issue on GitHub.
