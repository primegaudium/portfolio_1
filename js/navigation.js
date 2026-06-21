// ========================================
// NAVIGATION.JS — Harsh Raj Portfolio
// Bottom nav items, progress bars, slide
// counters, and overlay DOM population
// from slides-data.js
// ========================================

import { slides, slidesMeta } from "./slides-data.js";

// ────────────────────────────────────────
// BOTTOM NAV — build & update
// ────────────────────────────────────────

/**
 * Creates the bottom navigation bar with progress indicators
 */
export const createSlidesNavigation = () => {
    const navContainer = document.getElementById("slidesNav");
    if (!navContainer) {
        console.warn("Navigation container not found");
        return;
    }
    navContainer.innerHTML = "";

    slidesMeta.forEach((slide, index) => {
        const navItem = document.createElement("button");
        navItem.className = `slide-nav-item ${index === 0 ? "active" : ""}`;
        navItem.dataset.slideIndex = index;
        navItem.setAttribute("aria-label", `Go to slide ${index + 1}: ${slide.title}`);
        navItem.innerHTML = `
      <div class="slide-progress-line">
        <div class="slide-progress-fill" style="width:0%"></div>
      </div>
      <div class="slide-nav-title">${slide.title}</div>
    `;
        navContainer.appendChild(navItem);
    });
};

/**
 * Updates which navigation item is marked as active
 * @param {number} activeIndex - The index of the active slide
 */
export const updateNavigationState = (activeIndex) => {
    document.querySelectorAll(".slide-nav-item").forEach((item, i) => {
        item.classList.toggle("active", i === activeIndex);
    });
};

/**
 * Updates the progress bar for a specific slide
 * @param {number} slideIndex - The slide index
 * @param {number} progress - Progress percentage (0-100)
 */
export const updateSlideProgress = (slideIndex, progress) => {
    const fill = _getProgressFill(slideIndex);
    if (!fill) return;
    fill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    fill.style.opacity = "1";
};

/**
 * Fades out the progress bar for a specific slide
 * @param {number} slideIndex - The slide index
 */
export const fadeSlideProgress = (slideIndex) => {
    const fill = _getProgressFill(slideIndex);
    if (!fill) return;
    fill.style.opacity = "0";
    setTimeout(() => (fill.style.width = "0%"), 300);
};

/**
 * Quickly resets the progress bar
 * @param {number} slideIndex - The slide index
 */
export const quickResetProgress = (slideIndex) => {
    const fill = _getProgressFill(slideIndex);
    if (!fill) return;
    fill.style.transition = "width 0.2s ease-out";
    fill.style.width = "0%";
    setTimeout(() => {
        fill.style.transition = "width 0.1s ease, opacity 0.3s ease";
    }, 200);
};

/**
 * Gets the progress fill element for a slide
 * @private
 * @param {number} index - The slide index
 * @returns {HTMLElement|null} The progress fill element
 */
const _getProgressFill = (index) => {
    const items = document.querySelectorAll(".slide-nav-item");
    return items[index]?.querySelector(".slide-progress-fill") ?? null;
};

// ────────────────────────────────────────
// SLIDE COUNTER
// ────────────────────────────────────────

/**
 * Updates the slide counter display
 * @param {number} index - Current slide index (0-based)
 */
export const updateCounter = (index) => {
    const numEl = document.getElementById("slideNumber");
    const totalEl = document.getElementById("slideTotal");
    if (numEl) numEl.textContent = String(index + 1).padStart(2, "0");
    if (totalEl) totalEl.textContent = String(slidesMeta.length).padStart(2, "0");
};

// ────────────────────────────────────────
// OVERLAY — active state
// ────────────────────────────────────────

/**
 * Activates the overlay for a specific slide
 * @param {number} index - The slide index to activate
 */
export const activateOverlay = (index) => {
    document.querySelectorAll(".slide-overlay").forEach((el) => {
        el.classList.toggle("active", parseInt(el.dataset.slide) === index);
    });
};

// ────────────────────────────────────────
// OVERLAY DOM POPULATION
// Renders each slide's content into the
// empty containers defined in index.html
// ────────────────────────────────────────

/**
 * Populates all overlay content from slides data
 */
export const populateOverlays = () => {
    slides.forEach((slide) => {
        const { id, overlay } = slide;
        try {
            switch (overlay.type) {
                case "hero": _buildHero(overlay); break;
                case "about": _buildAbout(overlay); break;
                case "projects": _buildProjects(overlay); break;
                case "skills": _buildSkills(overlay); break;
                case "leadership": _buildLeadership(overlay); break;
                case "contact": _buildContact(overlay); break;
                default:
                    console.warn(`Unknown overlay type: ${overlay.type}`);
            }
        } catch (error) {
            console.error(`Error building overlay for slide "${id}":`, error);
        }
    });
};

// ── HERO ────────────────────────────────
const _buildHero = (o) => {
    _set("hero-eyebrow", o.eyebrow);
    _set("hero-name", o.headline);
    _set("hero-role", o.subheadline);
    _set("hero-tagline", o.tagline);

    // CTA buttons
    const actions = document.getElementById("hero-actions");
    if (actions && o.cta) {
        const resumeBtn = o.resumeUrl
            ? `<a class="hero-cta-secondary" href="${o.resumeUrl}" download target="_blank" rel="noopener noreferrer">Resume</a>`
            : "";
        actions.innerHTML = `
      <button class="hero-cta-primary"   data-slide-target="${o.cta.primary.slideTarget}">
        ${o.cta.primary.label}
      </button>
      <button class="hero-cta-secondary" data-slide-target="${o.cta.secondary.slideTarget}">
        ${o.cta.secondary.label}
      </button>
      ${resumeBtn}
    `;
    }

    // Social links
    const socials = document.getElementById("hero-socials");
    if (socials && o.socials) {
        socials.innerHTML = o.socials
            .map(
                (s) =>
                    `<a href="${s.url}" class="overlay-link" target="_blank" rel="noopener noreferrer">${s.label}</a>`
            )
            .join("");
    }
};

// ── ABOUT ───────────────────────────────
const _buildAbout = (o) => {
    _set("about-eyebrow", o.label);
    _set("about-headline", o.headline);
    _set("about-bio", o.bio);

    // Education list
    const eduEl = document.getElementById("about-education");
    if (eduEl && o.education) {
        eduEl.innerHTML = o.education
            .map(
                (e) => `
        <div class="edu-item">
          <p class="edu-degree">${e.degree}</p>
          <p class="edu-meta">${e.institution} &nbsp;·&nbsp; ${e.period}</p>
        </div>`
            )
            .join("");
    }

    // Stats grid
    const statsEl = document.getElementById("about-stats");
    if (statsEl && o.highlights) {
        statsEl.innerHTML = o.highlights
            .map(
                (h) => `
        <div class="stat-cell">
          <span class="stat-value">${h.value}</span>
          <span class="stat-label">${h.label}</span>
        </div>`
            )
            .join("");
    }
};

// ── PROJECTS ────────────────────────────
const _buildProjects = (o) => {
    _set("projects-headline", o.headline);
    _set("projects-count", `${o.projects.length} Projects`);

    // Optional research highlight
    const researchEl = document.getElementById("projects-research");
    if (researchEl && o.research) {
        researchEl.innerHTML = `
        <p class="research-label">${o.research.title}</p>
        <p class="research-heading">${o.research.heading}</p>
        <p class="research-desc">${o.research.description}</p>`;
    }

    const listEl = document.getElementById("projects-list");
    if (!listEl) return;

    listEl.innerHTML = o.projects
        .map((p) => {
            const techTags = p.tech
                .map((t) => `<span class="tag">${t}</span>`)
                .join("");

            const liveHtml = p.url
                ? `<a href="${p.url}" class="overlay-link" target="_blank" rel="noopener noreferrer">Live</a>`
                : "";
            const repoHtml = p.repo
                ? `<a href="${p.repo}" class="overlay-link" target="_blank" rel="noopener noreferrer">GitHub</a>`
                : "";
            const linkHtml = (liveHtml || repoHtml)
                ? `<span class="project-links">${liveHtml}${repoHtml}</span>`
                : `<span class="overlay-link" style="opacity:0.3;pointer-events:none;cursor:default">Hardware</span>`;

            return `
        <article class="project-card ${p.highlight ? "featured" : ""}">
          <div class="project-header">
            <h3 class="project-name">${p.name}</h3>
            <span class="project-tagline">${p.tagline}</span>
          </div>
          <p class="project-desc">${p.description}</p>
          <div class="project-footer">
            <div class="tags-row">${techTags}</div>
            ${linkHtml}
          </div>
        </article>`;
        })
        .join("");
};

// ── SKILLS ──────────────────────────────
const _buildSkills = (o) => {
    _set("skills-eyebrow", o.label);
    _set("skills-headline", o.headline);
    _set("certs-label", "Certifications");

    // Skill categories
    const catEl = document.getElementById("skill-categories");
    if (catEl && o.categories) {
        catEl.innerHTML = o.categories
            .map(
                (cat) => `
        <div class="skill-category">
          <p class="skill-category-name">${cat.name}</p>
          <div class="skill-pills">
            ${cat.skills.map((s) => `<span class="skill-pill">${s}</span>`).join("")}
          </div>
        </div>`
            )
            .join("");
    }

    // Certifications
    const certEl = document.getElementById("cert-list");
    if (certEl && o.certifications) {
        certEl.innerHTML = o.certifications
            .map(
                (c) => {
                    const nameHtml = c.url
                        ? `<a href="${c.url}" class="cert-name cert-link" target="_blank" rel="noopener noreferrer">${c.name} \u2197</a>`
                        : `<p class="cert-name">${c.name}</p>`;
                    return `
        <div class="cert-item">
          ${nameHtml}
          <p class="cert-issuer">${c.issuer}</p>
        </div>`;
                }
            )
            .join("");
    }
};

// ── LEADERSHIP ──────────────────────────
const _buildLeadership = (o) => {
    _set("leadership-eyebrow", o.label);
    _set("leadership-headline", o.headline);

    // Achievement badge
    const badgeEl = document.getElementById("achievement-badge");
    if (badgeEl && o.achievement) {
        const a = o.achievement;
        badgeEl.innerHTML = `
      <span class="badge-rank">${a.badge}</span>
      <span class="badge-event">${a.event}</span>
      <span class="badge-organizer">${a.organizer}</span>
    `;
    }

    // Roles list
    const rolesEl = document.getElementById("roles-list");
    if (rolesEl && o.roles) {
        rolesEl.innerHTML = o.roles
            .map(
                (r) => `
        <div class="role-item">
          <div class="role-header">
            <span class="role-title">${r.title}</span>
            <span class="role-period">${r.period}</span>
          </div>
          <p class="role-org">${r.org}</p>
          <p class="role-desc">${r.description}</p>
        </div>`
            )
            .join("");
    }
};

// ── CONTACT ─────────────────────────────
const _buildContact = (o) => {
    _set("contact-label", o.label);
    _set("contact-headline", o.headline);
    _set("contact-subtext", o.subtext);
    _set("contact-location", o.location);

    const linksEl = document.getElementById("contact-links");
    if (linksEl && o.links) {
        linksEl.innerHTML = o.links
            .map(
                (l) => `
        <div class="contact-link-item">
          <span class="contact-link-type">${l.type}</span>
          <a href="${l.url}" class="contact-link-value"
             ${l.type !== "email" && l.type !== "phone" ? 'target="_blank" rel="noopener noreferrer"' : ""}>
            ${l.label}
          </a>
        </div>`
            )
            .join("");
    }
};

// ── Utility ─────────────────────────────

/**
 * Safely sets text content of an element by ID
 * @private
 * @param {string} id - Element ID
 * @param {string} text - Text content to set
 */
const _set = (id, text) => {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) {
        el.textContent = text;
    } else if (!el) {
        console.warn(`Element with id "${id}" not found`);
    }
};

/**
 * Escapes HTML to prevent XSS
 * @private
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
const _escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};