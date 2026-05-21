/* ============================================
   SOFTZILAA - Contact Form Validation
   ============================================ */

(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const msgEl = form.querySelector('.form-msg');

    function showMsg(type, text) {
      if (!msgEl) return;
      msgEl.className = 'form-msg ' + type;
      msgEl.textContent = text;
      msgEl.style.display = 'block';
      setTimeout(() => { msgEl.style.display = 'none'; }, 5000);
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
      return /^[\d\s\-\+\(\)]{7,15}$/.test(phone);
    }

    function setFieldError(field, show) {
      if (show) {
        field.style.borderColor = 'var(--red)';
        field.style.boxShadow = '0 0 0 2px rgba(255,0,0,0.15)';
      } else {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }
    }

    function clearErrors() {
      form.querySelectorAll('input, textarea, select').forEach(f => setFieldError(f, false));
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const name = form.querySelector('#name') || form.querySelector('[name="name"]');
      const email = form.querySelector('#email') || form.querySelector('[name="email"]');
      const phone = form.querySelector('#phone') || form.querySelector('[name="phone"]');
      const subject = form.querySelector('#subject') || form.querySelector('[name="subject"]');
      const message = form.querySelector('#message') || form.querySelector('[name="message"]');

      let hasError = false;

      if (name && !name.value.trim()) {
        setFieldError(name, true);
        hasError = true;
      }

      if (email && !validateEmail(email.value)) {
        setFieldError(email, true);
        hasError = true;
      }

      if (phone && phone.value && !validatePhone(phone.value)) {
        setFieldError(phone, true);
        hasError = true;
      }

      if (message && message.value.trim().length < 10) {
        setFieldError(message, true);
        hasError = true;
      }

      if (hasError) {
        showMsg('error', 'Please fill in all required fields correctly.');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        form.reset();
        clearErrors();
        showMsg('success', '✓ Message sent! We\'ll get back to you within 24 hours.');
        if (window.SZToast) window.SZToast.show('success', 'Message sent successfully!');
      }, 1800);
    });

    /* Live validation on blur */
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.type === 'email') {
          setFieldError(field, field.value && !validateEmail(field.value));
        } else if (field.required) {
          setFieldError(field, !field.value.trim());
        }
      });

      field.addEventListener('input', () => {
        if (field.style.borderColor === 'var(--red)' || field.style.borderColor === 'rgb(255, 0, 0)') {
          setFieldError(field, false);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
