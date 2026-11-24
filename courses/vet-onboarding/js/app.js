(function () {
  'use strict';
  const L = window.LESSON, ART = window.ART || {}, CUES = window.CUES || {}, NARR = window.NARR || {};
  const NS = 'http://www.w3.org/2000/svg', KEY = 'vet-onboard:' + L.id;
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const LATER = ['scenario', 'quiz', 'checklist', 'glossary', 'reflect', 'done'];
  const REQ = ['support', 'kc1', 'journey', 'order', 'resp', 'kc2', 'scenario', 'quiz'];
  const S = Object.assign({ done: {}, cont: false, quiz: null, scn: null, pos: 'hero', rate: 1, cc: true, chk: [], ref: -1 }, store.get(KEY, {}));
  (function restore() { const d = LMS.resume(); if (!d) return; S.done = {}; (d.d || []).forEach(k => { if (REQ.includes(k)) S.done[k] = true; }); S.cont = !!d.c; S.quiz = d.q || null; S.scn = d.s || null; S.pos = d.p || 'hero'; S.chk = d.k || []; S.ref = d.r == null ? -1 : d.r; })();
  const save = () => { store.set(KEY, S); LMS.save({ d: Object.keys(S.done), c: S.cont ? 1 : 0, q: S.quiz && { right: S.quiz.right, total: S.quiz.total, pct: S.quiz.pct }, s: S.scn, p: S.pos, k: S.chk, r: S.ref }, S.pos); };
  /* helpers */
  function h(tag, attrs, ...kids) { const el = document.createElement(tag); if (attrs) for (const k in attrs) { const v = attrs[k]; if (v == null || v === false) continue; if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v; else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v); } kids.flat(9).forEach(c => { if (c == null || c === false) return; el.append(c.nodeType ? c : document.createTextNode(String(c))); }); return el; }
  const rc = (el, ...k) => el.replaceChildren(...k.flat(9).filter(c => c != null && c !== false).map(c => c.nodeType ? c : document.createTextNode(String(c))));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = (s, tag = 'p', cls) => h(tag, { class: cls, html: esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') });
  const I = { play: '<path d="M8 5v14l11-7z"/>', pause: '<path d="M8 5v14M16 5v14"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', chev: '<path d="M6 9l6 6 6-6"/>', arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>', arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>', arrowU: '<path d="M12 19V5M6 11l6-6 6 6"/>', arrowD: '<path d="M12 5v14M6 13l6 6 6-6"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', vol: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>', key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>', cc: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10a2.5 2.5 0 1 0 0 4M17 10a2.5 2.5 0 1 0 0 4"/>', award: '<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>', bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>', replay: '<path d="M4 12a8 8 0 1 0 2.3-5.6L4 8.7"/><path d="M4 4v4.7h4.7"/>', send: '<path d="M4 12l16-8-6 16-2-7z"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>' };
  function ic(n, fill) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'i' + (fill ? ' fill' : '')); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); s.innerHTML = I[n]; return s; }
  const say = (m, t = 2200) => { const el = h('div', { class: 'toast', role: 'status' }, m); document.body.append(el); setTimeout(() => el.remove(), t); };
  const live = h('div', { class: 'sr', 'aria-live': 'polite', 'aria-atomic': 'true', id: 'live' });
  const announce = t => { live.textContent = ''; setTimeout(() => live.textContent = t, 30); };
  const reqTag = key => h('span', { class: 'req' + (S.done[key] ? ' ok' : ''), 'data-req': key }, ic(S.done[key] ? 'check' : 'info'), S.done[key] ? 'Completed' : 'Required');
  function complete(key) { if (S.done[key]) return; S.done[key] = true; save(); document.querySelectorAll('[data-req="' + key + '"]').forEach(el => { el.className = 'req ok'; rc(el, ic('check'), 'Completed'); }); progress(); gateCheck(); }

  /* ---------- voice-over ---------- */
  const VO = { audio: null, id: null, btn: null, reset: null };
  function stopVO() { if (VO.audio) { VO.audio.pause(); } if (VO.reset) { VO.reset(); VO.reset = null; } }
  function voice(id) {
    const c = CUES[id] || { cues: [] }; const text = NARR[id] || '';
    const cap = h('p', { class: 'vo-cap', 'aria-hidden': 'true', hidden: !S.cc }, 'Listen to this section');
    const fill = h('i'); const bar = h('div', { class: 'bar', 'aria-hidden': 'true' }, fill);
    const btn = h('button', { class: 'vo-play', 'aria-label': 'Play voice-over for this section', 'data-vo': id }, ic('play', true));
    const state = h('span', { class: 'sr', 'aria-live': 'polite' });
    const lbl = (p) => { rc(btn, ic(p ? 'pause' : 'play', true)); btn.setAttribute('aria-label', (p ? 'Pause' : 'Play') + ' voice-over for this section'); };
    function audio() {
      if (VO.audio && VO.id === id) return VO.audio;
      stopVO(); const a = new Audio('audio/' + id + '.mp3'); a.preload = 'auto'; VO.audio = a; VO.id = id; VO.btn = btn;
      a.addEventListener('play', () => lbl(true)); a.addEventListener('pause', () => lbl(false));
      a.addEventListener('timeupdate', () => { fill.style.width = (a.duration ? a.currentTime / a.duration * 100 : 0) + '%'; const q = c.cues.find(x => a.currentTime >= x[0] && a.currentTime < x[1] + 0.3); if (q) cap.textContent = q[2]; });
      a.addEventListener('ended', () => { lbl(false); cap.textContent = 'Finished. Play to hear it again.'; fill.style.width = '100%'; state.textContent = 'Voice-over finished'; });
      a.addEventListener('error', () => { cap.hidden = false; cap.textContent = 'The audio could not load. Please read the transcript below.'; });
      return a;
    }
    btn.addEventListener('click', () => { document.querySelectorAll('.vo-play').forEach(b => { if (b !== btn) { rc(b, ic('play', true)); } }); if (VO.audio && VO.id !== id) stopVO(); const a = audio(); a.playbackRate = S.rate; if (a.paused) { if (a.ended) a.currentTime = 0; a.play().catch(() => { cap.hidden = false; cap.textContent = 'Your browser blocked the audio. Press play again.'; }); } else a.pause(); });
    return h('div', { class: 'vo', role: 'group', 'aria-label': 'Voice-over' },
      h('div', { class: 'vo-row' }, btn, h('div', { class: 'vo-main' }, h('div', { class: 'vo-t' }, ic('vol'), 'AI voice-over · ' + Math.round(c.dur || 0) + ' sec'), cap, bar), state),
      h('details', null, h('summary', null, 'Transcript'), h('p', null, text)));
  }
  const capSync = () => document.querySelectorAll('.vo-cap').forEach(el => el.hidden = !S.cc);

  /* ---------- blocks ---------- */
  /* ---------- clip player (mini listen buttons) ---------- */
  function listen(id, label, cls) {
    const lbl = p => { rc(btn, ic(p ? 'pause' : 'vol'), p ? 'Pause' : label); btn.setAttribute('aria-label', (p ? 'Pause: ' : 'Listen: ') + label); };
    const btn = h('button', { class: 'listen ' + (cls || ''), 'aria-label': 'Listen: ' + label, onclick: () => {
      if (VO.audio && VO.id === id && !VO.audio.paused) { VO.audio.pause(); lbl(false); return; }
      stopVO(); const a = new Audio('audio/' + id + '.mp3'); VO.audio = a; VO.id = id; VO.reset = () => lbl(false); a.playbackRate = S.rate;
      a.addEventListener('ended', () => { lbl(false); }); a.addEventListener('error', () => { say('The audio could not load. Please read the text.'); lbl(false); });
      a.play().then(() => lbl(true)).catch(() => { say('Your browser blocked the audio. Press listen again.'); lbl(false); }); } }, ic('vol'), label);
    return btn;
  }
  /* ---------- blocks ---------- */
  const artEl = (k, cls) => { const a = L.img[k]; return h('div', { class: 'art ' + (cls || '') }, h('img', { src: a.src, alt: a.alt, loading: 'lazy', decoding: 'async' })); };
  const shell = (id, inner, cls) => h('section', { class: 'sec ' + (cls || ''), id, 'aria-labelledby': id + '-h' }, h('div', { class: 'wrap' }, h('div', { class: 'stack' }, inner)));
  const head = (id, kicker, title, req) => h('div', { class: 'head reveal' }, h('span', { class: 'mono' }, kicker), h('h2', { id: id + '-h' }, title), req ? reqTag(req) : null);
  const callout = (icn, kick, title, text, cls) => h('div', { class: 'callout reveal ' + (cls || '') }, h('div', { class: 'ic' }, ic(icn)), h('div', null, h('span', { class: 'mono' }, kick), h('h3', null, title), md(text)));
  const objectives = (list) => h('div', { class: 'card' }, h('span', { class: 'mono' }, 'By the end you will be able to'), h('ul', { class: 'outcomes' }, list.map(o => h('li', null, o))));

  function hero() {
    return h('section', { class: 'sec hero', id: 'hero', 'aria-labelledby': 'hero-h' }, h('div', { class: 'wrap' },
      h('div', { class: 'stack' }, h('span', { class: 'mono' }, L.series), h('h1', { id: 'hero-h' }, 'Welcome to vocational learning'),
        h('p', { class: 'lead' }, 'Starting a new course can feel exciting, and sometimes a little overwhelming. Your first 30 days are a chance to understand how your course works, connect with your trainers and build the habits you will need to succeed.'),
        voice('hero'),
        h('ul', { class: 'facts' }, [['25', 'minutes'], ['3', 'modules'], ['5', 'question quiz']].map(f => h('li', null, h('b', null, f[0]), h('span', null, f[1])))),
        h('div', null, h('a', { class: 'btn', href: '#expect' }, 'Start learning', ic('arrowR')))),
      artEl('welcome', 'land')),
      days());
  }
  function days() {
    const D = L.days; let cur = 0;
    const card = h('div', { class: 'day-card', 'aria-live': 'polite' });
    const btns = D.stops.map((s, i) => h('button', { class: 'day', 'aria-pressed': 'false', onclick: () => go(i) }, h('span', { class: 'day-n' }, s.when), h('span', { class: 'day-t' }, s.t)));
    function go(i) { cur = i; btns.forEach((b, k) => { b.setAttribute('aria-pressed', String(k === i)); b.classList.toggle('past', k < i); });
      const s = D.stops[i]; rc(card, h('span', { class: 'mono' }, s.when + ' · ' + s.stages), h('h3', null, s.t), md(s.x), h('p', { class: 'when' }, h('strong', null, 'Who can help: '), s.who)); }
    go(0);
    return h('div', { class: 'days-wrap' }, h('div', { class: 'days' }, h('h2', { class: 'days-h' }, D.title), h('p', { class: 'hint' }, D.intro),
      h('div', { class: 'track', role: 'group', 'aria-label': 'Your first 30 days' }, btns), card));
  }
  function expect() {
    const E = L.expect;
    return shell('expect', [head('expect', 'Module 1 · VET onboarding and induction', 'What can you expect?'), voice('expect'),
      md('Vocational Education and Training (VET) focuses on developing **practical knowledge and skills for work.**', 'p', 'lead'),
      h('div', { class: 'two reveal' }, objectives(E.objectives), artEl('guide', 'tall')),
      h('div', { class: 'reveal' }, h('h3', { class: 'sub' }, 'Depending on your course, you may learn through'), h('ul', { class: 'modes' }, E.modes.map(m => h('li', null, m)))),
      md(L.basis, 'p', 'basis')]);
  }
  function support() {
    const seen = new Set(); let sel = -1;
    const panel = h('div', { class: 'card roleinfo', 'aria-live': 'polite' }, h('p', { class: 'hint' }, 'Select a photo to see who can help and when.'));
    const count = h('p', { class: 'hint', role: 'status' }, '0 of ' + L.roles.length + ' viewed');
    const tiles = L.roles.map((r, i) => h('button', { class: 'role', 'aria-pressed': 'false', onclick: () => pick(i) }, h('img', { src: L.img[r.key].src, alt: L.img[r.key].alt, loading: 'lazy' }), h('span', { class: 'rt' }, r.t, h('span', { class: 'sr', 'data-v': '' }))));
    function pick(i) { sel = i; seen.add(i); const r = L.roles[i];
      tiles.forEach((b, k) => { b.setAttribute('aria-pressed', String(k === i)); b.classList.toggle('seen', seen.has(k)); b.querySelector('[data-v]').textContent = seen.has(k) ? ' (viewed)' : ''; });
      rc(panel, h('span', { class: 'mono' }, r.t), md(r.x), h('p', { class: 'when' }, h('strong', null, 'When to go: '), r.when));
      count.textContent = seen.size + ' of ' + L.roles.length + ' viewed';
      if (seen.size === L.roles.length) { complete('support'); announce('All four support roles viewed.'); } }
    return shell('support', [head('support', 'Module 1 · Lesson', 'Who can support you?', 'support'), voice('support'), md('Four people and teams are there to help. Select each photo to find out how.', 'p', 'hint'), h('div', { class: 'roles reveal' }, tiles), count, panel,
      callout('bulb', 'Key takeaway', 'Not sure who to ask?', 'Start by asking your trainer or student support team.', 'note')]);
  }
  function kcBlock(id, num, K, title, kick) {
    const name = 'kc' + num + 'o'; let done = false;
    const area = h('div', { class: 'stack' }), fbHost = h('div', { 'aria-live': 'polite' });
    const draw = () => { done = false; const fs = h('fieldset', { class: 'opts' }, h('legend', null, K.q), K.options.map((o, i) => h('label', { class: 'opt', for: name + i }, h('input', { type: 'radio', name, id: name + i, value: i }), h('span', null, o.text))));
      const sub = h('button', { class: 'btn sm', onclick: () => { const v = fs.querySelector('input:checked'); if (!v) { say('Choose an answer first'); return; } const i = +v.value, ok = i === K.answer;
        fs.querySelectorAll('input').forEach(x => x.disabled = true); sub.disabled = true; fs.querySelectorAll('.opt').forEach((l, k) => { if (k === K.answer) l.classList.add('right'); else if (k === i) l.classList.add('wrong'); });
        LMS.interaction({ id: 'kc' + num, type: 'choice', response: 'abcd'[i], correct: 'abcd'[K.answer], ok, text: K.q });
        rc(fbHost, h('div', { class: 'fb ' + (ok ? 'ok' : 'no') }, h('strong', null, (ok ? 'Correct. ' : 'Not quite. ')), K.options[i].fb), h('div', { class: 'ctl' }, listen('kf' + num + '_' + i, 'Listen to feedback'), ok ? h('span', { class: 'req ok' }, ic('check'), 'Knowledge check complete') : h('button', { class: 'btn ghost sm', onclick: () => { rc(fbHost); draw(); } }, ic('replay'), 'Try again')));
        if (ok) complete(id); announce((ok ? 'Correct. ' : 'Not quite. ') + K.options[i].fb); } }, 'Submit');
      rc(area, h('div', { class: 'ctl' }, listen('kq' + num, 'Listen to the question and options')), fs, h('div', null, sub)); };
    draw();
    return shell(id, [head(id, kick, title, id), voice(id), h('div', { class: 'card reveal' }, area, fbHost)]);
  }
  function journey() {
    let cur = 0; const seen = new Set([0]); const nav = h('div', { class: 'steps', role: 'group', 'aria-label': 'Journey stages' }); const card = h('div', { class: 'card', 'aria-live': 'polite' });
    const go = i => { cur = i; seen.add(i); if (seen.size === L.stages.length) complete('journey'); [...nav.children].forEach((p, k) => { p.classList.toggle('seen', seen.has(k)); if (k === i) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); });
      const s = L.stages[i]; rc(card, h('span', { class: 'mono' }, 'Stage ' + (i + 1) + ' of ' + L.stages.length), h('h3', null, s.t), md(s.x),
        h('div', { class: 'ctl' }, h('button', { class: 'btn ghost sm', disabled: i === 0, onclick: () => go(i - 1) }, ic('arrowL'), 'Back'), i < L.stages.length - 1 ? h('button', { class: 'btn sm', onclick: () => go(i + 1) }, 'Next stage', ic('arrowR')) : h('span', { class: 'req ok' }, ic('check'), 'All stages viewed'))); };
    L.stages.forEach((s, i) => nav.append(h('button', { class: 'step-pill', 'aria-label': 'Stage ' + (i + 1) + ': ' + s.t, onclick: () => go(i) }, (i + 1) + ' ' + s.t)));
    go(0);
    return shell('journey', [head('journey', 'Module 2 · Your onboarding journey', 'From enrolment to learning', 'journey'), voice('journey'), md(L.journey.intro, 'p', 'lead'),
      h('div', { class: 'two reveal' }, objectives(L.journey.objectives), artEl('cross', 'tall')), h('div', { class: 'reveal' }, nav, card),
      callout('bulb', 'Key takeaway', 'Know what comes next', 'Understanding the onboarding journey helps you know what to expect and what action to take next.', 'note')]);
  }
  function orderAct() {
    let ord = L.journey.start.slice(), checked = false, wrongSet = new Set(); const list = h('ol', { class: 'order' }), status = h('p', { class: 'hint', role: 'status' }, 'Move each stage up or down, then check your journey.'), ctl = h('div', { class: 'ctl' });
    const draw = (focus) => { rc(list, ord.map((si, pos) => { const s = L.stages[si]; const st = checked ? (si === pos ? 'right' : 'wrong') : '';
      return h('li', { class: 'ord ' + st }, h('span', { class: 'n', 'aria-hidden': 'true' }, pos + 1), h('span', { class: 't' }, s.t, checked ? h('span', { class: 'sr' }, si === pos ? ' (correct position)' : ' (wrong position)') : null),
        h('span', { class: 'mv' }, h('button', { class: 'btn ghost sm icon', 'data-id': si, 'data-d': 'up', disabled: pos === 0, 'aria-label': 'Move ' + s.t + ' up, now position ' + (pos + 1), onclick: () => mv(pos, -1) }, ic('arrowU'), h('span', { class: 'sr' }, 'Move up')),
          h('button', { class: 'btn ghost sm icon', 'data-id': si, 'data-d': 'dn', disabled: pos === ord.length - 1, 'aria-label': 'Move ' + s.t + ' down, now position ' + (pos + 1), onclick: () => mv(pos, 1) }, ic('arrowD'), h('span', { class: 'sr' }, 'Move down')))); }));
      if (focus) { const b = list.querySelector('[data-id="' + focus.id + '"][data-d="' + focus.d + '"]:not(:disabled)') || list.querySelector('[data-id="' + focus.id + '"]:not(:disabled)'); b && b.focus({ preventScroll: true }); } };
    function mv(pos, d) { const id = ord[pos]; [ord[pos], ord[pos + d]] = [ord[pos + d], ord[pos]]; checked = false; status.textContent = L.stages[id].t + ' moved to position ' + (pos + d + 1) + '.'; draw({ id, d: d < 0 ? 'up' : 'dn' }); rc(ctl, chk, rev); }
    const chk = h('button', { class: 'btn sm', onclick: () => { checked = true; const n = ord.filter((si, p) => si === p).length; draw(); LMS.interaction({ id: 'order', type: 'sequencing', response: ord.map(i => L.stages[i].t[0]).join(','), correct: L.stages.map(s => s.t[0]).join(','), ok: n === ord.length, text: 'Put the eight stages in order' });
      if (n === ord.length) { status.textContent = 'That is right! All eight stages are in the correct order.'; complete('order'); rc(ctl, chk); } else { status.textContent = n + ' of 8 stages are in the right place. Move the marked stages and check again.'; rc(ctl, chk, rev); } announce(status.textContent); } }, 'Check my journey');
    const rev = h('button', { class: 'btn ghost sm', onclick: () => { ord = L.stages.map((s, i) => i); checked = false; draw(); status.textContent = 'The correct order is shown. Select check my journey to finish.'; announce(status.textContent); } }, 'Show the correct order');
    draw(); rc(ctl, chk);
    return shell('order', [head('order', 'Activity', 'Put the journey in order', 'order'), voice('order'), md('Arrange the eight stages from first to last. Use the move up and move down buttons. No dragging is needed.', 'p', 'hint'), h('div', { class: 'reveal' }, list, h('div', { style: 'margin-top:16px;display:flex;flex-direction:column;gap:12px' }, ctl, status))]);
  }
  function resp() {
    const seen = new Set(), wrap = h('div', { class: 'acc reveal' });
    L.resp.items.forEach((x, i) => { const id = 'rs' + i; const item = h('div', { class: 'acc-item' });
      const a = h('div', { class: 'acc-a', id, hidden: true }, md(x.x), h('div', { class: 'say' }, h('small', null, 'In practice'), x.eg));
      const b = h('button', { class: 'acc-q', 'aria-expanded': 'false', 'aria-controls': id, onclick: () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', String(o)); a.hidden = !o; if (o) { seen.add(i); item.classList.add('seen'); if (seen.size === L.resp.items.length) { complete('resp'); announce('All six responsibilities viewed.'); } } } }, h('span', { class: 'n' }, i + 1), h('span', { class: 't' }, x.t), ic('chev'));
      item.append(b, a); wrap.append(item); });
    return shell('resp', [head('resp', 'Module 3 · Understanding your responsibilities', 'Your responsibilities as a VET learner', 'resp'), voice('resp'), md(L.resp.intro, 'p', 'lead'), h('div', { class: 'two reveal' }, objectives(L.resp.objectives), artEl('guide', 'tall')), md('Open each card to see what it looks like in practice.', 'p', 'hint'), wrap]);
  }

  function habits() {
    const H = L.habits, wrap = h('div', { class: 'acc reveal' });
    H.items.forEach((x, i) => { const id = 'hb' + i; const a = h('div', { class: 'acc-a', id, hidden: true }, md(x.x), h('div', { class: 'say' }, h('small', null, 'Try this'), x.eg));
      const b = h('button', { class: 'acc-q', 'aria-expanded': 'false', 'aria-controls': id, onclick: () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', String(o)); a.hidden = !o; } }, h('span', { class: 'n' }, i + 1), h('span', { class: 't' }, x.t), ic('chev')); wrap.append(h('div', { class: 'acc-item' }, b, a)); });
    return shell('habits', [head('habits', 'Module 3 · Extra', 'Study habits and wellbeing'), voice('habits'), md(H.intro, 'p', 'lead'), wrap, callout('info', 'Need urgent support?', 'Reach out now', H.urgent, 'note')]);
  }
  function checklistSec() {
    const C = L.checklist; const total = C.weeks.reduce((a, w) => a + w.items.length, 0);
    const count = h('p', { class: 'hint', role: 'status', id: 'chk-count' }); const bar = h('i'); const pb = h('div', { class: 'bar', 'aria-hidden': 'true' }, bar);
    const upd = () => { const n = S.chk.length; count.textContent = n + ' of ' + total + ' done'; bar.style.width = n / total * 100 + '%'; };
    const boxes = C.weeks.map((w, wi) => h('fieldset', { class: 'card chk' }, h('legend', null, w.t), w.items.map((it, ii) => { const key = wi + '-' + ii;
      return h('label', { class: 'chk-i', for: 'ck' + key }, h('input', { type: 'checkbox', id: 'ck' + key, checked: S.chk.includes(key) || null, onchange: e => { if (e.target.checked) { if (!S.chk.includes(key)) S.chk.push(key); } else S.chk = S.chk.filter(k => k !== key); save(); upd(); } }), h('span', null, it)); })));
    upd();
    return shell('checklist', [head('checklist', 'Resource', 'Your 30-day checklist'), voice('checklist'), md(C.intro, 'p', 'lead'), h('div', { class: 'reveal' }, count, pb), h('div', { class: 'chkgrid reveal' }, boxes)]);
  }
  function glossarySec() {
    const G = L.glossary; const status = h('p', { class: 'hint', role: 'status' }); const list = h('dl', { class: 'gloss' });
    const inp = h('input', { type: 'search', id: 'gf', class: 'gf', autocomplete: 'off', oninput: () => draw() });
    const draw = () => { const q = inp.value.trim().toLowerCase(); const rows = G.terms.filter(t => !q || (t.t + ' ' + t.x).toLowerCase().includes(q));
      rc(list, rows.map(t => h('div', { class: 'g-i' }, h('dt', null, t.t), h('dd', null, t.x)))); status.textContent = rows.length ? rows.length + ' of ' + G.terms.length + ' terms shown' : 'No terms match. Try a different word.'; };
    draw();
    return shell('glossary', [head('glossary', 'Resource', 'Glossary of VET terms'), voice('glossary'), md(G.intro, 'p', 'lead'), h('div', { class: 'reveal' }, h('label', { for: 'gf', class: 'gl' }, 'Filter terms'), inp, status), h('div', { class: 'reveal' }, list), md(G.note, 'p', 'basis')]);
  }
  function reflectSec() {
    const R = L.reflect; const fb = h('div', { 'aria-live': 'polite' });
    const show = i => rc(fb, h('div', { class: 'fb ok' }, h('strong', null, 'Your first step: '), R.options[i].t + '. ', R.options[i].fb, h('div', { class: 'ctl' }, listen('rf' + i, 'Listen to feedback', 'sm'))));
    const fs = h('fieldset', { class: 'opts' }, h('legend', null, 'What will you do first?'), R.options.map((o, i) => h('label', { class: 'opt', for: 'rf' + i }, h('input', { type: 'radio', name: 'rflt', id: 'rf' + i, value: i, checked: S.ref === i || null, onchange: () => { S.ref = i; save(); show(i); announce('Saved. ' + R.options[i].fb); } }), h('span', null, o.t))));
    if (S.ref >= 0) show(S.ref);
    return shell('reflect', [head('reflect', 'Reflect', 'Your first step'), voice('reflect'), md(R.intro, 'p', 'lead'), h('div', { class: 'card reveal' }, fs, fb)]);
  }
  /* gate (Rise-style Continue divider) */
  const GATE = ['support', 'kc1', 'journey', 'order', 'resp', 'kc2'];
  const gate = h('section', { class: 'sec', id: 'gate', 'aria-label': 'Continue' }, h('div', { class: 'wrap' }, h('div', { class: 'gate' }, h('span', { class: 'mono' }, 'Ready to practise?'), h('p', { id: 'gatemsg' }, 'Finish the six activities above to continue.'), h('button', { class: 'btn', id: 'gatebtn', disabled: true, onclick: () => unlock(true) }, 'Continue', ic('arrowR')))));
  const later = h('div', { id: 'later', hidden: true });
  function gateCheck() { const left = GATE.filter(k => !S.done[k]).length; const b = document.getElementById('gatebtn'); if (!b) return; b.disabled = left > 0; document.getElementById('gatemsg').textContent = left ? 'Finish the ' + left + ' remaining required ' + (left > 1 ? 'activities' : 'activity') + ' above to continue.' : 'Nice work. Continue to the practical scenario and final quiz.'; if (!left && !S.cont) announce('Continue is now available.'); }
  function unlock(go) { S.cont = true; save(); gate.hidden = true; later.hidden = false; observe(); if (go) { const t = document.getElementById('scenario-h'); t && (t.setAttribute('tabindex', '-1'), t.focus({ preventScroll: true }), document.getElementById('scenario').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' })); } }
  function scenario() {
    const T = L.scenario, p = T.persona; let k = 0, pts = 0; const got = [];
    const log = h('ol', { class: 'chat', 'aria-label': 'Your first fortnight' }), area = h('div', { class: 'stack' }), lv = h('div', { class: 'sr', 'aria-live': 'polite' });
    const aimsEl = h('ul', { class: 'aims' }); const drawAims = () => rc(aimsEl, T.aims.map((a, i) => h('li', { class: got[i] != null ? (got[i] === 2 ? 'ok' : 'part') : '' }, h('span', { class: 'ck', 'aria-hidden': 'true' }, got[i] === 2 ? '✓' : got[i] === 1 ? '~' : got[i] === 0 ? '×' : ''), h('span', null, a, got[i] != null ? h('span', { class: 'sr' }, got[i] === 2 ? ' (achieved)' : got[i] === 1 ? ' (partly achieved)' : ' (missed)') : null))));
    const sit = (t, i) => h('li', { class: 'sit' }, h('span', { class: 'mono' }, 'Moment ' + (i + 1) + ' of ' + T.turns.length), h('strong', null, t.title), h('p', null, t.say));
    const max = T.turns.length * 2;
    const next = () => {
      if (k >= T.turns.length) { S.scn = { pts, max }; complete('scenario'); const band = pts === max ? 'hi' : pts >= 3 ? 'mid' : 'lo';
        rc(area, h('div', { class: 'card', role: 'status' }, h('span', { class: 'mono' }, 'Debrief'), h('p', { class: 'score' }, pts + ' / ' + max),
          h('h3', null, pts === max ? 'Strong response' : pts >= 3 ? 'Good effort' : 'Keep practising'), md(T.debrief[band]),
          h('ul', { class: 'review' }, T.aims.map((a, i) => h('li', null, h('span', { class: got[i] === 2 ? 'ok' : 'no' }, ic(got[i] === 2 ? 'check' : 'x')), h('span', null, h('strong', null, a), ' ', got[i] === 2 ? 'Achieved.' : got[i] === 1 ? 'Partly achieved.' : 'Missed.')))),
          h('p', null, h('strong', null, 'Next time: '), T.next), md('This practice is not marked. It is here to help you try the choices.', 'p', 'hint'),
          h('div', { class: 'ctl' }, listen('sd_' + band, 'Listen to the debrief'), h('button', { class: 'btn ghost sm', onclick: start }, ic('replay'), 'Replay')))); lv.textContent = 'Practice complete. ' + pts + ' of ' + max + '.'; return; }
      const t = T.turns[k]; const kk = k; log.append(sit(t, k)); lv.textContent = t.title + '. ' + t.say; const name = 'sc' + k;
      const fs = h('fieldset', { class: 'opts' }, h('legend', null, 'What do you do?'), t.options.map((o, i) => h('label', { class: 'opt', for: name + i }, h('input', { type: 'radio', name, id: name + i, value: i }), h('span', null, o.text))));
      const best = 2;
      const send = h('button', { class: 'btn sm', onclick: () => { const v = fs.querySelector('input:checked'); if (!v) { say('Choose an option first'); return; } const i = +v.value, o = t.options[i]; pts += o.pts; got[t.aim] = o.pts;
        log.append(h('li', { class: 'msg me' }, h('div', { class: 'bub' }, h('b', null, 'You'), o.text)));
        LMS.interaction({ id: 'scenario_m' + (kk + 1), type: 'choice', response: 'abc'[i], correct: 'abc'[t.options.findIndex(x => x.pts === best)], ok: o.pts === best, weight: best, text: t.title });
        log.append(h('li', { class: 'fb ' + (o.pts === best ? 'ok' : o.pts ? 'mid' : 'no') }, h('strong', null, 'Feedback · ' + o.pts + ' of ' + best + ' points. '), o.fb, h('div', { class: 'ctl' }, listen('sf' + kk + '_' + i, 'Listen to feedback', 'sm')))); lv.textContent = 'Feedback: ' + o.fb; drawAims(); k++; next(); } }, ic('send'), 'Confirm choice');
      rc(area, h('div', { class: 'ctl' }, listen('sq' + kk, 'Listen to this moment and the options')), fs, h('div', null, send)); };
    const start = () => { rc(log); k = 0; pts = 0; got.length = 0; drawAims(); next(); };
    start();
    return h('div', { class: 'scn reveal' }, h('div', { class: 'card' }, h('div', { style: 'display:flex;gap:12px;align-items:center' }, h('span', { class: 'av', 'aria-hidden': 'true' }, p.initials), h('div', null, h('strong', null, p.name), h('div', { class: 'hint' }, p.role))),
      h('dl', { class: 'brief' }, T.brief.map(b => h('div', null, h('dt', null, b[0]), h('dd', null, b[1])))), md(T.intro, 'p', 'hint'), log, area, lv),
      h('aside', { class: 'card aimscard', 'aria-label': 'Your aims' }, h('h3', null, 'Your aims'), aimsEl, h('p', { class: 'hint' }, 'Each moment tests one aim. There are no trick answers.')));
  }
  function scenarioSec() { return shell('scenario', [head('scenario', 'Practical scenario', 'Your first fortnight', 'scenario'), voice('scenario'), md('**Three moments, three choices.** Decide who to contact and what to do.', 'p', 'lead'), scenario()]); }
  function quiz() {
    const wrap = h('div', { class: 'card reveal' }); let i = 0, ans = [];
    const q = () => { const Q = L.quiz[i], name = 'qz' + i; const fs = h('fieldset', { class: 'opts' }, h('legend', null, Q.q), Q.options.map((o, k) => h('label', { class: 'opt', for: name + k }, h('input', { type: 'radio', name, id: name + k, value: k }), h('span', null, o))));
      rc(wrap, h('span', { class: 'mono' }, 'Question ' + (i + 1) + ' of ' + L.quiz.length), h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Quiz progress', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(i / L.quiz.length * 100) }, h('i', { style: 'width:' + (i / L.quiz.length * 100) + '%' })), h('div', { class: 'ctl' }, listen('qq' + (i + 1), 'Listen to the question and options')), fs,
        h('div', null, h('button', { class: 'btn sm', onclick: () => { const v = fs.querySelector('input:checked'); if (!v) { say('Choose an answer first'); return; } ans[i] = +v.value; i++; if (i < L.quiz.length) { q(); wrap.querySelector('legend').scrollIntoView({ block: 'center', behavior: 'auto' }); } else result(); } }, i < L.quiz.length - 1 ? 'Next question' : 'See my result', ic('arrowR')))); };
    const result = () => {
      const right = ans.filter((a, k) => a === L.quiz[k].answer).length, pct = Math.round(right / L.quiz.length * 100), pass = pct >= L.pass;
      L.quiz.forEach((Q, k) => LMS.interaction({ id: 'quiz_q' + (k + 1), type: 'choice', response: 'abcd'[ans[k]], correct: 'abcd'[Q.answer], ok: ans[k] === Q.answer, text: Q.q }));
      S.quiz = { right, total: L.quiz.length, pct, pass }; complete('quiz'); LMS.result(pct, L.pass); save(); showResult(ans); refreshDone(); progress(); announce(pass ? 'You passed with ' + pct + ' percent.' : 'You scored ' + pct + ' percent. You need ' + L.pass + ' to pass.');
    };
    const showResult = (a) => { const r = S.quiz, pass = r.pct >= L.pass;
      rc(wrap, h('div', { class: 'res', role: 'status' }, h('div', { class: 'ring', style: '--p:' + r.pct }, h('span', null, r.pct + '%')), h('div', { class: 'stack', style: 'gap:6px' }, h('span', { class: 'mono' }, pass ? 'Passed' : 'Not yet passed'), md(r.right + ' of ' + r.total + ' correct. ' + (pass ? 'Well done.' : 'You need ' + L.pass + '% to pass. Read the notes below, then try again.')), h('p', { class: 'hint' }, LMS.ok ? 'Your result has been sent to your learning platform.' : 'You are viewing this outside a learning platform, so your result is saved on this device only.'), h('div', { class: 'ctl' }, listen(pass ? 'rpass' : 'rfail', 'Listen to your result')))),
        a ? h('ul', { class: 'review' }, L.quiz.map((Q, k) => { const g = a[k] === Q.answer; return h('li', null, h('span', { class: g ? 'ok' : 'no' }, ic(g ? 'check' : 'x'), h('span', { class: 'sr' }, g ? 'Correct: ' : 'Incorrect: ')), h('span', null, h('strong', null, Q.q), ' ', g ? '' : 'Answer: ' + Q.options[Q.answer] + '. ', Q.why, ' ', listen('qw' + (k + 1), 'Listen to explanation ' + (k + 1), 'sm'))); })) : null,
        h('div', null, h('button', { class: 'btn ghost sm', onclick: () => { i = 0; ans = []; q(); } }, ic('replay'), 'Retake the quiz'))); };
    if (S.quiz) showResult(null); else q();
    return wrap;
  }
  function quizSec() { return shell('quiz', [head('quiz', 'Final quiz', 'Five questions. Four to pass.', 'quiz'), voice('quiz'), md('Pass mark ' + L.pass + '%. You can retake the quiz.', 'p', 'lead'), quiz()]); }
  const doneHost = h('div', { id: 'donehost' });
  function refreshDone() { const r = S.quiz, pass = r && r.pct >= L.pass;
    rc(doneHost, h('div', { class: 'done-card reveal in' }, h('div', { class: 'seal' }, ic('award')), h('span', { class: 'mono' }, pass ? 'Module complete' : 'Nearly there'),
      h('h2', { id: 'done-h' }, pass ? 'Well done. You are ready for your first 30 days.' : 'Finish your quiz to complete the module'),
      md(pass ? 'You know who can help, what the journey looks like and what is expected of you.' : 'Answer the five quiz questions and score at least ' + L.pass + '% to complete this module.'), pass ? null : h('a', { class: 'btn', href: '#quiz' }, 'Go to the quiz', ic('arrowR'))),
      pass ? h('ul', { class: 'takes reveal in' }, L.takeaways.map(t => h('li', null, h('img', { src: L.img[t.img].src, alt: L.img[t.img].alt }), h('div', null, h('span', { class: 'mono' }, 'Key takeaway'), h('h3', null, t.t), md(t.x))))) : null); }
  function doneSec() { refreshDone(); return h('section', { class: 'sec', id: 'done', 'aria-labelledby': 'done-h' }, h('div', { class: 'wrap' }, h('div', { class: 'stack' }, voice('done'), doneHost))); }

  /* ---------- chrome ---------- */
  const secNav = L.sections;
  const bar = h('i'); const pct = h('b', null, '0%');
  const menu = h('div', { class: 'menu', id: 'menu', hidden: true }, h('ol', null, secNav.filter(s => s.id !== 'hero').map(s => h('li', null, h('a', { href: '#' + s.id, 'data-s': s.id, onclick: e => { e.preventDefault(); if (LATER.includes(s.id) && !S.cont) { say('Finish the required activities and select Continue first'); return; } scrim.hidden = true; main_().inert = false; menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); const t = document.getElementById(s.id + '-h') || document.getElementById(s.id); document.getElementById(s.id).scrollIntoView(); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } } }, h('span', { class: 'dot' }), s.nav)))));
  const menuBtn = h('button', { class: 'pill', 'aria-label': 'Sections', 'aria-expanded': 'false', 'aria-controls': 'menu', id: 'menubtn', onclick: () => setMenu(menu.hidden) }, ic('menu'), h('span', { class: 'lab' }, 'Sections'));
  const main_ = () => document.getElementById('main');
  const scrim = h('div', { class: 'scrim', hidden: true, onclick: () => setMenu(false) });
  function setMenu(o) { scrim.hidden = !o; const m = document.getElementById('main'); if (m) m.inert = o; menu.hidden = !o; menuBtn.setAttribute('aria-expanded', String(o)); if (o) { const a = menu.querySelector('a'); a && a.focus(); } else menuBtn.focus({ preventScroll: true }); }
  const ccBtn = h('button', { class: 'pill vp', 'aria-pressed': String(S.cc), onclick: () => { S.cc = !S.cc; ccBtn.setAttribute('aria-pressed', String(S.cc)); save(); capSync(); } }, ic('cc'), h('span', { class: 'lab' }, 'Captions'));
  const rate = h('select', { class: 'pill vp', 'aria-label': 'Voice-over speed', onchange: e => { S.rate = +e.target.value; save(); if (VO.audio) VO.audio.playbackRate = S.rate; } }, [0.85, 1, 1.15, 1.3].map(r => h('option', { value: r, selected: r === S.rate || null }, r + '×')));
  const dlg = h('dialog', { 'aria-labelledby': 'khT' }, h('div', { class: 'dlg' }, h('h2', { id: 'khT' }, 'Keyboard shortcuts'), h('table', { class: 'kt' }, h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Keys'), h('th', { scope: 'col' }, 'Action'))), h('tbody', null, [['Alt + Shift + V', 'Play or pause the voice-over for the section you are in'], ['Alt + Shift + M', 'Open or close the sections menu'], ['Alt + Shift + N', 'Next section'], ['Alt + Shift + P', 'Previous section'], ['Alt + Shift + K', 'Show these shortcuts'], ['Alt + Shift + H', 'Open Help: who to contact'], ['Tab / Shift + Tab', 'Move between controls'], ['Enter or Space', 'Select a button, card or option'], ['Arrow keys', 'Move between options in a question'], ['Esc', 'Close this dialog or the menu']].map(r => h('tr', null, h('td', null, r[0].split(' / ').map((g, gi) => [gi ? ' or ' : null, g.split(' + ').map((x, xi) => [xi ? ' + ' : null, h('kbd', null, x)])])), h('td', null, r[1]))))), h('p', { style: 'margin-top:16px' }, h('button', { class: 'btn sm', onclick: () => dlg.close() }, 'Close'))));
  const helpDlg = h('dialog', { 'aria-labelledby': 'hlpT' }, h('div', { class: 'dlg' }, h('h2', { id: 'hlpT' }, 'Who can help?'), h('p', { class: 'hint' }, 'Help is always here in the top bar. Start with your trainer or student support team if you are not sure.'), h('ul', { class: 'helplist' }, L.roles.map(r => h('li', null, h('strong', null, r.t), h('span', null, r.when)))), h('p', { style: 'margin-top:16px' }, h('button', { class: 'btn sm', onclick: () => helpDlg.close() }, 'Close'))));
  const helpBtn = h('button', { class: 'pill', 'aria-label': 'Help: who can support you', onclick: () => helpDlg.showModal() }, ic('help'), h('span', { class: 'lab' }, 'Help'));
  const keyBtn = h('button', { class: 'pill vp', onclick: e => { dlg.showModal(); } }, ic('key'), h('span', { class: 'lab' }, 'Shortcuts'));
  const top = h('header', { class: 'top' }, h('div', { class: 'top-in' }, h('div', { class: 'brand' }, h('img', { src: 'img/mark.svg', alt: '' }), h('span', null, L.brand), h('span', { class: 'sep' }), h('span', { class: 'ct' }, L.series + ' · ' + L.title)),
    h('div', { class: 'top-r' }, rate, ccBtn, helpBtn, keyBtn, h('div', { style: 'position:relative' }, menuBtn, menu))),
    h('div', { class: 'prog' }, h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Lesson progress', id: 'pbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 }, bar), pct));
  function progress() { const n = REQ.filter(k => S.done[k]).length, p = Math.round(n / REQ.length * 100); bar.style.width = p + '%'; pct.textContent = p + '%'; document.getElementById('pbar').setAttribute('aria-valuenow', p); document.querySelectorAll('.menu a').forEach(a => { const k = a.dataset.s; const d = REQ.includes(k) && S.done[k]; a.classList.toggle('done', d); const dot = a.querySelector('.dot'); rc(dot, d ? ic('check') : null); }); }
  /* assemble */
  document.body.append(h('a', { class: 'skip', href: '#main', onclick: e => { e.preventDefault(); const m = document.getElementById('main'); m.focus(); m.scrollIntoView(); } }, 'Skip to lesson'), top, live, scrim);
  const main = h('main', { id: 'main', tabindex: '-1' }, hero(), expect(), support(), kcBlock('kc1', 1, L.kc1, 'Who should you contact?', 'Knowledge check 1'), journey(), orderAct(), resp(), habits(), kcBlock('kc2', 2, L.kc2, 'You are falling behind', 'Knowledge check 2'), gate, later); later.append(scenarioSec(), quizSec(), checklistSec(), glossarySec(), reflectSec(), doneSec());
  document.body.append(main, h('footer', null, L.brand + ' · ' + L.series + ' · ' + L.title, h('br'), '© 2026 Shammim. All rights reserved. Not for reuse without permission.'), dlg, helpDlg);
  /* reveal + position */
  let io, cur = 'hero';
  function observe() { if (io) io.disconnect(); io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } }), { threshold: .12 }); document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el)); }
  const pos = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cur = e.target.id; S.pos = cur; } }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section.sec').forEach(s => pos.observe(s));
  setTimeout(() => { document.querySelectorAll('#later section.sec').forEach(s => pos.observe(s)); }, 0);
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  if (S.cont) { gate.hidden = true; later.hidden = false; } observe(); progress(); gateCheck();
  window.addEventListener('pagehide', save);
  if (S.pos && S.pos !== 'hero' && document.getElementById(S.pos) && (S.cont || !LATER.includes(S.pos))) setTimeout(() => document.getElementById(S.pos).scrollIntoView(), 50);
  /* keyboard */
  const order = secNav.map(s => s.id);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); return; }
    if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) { const k = (e.code || '').replace('Key', '');
      if (k === 'V') { e.preventDefault(); const b = document.querySelector('#' + cur + ' .vo-play') || document.querySelector('.vo-play'); b && b.click(); }
      else if (k === 'M') { e.preventDefault(); setMenu(menu.hidden); }
      else if (k === 'K') { e.preventDefault(); dlg.showModal(); }
      else if (k === 'H') { e.preventDefault(); helpDlg.showModal(); }
      else if (k === 'N' || k === 'P') { e.preventDefault(); let i = order.indexOf(cur) + (k === 'N' ? 1 : -1); i = Math.max(0, Math.min(order.length - 1, i)); const id = order[i]; if (LATER.includes(id) && !S.cont) { say('Finish the required activities and select Continue first'); return; } document.getElementById(id).scrollIntoView(); } } });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.menu') && e.target !== menuBtn && !menuBtn.contains(e.target)) { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); } });
  window.__CTC__ = { S, complete, unlock, REQ };
})();
