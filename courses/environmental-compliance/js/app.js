/* Environmental Compliance & Land Management · lesson player
   One scrolling page. Each section has a presenter voice-over (captions, speed, transcript) and,
   where required, an activity that unlocks the Continue button. Progress is bookmarked (SCORM or browser). */
(function () {
  'use strict';
  var L = window.LESSON, V = window.VOICE || { audio: {}, script: {} }, LMS = window.LMS;
  var SEC = L.sections, N = SEC.length;
  var REQUIRED = { resp: 'Step through all five responsibilities to continue.', spot: 'Find all five items to continue.',
    native: 'Flip all four cards to continue.', safety: 'Sort all six actions correctly to continue.',
    scenario: 'Finish the conversation with Jordan to continue.', quiz: 'Submit the knowledge check to continue.' };

  /* ---------- state ---------- */
  var S = { unlocked: 0, done: {}, steps: [0], spot: [], flips: [], sort: {}, scen: [], quiz: null, auto: true, rate: 1, theme: 'light', cur: 'hero' };
  LMS.start();
  var saved = LMS.load(); if (saved) for (var k in saved) S[k] = saved[k];
  function save() { LMS.save(S, S.cur); }

  /* ---------- helpers ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var a in attrs) {
      var v = attrs[a];
      if (v == null || v === false) continue;
      if (a === 'class') el.className = v; else if (a === 'html') el.innerHTML = v; else if (a === 'text') el.textContent = v;
      else if (a.slice(0, 2) === 'on') el.addEventListener(a.slice(2), v); else el.setAttribute(a, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) { if (c == null || c === false) return; if (Array.isArray(c)) c.forEach(function (x) { add(el, x); }); else el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
  var ICON = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', play: '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor" stroke="none"/>', moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    key: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M20 6 9 17l-5-5"/>', arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>', down: '<path d="m6 9 6 6 6-6"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>', vol: '<path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'
  };
  function ic(n) { var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = ICON[n]; return s; }
  function idx(id) { for (var i = 0; i < N; i++) if (SEC[i].id === id) return i; return -1; }
  var live = h('p', { class: 'sr', 'aria-live': 'polite' });
  function say(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }
  var toastEl; function toast(t) { if (toastEl) toastEl.remove(); toastEl = h('div', { class: 'toast', role: 'status', text: t }); document.body.appendChild(toastEl); setTimeout(function () { if (toastEl) toastEl.remove(); }, 2200); }

  /* ---------- theme ---------- */
  function applyTheme() { document.documentElement.setAttribute('data-theme', S.theme); if (themeBtn) { themeBtn.innerHTML = ''; themeBtn.appendChild(ic(S.theme === 'dark' ? 'sun' : 'moon')); themeBtn.setAttribute('aria-label', S.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); } }

  /* ---------- voice-over ---------- */
  var audio = new Audio(); audio.preload = 'none';
  var vo = { id: null, cues: [] };
  function cues(text, dur) {
    var parts = (text.match(/[^.!?]+[.!?]*/g) || [text]).map(function (s) { return s.trim(); }).filter(Boolean);
    var total = parts.reduce(function (a, s) { return a + s.length; }, 0), t = 0;
    return parts.map(function (s) { var d = dur * s.length / total, c = { from: t, to: t + d, text: s }; t += d; return c; });
  }
  function fmt(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function voBars() { return document.querySelectorAll('.vo'); }
  function refreshVo() {
    voBars().forEach(function (bar) {
      var id = bar.dataset.id, on = vo.id === id && !audio.paused;
      var btn = bar.querySelector('.play'); btn.innerHTML = ''; btn.appendChild(ic(on ? 'pause' : 'play'));
      btn.setAttribute('aria-label', (on ? 'Pause' : 'Play') + ' voice-over');
      var sc = bar.closest('section'); if (sc) sc.classList.toggle('speaking', on);
      if (vo.id !== id) { bar.querySelector('.bar i').style.width = '0'; bar.querySelector('.cap').textContent = ''; bar.querySelector('.time').textContent = bar.dataset.len || ''; }
    });
  }
  function playVo(id) {
    if (!V.audio[id]) return;
    if (vo.id === id && !audio.paused) { audio.pause(); refreshVo(); return; }
    if (vo.id !== id) { audio.src = V.audio[id]; vo.id = id; vo.cues = []; }
    audio.playbackRate = S.rate;
    var p = audio.play(); if (p && p.catch) p.catch(function () { toast('Select play to hear the voice-over'); });
    refreshVo();
  }
  audio.addEventListener('loadedmetadata', function () { vo.cues = cues(V.script[vo.id] || '', audio.duration); });
  audio.addEventListener('timeupdate', function () {
    var bar = document.querySelector('.vo[data-id="' + vo.id + '"]'); if (!bar) return;
    bar.querySelector('.bar i').style.width = (audio.currentTime / (audio.duration || 1) * 100) + '%';
    bar.querySelector('.time').textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
    var c = vo.cues.filter(function (q) { return audio.currentTime >= q.from && audio.currentTime < q.to; })[0];
    var cap = bar.querySelector('.cap'); if (c && cap.textContent !== c.text) cap.textContent = c.text;
  });
  audio.addEventListener('ended', function () { var bar = document.querySelector('.vo[data-id="' + vo.id + '"]'); if (bar) bar.querySelector('.cap').textContent = ''; refreshVo(); });
  audio.addEventListener('pause', refreshVo); audio.addEventListener('play', refreshVo);

  function voBar(id) {
    if (!V.audio[id]) return null;
    var trans = h('div', { class: 'trans', id: 'tr-' + id, hidden: true, text: V.script[id] || '' });
    var rate = h('select', { 'aria-label': 'Voice-over speed', onchange: function () { S.rate = +this.value; audio.playbackRate = S.rate; save(); document.querySelectorAll('.vo select').forEach(function (s) { s.value = String(S.rate); }); } },
      [0.75, 1, 1.25, 1.5].map(function (r) { var o = h('option', { value: r, text: r + '×' }); if (r === S.rate) o.selected = true; return o; }));
    var tbtn = h('button', { class: 'tbtn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'tr-' + id, text: 'Transcript', onclick: function () { var open = trans.hidden; trans.hidden = !open; tbtn.setAttribute('aria-expanded', String(open)); } });
    var bar = h('div', { class: 'vo', 'data-id': id, role: 'group', 'aria-label': 'Voice-over' },
      h('div', { class: 'pres' }, h('img', { src: V.presenter.img, alt: '' })),
      h('div', { class: 'ctl' },
        h('span', { class: 'who', text: V.presenter.name + ' · voice-over' }),
        h('button', { class: 'play', type: 'button', 'aria-label': 'Play voice-over', onclick: function () { playVo(id); } }, ic('play')),
        h('span', { class: 'bar', 'aria-hidden': 'true' }, h('i')), h('span', { class: 'time' }), rate, tbtn),
      h('p', { class: 'cap', 'aria-live': 'off' }), trans);
    return bar;
  }

  /* ---------- completion + gating ---------- */
  function complete(id) {
    if (S.done[id]) return; S.done[id] = true; save(); updateGate(id); renderNav();
  }
  function updateGate(id) {
    var g = document.getElementById('gate-' + id); if (!g) return;
    var ok = !REQUIRED[id] || S.done[id];
    var btn = g.querySelector('button'); btn.disabled = !ok;
    var need = g.querySelector('.need'); if (need) need.hidden = ok;
    if (idx(id) < S.unlocked) g.hidden = true;
  }
  function gate(id) {
    var i = idx(id); if (i >= N - 1) return null;
    var next = SEC[i + 1];
    var g = h('div', { class: 'gate-wrap', id: 'gate-' + id },
      h('div', { class: 'gate' }, h('button', { class: 'btn', type: 'button', onclick: function () { go(i + 1, true); } }, 'Continue', ic('arrow'))),
      REQUIRED[id] ? h('p', { class: 'need', text: REQUIRED[id] }) : null);
    return g;
  }
  function go(i, fromGate) {
    if (fromGate && i > 0 && !REQUIRED[SEC[i - 1].id]) S.done[SEC[i - 1].id] = true;
    if (i > S.unlocked) S.unlocked = i;
    if (i === N - 1) S.done[SEC[i].id] = true;
    S.cur = SEC[i].id; save();
    SEC.forEach(function (s, k) { var el = document.getElementById('s-' + s.id); if (el) el.hidden = k > S.unlocked; if (k < S.unlocked) { var g = document.getElementById('gate-' + s.id); if (g) g.hidden = true; } });
    renderNav(); progress();
    var target = document.getElementById('s-' + SEC[i].id);
    target.scrollIntoView({ block: 'start' });
    var hd = target.querySelector('h1, h2'); if (hd) { hd.setAttribute('tabindex', '-1'); hd.focus({ preventScroll: true }); }
    if (fromGate && S.auto && V.audio[SEC[i].id]) playVo(SEC[i].id); else if (fromGate) audio.pause();
  }
  function progress() {
    var n = Object.keys(S.done).filter(function (k) { return S.done[k]; }).length, pct = Math.round(n / N * 100);
    var p = document.querySelector('.progress i'); if (p) p.style.width = pct + '%';
    var d = document.querySelector('.dbar i'); if (d) d.style.width = pct + '%';
    var t = document.querySelector('.dprog'); if (t) t.textContent = n + ' of ' + N + ' sections complete · ' + pct + '%';
  }

  /* ---------- sections ---------- */
  function sec(id, kick, title, body) {
    var s = h('section', { class: 'sec', id: 's-' + id, 'aria-labelledby': 'h-' + id },
      h('div', { class: 'in' }, kick ? h('p', { class: 'kick', text: kick }) : null, h('h2', { id: 'h-' + id, text: title }), voBar(id), body, gate(id)));
    return s;
  }
  function img(key, cls) { var m = L.img[key]; return m ? h('img', { src: m.src, alt: m.alt, class: cls || null, loading: 'lazy' }) : null; }
  function callout(kind, icon, title, text) { return h('div', { class: 'callout' + (kind ? ' ' + kind : '') }, h('span', { class: 'tile' }, ic(icon)), h('div', null, h('b', { text: title }), h('p', { text: text }))); }

  var build = {
    hero: function () {
      var m = SEC.filter(function (s) { return /Module \d/.test(s.nav); }).length;
      var vid = null;
      if (L.video) {
        vid = h('figure', { class: 'vid-wrap', style: 'margin:0;display:flex;flex-direction:column;gap:8px' },
          h('div', { class: 'vid' }, h('video', { src: L.video.src, controls: true, preload: 'metadata', playsinline: true, 'aria-describedby': 'vid-desc', onerror: function () { vid.hidden = true; } })),
          h('figcaption', { id: 'vid-desc', class: 'hint' }, h('b', { text: L.video.title + '. ' }), L.video.desc));
      }
      var s = h('section', { class: 'hero', id: 's-hero', 'aria-labelledby': 'h-hero' },
        h('div', { class: 'in' },
          h('div', { class: 'copy' },
            h('p', { class: 'tag', text: L.series + ' · ' + L.brand }),
            h('h1', { id: 'h-hero', html: 'Environmental Compliance &amp; <em>Land Management</em>' }),
            h('p', { class: 'lead', text: 'Your onboarding course before your first field placement: keep yourself safe, protect the land and report what you find.' }),
            h('dl', { class: 'meta' }, h('div', null, h('dt', { text: 'Time' }), h('dd', { text: 'About ' + L.minutes + ' minutes' })), h('div', null, h('dt', { text: 'Modules' }), h('dd', { text: String(m) })), h('div', null, h('dt', { text: 'Pass mark' }), h('dd', { text: L.pass + '%' })), h('div', null, h('dt', { text: 'Voice-over' }), h('dd', { text: 'Every section' }))),
            voBar('hero'),
            h('div', { class: 'btns' },
              h('button', { class: 'btn', type: 'button', onclick: function () { go(Math.max(1, S.unlocked), true); } }, S.unlocked > 1 ? 'Resume course' : 'Start course', ic('arrow')),
              h('button', { class: 'btn ghost', type: 'button', 'aria-pressed': String(S.auto), onclick: function () { S.auto = !S.auto; this.setAttribute('aria-pressed', String(S.auto)); this.lastChild.textContent = S.auto ? 'Voice-over plays automatically' : 'Voice-over on request'; save(); } }, ic('vol'), h('span', { text: S.auto ? 'Voice-over plays automatically' : 'Voice-over on request' }))),
            vid),
          h('div', { class: 'art' }, h('p', { class: 'bubble', text: 'Hi, I’m your trainer. I’ll talk you through each section.' }), img('host'))));
      return s;
    },
    intro: function () {
      return sec('intro', 'Module 1 · Foundations', 'Why it matters', [
        h('div', { class: 'split' }, h('div', { style: 'display:flex;flex-direction:column;gap:14px' },
          h('p', { class: 'lead', text: 'Everyday workplace decisions help protect natural environments. Land that is not looked after erodes, floods and loses its plants and wildlife.' }),
          h('p', { class: 'txt', text: 'By the end of this course you will be able to:' })), img('land')),
        h('ol', { class: 'outcomes' }, L.outcomes.map(function (o) { return h('li', { text: o }); }))]);
    },
    whatis: function () {
      return sec('whatis', 'Module 1 · Foundations', 'What is conservation?', [
        h('div', { class: 'split rev' }, img('tree'), h('div', { style: 'display:flex;flex-direction:column;gap:12px' },
          h('p', { class: 'lead', text: 'Conservation is protecting and managing natural environments so they stay healthy.' }),
          h('p', { class: 'txt', text: 'As a field trainee, your daily choices are part of that: where you park, where you walk, what you report.' }))),
        h('div', { class: 'pillars' }, L.pillars.map(function (p) { return h('div', null, h('b', { text: p.t }), h('p', { text: p.x })); }))]);
    },
    resp: function () {
      var nav = h('div', { class: 'stepnav', role: 'list', 'aria-label': 'Five responsibilities' });
      var card = h('div', { class: 'card stepcard', 'aria-live': 'polite' });
      var cur = S.steps.length ? S.steps[S.steps.length - 1] : 0;
      function show(i) {
        cur = i; if (S.steps.indexOf(i) < 0) S.steps.push(i);
        nav.innerHTML = '';
        L.steps.forEach(function (st, k) {
          nav.appendChild(h('button', { type: 'button', role: 'listitem', class: S.steps.indexOf(k) > -1 ? 'seen' : null, 'aria-current': k === i ? 'step' : null, onclick: function () { show(k); } }, h('span', { class: 'n', text: String(k + 1) }), st.title));
        });
        var st = L.steps[i];
        card.innerHTML = '';
        add(card, [h('p', { class: 'kick', text: 'Responsibility ' + (i + 1) + ' of 5' }), h('h3', { text: st.title }), h('p', { class: 'txt', text: st.text }), h('p', { class: 'say', text: st.say }),
          h('div', { class: 'stepctl' }, h('button', { class: 'btn ghost', type: 'button', disabled: i === 0, onclick: function () { show(i - 1); } }, 'Previous'),
            h('button', { class: 'btn', type: 'button', disabled: i === L.steps.length - 1, onclick: function () { show(i + 1); } }, 'Next step', ic('arrow')))]);
        save(); if (S.steps.length >= L.steps.length) complete('resp');
      }
      var wrap = h('div', { style: 'display:grid;gap:16px' }, h('div', { class: 'split' }, h('p', { class: 'lead', text: 'Five responsibilities you will use on every field task. Step through each one.' }), img('team')), nav, card);
      show(cur);
      return sec('resp', 'Module 1 · Foundations', 'Your five environmental responsibilities', wrap);
    },
    spot: function () {
      var info = h('div', { class: 'card spotinfo', 'aria-live': 'polite' }, h('p', { class: 'hint', text: 'Select a marker on the picture to see what needs attention and why.' }));
      var meterBar = h('i'), meterTxt = h('span');
      var hot = h('div', { class: 'hot' }, img('site'));
      function meter() { meterTxt.textContent = S.spot.length + ' of ' + L.spot.length + ' items found'; meterBar.style.width = (S.spot.length / L.spot.length * 100) + '%'; }
      L.spot.forEach(function (p, k) {
        var b = h('button', { class: 'mark' + (S.spot.indexOf(p.id) > -1 ? ' found' : ''), type: 'button', style: 'left:' + p.x + '%;top:' + p.y + '%', 'aria-label': 'Marker ' + (k + 1) + (S.spot.indexOf(p.id) > -1 ? ': ' + p.t : ''), 'aria-pressed': 'false',
          onclick: function () {
            hot.querySelectorAll('.mark').forEach(function (m) { m.setAttribute('aria-pressed', 'false'); });
            b.setAttribute('aria-pressed', 'true'); b.classList.add('found'); b.innerHTML = ''; b.appendChild(ic('check')); b.setAttribute('aria-label', 'Marker ' + (k + 1) + ': ' + p.t);
            if (S.spot.indexOf(p.id) < 0) { S.spot.push(p.id); LMS.interaction('spot-' + p.id, 'other', 'found', true); }
            info.innerHTML = ''; add(info, [h('h3', { text: p.t }), h('p', { class: 'txt', text: p.why })]);
            meter(); save(); if (S.spot.length === L.spot.length) { complete('spot'); say('All five items found.'); }
          } }, ic(S.spot.indexOf(p.id) > -1 ? 'check' : 'plus'));
        hot.appendChild(b);
      });
      meter();
      return sec('spot', 'Module 1 · Foundations', 'Spot what needs attention', [
        h('p', { class: 'lead', text: 'Look carefully at the site below. Select each marker to find the items that might need attention.' }),
        hot, h('div', { class: 'meter' }, meterTxt, h('span', { class: 'bar', 'aria-hidden': 'true' }, meterBar)), info]);
    },
    native: function () {
      var grid = h('div', { class: 'flips' });
      L.flips.forEach(function (f, k) {
        var on = S.flips.indexOf(k) > -1;
        var b = h('button', { class: 'flip', type: 'button', 'aria-pressed': String(on), onclick: function () {
          var now = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(now)); render(now);
          if (S.flips.indexOf(k) < 0) S.flips.push(k); save(); if (S.flips.length === L.flips.length) complete('native');
        } });
        function render(back) { b.innerHTML = ''; add(b, back ? [h('b', { text: f.t }), h('p', { text: f.x }), h('small', { text: 'Select to flip back' })] : [h('b', { text: f.t }), h('small', { text: 'Select to see why' })]); }
        render(on); grid.appendChild(b);
      });
      return sec('native', 'Module 2 · In the field', 'Native vegetation', [
        h('div', { class: 'split' }, h('div', { style: 'display:flex;flex-direction:column;gap:12px' },
          h('p', { class: 'lead', text: 'Native plants give food and shelter to native wildlife and hold soil and banks together. Knowing what you are looking at is the first step.' }),
          h('p', { class: 'txt', text: 'Flip each card to see why identification matters on site.' })), img('sow')), grid]);
    },
    weeds: function () {
      return sec('weeds', 'Module 2 · In the field', 'Weed management', [
        h('p', { class: 'lead', text: 'Invasive weeds are introduced plants that take hold where they do not belong.' }),
        h('div', { class: 'infos' }, L.weeds.map(function (w) { return h('div', { class: 'info' }, h('b', { text: w.t }), h('p', { text: w.x })); })),
        callout('', 'leaf', 'Biosecurity: clean down before you move', 'Weed seed, soil and pathogens travel on boots, tools and vehicles. Clean down before you move between sites, and stick to marked tracks and wash-down points.')]);
    },
    safety: function () {
      var list = h('ul', { class: 'sortlist' });
      L.sort.items.forEach(function (it, k) {
        var li = h('li'), fb = h('p', { class: 'fb', 'aria-live': 'polite' });
        var opts = h('div', { class: 'opts', role: 'group', 'aria-label': 'Sort: ' + it.text });
        function pick(b) {
          S.sort[k] = b; save();
          opts.querySelectorAll('button').forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === b)); });
          var ok = b === it.to; li.className = ok ? 'ok' : 'no';
          fb.textContent = (ok ? 'Correct. ' : 'Not quite. Try the other group. ') + (ok ? it.why : '');
          LMS.interaction('safety-' + (k + 1), 'choice', L.sort.buckets[b], ok);
          var all = L.sort.items.every(function (x, j) { return S.sort[j] === x.to; });
          if (all) { complete('safety'); say('All six actions sorted correctly.'); }
        }
        L.sort.buckets.forEach(function (bk, j) { opts.appendChild(h('button', { type: 'button', 'aria-pressed': 'false', text: bk, onclick: function () { pick(j); } })); });
        add(li, [h('p', { style: 'font-weight:600', text: it.text }), opts, fb]); list.appendChild(li);
        if (S.sort[k] != null) setTimeout(function () { pick(S.sort[k]); }, 0);
      });
      return sec('safety', 'Module 2 · In the field', 'Safety on site', [
        h('p', { class: 'lead', text: 'Before you enter a site, complete your induction, wear the right gear and tell your team leader where you will be.' }),
        callout('warn', 'alert', 'Your safety comes first', 'If something looks unsafe, stop and tell your team leader. No task is so urgent that it cannot be done safely.'),
        h('p', { class: 'txt', text: 'Sort each action: is it safe and responsible, or does it put people or the site at risk?' }), list]);
    },
    scenario: function () {
      var sc = L.scenario, chat = h('div', { class: 'chat', 'aria-live': 'polite' }), replies = h('div', { class: 'replies' });
      var aims = h('ul', { class: 'aims', 'aria-label': 'Your aims' }, sc.aims.map(function (a) { return h('li', null, h('i'), h('span', { text: a })); }));
      function bubble(me, who, text) { return h('div', { class: 'row' + (me ? ' me' : '') }, h('span', { class: 'av', 'aria-hidden': 'true', text: me ? 'You' .slice(0, 1) : sc.persona.initials }), h('div', { class: 'bub' }, h('p', { class: 'who', text: who }), h('p', { text: text }))); }
      function markAim(k, pts) { var li = aims.children[k]; li.className = pts === 2 ? 'g' : pts === 1 ? 'o' : 'p'; }
      function run() {
        chat.innerHTML = ''; replies.innerHTML = ''; [].forEach.call(aims.children, function (li) { li.className = ''; });
        add(chat, h('p', { class: 'hint', text: sc.intro }));
        S.scen.forEach(function (p, t) { var turn = sc.turns[t], o = turn.options[p]; add(chat, [bubble(false, sc.persona.name, turn.say), bubble(true, 'You', o.text), h('p', { class: 'fb ' + (o.pts === 2 ? 'g' : o.pts === 1 ? 'o' : 'p'), text: o.fb })]); markAim(turn.aim, o.pts); });
        var t = S.scen.length;
        if (t < sc.turns.length) {
          var turn = sc.turns[t]; add(chat, bubble(false, sc.persona.name, turn.say));
          turn.options.forEach(function (o, j) { replies.appendChild(h('button', { type: 'button', text: o.text, onclick: function () { S.scen.push(j); LMS.interaction('jordan-' + (t + 1), 'choice', o.text.slice(0, 200), o.pts === 2); save(); run(); } })); });
        } else {
          var pts = S.scen.reduce(function (a, p, k) { return a + sc.turns[k].options[p].pts; }, 0);
          add(chat, [bubble(false, sc.persona.name, sc.outro), h('p', { class: 'fb g', text: 'You scored ' + pts + ' of ' + sc.turns.length * 2 + '. ' + sc.next })]);
          replies.appendChild(h('button', { type: 'button', text: 'Try the conversation again', onclick: function () { S.scen = []; save(); run(); } }));
          complete('scenario');
        }
      }
      run();
      return sec('scenario', 'Module 3 · Apply and check', 'An unfamiliar plant', [
        h('div', { class: 'brief' }, sc.brief.map(function (b) { return h('span', null, h('b', { text: b[0] + ': ' }), b[1]); })),
        h('div', { class: 'scen' }, h('div', { style: 'display:flex;flex-direction:column;gap:12px' }, chat, replies),
          h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, h('p', { class: 'kick', text: 'Your aims' }), aims, h('p', { class: 'hint', text: 'Green: aim met. Amber: partly. Red: try again.' })))]);
    },
    quiz: function () {
      var form = h('form', { novalidate: true, style: 'display:grid;gap:14px' }), out = h('div', { 'aria-live': 'polite' });
      L.quiz.forEach(function (q, k) {
        var fs = h('fieldset', null, h('legend', { text: (k + 1) + '. ' + q.q }));
        q.options.forEach(function (o, j) { fs.appendChild(h('label', null, h('input', { type: 'radio', name: 'q' + k, value: j }), h('span', { text: o }))); });
        form.appendChild(h('div', { class: 'q', id: 'q' + k }, fs, h('p', { class: 'fb', hidden: true })));
      });
      var submit = h('button', { class: 'btn', type: 'submit' }, 'Submit answers');
      form.appendChild(h('div', { class: 'btns' }, submit));
      function mark(ans) {
        var right = 0;
        L.quiz.forEach(function (q, k) {
          var box = document.getElementById('q' + k) || form.querySelector('#q' + k);
          var a = ans[k], ok = a === q.answer; if (ok) right++;
          box.querySelectorAll('label').forEach(function (l, j) { l.classList.toggle('right', j === q.answer); l.classList.toggle('wrong', j === a && !ok); l.querySelector('input').checked = j === a; });
          var fb = box.querySelector('.fb'); fb.hidden = false; fb.className = 'fb ' + (ok ? 'g' : 'p'); fb.textContent = (ok ? 'Correct. ' : 'Not quite. ') + q.why;
        });
        var pct = Math.round(right / L.quiz.length * 100), pass = pct >= L.pass;
        out.innerHTML = '';
        add(out, h('div', { class: 'result' + (pass ? '' : ' fail') }, h('b', { text: pct + '%' }),
          h('p', { text: (pass ? 'Passed. ' : 'Not yet. ') + right + ' of ' + L.quiz.length + ' correct. The pass mark is ' + L.pass + '%.' }),
          h('div', { class: 'btns' }, h('button', { class: 'btn ghost', type: 'button', onclick: function () { S.quiz = null; save(); form.reset(); form.querySelectorAll('label').forEach(function (l) { l.className = ''; }); form.querySelectorAll('.fb').forEach(function (f) { f.hidden = true; }); out.innerHTML = ''; submit.disabled = false; } }, 'Retake the quiz'))));
        submit.disabled = true; return { pct: pct, pass: pass };
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ans = L.quiz.map(function (q, k) { var c = form.querySelector('input[name="q' + k + '"]:checked'); return c ? +c.value : null; });
        if (ans.some(function (a) { return a === null; })) { toast('Answer all five questions first'); return; }
        var r = mark(ans);
        L.quiz.forEach(function (q, k) { LMS.interaction('quiz-' + (k + 1), 'choice', q.options[ans[k]].slice(0, 200), ans[k] === q.answer); });
        LMS.result(r.pct, L.pass);
        S.quiz = { ans: ans, pct: r.pct, pass: r.pass }; save(); complete('quiz');
        say('You scored ' + r.pct + ' percent. ' + (r.pass ? 'Passed.' : 'Not yet passed.'));
      });
      var s = sec('quiz', 'Module 3 · Apply and check', 'Knowledge check', [h('p', { class: 'lead', text: 'Five questions. You need ' + L.pass + '% to pass (4 of 5). Every answer comes with an explanation, and you can retake it.' }), form, out]);
      if (S.quiz) setTimeout(function () { mark(S.quiz.ans); }, 0);
      return s;
    },
    done: function () {
      return sec('done', 'Ready for placement', 'Well done', [
        h('div', { class: 'split' }, h('div', { class: 'take' }, h('h3', { text: L.takeaway.title }), h('p', { text: L.takeaway.text })), img('host')),
        h('div', { class: 'pillars' }, L.steps.map(function (st) { return h('div', null, h('b', { text: st.title }), h('p', { text: st.say })); })),
        h('p', { class: 'basis', text: L.basis })]);
    }
  };

  /* ---------- chrome ---------- */
  var themeBtn, drawer, scrim, menuBtn, dlist;
  function renderNav() {
    if (!dlist) return; dlist.innerHTML = '';
    SEC.forEach(function (s, i) {
      var open = i <= S.unlocked;
      dlist.appendChild(h('li', null, h('button', { type: 'button', class: 'ditem' + (S.done[s.id] ? ' done' : '') + (S.cur === s.id ? ' cur' : ''), disabled: !open, 'aria-current': S.cur === s.id ? 'true' : null,
        onclick: function () { closeMenu(); go(i, false); } }, h('span', { class: 'st', 'aria-hidden': 'true' }), h('span', { text: s.nav }), open ? null : h('span', { class: 'lock', text: 'Locked' }))));
    });
    progress();
  }
  function openMenu() { drawer.hidden = false; scrim.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); var c = drawer.querySelector('.ditem.cur') || drawer.querySelector('button'); c.focus(); }
  function closeMenu() { drawer.hidden = true; scrim.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
  var shortcuts;
  function init() {
    var brand = '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="bm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0CC0DF"/><stop offset="1" stop-color="#7ED957"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="none" stroke="url(#bm)" stroke-width="3.5"/><path d="M26 13.5h-8.2a3.6 3.6 0 0 0 0 7.2h4.4a3.6 3.6 0 0 1 0 7.2H13.6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="27.4" cy="27.9" r="1.9" fill="#7ED957"/></svg>';
    menuBtn = h('button', { class: 'ib', type: 'button', 'aria-label': 'Course menu', 'aria-expanded': 'false', 'aria-controls': 'drawer', onclick: openMenu }, ic('menu'), h('span', { class: 'lbl', text: 'Menu' }));
    themeBtn = h('button', { class: 'ib', type: 'button', onclick: function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); } });
    var keyBtn = h('button', { class: 'ib', type: 'button', 'aria-label': 'Keyboard shortcuts', onclick: function () { shortcuts.showModal(); } }, ic('key'));
    var top = h('header', { class: 'topbar' }, h('div', { class: 'row' }, menuBtn, h('div', { class: 'brand', html: brand }, h('span', { class: 't' }, h('span', { class: 'wm', text: 'Shammim' }), h('span', { class: 'ct', text: L.title }))), keyBtn, themeBtn), h('div', { class: 'progress', 'aria-hidden': 'true' }, h('i')));
    dlist = h('ul', { class: 'dlist' });
    drawer = h('nav', { class: 'drawer', id: 'drawer', 'aria-label': 'Course contents', hidden: true },
      h('div', { class: 'drawer-top' }, h('span', { class: 'label', text: 'Course contents' }), h('button', { class: 'ib', type: 'button', 'aria-label': 'Close menu', onclick: function () { closeMenu(); menuBtn.focus(); } }, ic('x'))),
      h('h2', { text: L.title }), h('p', { class: 'dprog' }), h('div', { class: 'dbar' }, h('i')), dlist);
    scrim = h('div', { class: 'scrim', hidden: true, onclick: closeMenu });
    shortcuts = h('dialog', { 'aria-labelledby': 'kh' }, h('h2', { id: 'kh', style: 'font-size:20px;margin-bottom:12px', text: 'Keyboard shortcuts' }),
      h('table', null, [['M', 'Open the course menu'], ['N', 'Next section'], ['P', 'Previous section'], ['Alt + Shift + V', 'Play or pause the voice-over'], ['K', 'Show these shortcuts'], ['Esc', 'Close menu or dialog']].map(function (r) { return h('tr', null, h('td', null, h('kbd', { text: r[0] })), h('td', { text: r[1] })); })),
      h('form', { method: 'dialog', style: 'margin-top:14px' }, h('button', { class: 'btn', text: 'Close' })));
    var main = h('main', { id: 'main' });
    SEC.forEach(function (s, i) { var el = build[s.id](); if (i > S.unlocked) el.hidden = true; main.appendChild(el); });
    add(document.body, [h('a', { class: 'skip', href: '#main', text: 'Skip to lesson content' }), top, scrim, drawer, main, shortcuts, live]);
    SEC.forEach(function (s) { updateGate(s.id); });
    applyTheme(); renderNav(); refreshVo();
    // section durations for the time labels
    Object.keys(V.audio).forEach(function (id) { var a = new Audio(); a.preload = 'metadata'; a.src = V.audio[id]; a.addEventListener('loadedmetadata', function () { var bar = document.querySelector('.vo[data-id="' + id + '"]'); if (bar) { bar.dataset.len = fmt(a.duration); if (vo.id !== id) bar.querySelector('.time').textContent = bar.dataset.len; } }); });
    // track the section in view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { S.cur = e.target.id.slice(2); renderNav(); save(); } }); }, { rootMargin: '-45% 0px -50% 0px' });
      document.querySelectorAll('main > section').forEach(function (s) { io.observe(s); });
    }
    if (S.cur && S.cur !== 'hero' && idx(S.cur) > 0 && idx(S.cur) <= S.unlocked) setTimeout(function () { var t = document.getElementById('s-' + S.cur); if (t) t.scrollIntoView({ block: 'start' }); }, 50);
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      if (e.key === 'Escape' && !drawer.hidden) { closeMenu(); menuBtn.focus(); return; }
      if (e.altKey && e.shiftKey && (e.key === 'V' || e.key === 'v')) { e.preventDefault(); playVo(S.cur); return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var i = idx(S.cur);
      if (e.key === 'm' || e.key === 'M') { e.preventDefault(); openMenu(); }
      else if (e.key === 'k' || e.key === 'K') { e.preventDefault(); shortcuts.showModal(); }
      else if ((e.key === 'n' || e.key === 'N') && i < S.unlocked) { e.preventDefault(); go(i + 1, false); }
      else if ((e.key === 'p' || e.key === 'P') && i > 0) { e.preventDefault(); go(i - 1, false); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
