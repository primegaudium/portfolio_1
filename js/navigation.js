// ========================================
// NAVIGATION.JS — Harsh Raj Portfolio
// Bottom nav items, progress bars, slide
// counters, and overlay DOM population
// from slides-data.js
// ========================================

import { slides, slidesMeta } from "./slides-data.js";
import { cacheHeadings, triggerTypewriter } from "./overlay.js";

// ────────────────────────────────────────
// BOTTOM NAV — build & update
// ────────────────────────────────────────

export const createSlidesNavigation = () => {
    const navContainer = document.getElementById("slidesNav");
    if (!navContainer) return;
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

export const updateNavigationState = (activeIndex) => {
    document.querySelectorAll(".slide-nav-item").forEach((item, i) => {
        const isActive = i === activeIndex;
        item.classList.toggle("active", isActive);
        // aria-current marks the active slide for assistive tech.
        if (isActive) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
    });
};

// Announce the current slide via the SR-only live region. The visible
// counter is display:none, so this is the only slide context SR users get.
const _announceSlide = (index) => {
    const el = document.getElementById("slideAnnouncer");
    if (!el) return;
    const title = slidesMeta[index]?.title ?? "";
    el.textContent = `Slide ${index + 1} of ${slidesMeta.length}: ${title}`;
};

export const updateSlideProgress = (slideIndex, progress) => {
    const fill = _getProgressFill(slideIndex);
    if (!fill) return;
    fill.style.width = `${progress}%`;
    fill.style.opacity = "1";
};

export const fadeSlideProgress = (slideIndex) => {
    const fill = _getProgressFill(slideIndex);
    if (!fill) return;
    fill.style.opacity = "0";
    setTimeout(() => (fill.style.width = "0%"), 300);
};

export const quickResetProgress = (slideIndex) => {
    const fill = _getProgressFill(slideIndex);
    if (!fill) return;
    fill.style.transition = "width 0.2s ease-out";
    fill.style.width = "0%";
    setTimeout(() => {
        fill.style.transition = "width 0.1s ease, opacity 0.3s ease";
    }, 200);
};

const _getProgressFill = (index) => {
    const items = document.querySelectorAll(".slide-nav-item");
    return items[index]?.querySelector(".slide-progress-fill") ?? null;
};

// ────────────────────────────────────────
// SLIDE COUNTER
// ────────────────────────────────────────

export const updateCounter = (index) => {
    const numEl = document.getElementById("slideNumber");
    const totalEl = document.getElementById("slideTotal");
    if (numEl) numEl.textContent = String(index + 1).padStart(2, "0");
    if (totalEl) totalEl.textContent = String(slidesMeta.length).padStart(2, "0");
};

// ────────────────────────────────────────
// OVERLAY — active state + typewriter
// ────────────────────────────────────────

export const activateOverlay = (index) => {
    document.querySelectorAll(".slide-overlay").forEach((el) => {
        const isActive = parseInt(el.dataset.slide) === index;
        el.classList.toggle("active", isActive);
        // Hide inactive slides from assistive tech and keyboard focus so
        // users don't tab into off-screen content.
        el.setAttribute("aria-hidden", String(!isActive));
        if (isActive) el.removeAttribute("inert");
        else el.setAttribute("inert", "");
    });

    _announceSlide(index);

    // Trigger typewriter on the active slide's heading
    triggerTypewriter(index);
};

// ────────────────────────────────────────
// OVERLAY DOM POPULATION
// ────────────────────────────────────────

export const populateOverlays = () => {
    slides.forEach((slide) => {
        const { overlay } = slide;
        switch (overlay.type) {
            case "hero": _buildHero(overlay); break;
            case "about": _buildAbout(overlay); break;
            case "projects": _buildProjects(overlay); break;
            case "skills": _buildSkills(overlay); break;
            case "leadership": _buildLeadership(overlay); break;
            case "contact": _buildContact(overlay); break;
        }
    });

    // Cache heading text AFTER DOM is populated
    cacheHeadings();
};

// ── HERO ────────────────────────────────
const _buildHero = (o) => {
    _set("hero-eyebrow", o.eyebrow);
    _set("hero-name", o.headline);
    _set("hero-role", o.subheadline);
    _set("hero-tagline", o.tagline);

    const actions = document.getElementById("hero-actions");
    if (actions && o.cta) {
        actions.innerHTML = `
            <button class="hero-cta-primary"   data-slide-target="${o.cta.primary.slideTarget}">
            ${o.cta.primary.label}
            </button>
            <button class="hero-cta-secondary" data-slide-target="${o.cta.secondary.slideTarget}">
            ${o.cta.secondary.label}
            </button>
            ${o.resume ? `<a class="hero-cta-resume" href="${o.resume.url}" download target="_blank" rel="noopener">${o.resume.label}</a>` : ""}
           `;
    }

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

    const listEl = document.getElementById("projects-list");
    if (!listEl) return;

    listEl.innerHTML = o.projects
        .map((p) => {
            const techTags = p.tech.map((t) => `<span class="tag">${t}</span>`).join("");
            const linkHtml = p.url
                ? `<a href="${p.url}" class="overlay-link" target="_blank" rel="noopener noreferrer">Live</a>`
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
// ═══════════════════════════════════════════════════
// NAVIGATION.JS — _buildSkills PATCH
//
// Find the `_buildSkills` function in navigation.js
// and replace the ENTIRE function with this.
// ═══════════════════════════════════════════════════
// ── SKILLS ──────────────────────────────
// ── SKILLS ──────────────────────────────
const _buildSkills = (o) => {
    _set("skills-eyebrow", o.label);
    _set("skills-headline", o.headline);
    _set("certs-label", "Certifications");

    const FALLBACK_ICON = "assets/icons/fallback.svg";

    const applySafeFallback = (img) => {
        img.onerror = null;
        img.src = FALLBACK_ICON;
    };

    // Returns an <img> tag only when a valid icon slug is provided.
    // Appends /ffffff so all icons render white to match the dark UI.
    const iconImg = (slug, alt, cls) => {
        if (!slug) return `<span class="${cls}-placeholder"></span>`;
        return `<img
            src="https://cdn.simpleicons.org/${slug}/ffffff"
            alt="${alt}"
            class="${cls}"
            loading="lazy"
        />`;
    };

    // ── Skill Categories ─────────────────
    const catEl = document.getElementById("skill-categories");

    if (catEl && o.categories) {
        catEl.innerHTML = o.categories
            .map((cat) => `
                <div class="skill-category">
                    <p class="skill-category-name">${cat.name}</p>
                    <div class="skill-pills">
                        ${cat.skills.map((s) => `
                            <span class="skill-pill">
                                ${iconImg(s.icon, s.name + " logo", "skill-icon")}
                                ${s.name}
                            </span>
                        `).join("")}
                    </div>
                </div>
            `)
            .join("");

        catEl.querySelectorAll("img.skill-icon").forEach(img => {
            img.onerror = () => applySafeFallback(img);
        });
    }

    // ── Certifications ───────────────────
    const certEl = document.getElementById("cert-list");

    if (certEl && o.certifications) {
        certEl.innerHTML = o.certifications
            .map((c) => `
                <div class="cert-item">
                    <div class="cert-item-inner">
                        ${iconImg(c.icon, c.issuer + " logo", "cert-icon")}
                        <div class="cert-text">
                            <p class="cert-name">${c.name}</p>
                            <p class="cert-issuer">${c.issuer}</p>
                        </div>
                    </div>
                </div>
            `)
            .join("");

        certEl.querySelectorAll("img.cert-icon").forEach(img => {
            img.onerror = () => applySafeFallback(img);
        });
    }
};

// ── LEADERSHIP ──────────────────────────
const _buildLeadership = (o) => {
    _set("leadership-eyebrow", o.label);
    _set("leadership-headline", o.headline);

    const badgeEl = document.getElementById("achievement-badge");
    if (badgeEl && o.achievement) {
        const a = o.achievement;
        badgeEl.innerHTML = `
      <span class="badge-rank">${a.badge}</span>
      <span class="badge-event">${a.event}</span>
      <span class="badge-organizer">${a.organizer}</span>
    `;
    }

    const researchEl = document.getElementById("research-block");
    if (researchEl && o.research) {
        researchEl.innerHTML = `
      <p class="overlay-eyebrow research-eyebrow">Research</p>
      <p class="research-title">${o.research.title}</p>
      <p class="research-desc">${o.research.description}</p>
    `;
    }

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

    const extraEl = document.getElementById("contact-extra");
    if (extraEl && (o.languages || o.interests)) {
        extraEl.innerHTML = `
      ${o.languages ? `<div class="contact-extra-item"><span class="contact-link-type">Languages</span><span class="contact-extra-value">${o.languages}</span></div>` : ""}
      ${o.interests ? `<div class="contact-extra-item"><span class="contact-link-type">Interests</span><span class="contact-extra-value">${o.interests}</span></div>` : ""}
    `;
    }

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
const _set = (id, text) => {
    const el = document.getElementById(id);
    if (el && text !== undefined) el.textContent = text;
};