/* Rise-style course player (Shammim). Reads window.COURSE and window.VO_DATA.
   Cover page → lessons revealed segment by segment with Continue buttons → quiz lesson with a scored result.
   SCORM 1.2 / 2004 reporting when an LMS API is found; otherwise progress is kept in this browser. */
(function () {
  'use strict';
  const C = window.COURSE, VO = window.VO_DATA || {};
  const KEY = 'rise:' + C.id;
  const L = C.lessons, N = L.length; const UW = C.unit || 'Lesson';

  /* ---------- helpers ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(9).forEach(c => { if (c == null || c === false) return; el.append(c.nodeType ? c : document.createTextNode(String(c))); });
    return el;
  }
  const rc = (el, ...k) => el.replaceChildren(...k.flat(9).filter(c => c != null && c !== false).map(c => c.nodeType ? c : document.createTextNode(String(c))));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const inl = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[\[(.+?)\]\]/g, '<kbd>$1</kbd>');
  const md = (s, tag = 'p', cls) => h(tag, { class: cls, html: inl(s) });
  const NS = 'http://www.w3.org/2000/svg';
  /* Tabler Icons 3.19 (outline), embedded so the package makes no outside requests (Shammim Design System). */
  const I = {"menu": "<path d=\"M4 6l16 0\"/><path d=\"M4 12l16 0\"/><path d=\"M4 18l16 0\"/>", "x": "<path d=\"M18 6l-12 12\"/><path d=\"M6 6l12 12\"/>", "check": "<path d=\"M5 12l5 5l10 -10\"/>", "lock": "<path d=\"M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z\"/><path d=\"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0\"/><path d=\"M8 11v-4a4 4 0 1 1 8 0v4\"/>", "arrowR": "<path d=\"M5 12l14 0\"/><path d=\"M13 18l6 -6\"/><path d=\"M13 6l6 6\"/>", "arrowL": "<path d=\"M5 12l14 0\"/><path d=\"M5 12l6 6\"/><path d=\"M5 12l6 -6\"/>", "chevD": "<path d=\"M6 9l6 6l6 -6\"/>", "plus": "<path d=\"M12 5l0 14\"/><path d=\"M5 12l14 0\"/>", "minus": "<path d=\"M5 12l14 0\"/>", "play": "<path d=\"M7 4v16l13 -8z\"/>", "pause": "<path d=\"M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\"/><path d=\"M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\"/>", "clock": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\"/><path d=\"M12 7v5l3 3\"/>", "book": "<path d=\"M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0\"/><path d=\"M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0\"/><path d=\"M3 6l0 13\"/><path d=\"M12 6l0 13\"/><path d=\"M21 6l0 13\"/>", "info": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\"/><path d=\"M12 9h.01\"/><path d=\"M11 12h1v4h1\"/>", "alert": "<path d=\"M12 9v4\"/><path d=\"M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z\"/><path d=\"M12 16h.01\"/>", "bulb": "<path d=\"M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7\"/><path d=\"M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3\"/><path d=\"M9.7 17l4.6 0\"/>", "download": "<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\"/><path d=\"M7 11l5 5l5 -5\"/><path d=\"M12 4l0 12\"/>", "ext": "<path d=\"M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6\"/><path d=\"M11 13l9 -9\"/><path d=\"M15 4h5v5\"/>", "flip": "<path d=\"M9 4.55a8 8 0 0 1 6 14.9m0 -4.45v5h5\"/><path d=\"M5.63 7.16l0 .01\"/><path d=\"M4.06 11l0 .01\"/><path d=\"M4.63 15.1l0 .01\"/><path d=\"M7.16 18.37l0 .01\"/><path d=\"M11 19.94l0 .01\"/>", "home": "<path d=\"M5 12l-2 0l9 -9l9 9l-2 0\"/><path d=\"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7\"/><path d=\"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6\"/>", "replay": "<path d=\"M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5\"/>", "vol": "<path d=\"M15 8a5 5 0 0 1 0 8\"/><path d=\"M17.7 5a9 9 0 0 1 0 14\"/><path d=\"M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5\"/>", "quiz": "<path d=\"M3.5 5.5l1.5 1.5l2.5 -2.5\"/><path d=\"M3.5 11.5l1.5 1.5l2.5 -2.5\"/><path d=\"M3.5 17.5l1.5 1.5l2.5 -2.5\"/><path d=\"M11 6l9 0\"/><path d=\"M11 12l9 0\"/><path d=\"M11 18l9 0\"/>", "keyboard": "<path d=\"M2 6m0 2a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2z\"/><path d=\"M6 10l0 .01\"/><path d=\"M10 10l0 .01\"/><path d=\"M14 10l0 .01\"/><path d=\"M18 10l0 .01\"/><path d=\"M6 14l0 .01\"/><path d=\"M18 14l0 .01\"/><path d=\"M10 14l4 .01\"/>", "file": "<path d=\"M14 3v4a1 1 0 0 0 1 1h4\"/><path d=\"M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z\"/><path d=\"M9 9l1 0\"/><path d=\"M9 13l6 0\"/><path d=\"M9 17l6 0\"/>", "school": "<path d=\"M22 9l-10 -4l-10 4l10 4l10 -4v6\"/><path d=\"M6 10.6v5.4a6 3 0 0 0 12 0v-5.4\"/>", "copy": "<path d=\"M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z\"/><path d=\"M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1\"/>", "code": "<path d=\"M7 8l-4 4l4 4\"/><path d=\"M17 8l4 4l-4 4\"/><path d=\"M14 4l-4 16\"/>", "circle": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\"/>", "eye": "<path d=\"M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\"/><path d=\"M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6\"/>", "tree": "<path d=\"M9 6h11\"/><path d=\"M12 12h8\"/><path d=\"M15 18h5\"/><path d=\"M5 6v.01\"/><path d=\"M8 12v.01\"/><path d=\"M11 18v.01\"/>", "hash": "<path d=\"M5 9l14 0\"/><path d=\"M5 15l14 0\"/><path d=\"M11 4l-4 16\"/><path d=\"M17 4l-4 16\"/>"};
  const ic = n => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'i'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); s.innerHTML = I[n] || I.info; return s; };
  const live = h('div', { class: 'sr', 'aria-live': 'polite', role: 'status' });
  const say = t => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 50); };
  function toast(t) { const el = h('div', { class: 'toast', role: 'status' }, t); document.body.append(el); setTimeout(() => el.remove(), 2400); }
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LMS (SCORM 1.2 and 2004) ---------- */
  const LMS = (function () {
    let api = null, ver = null, ok = false, done = false, timer = null, passed = false; const t0 = Date.now();
    function find(w) { for (let n = 0; w && n < 12; n++) { try { if (w.API_1484_11) return [w.API_1484_11, '2004']; if (w.API) return [w.API, '1.2']; } catch (e) { return null; } if (w.parent === w) break; w = w.parent; } return null; }
    try { const r = find(window) || (window.opener ? find(window.opener) : null); if (r) [api, ver] = r; } catch (e) {}
    const call = (f, ...a) => { try { return String(api[f](...a)); } catch (e) { return ''; } };
    const v4 = () => ver === '2004';
    const get = k => call(v4() ? 'GetValue' : 'LMSGetValue', k);
    const set = (k, v) => call(v4() ? 'SetValue' : 'LMSSetValue', k, String(v));
    const commit = () => call(v4() ? 'Commit' : 'LMSCommit', '');
    if (api) ok = call(v4() ? 'Initialize' : 'LMSInitialize', '') === 'true';
    if (ok) {
      if (v4()) { const c = get('cmi.completion_status'); if (!c || c === 'not attempted' || c === 'unknown') set('cmi.completion_status', 'incomplete'); }
      else { const c = get('cmi.core.lesson_status'); if (!c || c === 'not attempted') set('cmi.core.lesson_status', 'incomplete'); }
      commit();
    }
    const pad = (n, w) => String(n).padStart(w, '0');
    const stime = () => { const s = Math.max(0, Math.round((Date.now() - t0) / 1000)), hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60; return v4() ? 'PT' + hh + 'H' + mm + 'M' + ss + 'S' : pad(hh, 4) + ':' + pad(mm, 2) + ':' + pad(ss, 2); };
    return {
      get ok() { return ok; }, get is04() { return ver === '2004'; },
      resume() { if (!ok) return null; try { const d = get('cmi.suspend_data'); return d ? JSON.parse(d) : null; } catch (e) { return null; } },
      save(data, loc) {
        if (!ok || done) return;
        const str = JSON.stringify(data); if (str.length <= (v4() ? 64000 : 4096)) set('cmi.suspend_data', str);
        set(v4() ? 'cmi.location' : 'cmi.core.lesson_location', loc);
        clearTimeout(timer); timer = setTimeout(commit, 600);
      },
      result(pct, pass) {
        if (!ok || done) return false; passed = pct >= pass;
        if (v4()) { set('cmi.score.min', 0); set('cmi.score.max', 100); set('cmi.score.raw', pct); set('cmi.score.scaled', (pct / 100).toFixed(2)); set('cmi.completion_status', 'completed'); set('cmi.success_status', passed ? 'passed' : 'failed'); }
        else { set('cmi.core.score.min', 0); set('cmi.core.score.max', 100); set('cmi.core.score.raw', pct); set('cmi.core.lesson_status', passed ? 'passed' : 'failed'); }
        commit(); return true;
      },
      interaction(it) {
        if (!ok || done) return;
        const n = +get('cmi.interactions._count') || 0, k = 'cmi.interactions.' + n + '.';
        set(k + 'id', v4() ? 'urn:' + C.id + ':' + it.id : it.id); set(k + 'type', it.type);
        if (it.correct != null) set(k + 'correct_responses.0.pattern', it.correct);
        set(k + (v4() ? 'learner_response' : 'student_response'), String(it.response).slice(0, 250));
        set(k + 'result', it.ok ? 'correct' : (v4() ? 'incorrect' : 'wrong')); set(k + 'weighting', 1);
        if (v4() && it.text) set(k + 'description', String(it.text).slice(0, 250));
        clearTimeout(timer); timer = setTimeout(commit, 600);
      },
      finish() {
        if (!ok || done) return; done = true; clearTimeout(timer);
        if (v4()) { set('cmi.session_time', stime()); set('cmi.exit', passed ? 'normal' : 'suspend'); commit(); call('Terminate', ''); }
        else { set('cmi.core.session_time', stime()); set('cmi.core.exit', passed ? '' : 'suspend'); commit(); call('LMSFinish', ''); }
      }
    };
  })();
  window.addEventListener('pagehide', () => LMS.finish());
  window.addEventListener('beforeunload', () => LMS.finish());

  /* ---------- state ---------- */
  const S = Object.assign({ cur: -1, done: {}, seg: {}, bc: {}, quiz: null }, store.get(KEY, {}));
  (function restore() {
    const d = LMS.resume(); if (!d) return;
    S.cur = d.c ?? -1; S.done = {}; (d.d || []).forEach(i => { if (L[i]) S.done[L[i].id] = true; });
    S.seg = {}; Object.entries(d.s || {}).forEach(([i, n]) => { if (L[i]) S.seg[L[i].id] = n; });
    S.bc = {}; (d.b || []).forEach(k => S.bc[k] = true); S.quiz = d.q || null;
  })();
  function save() {
    store.set(KEY, S);
    const seg = {}; L.forEach((l, i) => { if (S.seg[l.id]) seg[i] = S.seg[l.id]; });
    LMS.save({ c: S.cur, d: L.map((l, i) => S.done[l.id] ? i : -1).filter(i => i >= 0), s: seg, b: Object.keys(S.bc), q: S.quiz }, String(S.cur));
  }
  const available = i => !C.restricted || i === 0 || L.slice(0, i).every(l => S.done[l.id]);
  const pctDone = () => Math.round(L.filter(l => S.done[l.id]).length / N * 100);
  const minutes = L.reduce((a, l) => a + (l.min || 0), 0);

  /* ---------- audio (AI voice-over with captions and transcript) ---------- */
  let AUD = null;
  const stopAudio = () => { if (AUD) { AUD.pause(); AUD = null; } };
  const fmt = t => { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };

  /* ---------- blocks ---------- */
  const B = {};
  const head = b => [b.heading ? h('h2', null, b.heading) : null, typeof b.intro === 'string' ? md(b.intro, 'p', 'intro') : null];
  B.heading = b => h('h2', null, b.text);
  B.text = b => h('div', { class: 'prose' }, head(b), (b.paras || []).map(p => md(p)), b.bullets ? h('ul', null, b.bullets.map(x => md(x, 'li'))) : null, (b.after || []).map(p => md(p)));
  B.statement = b => h('div', { class: 'statement ' + (b.style || 'a') }, h('p', { html: inl(b.text) }));
  B.quote = b => h('blockquote', { class: 'quote', style: 'margin:0' }, h('span', { class: 'mk', 'aria-hidden': 'true' }, '“'), md(b.text), b.cite ? h('cite', null, b.cite) : null);
  B.note = b => h('div', { class: 'note' + (b.tone === 'warn' ? ' warn' : ''), role: 'note' }, ic(b.tone === 'warn' ? 'alert' : b.tone === 'tip' ? 'bulb' : 'info'), h('div', null, b.title ? h('strong', null, b.title) : null, md(b.text)));
  B.list = b => h('div', null, head(b), h(b.style === 'number' ? 'ol' : 'ul', { class: b.style === 'number' ? 'list-num' : b.style === 'check' ? 'list-chk' : null }, b.items.map(x => h('li', null, b.style === 'check' ? ic('check') : null, h('div', { html: inl(x) })))));
  B.table = b => h('div', null, head(b), h('div', { class: 'tbl-wrap', tabindex: '0', role: 'region', 'aria-label': b.heading || 'Table' }, h('table', null, b.caption ? h('caption', { class: 'sr' }, b.caption) : null,
    h('thead', null, h('tr', null, b.cols.map(c => h('th', { scope: 'col' }, c)))), h('tbody', null, b.rows.map(r => h('tr', null, r.map((c, i) => i === 0 ? h('th', { scope: 'row', html: inl(c) }) : h('td', { html: inl(c) }))))))));
  B.image = b => h('figure', { class: 'img' }, h('img', { src: b.src, alt: b.alt || '', width: b.w, height: b.h, loading: 'lazy', decoding: 'async' }), b.caption ? h('figcaption', null, b.caption) : null);
  B.imgtext = b => h('div', { class: 'imgtext ' + (b.side || 'left') }, h('figure', null, h('img', { src: b.src, alt: b.alt || '', width: b.w, height: b.h, loading: 'lazy', decoding: 'async' })), h('div', null, b.heading ? h('h2', null, b.heading) : null, (b.paras || []).map(p => md(p)), b.bullets ? h('ul', null, b.bullets.map(x => md(x, 'li'))) : null));
  B.buttons = b => h('div', null, head(b), h('div', { class: 'btnstack' }, b.items.map(it => {
    const r = typeof it === 'number' ? C.resources[it] : it;
    const act = r.b64 ? h('button', { class: 'btn sm', type: 'button', onclick: e => saveFile(r, e.currentTarget) }, ic('download'), h('span', null, 'Download', h('span', { class: 'sr' }, ' ' + r.title)))
      : r.download ? h('a', { class: 'btn sm', href: r.download, download: r.file || '' }, ic('download'), h('span', null, 'Download', h('span', { class: 'sr' }, ' ' + r.title)))
      : h('a', { class: 'btn ghost sm', href: r.url, target: '_blank', rel: 'noopener' }, 'Open', h('span', { class: 'sr' }, ' ' + r.title + ' (opens in a new tab)'), ic('ext'));
    return h('div', { class: 'btnrow' }, h('div', null, h('strong', null, r.title), r.desc ? h('p', null, r.desc + (r.meta ? ' (' + r.meta + ')' : '')) : null), act);
  })));

  B.audio = (b, ctx) => {
    const d = VO[b.vo]; if (!d) return null;
    const a = h('audio', { preload: 'metadata', src: d.audio });
    const play = h('button', { class: 'au-play', 'aria-label': 'Play ' + UW.toLowerCase() + ' audio' }, ic('play'));
    const cap = h('p', { class: 'au-cap' }, 'Listen to an overview of this ' + UW.toLowerCase() + '.');
    const time = h('span', { class: 'au-time' }, '0:00 / ' + fmt(d.duration));
    const bar = h('i');
    const seek = h('input', { type: 'range', min: 0, max: Math.ceil(d.duration), step: 1, value: 0, 'aria-label': 'Audio position', class: 'sr' });
    const rate = h('select', { 'aria-label': 'Playback speed' }, [0.85, 1, 1.15, 1.3].map(r => h('option', { value: r, selected: r === (store.get('rise:rate', 1)) || null }, r + '×')));
    const tx = h('div', { class: 'transcript', id: ctx.key + 'tx', hidden: true, tabindex: '0', role: 'region', 'aria-label': 'Transcript' }, d.cues.map(c => h('p', null, c[2])));
    const txBtn = h('button', { class: 'tx', 'aria-expanded': 'false', 'aria-controls': ctx.key + 'tx' }, 'Transcript');
    txBtn.onclick = () => { const o = tx.hidden; tx.hidden = !o; txBtn.setAttribute('aria-expanded', String(o)); };
    rate.onchange = () => { a.playbackRate = +rate.value; store.set('rise:rate', +rate.value); };
    play.onclick = () => { if (a.paused) { if (AUD && AUD !== a) AUD.pause(); AUD = a; a.playbackRate = +rate.value; a.play().catch(() => toast('Audio couldn’t start. Try again.')); } else a.pause(); };
    const sync = () => {
      const t = a.currentTime; bar.style.width = (t / (a.duration || d.duration) * 100) + '%'; time.textContent = fmt(t) + ' / ' + fmt(a.duration || d.duration); seek.value = Math.floor(t);
      const c = d.cues.find(c => t >= c[0] - 0.05 && t <= c[1] + 0.35); if (c) cap.textContent = c[2];
    };
    a.addEventListener('timeupdate', sync);
    a.addEventListener('play', () => { rc(play, ic('pause')); play.setAttribute('aria-label', 'Pause ' + UW.toLowerCase() + ' audio'); });
    a.addEventListener('pause', () => { rc(play, ic('play')); play.setAttribute('aria-label', 'Play ' + UW.toLowerCase() + ' audio'); });
    a.addEventListener('ended', () => { cap.textContent = 'Finished. Play again or read the transcript.'; });
    seek.oninput = () => { a.currentTime = +seek.value; sync(); };
    return h('div', { class: 'audio' }, h('div', { class: 'au-row' }, play,
      h('div', { class: 'au-main' }, h('span', { class: 'au-label' }, b.title || UW + ' audio · AI voice-over'), cap, h('div', { class: 'au-bar', 'aria-hidden': 'true' }, bar), seek),
      h('div', { class: 'au-ctl' }, time, rate, txBtn)), tx, a);
  };

  B.accordion = (b, ctx) => h('div', null, head(b), h('div', { class: 'acc' }, b.items.map((it, i) => {
    const id = ctx.key + 'a' + i; const ans = h('div', { class: 'acc-a', id, hidden: true }, (Array.isArray(it.text) ? it.text : [it.text]).map(p => md(p)));
    const pm = h('span', { class: 'pm', 'aria-hidden': 'true' }, ic('plus'));
    const btn = h('button', { class: 'acc-q', 'aria-expanded': 'false', 'aria-controls': id }, h('span', null, it.title), pm);
    btn.onclick = () => { const o = btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', String(o)); ans.hidden = !o; rc(pm, ic(o ? 'minus' : 'plus')); };
    return h('div', { class: 'acc-item' }, h('h3', { style: 'font-size:inherit;margin:0' }, btn), ans);
  })));

  B.tabs = (b, ctx) => {
    const id = ctx.key + 't'; const list = h('div', { class: 'tablist', role: 'tablist', 'aria-label': b.heading || 'Tabs' }); const panel = h('div', { class: 'tabpanel', role: 'tabpanel', id: id + 'p', tabindex: '0' });
    const show = (i, f) => { [...list.children].forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; }); const it = b.items[i]; rc(panel, (Array.isArray(it.text) ? it.text : [it.text]).map(p => md(p)), it.bullets ? h('ul', null, it.bullets.map(x => md(x, 'li'))) : null); panel.setAttribute('aria-labelledby', id + i); if (f) list.children[i].focus(); };
    b.items.forEach((it, i) => list.append(h('button', { class: 'tab', role: 'tab', id: id + i, 'aria-controls': id + 'p', onclick: () => show(i) }, it.title)));
    list.addEventListener('keydown', e => { const n = b.items.length, cur = [...list.children].indexOf(document.activeElement); if (cur < 0) return; const to = e.key === 'ArrowRight' ? (cur + 1) % n : e.key === 'ArrowLeft' ? (cur - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1; if (to >= 0) { e.preventDefault(); show(to, true); } });
    show(0); return h('div', null, head(b), list, panel);
  };

  B.labeled = (b, ctx) => {
    const seen = new Set(); const pid = ctx.key + 'lp';
    const panel = h('div', { class: 'lg-panel', id: pid, 'aria-live': 'polite' }, h('span', { class: 'lbl' }, 'Explore'), h('p', null, 'Select each numbered marker. ' + b.markers.length + ' to explore.'));
    const stage = h('div', { class: 'lg-stage' }, h('img', { src: b.src, alt: b.alt, width: b.w, height: b.h, decoding: 'async' }));
    const btns = b.markers.map((m, i) => {
      const bt = h('button', { class: 'marker' + (ctx.done() ? ' seen' : ''), style: `left:${m.x}%;top:${m.y}%`, 'aria-expanded': 'false', 'aria-controls': pid }, h('span', { class: 'sr' }, 'Marker '), String(i + 1), h('span', { class: 'sr' }, ': ' + m.title));
      bt.onclick = () => { btns.forEach(x => x.setAttribute('aria-expanded', 'false')); bt.setAttribute('aria-expanded', 'true'); bt.classList.add('seen'); seen.add(i);
        rc(panel, h('span', { class: 'lbl' }, i + 1 + ' of ' + b.markers.length), h('h3', null, m.title), md(m.text)); if (seen.size === b.markers.length) ctx.complete(); };
      stage.append(bt); return bt;
    });
    return h('div', null, head(b), h('div', { class: 'lg-scroll', tabindex: '0', role: 'region', 'aria-label': (b.heading || 'Labelled graphic') + ' (scroll sideways on small screens)' }, stage), panel);
  };

  B.process = (b, ctx) => {
    let i = -1; const total = b.steps.length; const card = h('div', { class: 'pr-card', 'aria-live': 'polite' }); const nav = h('div', { class: 'pr-nav' });
    const draw = (focus) => {
      const intro = i < 0, sum = i >= total;
      card.className = 'pr-card' + (intro ? ' intro' : '');
      if (intro) rc(card, h('h3', null, b.intro.title), md(b.intro.text), h('div', null, h('button', { class: 'btn', onclick: () => { i = 0; draw(true); } }, 'Start', ic('arrowR'))));
      else if (sum) rc(card, h('span', { class: 'pr-step' }, 'Summary'), h('h3', null, b.summary.title), md(b.summary.text), h('div', null, h('button', { class: 'btn ghost sm', onclick: () => { i = -1; draw(true); } }, ic('replay'), 'Start Again')));
      else { const s = b.steps[i]; rc(card, h('span', { class: 'pr-step' }, 'Step ' + (i + 1) + ' of ' + total), h('h3', null, s.title), md(s.text), s.path ? h('div', { class: 'pr-path', html: inl(s.path) }) : null, s.code ? codeView({ src: s.code, label: 'HTML', name: 'Example: ' + s.title }) : null, s.keys ? h('p', null, 'Shortcut: ', h('span', { html: s.keys.map(k => '<kbd>' + esc(k) + '</kbd>').join(' + ') })) : null); }
      if (sum) ctx.complete();
      rc(nav, h('button', { class: 'btn ghost sm', disabled: i < 0, onclick: () => { i--; draw(true); } }, ic('arrowL'), 'Back'),
        h('div', { class: 'pr-dots', 'aria-hidden': 'true' }, Array.from({ length: total + 2 }, (_, k) => h('span', { class: k === i + 1 ? 'on' : null }))),
        h('button', { class: 'btn sm', disabled: sum || i < 0, onclick: () => { i++; draw(true); } }, i === total - 1 ? 'Summary' : 'Next', ic('arrowR')));
      if (focus) { const t = card.querySelector('h3'); t.tabIndex = -1; t.focus({ preventScroll: true }); }
    };
    draw(false); return h('div', null, head(b), h('div', { class: 'process' }, card, nav));
  };

  B.flashcards = (b, ctx) => {
    const seen = new Set();
    return h('div', null, head(b), h('div', { class: 'cards' }, b.cards.map((c, i) => {
      const btn = h('button', { class: 'card', 'aria-pressed': 'false' });
      const draw = on => rc(btn, h('span', { class: 'side-lbl' }, on ? 'Back' : 'Front'), on ? h('div', { class: 'front-t', html: inl(c.back) }) : h('div', { class: 'front-t' }, c.front), h('span', { class: 'hint' }, ic('flip'), on ? 'Select to see the front' : 'Select to flip'));
      btn.onclick = () => { const on = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', String(on)); draw(on); if (on) { seen.add(i); if (seen.size === b.cards.length) ctx.complete(); } };
      draw(false); return btn;
    })));
  };

  B.sort = (b, ctx) => {
    let k = 0; const placed = b.piles.map(() => []);
    const deck = h('div', { class: 'sort-deck' }); const piles = h('div', { class: 'piles' }); const fb = h('p', { class: 'sort-fb', 'aria-live': 'polite' });
    const draw = () => {
      if (k >= b.cards.length) { rc(deck, h('p', { class: 'sort-card', style: 'box-shadow:none' }, 'All cards sorted'), h('button', { class: 'btn ghost sm', onclick: () => { k = 0; placed.forEach(p => p.length = 0); fb.textContent = ''; draw(); deck.querySelector('.sort-card').focus(); } }, ic('replay'), 'Sort Again')); ctx.complete(); }
      else rc(deck, h('span', { class: 'sort-count' }, 'Card ' + (k + 1) + ' of ' + b.cards.length), h('p', { class: 'sort-card', tabindex: '-1', id: ctx.key + 'card' }, b.cards[k].text));
      rc(piles, b.piles.map((p, i) => h('div', { class: 'pile', role: 'group', 'aria-label': p }, h('h3', null, p),
        k < b.cards.length ? h('button', { class: 'btn sm', 'aria-describedby': ctx.key + 'card', onclick: () => place(i) }, 'Place Here', h('span', { class: 'sr' }, ': ' + p)) : null,
        h('ul', null, placed[i].map(t => h('li', null, ic('check'), t))))));
    };
    const place = i => {
      const c = b.cards[k];
      if (c.pile === i) { placed[i].push(c.text); fb.className = 'sort-fb ok'; fb.textContent = 'Correct. “' + c.text + '” goes in ' + b.piles[i] + '.' + (c.why ? ' ' + c.why : ''); k++; draw(); const nx = document.getElementById(ctx.key + 'card'); nx && nx.focus(); }
      else { fb.className = 'sort-fb no'; fb.textContent = 'Not quite. “' + c.text + '” doesn’t belong in ' + b.piles[i] + '. Try another pile.'; }
    };
    draw(); return h('div', null, head(b), deck, piles, fb);
  };

  B.scenario = (b, ctx) => {
    const box = h('div', { class: 'scenario' }); let sid = b.start;
    const draw = (focus) => {
      const s = b.scenes[sid]; const ch = b.characters[s.char || b.defaultChar];
      const bubble = h('div', { class: 'sc-bubble' }, h('span', { class: 'who' }, ch.name + (ch.role ? ' · ' + ch.role : '')), md(s.say));
      const stage = h('div', { class: 'sc-stage', style: b.bg ? `background-image:url('${b.bg}')` : null }, h('div', { class: 'sc-char' }, h('img', { src: ch.img, alt: '', width: 150, height: 190 })), bubble);
      const below = h('div', { class: 'sc-choices' });
      if (s.end) { ctx.complete(); rc(below, h('p', null, h('strong', null, s.endTitle || 'Scenario complete')), s.endText ? md(s.endText) : null, h('div', null, h('button', { class: 'btn ghost sm', onclick: () => { sid = b.start; draw(true); } }, ic('replay'), 'Restart Scenario'))); }
      else rc(below, h('span', { class: 'lbl', id: ctx.key + sid + 'l' }, 'How do you respond?'), h('div', { role: 'group', 'aria-labelledby': ctx.key + sid + 'l', style: 'display:grid;gap:10px' }, s.choices.map(c => h('button', { class: 'choice', onclick: () => pick(c) }, c.text))));
      rc(box, stage, below);
      if (focus) { bubble.tabIndex = -1; bubble.focus({ preventScroll: false }); }
    };
    const pick = c => {
      const below = box.querySelector('.sc-choices');
      const fb = h('div', { class: 'sc-fb ' + (c.tone || ''), tabindex: '-1' }, h('strong', { class: 'verdict' }, c.tone === 'good' ? 'Good choice' : c.tone === 'bad' ? 'Not the best choice' : 'Okay, but…'), md(c.fb));
      rc(below, h('p', null, h('span', { class: 'lbl' }, 'You said: '), c.text), fb, h('div', null, h('button', { class: 'btn sm', onclick: () => { sid = c.next; draw(true); } }, c.next === sid ? 'Try Again' : 'Continue', ic('arrowR'))));
      fb.focus();
    };
    draw(false); return h('div', null, head(b), box);
  };

  /* knowledge check: mc, mr, fill, match. Submitting completes the block (Rise behaviour). */
  B.kc = (b, ctx) => {
    const wrap = h('div', { class: 'kc' }); const name = ctx.key + 'k';
    const draw = (state) => {
      const parts = [h('span', { class: 'kc-lbl' }, b.label || 'Knowledge check'), b.ctx ? md(b.ctx, 'p', 'kc-ctx') : null, h('p', { class: 'q', id: name + 'q' }, b.q)];
      let input;
      if (b.kind === 'mc' || b.kind === 'mr') {
        input = h('fieldset', null, h('legend', { class: 'sr' }, b.q + (b.kind === 'mr' ? ' (select all that apply)' : '')), b.kind === 'mr' ? h('p', { style: 'font-size:15px;color:var(--muted)' }, 'Select all that apply.') : null,
          b.options.map((o, i) => { const correct = b.kind === 'mr' ? b.correct.includes(i) : b.correct === i; const picked = state && state.pick.includes(i);
            const lab = h('label', { class: 'opt' + (state && (correct || picked) ? (correct ? ' right' : ' wrong') : '') }, h('input', { type: b.kind === 'mr' ? 'checkbox' : 'radio', name, value: i, checked: picked || null, disabled: !!state }), h('span', { html: inl(o) }),
              state && (correct || picked) ? h('span', { class: 'mark' }, correct ? (picked ? 'Correct' : 'Correct answer') : 'Incorrect') : null);
            return lab; }));
      } else if (b.kind === 'fill') {
        input = h('div', null, h('label', { for: name + 'in', class: 'sr' }, 'Your answer'), h('input', { type: 'text', id: name + 'in', autocomplete: 'off', 'aria-describedby': name + 'q', disabled: !!state, value: state ? state.text : null }));
      } else if (b.kind === 'match') {
        input = h('div', { class: 'match' }, b.pairs.map((p, i) => h('div', { class: 'match-row' }, h('label', { for: name + 'm' + i, html: inl(p[0]) }),
          h('select', { id: name + 'm' + i, disabled: !!state }, h('option', { value: '' }, 'Choose…'), b.choices.map((c, k) => h('option', { value: k, selected: state && state.pick[i] === k || null }, c))))));
      }
      parts.push(input);
      if (!state) parts.push(h('div', { class: 'kc-actions' }, h('button', { class: 'btn', onclick: submit }, 'Submit')));
      else {
        parts.push(h('div', { class: 'kc-fb ' + (state.ok ? 'ok' : 'no'), role: 'status', tabindex: '-1' }, h('span', { class: 'ic', 'aria-hidden': 'true' }, ic(state.ok ? 'check' : 'x')), h('div', null, h('strong', { class: 'verdict' }, state.ok ? 'Correct' : 'Incorrect'), md(state.ok ? b.fb.ok : b.fb.no))));
        parts.push(h('div', { class: 'kc-actions' }, h('button', { class: 'btn ghost sm', onclick: () => { draw(null); wrap.querySelector('input,select').focus(); } }, ic('replay'), 'Take Again')));
      }
      rc(wrap, parts);
      const f = wrap.querySelector('.kc-fb'); if (f && state && state.focus) f.focus();
    };
    const submit = () => {
      let st;
      if (b.kind === 'mc' || b.kind === 'mr') { const pick = [...wrap.querySelectorAll('input:checked')].map(x => +x.value); if (!pick.length) { toast('Choose an answer first'); return; }
        const ok = b.kind === 'mr' ? (pick.length === b.correct.length && pick.every(p => b.correct.includes(p))) : pick[0] === b.correct; st = { pick, ok }; }
      else if (b.kind === 'fill') { const t = wrap.querySelector('input').value.trim(); if (!t) { toast('Type an answer first'); return; } st = { text: t, ok: b.accept.some(a => t.toLowerCase().replace(/\s+/g, ' ') === a.toLowerCase()) }; }
      else { const pick = [...wrap.querySelectorAll('select')].map(s => s.value === '' ? -1 : +s.value); if (pick.some(p => p < 0)) { toast('Match every item first'); return; } st = { pick, ok: pick.every((p, i) => p === b.pairs[i][1]) }; }
      st.focus = true; ctx.complete(); draw(st);
    };
    draw(null); return wrap;
  };

  /* ---------- code: highlighted examples, live sandbox, graded coding task ---------- */
  const txt = el => (el && el.textContent || '').replace(/\s+/g, ' ').trim();
  const hlAttrs = a => { let o = '', last = 0, m; const re = /([^\s=\/]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
    while ((m = re.exec(a))) { o += esc(a.slice(last, m.index)) + '<span class="t-a">' + esc(m[1]) + '</span>' + (m[2] ? esc(m[2]) + '<span class="t-v">' + esc(m[3]) + '</span>' : ''); last = re.lastIndex; }
    return o + esc(a.slice(last)); };
  function hl(src) {
    let o = '', last = 0, m; const re = /(<!--[\s\S]*?-->)|(<\/?)(!?[a-zA-Z][\w-]*)([^>]*?)(\/?>)|(&[#\w]+;)/g;
    while ((m = re.exec(src))) {
      o += esc(src.slice(last, m.index));
      if (m[1]) o += '<span class="t-c">' + esc(m[1]) + '</span>';
      else if (m[6]) o += '<span class="t-e">' + esc(m[6]) + '</span>';
      else o += '<span class="t-p">' + esc(m[2]) + '</span><span class="t-t">' + esc(m[3]) + '</span>' + (m[3][0] === '!' ? esc(m[4]) : hlAttrs(m[4])) + '<span class="t-p">' + esc(m[5]) + '</span>';
      last = re.lastIndex;
    }
    return o + esc(src.slice(last));
  }
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch (e) {
      try { const ta = h('textarea', { 'aria-hidden': 'true', tabindex: '-1', style: 'position:fixed;left:-9999px' }); ta.value = t; document.body.append(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e2) { return false; }
    }
  }
  let cvN = 0;
  function codeView(o) {
    const id = 'cv' + (++cvN);
    const btn = h('button', { class: 'btn ghost sm cv-copy', type: 'button', 'aria-describedby': id }, ic('copy'), 'Copy');
    btn.onclick = async () => { const ok = await copyText(o.src); say(ok ? 'Code copied.' : 'Couldn’t copy. Select the code and copy it instead.'); toast(ok ? 'Code copied' : 'Couldn’t copy here'); };
    return h('div', { class: 'cv' }, h('div', { class: 'cv-bar' }, h('span', { class: 'cv-lbl', id }, o.label || 'HTML'), btn),
      h('pre', { tabindex: '0', role: 'region', 'aria-label': (o.name || o.label || 'HTML') + ' (code)' }, h('code', { html: hl(o.src) })));
  }
  B.code = b => h('figure', { class: 'code-fig' }, head(b), codeView({ src: b.src, label: b.label || 'HTML', name: b.heading }), b.caption ? h('figcaption', null, b.caption) : null);

  const parse = src => new DOMParser().parseFromString(src, 'text/html');
  const codeKey = k => 'rise:code:' + C.id + ':' + k;
  function editor(key, src, label) {
    const id = key + 'ed';
    const ta = h('textarea', { id, class: 'ed', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', wrap: 'off', 'aria-describedby': id + 'h', rows: Math.min(20, Math.max(8, src.split('\n').length + 1)) });
    ta.value = src;
    ta.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
      const v = ta.value, p = ta.selectionStart, ls = v.lastIndexOf('\n', p - 1) + 1, ind = (v.slice(ls, p).match(/^[ \t]*/) || [''])[0];
      if (ind) { e.preventDefault(); ta.setRangeText('\n' + ind, p, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); }
    });
    return { ta, el: h('div', { class: 'ed-wrap' }, h('label', { for: id, class: 'pane-lbl' }, ic('code'), label), ta, h('p', { class: 'ed-help', id: id + 'h' }, 'Tab moves to the next control. Enter keeps your indent.')) };
  }
  const frame = () => h('iframe', { class: 'pv-frame', title: 'Live preview of your page', sandbox: '' });
  const LM = { HEADER: 'Banner landmark (header)', NAV: 'Navigation landmark (nav)', MAIN: 'Main landmark (main)', ASIDE: 'Complementary landmark (aside)', FOOTER: 'Content info landmark (footer)' };
  function outlineOf(doc) {
    const out = []; if (!doc.body) return out;
    doc.body.querySelectorAll('header,nav,main,aside,footer,h1,h2,h3,h4,h5,h6').forEach(el => {
      const t = el.tagName;
      if (/^H\d$/.test(t)) out.push({ lvl: +t[1], text: 'Heading level ' + t[1] + ': ' + (txt(el) || '(empty)') });
      else if (!((t === 'HEADER' || t === 'FOOTER') && el.parentElement && el.parentElement.closest('main,article,section,aside,nav'))) out.push({ lm: true, text: LM[t] });
    });
    return out;
  }
  function namesOf(doc) {
    const out = [];
    doc.querySelectorAll('input:not([type=hidden]), select, textarea, button').forEach(el => {
      const t = (el.getAttribute('type') || '').toLowerCase(), tag = el.tagName;
      const role = tag === 'BUTTON' || ['submit', 'button', 'reset'].includes(t) ? 'button' : tag === 'SELECT' ? 'combo box' : tag === 'TEXTAREA' ? 'edit text, multi-line' : t === 'radio' ? 'radio button' : t === 'checkbox' ? 'checkbox' : 'edit text';
      let name = el.getAttribute('aria-label') || '';
      if (!name) { const lab = el.id ? [...doc.querySelectorAll('label')].find(l => l.getAttribute('for') === el.id) : null; name = lab ? txt(lab) : el.closest('label') ? txt(el.closest('label')) : ''; }
      if (!name && role === 'button') name = txt(el) || el.getAttribute('value') || '';
      let grp = ''; const fs = el.closest('fieldset'); if (fs && (t === 'radio' || t === 'checkbox')) grp = txt(fs.querySelector('legend'));
      out.push({ ok: !!name, text: (grp ? grp + ', ' : '') + (name ? '“' + name + '”, ' : '') + role + (el.hasAttribute('required') ? ', required' : '') + (name ? '' : ' — no name' + (el.getAttribute('placeholder') ? ' (placeholder “' + el.getAttribute('placeholder') + '” only)' : '')) });
    });
    doc.querySelectorAll('form div, form span').forEach(el => { if (!el.querySelector('*') && /^(send|submit)/i.test(txt(el))) out.push({ ok: false, text: '“' + txt(el) + '” is plain text, not a button: keyboard users can’t reach it' }); });
    return out;
  }
  function insight(kind) {
    const list = h('ul', { class: 'ins-list' });
    const el = h('div', { class: 'ins' }, h('h3', { class: 'pane-lbl' }, ic(kind === 'names' ? 'vol' : 'tree'), kind === 'names' ? 'What a screen reader announces' : 'Page outline for assistive technology'), list);
    const update = doc => {
      const rows = kind === 'names' ? namesOf(doc).map(r => h('li', { class: r.ok ? 'ok' : 'warn' }, ic(r.ok ? 'check' : 'alert'), h('span', null, r.text)))
        : outlineOf(doc).map(r => h('li', { class: r.lm ? 'lm' : 'hd', style: r.lvl ? '--lvl:' + (r.lvl - 1) : null }, ic(r.lm ? 'tree' : 'hash'), h('span', null, r.text)));
      rc(list, rows.length ? rows : h('li', { class: 'empty' }, kind === 'names' ? 'No form controls yet.' : 'No landmarks or headings yet.'));
    };
    return { el, update };
  }
  function workbench(b, ctx, label, onUpdate) {
    const saved = store.get(codeKey(ctx.key), null);
    const E = editor(ctx.key, saved != null ? saved : b.src, label);
    const pv = frame(); const ins = b.outline ? insight('outline') : b.names ? insight('names') : null;
    let t = null;
    const upd = () => { pv.srcdoc = E.ta.value; const d = parse(E.ta.value); if (ins) ins.update(d); store.set(codeKey(ctx.key), E.ta.value); onUpdate && onUpdate(d, E.ta.value); };
    E.ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(upd, 300); });
    const set = v => { E.ta.value = v; upd(); };
    const grid = h('div', { class: 'sbx-grid' }, E.el, h('div', { class: 'pv' }, h('span', { class: 'pane-lbl', 'aria-hidden': 'true' }, ic('eye'), 'Live preview'), pv, ins ? ins.el : null));
    setTimeout(upd, 0);
    return { E, grid, set, upd };
  }
  B.sandbox = (b, ctx) => {
    const W = workbench(b, ctx, 'Code editor');
    const reset = h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { W.set(b.src); say('Code reset to the original.'); W.E.ta.focus(); } }, ic('replay'), 'Reset Code');
    return h('div', { class: 'sbx' }, h('span', { class: 'sbx-tag' }, ic('code'), 'Code sandbox'), head(b),
      b.tries ? h('div', { class: 'tries' }, h('h3', null, 'Try this'), h('ol', null, b.tries.map(x => md(x, 'li')))) : null,
      W.grid, h('div', { class: 'sbx-actions' }, reset));
  };
  B.codetask = (b, ctx) => {
    const items = b.checks.map(c => { const icn = h('span', { class: 'ck-ic', 'aria-hidden': 'true' }), st = h('span', { class: 'ck-st' }); return { c, icn, st, li: h('li', { class: 'ck todo' }, icn, h('span', { class: 'ck-t' }, c.label), st) }; });
    const run = (d, src) => items.map(it => { try { return !!it.c.test(d, src); } catch (e) { return false; } });
    const paint = r => items.forEach((it, i) => { it.li.className = 'ck ' + (r[i] ? 'ok' : 'todo'); rc(it.icn, ic(r[i] ? 'check' : 'circle')); it.st.textContent = r[i] ? 'Done' : 'Not yet'; });
    const W = workbench(b, ctx, 'Your code', (d, src) => paint(run(d, src)));
    const fb = h('div', { class: 'ct-fb', tabindex: '-1' });
    const sol = h('div', { class: 'ct-sol', hidden: true });
    const solBtn = h('button', { class: 'btn ghost sm', type: 'button', 'aria-expanded': 'false', hidden: !ctx.done() || null }, ic('eye'), 'Show Solution');
    solBtn.onclick = () => { const o = sol.hidden; sol.hidden = !o; solBtn.setAttribute('aria-expanded', String(o)); rc(solBtn, ic('eye'), o ? 'Hide Solution' : 'Show Solution'); };
    rc(sol, h('h3', null, 'One possible solution'), codeView({ src: b.solution, label: 'Solution', name: 'Solution: ' + (b.heading || '').replace(/^Coding task: /, '') }),
      h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { W.set(b.solution); say('Solution copied into your code. Select Check My Code.'); W.E.ta.focus(); } }, ic('code'), 'Use This Code'));
    const success = () => rc(fb, h('div', { class: 'kc-fb ok' }, h('span', { class: 'ic', 'aria-hidden': 'true' }, ic('check')), h('div', null, h('strong', { class: 'verdict' }, 'All ' + items.length + ' checks passed'), md(b.done || 'Well done. Your code meets every requirement, and you can continue.'))));
    const check = () => {
      const src = W.E.ta.value, r = run(parse(src), src); paint(r); const n = r.filter(Boolean).length;
      if (n === r.length) { ctx.complete(); success(); }
      else { const first = items[r.indexOf(false)]; rc(fb, h('div', { class: 'kc-fb no' }, h('span', { class: 'ic', 'aria-hidden': 'true' }, ic('x')), h('div', null, h('strong', { class: 'verdict' }, n + ' of ' + r.length + ' checks passed'), h('p', null, 'Next to fix: ', first.c.label), md('**Hint:** ' + first.c.hint)))); }
      solBtn.hidden = false; fb.focus();
    };
    if (ctx.done()) success();
    return h('div', { class: 'sbx task' }, h('span', { class: 'sbx-tag' }, ic('quiz'), 'Coding task'), head(b), b.brief ? md(b.brief, 'p', 'ct-brief') : null,
      h('div', { class: 'tries' }, h('h3', null, 'Your task'), h('ol', null, b.steps.map(x => md(x, 'li')))),
      W.grid,
      h('div', { class: 'checks' }, h('h3', { id: ctx.key + 'ckh' }, 'Checks'), h('p', { class: 'ed-help' }, 'These update as you type. Select Check My Code for feedback.'), h('ul', { 'aria-labelledby': ctx.key + 'ckh' }, items.map(i => i.li))),
      h('div', { class: 'sbx-actions' }, h('button', { class: 'btn', type: 'button', onclick: check }, ic('check'), 'Check My Code'), solBtn,
        h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { W.set(b.src); say('Code reset to the starting point.'); W.E.ta.focus(); } }, ic('replay'), 'Reset Code')),
      fb, sol);
  };

  /* ---------- downloads in previews (embedded files saved through the viewer's prompt) ---------- */
  async function saveFile(r, btn) {
    let dl = null; try { dl = (window.claude && window.claude.use) ? await window.claude.use('downloads') : null; } catch (e) {}
    if (!dl) { toast('Downloads aren’t available in this view.'); return; }
    const bin = atob(r.b64); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    try { await dl.save({ filename: r.file, data: new Blob([bytes]) }); } catch (e) { if (e && e.code !== 'declined') toast('This file couldn’t be saved here.'); }
  }

  /* ---------- views ---------- */
  const app = h('div', { id: 'app', style: 'height:100%' }); document.body.append(live, app);
  let sideOpen = matchMedia('(min-width: 981px)').matches;
  /* Shammim Design System monogram: lagoon→sky gradient ring, “S” stroke in lagoon ink, “Shammim.” wordmark. */
  const logo = (sub) => h('span', { class: 'mono' },
    h('span', { class: 'mono-ring', 'aria-hidden': 'true' }, h('span', { class: 'mono-in', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6H8a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H6"/></svg>' })),
    h('span', { class: 'mono-txt' }, h('span', { class: 'mono-name' }, 'Shammim', h('span', { class: 'dot-acc' }, '.')), h('span', { class: 'mono-sub' }, sub || 'Tech Skills')));

  function cover() {
    const started = S.cur >= 0 || Object.keys(S.done).length;
    const firstOpen = (() => { for (let i = 0; i < N; i++) if (!S.done[L[i].id]) return i; return N - 1; })();
    return h('main', { class: 'cover', id: 'main' },
      h('header', { class: 'cover-hero' }, h('div', { class: 'cover-in' }, h('div', { class: 'cover-txt' },
        h('div', { class: 'brand' }, logo(C.brand || 'Tech Skills')),
        h('span', { class: 'cover-kicker' }, C.kicker), h('h1', { id: 'title', tabindex: '-1' }, C.title), md(C.desc, 'p', 'cover-desc'),
        h('div', { class: 'cover-meta' }, h('span', null, ic('book'), N - 1 + ' ' + UW.toLowerCase() + 's + quiz'), h('span', null, ic('clock'), 'About ' + minutes + ' minutes'), h('span', null, ic('check'), pctDone() + '% complete')),
        h('button', { class: 'btn', onclick: () => open(started ? firstOpen : 0) }, started ? 'Resume Course' : 'Start Course', ic('arrowR'))),
        h('figure', { class: 'cover-art' }, h('img', { src: C.cover.image, alt: '', width: C.cover.w || 1200, height: C.cover.h || 800 })))),
      h('div', { class: 'cover-body' },
        h('section', { 'aria-labelledby': 'llh' }, h('h2', { id: 'llh' }, UW + 's'), h('ol', { class: 'lesson-list' }, L.map((l, i) => h('li', null,
          h('button', { class: 'lesson-link', disabled: !available(i), onclick: () => open(i) }, statusDot(i), h('span', { class: 'num', 'aria-hidden': 'true' }, l.type === 'quiz' ? '' : String(i + 1).padStart(2, '0')), h('span', { class: 'ttl' }, l.title, h('span', { class: 'sr' }, ' — ' + statusText(i))), h('span', { class: 'tm' }, l.min + ' min')))))),
        h('aside', { class: 'cover-side', 'aria-labelledby': 'ash' }, h('h2', { id: 'ash', style: 'margin:0' }, 'About this course'), md(C.about), h('ul', null, C.features.map(f => md(f, 'li'))))));
  }
  function statusText(i) { const l = L[i]; return S.done[l.id] ? 'completed' : !available(i) ? 'locked' : (S.seg[l.id] ? 'in progress' : 'not started'); }
  function statusDot(i) { const l = L[i]; const st = statusText(i); return h('span', { class: 'dot ' + (st === 'completed' ? 'done' : st === 'locked' ? 'lock' : st === 'in progress' ? 'part' : ''), 'aria-hidden': 'true' }, st === 'completed' ? ic('check') : null); }

  function sidebar() {
    const p = pctDone();
    return h('nav', { class: 'side', 'aria-label': 'Course' },
      h('div', { class: 'side-top' }, h('div', { class: 'side-brand' }, logo(), h('button', { class: 'icon-btn side-close', 'aria-label': 'Close course menu', onclick: () => { setSide(false); const m = document.getElementById('menubtn'); m && m.focus(); } }, ic('x'))), h('div', { class: 'side-title' }, C.title),
        h('div', { class: 'prog' }, h('div', { class: 'prog-txt' }, h('span', null, p + '% complete')), h('div', { class: 'bar', role: 'progressbar', 'aria-label': 'Course progress', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': p }, h('i', { style: 'width:' + p + '%' })))),
      h('div', { class: 'side-nav' }, h('ol', null, L.map((l, i) => h('li', null, h('button', { disabled: !available(i), 'aria-current': i === S.cur ? 'page' : null, onclick: () => open(i) }, statusDot(i), h('span', null, l.title, h('span', { class: 'sr' }, ' — ' + statusText(i)))))))),
      h('div', { class: 'side-foot' }, h('button', { onclick: () => { stopAudio(); S.cur = -1; save(); render(); } }, ic('home'), 'Course Overview'), h('button', { 'aria-haspopup': 'dialog', onclick: e => resources(e.currentTarget) }, ic('download'), 'Resources')));
  }

  function resources(from) {
    const close = () => { wrap.remove(); from && from.focus(); };
    const x = h('button', { class: 'icon-btn', 'aria-label': 'Close resources', onclick: close }, ic('x'));
    const wrap = h('div', { class: 'dlg-wrap', onclick: e => { if (e.target === wrap) close(); } }, h('div', { class: 'dlg', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rh' },
      h('div', { class: 'dlg-top' }, h('h2', { id: 'rh' }, 'Resources'), x),
      h('dl', null, C.resources.map(r => [h('dt', null, r.b64 ? h('button', { class: 'btn ghost sm', onclick: e => saveFile(r, e.currentTarget) }, ic('download'), r.title) : r.download ? h('a', { href: r.download, download: r.file }, r.title + ' (download)') : h('a', { href: r.url, target: '_blank', rel: 'noopener' }, r.title, h('span', { class: 'sr' }, ' (opens in a new tab)'))), h('dd', null, r.desc)]))));
    wrap.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if (e.key === 'Tab') { const f = [...wrap.querySelectorAll('button,a')]; const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    });
    document.body.append(wrap); x.focus();
  }

  /* lesson: blocks split into segments by Continue dividers */
  function segments(l) { const segs = [[]]; l.blocks.forEach((b, i) => { if (b.t === 'continue') segs.push([]); else segs[segs.length - 1].push(i); }); return segs; }
  const conts = l => l.blocks.filter(b => b.t === 'continue');
  let gateRefresh = null;
  function lessonView(i) {
    const l = L[i]; const segs = segments(l); const cs = conts(l);
    const shown = Math.min(S.seg[l.id] || 0, cs.length);
    const blocks = h('div', { class: 'blocks' });
    const ctxFor = bi => { const key = l.id + '_' + bi; return { key, done: () => !!S.bc[key], complete: () => { if (S.bc[key]) return; S.bc[key] = true; save(); gateRefresh && gateRefresh(); } }; };
    const segEl = (k, isNew) => { const el = h('div', { class: 'seg' + (isNew ? ' seg-new' : ''), 'data-seg': k }); segs[k].forEach(bi => { const b = l.blocks[bi]; const fn = B[b.t]; const node = fn ? fn(b, ctxFor(bi)) : null; if (node) el.append(h('div', { class: 'blk' + (b.wide ? ' wide' : ''), 'data-t': b.t }, node)); }); return el; };
    for (let k = 0; k <= shown; k++) blocks.append(segEl(k, false));
    const tail = h('div');
    const drawTail = () => {
      const cur = Math.min(S.seg[l.id] || 0, cs.length);
      if (cur < cs.length) {
        const c = cs[cur]; const need = c.gate ? segs[cur].filter(bi => GATED.includes(l.blocks[bi].t) && !S.bc[l.id + '_' + bi]).length : 0;
        const btn = h('button', { class: 'btn', disabled: need > 0 || null, 'aria-describedby': need ? 'need' : null, onclick: () => {
          S.seg[l.id] = cur + 1; save(); const el = segEl(cur + 1, true); blocks.append(el); drawTail(); refreshSide();
          const first = el.querySelector('h2,h3,p,button'); el.tabIndex = -1; el.focus({ preventScroll: true }); el.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' }); say('More content added below.');
        } }, c.label || 'Continue');
        rc(tail, h('div', { class: 'cont' }, btn, need ? h('p', { class: 'need', id: 'need' }, ic('lock'), 'Complete the activity above to continue') : null));
        gateRefresh = () => { const n2 = segs[cur].filter(bi => GATED.includes(l.blocks[bi].t) && !S.bc[l.id + '_' + bi]).length; if (c.gate && n2 === 0 && btn.disabled) { btn.disabled = false; btn.removeAttribute('aria-describedby'); const nd = tail.querySelector('.need'); nd && nd.remove(); say('Continue is now available.'); } };
      } else {
        gateRefresh = null;
        const next = i + 1 < N ? i + 1 : -1;
        const end = h('div', { class: 'lesson-end' }, h('p', { class: 'done' }, ic('check'), UW + ' complete'),
          next >= 0 ? [h('span', { class: 'nxt', id: 'nxtl' }, 'Next'), h('button', { class: 'btn', 'aria-describedby': 'nxtl', onclick: () => { markDone(l); open(next); } }, L[next].title, ic('arrowR'))] : h('button', { class: 'btn', onclick: () => { markDone(l); S.cur = -1; save(); render(); } }, 'Back to Course Overview'));
        rc(tail, end);
        if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { markDone(l); io.disconnect(); } }); setTimeout(() => io.observe(end), 400); }
      }
    };
    drawTail();
    return h('div', null, h('header', { class: 'lesson-head' }, h('p', { class: 'lesson-num' }, UW + ' ' + (i + 1) + ' of ' + (N - 1)), h('h1', { id: 'title', tabindex: '-1' }, l.title), h('div', { class: 'rule', 'aria-hidden': 'true' })), blocks, tail);
  }
  const GATED = ['kc', 'process', 'flashcards', 'sort', 'labeled', 'scenario', 'codetask'];
  function markDone(l) { if (S.done[l.id]) return; S.done[l.id] = true; save(); refreshSide(); }

  /* quiz lesson */
  function quizView(i) {
    const l = L[i]; const wrap = h('div', { class: 'quiz' }); let q = 0, ans = [];
    const intro = () => {
      const last = S.quiz;
      rc(wrap, h('div', { class: 'quiz-intro' }, h('h2', null, l.title), h('p', null, l.questions.length + ' questions · Passing score ' + l.pass + '% · You can retake it'),
        last ? h('p', null, 'Your last result: ' + last.pct + '% (' + (last.passed ? 'passed' : 'not yet passed') + ')') : null,
        h('button', { class: 'btn', onclick: () => { q = 0; ans = []; question(true); } }, last ? 'Retake Quiz' : 'Start Quiz', ic('arrowR'))));
    };
    const question = (focus) => {
      const Q = l.questions[q]; const name = 'qz' + q;
      const fs = h('fieldset', { style: 'border:0;padding:0;margin:0' }, h('legend', { class: 'sr' }, Q.q + (Q.kind === 'mr' ? ' (select all that apply)' : '')), Q.kind === 'mr' ? h('p', { style: 'font-size:15px;color:var(--muted)' }, 'Select all that apply.') : null,
        Q.options.map((o, k) => h('label', { class: 'opt' }, h('input', { type: Q.kind === 'mr' ? 'checkbox' : 'radio', name, value: k }), h('span', { html: inl(o) }))));
      const qh = h('p', { class: 'q', tabindex: '-1' }, Q.q);
      rc(wrap, h('div', { class: 'kc' }, h('div', { class: 'quiz-prog' }, h('span', null, 'Question ' + (q + 1) + ' of ' + l.questions.length), h('span', null, l.title)),
        h('div', { class: 'bar', 'aria-hidden': 'true' }, h('i', { style: 'width:' + (q / l.questions.length * 100) + '%' })), qh, fs,
        h('div', { class: 'kc-actions' }, h('button', { class: 'btn', onclick: () => {
          const pick = [...fs.querySelectorAll('input:checked')].map(x => +x.value); if (!pick.length) { toast('Choose an answer first'); return; }
          ans[q] = pick; q++; q < l.questions.length ? question(true) : result();
        } }, q < l.questions.length - 1 ? 'Next Question' : 'Submit Quiz', ic('arrowR')))));
      if (focus) qh.focus();
    };
    const correct = (Q, a) => Q.kind === 'mr' ? (a.length === Q.answer.length && a.every(x => Q.answer.includes(x))) : a[0] === Q.answer;
    const result = () => {
      const right = l.questions.filter((Q, k) => correct(Q, ans[k])).length; const pct = Math.round(right / l.questions.length * 100); const passed = pct >= l.pass;
      S.quiz = { pct, passed, right, total: l.questions.length }; if (passed) S.done[l.id] = true; save(); refreshSide();
      l.questions.forEach((Q, k) => LMS.interaction({ id: 'q' + (k + 1), type: 'choice', response: ans[k].map(x => 'abcdefgh'[x]).join(LMS_SEP()), correct: [].concat(Q.answer).map(x => 'abcdefgh'[x]).join(LMS_SEP()), ok: correct(Q, ans[k]), text: Q.q }));
      const sent = LMS.result(pct, l.pass);
      const vh = h('p', { class: 'verdict', tabindex: '-1' }, passed ? 'You passed' : 'You didn’t pass this time');
      rc(wrap, h('div', { class: 'result ' + (passed ? 'pass' : 'fail'), role: 'status' },
        h('div', { class: 'ring', style: '--p:' + pct, 'aria-hidden': 'true' }, h('span', null, pct + '%')), h('span', { class: 'sr' }, 'Score ' + pct + ' per cent. '), vh,
        h('p', null, right + ' of ' + l.questions.length + ' correct. Passing score: ' + l.pass + '%.'),
        h('p', { class: 'sent' }, ic(LMS.ok ? 'check' : 'info'), LMS.ok ? 'Your result has been sent to your learning platform.' : 'Viewing outside a learning platform: your result is saved on this device only.'),
        h('div', { class: 'kc-actions', style: 'justify-content:center' }, h('button', { class: passed ? 'btn ghost' : 'btn', onclick: () => { q = 0; ans = []; question(true); } }, ic('replay'), 'Retake Quiz'), passed ? h('button', { class: 'btn', onclick: () => { S.cur = -1; save(); render(); } }, 'Finish') : null),
        h('ul', { class: 'review', 'aria-label': 'Review your answers' }, l.questions.map((Q, k) => { const g = correct(Q, ans[k]); return h('li', null, h('span', { class: g ? 'ok' : 'no' }, ic(g ? 'check' : 'x'), h('span', { class: 'sr' }, g ? 'Correct: ' : 'Incorrect: ')), h('span', null, h('strong', null, Q.q), ' ', g ? null : h('span', null, 'Answer: ' + [].concat(Q.answer).map(x => Q.options[x]).join('; ') + '. '), h('span', { html: inl(Q.why || '') }))); }))));
      vh.focus();
    };
    intro();
    return h('div', null, h('header', { class: 'lesson-head' }, h('p', { class: 'lesson-num' }, 'Final quiz'), h('h1', { id: 'title', tabindex: '-1' }, l.title), h('div', { class: 'rule', 'aria-hidden': 'true' })), wrap);
  }
  const LMS_SEP = () => LMS.is04 ? '[,]' : ',';

  function refreshSide() { const old = app.querySelector('.side'); if (old) { const sc = old.querySelector('.side-nav').scrollTop; const nu = sidebar(); old.replaceWith(nu); nu.querySelector('.side-nav').scrollTop = sc; } }
  const small = () => !matchMedia('(min-width: 981px)').matches;
  function setSide(v) {
    sideOpen = v; const sh = app.querySelector('.shell'); if (sh) sh.classList.toggle('closed', !v);
    const b = document.getElementById('menubtn'); if (b) b.setAttribute('aria-expanded', String(v));
    // On small screens the menu is a modal drawer: the page behind is inert while it is open.
    const main = app.querySelector('.main'); const side = app.querySelector('.side');
    if (main) main.inert = small() && v;
    if (side) { if (small()) { side.setAttribute('role', 'dialog'); side.setAttribute('aria-modal', String(v)); } else { side.removeAttribute('role'); side.removeAttribute('aria-modal'); } }
    if (small() && v) { const c = app.querySelector('.side-close'); c && setTimeout(() => c.focus(), 30); }
  }
  function open(i) { if (!available(i)) return; stopAudio(); S.cur = i; save(); if (!matchMedia('(min-width: 981px)').matches) sideOpen = false; render(true); }

  function render(focus) {
    stopAudio(); rc(app, );
    if (S.cur < 0) { app.append(h('a', { class: 'skip', href: '#main' }, 'Skip to main content'), cover()); document.title = C.title; if (focus) document.getElementById('title').focus(); return; }
    const l = L[S.cur];
    const body = l.type === 'quiz' ? quizView(S.cur) : lessonView(S.cur);
    const main = h('div', { class: 'main' },
      h('header', { class: 'topbar' }, h('button', { class: 'icon-btn', id: 'menubtn', 'aria-label': 'Course menu', 'aria-expanded': String(sideOpen), onclick: () => setSide(!sideOpen) }, ic('menu')),
        h('p', { class: 'where' }, C.title), h('span', { class: 'sr' }, '')),
      h('main', { class: 'scroll', id: 'main', tabindex: '-1' }, body));
    app.append(h('a', { class: 'skip', href: '#title', onclick: e => { e.preventDefault(); document.getElementById('title').focus(); } }, 'Skip to lesson content'),
      h('div', { class: 'shell' + (sideOpen ? '' : ' closed') }, sidebar(), h('div', { class: 'scrim', onclick: () => setSide(false) }), main));
    document.title = l.title + ' · ' + C.title;
    setSide(sideOpen);
    if (focus) { document.getElementById('main').scrollTop = 0; document.getElementById('title').focus({ preventScroll: true }); }
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sideOpen && small() && !document.querySelector('.dlg')) { setSide(false); const b = document.getElementById('menubtn'); b && b.focus(); } });
  matchMedia('(min-width: 981px)').addEventListener('change', () => { if (S.cur >= 0) setSide(!small()); });
  window.__RISE__ = { S, L, open, render, save };
  render();
})();
