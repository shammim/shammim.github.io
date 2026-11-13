/* Shammim portfolio · shared behaviour */
(function () {
  'use strict';
  var root = document.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* Theme: light by default until the visitor picks dark */
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    return t || 'light';
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
      if (history.replaceState) history.replaceState(null, '', c.dataset.filter === 'all' ? location.pathname + '#work' : '#' + c.dataset.filter);
    });
    window.__applyFilter = function (k) { if (filterBar.querySelector('[data-filter="' + k + '"]')) { apply(k); return true; } return false; };
    var h = (location.hash || '').replace('#', '');
    apply(filterBar.querySelector('[data-filter="' + h + '"]') ? h : 'all');
  }

  /* One-page portfolio: project details (#case-slug) and walkthroughs (#walk-slug) open in dialogs.
     A sector key in the address (#ecec) filters My work. Links stay shareable. */
  var lastFocus = null;
  /* Project details and walkthroughs live in assets/details.html. They load when the browser is idle,
     or straight away when a visitor opens one, so the first view of the page stays light. */
  var detailsP = null;
  function loadDetails() {
    if (!detailsP) {
      detailsP = fetch('assets/details.html').then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (t) { (document.getElementById('main') || document.body).insertAdjacentHTML('beforeend', t); });
      detailsP.catch(function () { detailsP = null; });
    }
    return detailsP;
  }
  function openDlg(id, push) {
    var d = document.getElementById(id);
    if (!d && /^(case|walk)-[a-z0-9-]+$/.test(id)) { var opener = document.activeElement; loadDetails().then(function () { if (opener && opener.focus) { try { opener.focus(); } catch (er) {} } openDlg(id, push); }).catch(function () {}); return true; }
    if (!d || d.tagName !== 'DIALOG' || typeof d.showModal !== 'function') return false;
    document.querySelectorAll('dialog[open]').forEach(function (o) { if (o !== d) o.close(); });
    if (!d.open) { lastFocus = document.activeElement; d.showModal(); }
    if (push !== false && history.replaceState) history.replaceState(null, '', '#' + id);
    return true;
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openDlg(o.getAttribute('data-open')); return; }
    var x = e.target.closest('[data-close]');
    if (x) { var dd = x.closest('dialog'); if (dd) dd.close(); return; }
    if (e.target.tagName === 'DIALOG' && e.target.open) {
      var r = e.target.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
    }
  });
  document.addEventListener('close', function (ev) {
    var d = ev.target; if (!d || d.tagName !== 'DIALOG') return;
    d.querySelectorAll('video').forEach(function (v) { v.pause(); });
    if (('#' + d.id) === location.hash && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    if (!document.querySelector('dialog[open]') && lastFocus && document.contains(lastFocus)) { try { lastFocus.focus(); } catch (er) {} }
  }, true);
  function route() {
    var h = decodeURIComponent((location.hash || '').replace('#', ''));
    if (!h) return;
    if (openDlg(h, false)) return;
    if (window.__applyFilter && window.__applyFilter(h)) {
      var w = document.getElementById('work'); if (w) w.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', route);
  route();
  function idle(fn, ms) { window.addEventListener('load', function () { setTimeout(function () { (window.requestIdleCallback || setTimeout)(fn); }, ms); }); }
  var saveData = navigator.connection && navigator.connection.saveData;
  if (!saveData) idle(loadDetails, 1500);
  /* warm up details when a visitor heads for a card */
  document.addEventListener('pointerover', function (e) { if (e.target.closest && e.target.closest('[data-open]')) loadDetails(); }, { passive: true });

  /* The portfolio assistant (about 80 KB) loads on first use. Until then a light button stands in for it. */
  var assistP = null;
  function addScript(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.body.appendChild(s); }); }
  function loadAssist() {
    if (!assistP) { assistP = addScript('assets/js/kb.js').then(function () { return addScript('assets/js/assistant.js'); }); assistP.catch(function () { assistP = null; }); }
    return assistP;
  }
  function askLater(q) { loadAssist().then(function () { if (window.SHAMMIM_ASSIST) window.SHAMMIM_ASSIST.open(q); }); }
  var stub = document.createElement('button');
  stub.className = 'ai-launch'; stub.type = 'button'; stub.setAttribute('aria-expanded', 'false');
  stub.innerHTML = '<img src="assets/img/designer-laptop.webp" alt="" width="38" height="38"><span>Ask<span class="lbl-long"> my assistant</span><span class="lbl-short" aria-hidden="true"> me</span></span><span class="pulse" aria-hidden="true"></span>';
  stub.addEventListener('click', function () { askLater(''); });
  ['pointerover', 'focus'].forEach(function (ev) { stub.addEventListener(ev, loadAssist, { once: true }); });
  document.body.appendChild(stub);
  document.addEventListener('click', function (e) {
    if (window.SHAMMIM_ASSIST) return;
    var b = e.target.closest && e.target.closest('[data-ask]'); if (!b) return;
    e.preventDefault(); askLater(b.getAttribute('data-ask') || '');
  });
  document.querySelectorAll('[data-ask-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) { if (window.SHAMMIM_ASSIST) return; e.preventDefault(); var i = f.querySelector('input'); var v = i.value.trim(); i.value = ''; askLater(v); });
  });

  /* Highlight the menu item for the section in view */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {}; navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = byId[en.target.id]; if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
  /* Close the mobile menu after picking a section */
  document.querySelectorAll('.mobile-menu a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { var b = document.querySelector('.menu-btn'); if (b && b.getAttribute('aria-expanded') === 'true') b.click(); });
  });

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
