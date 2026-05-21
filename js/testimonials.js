/* ============================================
   SOFTZILAA - Testimonials Slider
   ============================================ */

(function () {
  'use strict';

  function initTestimonialsSwiper() {
    if (typeof Swiper === 'undefined') {
      setTimeout(initTestimonialsSwiper, 200);
      return;
    }

    const el = document.querySelector('.testimonials-swiper');
    if (!el) return;

    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.testimonials-pagination', clickable: true },
      navigation: {
        prevEl: '.testimonials-prev',
        nextEl: '.testimonials-next'
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      },
      grabCursor: true,
      speed: 600,
      effect: 'slide'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialsSwiper);
  } else {
    initTestimonialsSwiper();
  }
})();
