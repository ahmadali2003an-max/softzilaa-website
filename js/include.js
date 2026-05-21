/* ============================================
   SOFTZILAA - Dynamic Include Loader
   Loads header.html and footer.html into pages
   ============================================ */

(function () {
  'use strict';

  /* Detect base path from current page URL */
  function getBasePath() {
    const base = document.querySelector('meta[name="base-path"]');
    return base ? base.getAttribute('content') : 'softzilaa-website/';
  }

  const BASE = getBasePath();

  /* Determine current page filename */
  function getCurrentPage() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    if (!last || last === '' || last.endsWith('/')) return 'index.html';
    return last;
  }

  /* Fetch and inject an HTML partial into the target element */
  async function loadPartial(url, targetSelector, position) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const html = await resp.text();
      const target = document.querySelector(targetSelector);
      if (!target) return;
      if (position === 'replace') {
        target.outerHTML = html;
      } else if (position === 'prepend') {
        document.body.insertAdjacentHTML('afterbegin', html);
      } else {
        document.body.insertAdjacentHTML('beforeend', html);
      }
    } catch (e) {
      console.warn(`Could not load partial: ${url}`, e);
    }
  }

  /* Set active nav link */
  function setActiveNav() {
    const current = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPage = href.split('/').pop();
      const isActive =
        (current === 'index.html' && (linkPage === 'index.html' || linkPage === '' || href === '/')) ||
        (current !== 'index.html' && linkPage === current);
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* Initialize hamburger / mobile menu */
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    /* Close on link click */
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });

    /* Close on outside click */
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  /* Navbar scroll behavior */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Back to top button */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Newsletter form (front-end only) */
  function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.includes('@')) {
        input.value = '';
        showToast('success', 'Subscribed successfully!');
      } else {
        showToast('error', 'Please enter a valid email.');
      }
    });
  }

  /* Simple toast notification */
  function showToast(type, message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* Main load sequence */
  async function init() {
    /* Load header then footer */
    await loadPartial(BASE + 'includes/header.html', 'body', 'prepend');
    await loadPartial(BASE + 'includes/footer.html', 'body', 'append');

    setActiveNav();
    initMobileMenu();
    initNavbarScroll();
    initBackToTop();
    initNewsletter();

    /* Dispatch event so other scripts know includes are ready */
    document.dispatchEvent(new CustomEvent('includesLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose showToast globally */
  window.SZToast = { show: showToast };
})();
