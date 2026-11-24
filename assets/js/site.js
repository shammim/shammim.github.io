/* Shammim portfolio · shared behaviour */
(function () {
  'use strict';
  var root = document.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* Theme: follows the device until the visitor picks one */
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    function label() { btn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); }
    label();
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next); store('shammim-theme', next); label();
    });
  });

  /* Mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
    });
  }

  /* Case study tabs are pure HTML + CSS (:target). This only forwards old links (#storyboard, #course, #job-aids). */
  var OLD = { storyboard: 'interface', course: 'interface', 'job-aids': 'job-aid' };
  var oh = (location.hash || '').replace('#', '');
  if (OLD[oh] && document.getElementById(OLD[oh])) location.replace('#' + OLD[oh]);

  /* Portfolio filter. Deep link: portfolio.html#ecec */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-sector]'));
    var empty = document.querySelector('[data-empty]');
    function apply(key) {
      var shown = 0;
      filterBar.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === key)); });
      cards.forEach(function (c) { var on = key === 'all' || c.dataset.sector.split(' ').indexOf(key) > -1; c.hidden = !on; if (on) shown++; });
      if (empty) empty.hidden = shown > 0;
      var live = document.getElementById('filter-status');
      if (live) live.textContent = shown + (shown === 1 ? ' case study' : ' case studies') + ' shown';
    }
    filterBar.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      apply(c.dataset.filter);
      if (history.replaceState) history.replaceState(null, '', c.dataset.filter === 'all' ? location.pathname : '#' + c.dataset.filter);
    });
    var h = (location.hash || '').replace('#', '');
    apply(filterBar.querySelector('[data-filter="' + h + '"]') ? h : 'all');
  }

  /* Optional files: if a linked file isn't on the server yet, show a note instead of a broken link */
  if (location.protocol.indexOf('http') === 0) {
    document.querySelectorAll('[data-check]').forEach(function (el) {
      var url = el.getAttribute('href');
      fetch(url, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        if (!r.ok) {
          el.hidden = true;
          var note = el.dataset.missing && document.getElementById(el.dataset.missing);
          if (note) note.hidden = false;
        }
      }).catch(function () {});
    });
  }

  /* Contact form: Netlify Forms (works when the site is deployed on Netlify) */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var btn = form.querySelector('[type="submit"]');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true; btn.querySelector('span').textContent = 'Sending…';
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.className = 'form-status ok';
          status.textContent = 'Thanks, your message is on its way. I’ll get back to you soon.';
          form.reset();
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Your message couldn’t be sent from here. Please try again in a moment, or ask the assistant how else to reach me.';
        })
        .then(function () { status.hidden = false; btn.disabled = false; btn.querySelector('span').textContent = 'Send message'; });
    });
  }

  /* Copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy');
      var done = function () { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done).catch(function () {});
    });
  });
})();
