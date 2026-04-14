/* ============================================================
   ENTREGABLE UNIDAD 1 – BIG DATA · ProyectoVentas
   JavaScript principal
   ============================================================ */

/* ── LOGIN ──────────────────────────────────────────────────── */
const PIN_CORRECTO = '2026';

function doLogin() {
  const input = document.getElementById('pin-input');
  const error = document.getElementById('lg-error');
  const btn   = document.getElementById('lg-btn-text');

  if (input.value === PIN_CORRECTO) {
    btn.textContent = '✓ Correcto';
    error.textContent = '';
    const screen = document.getElementById('login-screen');
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      showCaratula();
    }, 420);
  } else {
    error.textContent = '⚠ Código incorrecto. Intenta de nuevo.';
    // Shake animation re-trigger
    error.style.animation = 'none';
    requestAnimationFrame(() => { error.style.animation = ''; });
    input.value = '';
    input.focus();
    btn.textContent = 'Acceder →';
  }
}

/* ── CARÁTULA ───────────────────────────────────────────────── */
function showCaratula() {
  const cara = document.getElementById('caratula-screen');
  cara.style.display = 'flex';
}

function enterApp() {
  const cara = document.getElementById('caratula-screen');
  cara.classList.add('fade-out');
  setTimeout(() => {
    cara.style.display = 'none';
    const app = document.getElementById('main-app');
    app.style.display = 'block';
    animateProgress();
  }, 420);
}

/* ── Navigation ─────────────────────────────────────────────── */
function show(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('visible');
  document.querySelectorAll('.nav-btn').forEach(b => {
    const fn = b.getAttribute('onclick') || '';
    if (fn.includes("'" + id + "'")) b.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger animations for visible section
  setTimeout(() => animateSection(id), 50);
}

/* ── Section-specific animations ───────────────────────────── */
function animateSection(id) {
  if (id === 'kpis') animateKPIs();
  if (id === 'portada') animateProgress();
}

/* ── KPI counter animation ──────────────────────────────────── */
function animateKPIs() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isFloat = String(target).includes('.');
    const decimals = isFloat ? (String(target).split('.')[1] || '').length : 0;
    const duration = 1400;
    const start = performance.now();
    const update = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = isFloat
        ? current.toFixed(decimals)
        : Math.floor(current).toLocaleString('es-PE');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isFloat
        ? target.toFixed(decimals)
        : target.toLocaleString('es-PE');
    };
    requestAnimationFrame(update);
  });
}

/* ── Progress bar ───────────────────────────────────────────── */
function animateProgress() {
  const fill = document.querySelector('.progress-fill');
  if (fill) fill.style.width = '100%';
}

/* ── Toggle code visibility ─────────────────────────────────── */
function toggleCode(id) {
  const el = document.getElementById(id);
  const btn = el.previousElementSibling.querySelector('.toggle-btn');
  if (!el || !btn) return;
  const hidden = el.style.display === 'none' || !el.style.display;
  el.style.display = hidden ? 'block' : 'none';
  btn.textContent = hidden ? '▲ Ocultar' : '▼ Ver código';
}

/* ── Copy to clipboard ──────────────────────────────────────── */
function copyCode(btnEl) {
  const block = btnEl.closest('.code-wrapper').querySelector('.terminal');
  navigator.clipboard.writeText(block.innerText).then(() => {
    const orig = btnEl.textContent;
    btnEl.textContent = '✓ Copiado';
    setTimeout(() => (btnEl.textContent = orig), 1800);
  });
}

/* ── Tooltip ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Init first section
  animateProgress();

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const sections = ['portada','dataset','nb01','nb02','nb03','nb04','kpis','rubrica'];
    const btns = Array.from(document.querySelectorAll('.nav-btn'));
    const activeIdx = btns.findIndex(b => b.classList.contains('active'));
    if (e.key === 'ArrowRight' && activeIdx < btns.length - 1) {
      btns[activeIdx + 1].click();
    }
    if (e.key === 'ArrowLeft' && activeIdx > 0) {
      btns[activeIdx - 1].click();
    }
  });

  // Intersection observer for subtle entrance animation on cards
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .nb-item, .result-row, .zone-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    observer.observe(el);
  });
});
