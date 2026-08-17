(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Theme (light / dark) with persistence
     --------------------------------------------------------------------- */
  const THEME_KEY = 'academia_theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
    });
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored || (prefersDark ? 'dark' : 'light'));

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav
     --------------------------------------------------------------------- */
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
      });
    });

    const path = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('a[data-page]').forEach(a => {
      if (a.getAttribute('data-page') === path) a.classList.add('active');
    });
  }

  /* ---------------------------------------------------------------------
     FAQ / accordion
     --------------------------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll('.accordion-item').forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        item.parentElement.querySelectorAll('.accordion-item.open').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });
        item.classList.toggle('open', !isOpen);
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Animated stat counters
     --------------------------------------------------------------------- */
  function initCounters() {
    const stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;
    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { stats.forEach(animate); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    stats.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Back to top
     --------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------------------------------------------------------------------
     Countdown to next cohort
     --------------------------------------------------------------------- */
  function initCountdown() {
    const el = document.querySelector('.countdown');
    if (!el) return;
    const target = new Date(el.getAttribute('data-target') || '2026-09-07T09:00:00');
    const dEl = el.querySelector('.c-days');
    const hEl = el.querySelector('.c-hours');
    const mEl = el.querySelector('.c-mins');
    const sEl = el.querySelector('.c-secs');

    function tick() {
      const diff = Math.max(0, target - new Date());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------
     Toast notifications
     --------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = '<span class="dot"></span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  /* ---------------------------------------------------------------------
     Cart (localStorage-backed)
     --------------------------------------------------------------------- */
  const CART_KEY = 'academia_cart';
  const CATALOG = {
    fullstack: { name: 'Full-Stack Completo (12 semanas)', price: 899, img: 'img/products/prod-fullstack.jpg', meta: 'Programa insignia · 12 semanas' },
    frontend: { name: 'Frontend Moderno', price: 349, img: 'img/products/prod1.jpg', meta: 'Módulo · 4 semanas' },
    backend: { name: 'Backend & APIs', price: 379, img: 'img/products/prod2.jpg', meta: 'Módulo · 4 semanas' },
    devops: { name: 'Cloud & DevOps', price: 329, img: 'img/products/prod3.jpg', meta: 'Módulo · 3 semanas' },
    data: { name: 'Data Analytics', price: 359, img: 'img/products/prod4.jpg', meta: 'Módulo · 4 semanas' },
    uxui: { name: 'UX/UI Design', price: 319, img: 'img/products/prod5.jpg', meta: 'Módulo · 3 semanas' },
  };

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  function cartCount(cart = getCart()) {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }
  function cartTotal(cart = getCart()) {
    return Object.entries(cart).reduce((sum, [id, qty]) => sum + (CATALOG[id]?.price || 0) * qty, 0);
  }

  function renderCartBadges() {
    const count = cartCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function addToCart(id, qty = 1) {
    if (!CATALOG[id]) return;
    const cart = getCart();
    cart[id] = (cart[id] || 0) + qty;
    saveCart(cart);
    renderCartBadges();
    showToast(`${CATALOG[id].name} añadido al carrito`);
  }

  function updateCartQty(id, qty) {
    const cart = getCart();
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    saveCart(cart);
    renderCartBadges();
    renderCartPage();
  }

  function removeFromCart(id) {
    const cart = getCart();
    delete cart[id];
    saveCart(cart);
    renderCartBadges();
    renderCartPage();
  }

  function money(n) {
    return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0 });
  }

  function renderCartPage() {
    const list = document.querySelector('.cart-list');
    if (!list) return;
    const cart = getCart();
    const ids = Object.keys(cart);
    const emptyState = document.querySelector('.cart-empty');
    const layout = document.querySelector('.cart-layout');

    if (!ids.length) {
      if (layout) layout.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    if (layout) layout.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    list.innerHTML = ids.map(id => {
      const item = CATALOG[id];
      const qty = cart[id];
      return `
        <div class="cart-item" data-id="${id}">
          <img src="${item.img}" alt="${item.name}">
          <div>
            <h3>${item.name}</h3>
            <div class="meta">${item.meta} · ${money(item.price)} c/u</div>
            <div class="qty-control">
              <button type="button" class="qty-minus" aria-label="Reducir cantidad">−</button>
              <span>${qty}</span>
              <button type="button" class="qty-plus" aria-label="Aumentar cantidad">+</button>
            </div>
          </div>
          <div class="line-actions">
            <span class="line-price">${money(item.price * qty)}</span>
            <button type="button" class="remove-link">Eliminar</button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.cart-item').forEach(row => {
      const id = row.getAttribute('data-id');
      row.querySelector('.qty-plus').addEventListener('click', () => updateCartQty(id, (getCart()[id] || 0) + 1));
      row.querySelector('.qty-minus').addEventListener('click', () => updateCartQty(id, (getCart()[id] || 0) - 1));
      row.querySelector('.remove-link').addEventListener('click', () => removeFromCart(id));
    });

    const subtotal = cartTotal(cart);
    const discount = document.body.getAttribute('data-promo-applied') === 'true' ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;

    const subtotalEl = document.querySelector('.summary-subtotal');
    const discountEl = document.querySelector('.summary-discount');
    const totalEl = document.querySelector('.summary-total');
    if (subtotalEl) subtotalEl.textContent = money(subtotal);
    if (discountEl) discountEl.textContent = discount ? '-' + money(discount) : '-';
    if (totalEl) totalEl.textContent = money(total);
  }

  function initCart() {
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(btn.getAttribute('data-add-to-cart'));
      });
    });

    const promoForm = document.querySelector('.promo-row');
    if (promoForm) {
      const applyBtn = promoForm.querySelector('button');
      applyBtn?.addEventListener('click', () => {
        const input = promoForm.querySelector('input');
        if (input && input.value.trim().toUpperCase() === 'CODIGO10') {
          document.body.setAttribute('data-promo-applied', 'true');
          showToast('Código aplicado: 10% de descuento');
          renderCartPage();
        } else {
          showToast('Código no válido');
        }
      });
    }

    const checkoutForm = document.querySelector('#checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(checkoutForm)) return;
        localStorage.removeItem(CART_KEY);
        renderCartBadges();
        checkoutForm.style.display = 'none';
        document.querySelector('.cart-layout')?.setAttribute('style', 'display:none');
        const success = document.querySelector('.form-success');
        if (success) success.style.display = 'block';
      });
    }

    renderCartBadges();
    renderCartPage();
  }

  /* ---------------------------------------------------------------------
     Generic form validation (contact / enrollment / newsletter)
     --------------------------------------------------------------------- */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.field') || input.parentElement;
      let ok = input.value.trim().length > 0;
      if (input.type === 'email' && ok) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      }
      if (input.type === 'checkbox') ok = input.checked;
      field?.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(form)) return;
        const success = form.parentElement.querySelector('.form-success');
        if (success) {
          form.style.display = 'none';
          success.style.display = 'block';
        } else {
          showToast('¡Formulario enviado correctamente!');
          form.reset();
        }
      });
    });

    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          showToast('¡Gracias por suscribirte!');
          form.reset();
        } else {
          showToast('Ingresa un correo válido');
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Course catalog filter (products.html)
     --------------------------------------------------------------------- */
  function initFilters() {
    const bar = document.querySelector('.filter-bar');
    if (!bar) return;
    const buttons = bar.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('[data-category]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        cards.forEach(card => {
          const show = cat === 'all' || card.getAttribute('data-category') === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initAccordion();
    initReveal();
    initCounters();
    initBackToTop();
    initYear();
    initCountdown();
    initCart();
    initForms();
    initFilters();
  });
})();
