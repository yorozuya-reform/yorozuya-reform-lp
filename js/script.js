(() => {
  'use strict';

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.global-nav');

  if (toggle && nav) {
    const setMenuState = (isOpen) => {
      nav.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute(
        'aria-label',
        isOpen ? 'メニューを閉じる' : 'メニューを開く',
      );
    };

    toggle.addEventListener('click', () => {
      setMenuState(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      setMenuState(false);
    });
  }

  const slides = document.querySelectorAll('.hero-slides .slide');
  const shouldReduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (slides.length > 1 && !shouldReduceMotion) {
    let current = 0;
    window.setInterval(() => {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 6000);
  }

  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const range = slider.querySelector('.ba-range');
    const after = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    if (!range || !after || !handle) return;

    const update = () => {
      const value = range.value;
      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      handle.style.left = `${value}%`;
    };

    range.addEventListener('input', update);
    update();
  });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      if (!['http:', 'https:'].includes(window.location.protocol)) {
        event.preventDefault();
        window.alert(
          'お問い合わせフォームを送信するには、ウェブサーバー経由でページを開いてください。',
        );
        return;
      }

      const nextUrl = contactForm.querySelector('input[name="_next"]');
      if (nextUrl) {
        const returnUrl = new URL(window.location.href);
        returnUrl.search = 'sent=1';
        returnUrl.hash = 'contact';
        nextUrl.value = returnUrl.href;
      }

      const hiddenConsultation = contactForm.querySelector('#f-consultation');
      const options = contactForm.querySelectorAll('.consultation-option');

      if (hiddenConsultation && options.length) {
        const selected = Array.from(options)
          .filter((option) => option.checked)
          .map((option) => option.value);
        hiddenConsultation.value = selected.join(' / ');
      }
    });
  }

  const sent = document.querySelector('.form-sent');
  const hasSentFlag =
    new URLSearchParams(window.location.search).get('sent') === '1';

  if (sent) {
    sent.hidden = !hasSentFlag;

    if (hasSentFlag) {
      const contactSection = sent.closest('#contact');
      const contactNote = contactSection?.querySelector(
        '.contact-title .section-note',
      );
      if (contactNote) contactNote.hidden = true;
      if (contactForm) contactForm.hidden = true;
      sent.scrollIntoView({ block: 'center' });
    }
  }
})();
