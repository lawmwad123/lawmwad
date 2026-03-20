/* ============================================
   LAWMWAD ENGINEERING LAB - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initFilterBar();
  initLightbox();
  initMobileMenu();
  initCountUp();
  initImageProtection();
  initAccordionFooter();
  initApplicationForm();
  initVideoBackgrounds();
});

/* --- Navigation Scroll Effect --- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const nav = document.querySelector('.nav');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    nav?.classList.toggle('menu-open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      nav?.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll Reveal Animation --- */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* --- Project Filter Bar --- */
function initFilterBar() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* --- Gallery Lightbox with Swipe & Navigation --- */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const closeBtn = lightbox?.querySelector('.lightbox__close');
  if (!lightbox) return;

  const galleryItems = document.querySelectorAll('.gallery-grid__item');
  const images = [];
  let currentIndex = 0;

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({ src: img.src, alt: img.alt });
      item.addEventListener('click', () => {
        currentIndex = i;
        showImage(currentIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  function showImage(index) {
    if (!images[index]) return;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    const counter = lightbox.querySelector('.lightbox__counter');
    if (counter) counter.textContent = `${index + 1} / ${images.length}`;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Nav buttons
  const prevBtn = lightbox.querySelector('.lightbox__nav-btn--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav-btn--next');
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(diffX) > 50 && diffY < 100) {
      if (diffX > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
}

/* --- Count Up Animation for Stats --- */
function initCountUp() {
  const stats = document.querySelectorAll('.stat__number');
  if (!stats.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stats.forEach(el => {
      const target = el.dataset.count || '0';
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      el.textContent = prefix + target + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          animateCount(el, 0, target, 1500, prefix, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
}

function animateCount(el, start, end, duration, prefix, suffix) {
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

/* --- Image Download Protection --- */
function initImageProtection() {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('picture')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
}

/* --- Accordion Footer (Mobile) --- */
function initAccordionFooter() {
  if (window.innerWidth > 768) return;

  const footer = document.querySelector('.footer');
  if (!footer) return;

  const headings = footer.querySelectorAll('.footer__heading');
  headings.forEach(heading => {
    const links = heading.nextElementSibling;
    if (!links || !links.classList.contains('footer__links')) return;

    heading.addEventListener('click', () => {
      const isOpen = heading.classList.contains('open');

      // Close all others
      headings.forEach(h => {
        h.classList.remove('open');
        const l = h.nextElementSibling;
        if (l) l.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        heading.classList.add('open');
        links.classList.add('open');
      }
    });
  });
}

/* --- Application Form Submission --- */
function initApplicationForm() {
  const form = document.querySelector('form[action="#"]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    const data = {
      name: form.querySelector('#name').value.trim(),
      email: form.querySelector('#email').value.trim(),
      phone: form.querySelector('#phone').value.trim(),
      lab: form.querySelector('#lab').value,
      level: form.querySelector('#level').value,
      about: form.querySelector('#about').value.trim(),
    };

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        btn.textContent = 'Submitted!';
        btn.style.background = 'var(--color-success, #4ade80)';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      btn.textContent = 'Error — Try Again';
      btn.style.background = 'var(--color-error, #ef4444)';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    }
  });
}

/* --- Lazy Video Backgrounds --- */
function initVideoBackgrounds() {
  const videos = document.querySelectorAll('.video-bg video[data-src]');
  if (!videos.length) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = video.dataset.src;
            video.addEventListener('canplaythrough', () => {
              video.classList.add('loaded');
            }, { once: true });
            // Fallback if canplaythrough doesn't fire
            video.addEventListener('loadeddata', () => {
              setTimeout(() => video.classList.add('loaded'), 200);
            }, { once: true });
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  videos.forEach(video => observer.observe(video));
}

/* --- Active Nav Link --- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href')?.split('/').pop();
  if (href === currentPage) {
    link.classList.add('active');
  }
});
