/* ============================================
   SOFTZILAA - Main JavaScript
   Particles, Typing Effect, Scroll Animations,
   Tilt Cards, Smooth Scroll
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     PARTICLES CANVAS
     ============================================ */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor(canvas.width / 12), 80);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
          color: Math.random() < 0.3 ? 'rgba(255,0,0,' : 'rgba(255,255,255,'
        });
      }
    }

    createParticles();

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,0,0,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });

      animFrame = requestAnimationFrame(animate);
    }

    animate();

    /* Pause animation when page not visible */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        animate();
      }
    });
  }

  /* ============================================
     TYPING EFFECT
     ============================================ */
  function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
      'Digital Success',
      'Innovative Solutions',
      'Brand Excellence',
      'Business Growth'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 60 : 100;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      timeout = setTimeout(type, delay);
    }

    type();
  }

  /* ============================================
     SCROLL REVEAL (custom lightweight AOS)
     ============================================ */
  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ============================================
     TILT EFFECT ON CARDS
     ============================================ */
  function initTilt() {
    const cards = document.querySelectorAll('.tilt-card, .service-card, .portfolio-card, .portfolio-full-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================
     NAVBAR TRANSPARENT-TO-SOLID ON SCROLL
     ============================================ */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = current;
    }, { passive: true });
  }

  /* ============================================
     HERO SCROLL INDICATOR
     ============================================ */
  function initHeroScroll() {
    const scrollBtn = document.querySelector('.hero-scroll');
    if (!scrollBtn) return;
    scrollBtn.addEventListener('click', () => {
      const nextSection = document.querySelector('.trusted-section, .section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ============================================
     GSAP ANIMATIONS (if available)
     ============================================ */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;

    /* Hero entrance */
    gsap.from('.hero-tag', { y: 30, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero-title', { y: 40, opacity: 0, duration: 0.9, delay: 0.25, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, delay: 0.55, ease: 'power3.out' });

    /* Section titles on scroll */
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.section-tag').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
        });
      });
    }
  }

  /* ============================================
     SWIPER TESTIMONIALS
     ============================================ */
  function initHeroSwiper() {
    if (typeof Swiper === 'undefined') return;
    const el = document.querySelector('.testimonials-swiper');
    if (!el) return;

    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  /* ============================================
     INIT
     ============================================ */
  function init() {
    initParticles();
    initTyping();
    initScrollReveal();
    initTilt();
    initSmoothScroll();
    initNavbar();
    initHeroScroll();
    initHeroSwiper();

    /* GSAP loads async via CDN, wait a bit */
    setTimeout(initGSAP, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-init tilt and scroll reveal after includes load */
  document.addEventListener('includesLoaded', () => {
    initScrollReveal();
    initTilt();
  });

})();
