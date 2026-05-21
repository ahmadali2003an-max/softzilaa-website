/* ============================================
   SOFTZILAA - Portfolio Filter
   ============================================ */

(function () {
  'use strict';

  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-full-card');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          const cat = item.getAttribute('data-category');
          const show = filter === 'all' || cat === filter;

          if (show) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.classList.remove('hidden');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              });
            });
          } else {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.classList.add('hidden');
              item.style.opacity = '';
              item.style.transform = '';
              item.style.transition = '';
            }, 300);
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioFilter);
  } else {
    initPortfolioFilter();
  }
})();
