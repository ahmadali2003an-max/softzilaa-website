/* ============================================
   SOFTZILAA - FAQ Accordion
   ============================================ */

(function () {
  'use strict';

  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        /* Close all */
        items.forEach(i => i.classList.remove('active'));
        /* Open clicked if was closed */
        if (!isOpen) item.classList.add('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
