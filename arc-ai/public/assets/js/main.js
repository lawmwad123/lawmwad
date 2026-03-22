/* ============================================
   ARC AI — Main JavaScript
   A product by Lawmwad Engineering Lab
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initScrollReveal();
  initTerminalDemo();
  initDemoForm();
});

/* --- Navigation Scroll Effect --- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
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

  links.querySelectorAll('.nav__link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      nav?.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll Reveal --- */
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
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

/* --- Terminal Demo Animation --- */
function initTerminalDemo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const queryEl      = document.getElementById('terminal-query');
  const cursorEl     = document.getElementById('terminal-cursor');
  const thinkingEl   = document.getElementById('terminal-thinking');
  const responseEl   = document.getElementById('terminal-response');
  const historyEl    = document.getElementById('terminal-history');
  const badgeEl      = document.getElementById('terminal-industry-badge');

  if (!queryEl || !cursorEl) return;

  const demos = [
    {
      industry: 'Banking',
      query: 'Which customers made 3+ failed transactions this week?',
      response: '47 customers matched · Top risk: J. Mwenda — 3 failures, $12,400 attempted',
    },
    {
      industry: 'Healthcare',
      query: 'Find patients with missed appointments not yet rescheduled',
      response: '23 patients across 4 departments · 8 flagged urgent for follow-up',
    },
    {
      industry: 'Education',
      query: 'Students at risk of dropping out this term?',
      response: '18 students flagged · 6 critical: below 40% attendance + overdue fees',
    },
    {
      industry: 'Finance',
      query: 'Cash position across all branches today?',
      response: 'Total: $24.7M across 12 branches · Nairobi HQ 23% below monthly target',
    },
    {
      industry: 'Retail',
      query: 'Which products are trending toward stockout this week?',
      response: '9 SKUs at risk · Top 3: Rice 5kg, Cooking Oil 2L, Wheat Flour 2kg',
    },
  ];

  let currentIndex = 0;
  let stopped = false;
  let history = [];

  // Typing speed (ms per character)
  const TYPE_SPEED = 38;
  const PAUSE_AFTER_QUERY = 500;
  const THINK_DURATION = 1100;
  const DISPLAY_DURATION = 3200;
  const PAUSE_BEFORE_NEXT = 1000;

  function typeText(el, text, speed) {
    return new Promise(resolve => {
      let i = 0;
      el.textContent = '';
      const timer = setInterval(() => {
        if (stopped) { clearInterval(timer); resolve(); return; }
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  function delay(ms) {
    return new Promise(resolve => {
      if (stopped) { resolve(); return; }
      setTimeout(resolve, ms);
    });
  }

  function pushHistory(query, response) {
    if (!historyEl) return;
    history.push({ query, response });
    // Keep last 2 in history
    if (history.length > 2) history.shift();

    historyEl.innerHTML = history.map(h => `
      <div class="terminal__history-item">
        <span class="t-prompt">›</span>
        <div>
          <div>${h.query.substring(0, 48)}${h.query.length > 48 ? '…' : ''}</div>
          <div class="t-res">↳ ${h.response.substring(0, 52)}${h.response.length > 52 ? '…' : ''}</div>
        </div>
      </div>
    `).join('');
  }

  async function runDemo() {
    while (!stopped) {
      const demo = demos[currentIndex];

      // Update industry badge
      if (badgeEl) badgeEl.textContent = demo.industry;

      // Reset state
      queryEl.textContent = '';
      responseEl.classList.remove('visible');
      responseEl.textContent = '';
      thinkingEl.classList.remove('visible');
      cursorEl.classList.remove('hidden');

      // Type the query
      await typeText(queryEl, demo.query, TYPE_SPEED);
      await delay(PAUSE_AFTER_QUERY);

      // Show thinking
      cursorEl.classList.add('hidden');
      thinkingEl.classList.add('visible');
      await delay(THINK_DURATION);

      // Show response
      thinkingEl.classList.remove('visible');
      responseEl.textContent = demo.response;
      responseEl.classList.add('visible');

      await delay(DISPLAY_DURATION);

      // Push to history
      pushHistory(demo.query, demo.response);

      // Clear current
      queryEl.textContent = '';
      responseEl.classList.remove('visible');
      responseEl.textContent = '';
      cursorEl.classList.remove('hidden');

      await delay(PAUSE_BEFORE_NEXT);

      currentIndex = (currentIndex + 1) % demos.length;
    }
  }

  // Start when terminal is in view
  const terminal = document.querySelector('.terminal');
  if (!terminal) return;

  const startObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        runDemo();
        startObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  startObserver.observe(terminal);
}

/* --- Demo Form Submission --- */
function initDemoForm() {
  const form = document.getElementById('demo-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.demo-form__btn');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = {
      name:     (form.querySelector('#demo-name')?.value || '').trim(),
      email:    (form.querySelector('#demo-email')?.value || '').trim(),
      org:      (form.querySelector('#demo-org')?.value || '').trim(),
      whatsapp: (form.querySelector('#demo-whatsapp')?.value || '').trim(),
      industry: (form.querySelector('#demo-industry')?.value || '').trim(),
    };

    if (!data.name || !data.email || !data.org || !data.whatsapp || !data.industry) {
      btn.textContent = 'Please fill in all fields';
      btn.style.background = '#EF4444';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 2500);
      return;
    }

    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        btn.textContent = 'Request Sent — We\'ll be in touch!';
        btn.style.background = 'var(--color-accent)';
        btn.style.boxShadow = '0 4px 20px rgba(6, 214, 160, 0.35)';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.boxShadow = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch {
      btn.textContent = 'Error — Try Again';
      btn.style.background = '#EF4444';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    }
  });
}
