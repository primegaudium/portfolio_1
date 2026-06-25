// ========================================
// Portfolio app — lightweight, dependency-free
// ========================================
(function () {
  'use strict';

  // Preloader: hide once page is loaded (with a small minimum so it doesn't flash)
  var preloader = document.getElementById('preloader');
  var start = Date.now();
  function hidePreloader() {
    var elapsed = Date.now() - start;
    var wait = Math.max(0, 600 - elapsed);
    setTimeout(function () {
      if (preloader) preloader.classList.add('is-hidden');
      document.body.style.overflow = '';
    }, wait);
  }
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', hidePreloader);
  // Safety fallback in case load never fires
  setTimeout(hidePreloader, 3500);

  // Current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle (initial theme is set pre-paint by inline script in <head>)
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.getElementById('themeColorMeta');
  var THEME_COLORS = { dark: '#0a0a0f', light: '#f6f7fb' };
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  }
  if (themeToggle) {
    applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  // Header shadow on scroll
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  function closeNav() {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a[href^="#"], .nav-resume').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Scroll reveal via IntersectionObserver
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Active nav link based on section in view
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = nav.querySelectorAll('a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (l) {
            var isActive = l.getAttribute('href') === '#' + id;
            l.classList.toggle('active', isActive);
            if (isActive) l.setAttribute('aria-current', 'true');
            else l.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
