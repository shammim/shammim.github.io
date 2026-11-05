/* Digital Skills for Seniors — Rise-style player. Guided navigation in Welcome, Lessons 1–2; open navigation from Lesson 3.
   Narration: one clip per screen, learner-started by default, with replay, speed and transcript. */
(function () {
"use strict";
const C = window.COURSE, AUDIO = window.AUDIO || {}, TIMING = window.TIMING || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- icons (Lucide outlines) ---------- */
const P = {
  play:'<polygon points="7 4 20 12 7 20 7 4"/>', pause:'<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  rotate:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  text:'<path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', checkc:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  laptop:'<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  wifi:'<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/>',
  video:'<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.76-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  videooff:'<path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.25-3.5a.5.5 0 0 1 .75.43v9.1"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  phoneoff:'<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><path d="m22 2-20 20"/>',
  mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  micoff:'<path d="m2 2 20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M12 19v3"/>',
  image:'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  note:'<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  key:'<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  chev:'<path d="m6 9 6 6 6-6"/>', left:'<path d="m15 18-6-6 6-6"/>', right:'<path d="m9 18 6-6-6-6"/>',
  print:'<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'
};
const FILL = { play: 1, pause: 1 };
const ic = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${FILL[n] ? ' style="fill:currentColor;stroke:none"' : ""}>${P[n] || ""}</svg>`;
const tok = h => h.replace(/\{i:(\w+)\}/g, (_, n) => ic(n));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- state ---------- */
const KEY = "dss-seniors-v1";
let S = { cur: 0, max: -1, visited: {}, done: {}, speed: 1, size: 1, autoplay: false, goal: "", conf: { before: {}, after: {} } };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

const FLAT = [];
C.lessons.forEach((L, li) => L.screens.forEach((sc, si) => FLAT.push({ sc, L, li, si })));
const firstFree = FLAT.findIndex(x => x.L.mode !== "guided");
const allOpen = () => S.max >= firstFree;
const allowed = i => allOpen() || i <= S.max + 1;
const idxOf = id => FLAT.findIndex(x => x.sc.id === id);
const MODES = { guided: "Guided", choice: "You choose", free: "Your choice" };

/* ---------- shell ---------- */
document.documentElement.dataset.size = S.size;
const app = document.getElementById("app");
app.innerHTML = `
<a class="skip" href="#main">Skip to lesson content</a>
<header class="topbar">
  <button class="tbtn" id="menuBtn" type="button" aria-expanded="true" aria-controls="side">${ic("menu")}<span>Menu</span></button>
  <div class="brand"><img class="mono" alt="" src="${window.LOGO || ""}"><div><b>${esc(C.title)}</b><small>SS Learning Design</small></div></div>
  <div class="tb-group sizes" role="group" aria-label="Text size"><span class="tb-label" aria-hidden="true">Text</span>
    <button class="tbtn" type="button" data-size="1" aria-label="Normal text size">A</button>
    <button class="tbtn" type="button" data-size="2" aria-label="Large text size" style="font-size:.95rem">A+</button>
    <button class="tbtn" type="button" data-size="3" aria-label="Largest text size" style="font-size:1.1rem">A++</button></div>
  <button class="tbtn" id="helpBtn" type="button" aria-haspopup="dialog">${ic("help")}<span>Need help?</span></button>
</header>
<div class="layout">
  <nav class="side" id="side" aria-label="Course menu"></nav>
  <main id="main" tabindex="-1"><div class="col" id="col"></div></main>
</div>
<dialog id="help" aria-labelledby="helpTitle"><div class="dlg">
  <h2 id="helpTitle">Need help?</h2>
  <ul class="ticks">
    <li><strong>Listen again:</strong> press Replay on the narration bar.</li>
    <li><strong>Too fast?</strong> Choose 0.75× speed.</li>
    <li><strong>Prefer reading?</strong> Press Transcript.</li>
    <li><strong>Stuck on an activity?</strong> Press Next to move on. You can come back any time from the Menu.</li>
    <li><strong>Keyboard:</strong> <kbd>Tab</kbd> moves, <kbd>Enter</kbd> presses, <kbd>Esc</kbd> closes this box.</li>
    <li><strong>Still stuck?</strong> Ask a family member, friend or your local library for help.</li>
  </ul>
  <div class="row"><button class="btn primary" type="button" id="helpClose">Close</button></div>
</div></dialog>
<audio id="aud" preload="auto"></audio>`;

const side = $("#side"), col = $("#col"), aud = $("#aud"), menuBtn = $("#menuBtn");
const narrow = () => window.matchMedia("(max-width:60rem)").matches;
function setMenu(open) { side.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); }
setMenu(!narrow());
menuBtn.addEventListener("click", () => { const o = side.hidden; setMenu(o); if (o) { const c = $('[aria-current="page"]', side); (c || side).focus(); } });
side.addEventListener("keydown", e => { if (e.key === "Escape" && narrow()) { setMenu(false); menuBtn.focus(); } });

$$(".sizes .tbtn").forEach(b => b.addEventListener("click", () => { S.size = +b.dataset.size; document.documentElement.dataset.size = S.size; save(); syncSizes(); }));
function syncSizes() { $$(".sizes .tbtn").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.size === S.size))); }
syncSizes();

const help = $("#help"); let helpReturn = null;
$("#helpBtn").addEventListener("click", () => { helpReturn = document.activeElement; help.showModal(); $("#helpClose").focus(); });
$("#helpClose").addEventListener("click", () => help.close());
help.addEventListener("close", () => { if (helpReturn) helpReturn.focus(); });

/* ---------- sidebar ---------- */
function renderSide() {
  const vis = FLAT.filter(x => S.visited[x.sc.id]).length, pct = Math.round(vis / FLAT.length * 100);
  const r = 20, c = 2 * Math.PI * r;
  let h = `<div class="prog"><svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="6"/><circle cx="24" cy="24" r="${r}" fill="none" stroke="#047857" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" transform="rotate(-90 24 24)"/></svg><div><b>${pct}% complete</b><span>${vis} of ${FLAT.length} screens</span></div></div>`;
  C.lessons.forEach(L => {
    h += `<h2 id="nh-${L.id}">${L.num ? "Lesson " + L.num + ": " : ""}${esc(L.title)}${L.num && L.num < 5 ? `<span class="mode">${MODES[L.mode]}</span>` : ""}</h2><ol aria-labelledby="nh-${L.id}">`;
    L.screens.forEach(sc => {
      const i = idxOf(sc.id), ok = allowed(i), cur = i === S.cur, v = S.visited[sc.id];
      const st = !ok ? `<span class="st lock">${ic("lock")}</span>` : v ? `<span class="st done">${ic("check")}</span>` : `<span class="st"></span>`;
      const sr = !ok ? '<span class="sr"> (opens after the screens before it)</span>' : v ? '<span class="sr"> (visited)</span>' : "";
      h += `<li><button type="button" class="navitem" data-go="${i}"${cur ? ' aria-current="page"' : ""}${!ok ? ' aria-disabled="true"' : ""}>${st}<span>${esc(sc.title)}${sr}</span></button></li>`;
    });
    h += "</ol>";
  });
  side.innerHTML = h;
  $$(".navitem", side).forEach(b => b.addEventListener("click", () => {
    if (b.getAttribute("aria-disabled") === "true") return;
    go(+b.dataset.go); if (narrow()) setMenu(false);
  }));
  const cur = $('[aria-current="page"]', side); if (cur && !side.hidden) cur.scrollIntoView({ block: "nearest" });
}

/* ---------- narration ---------- */
const fmt = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function narrBar(sc) {
  const dur = (TIMING[sc.id] || {}).dur || 0;
  return `<section class="narr" aria-label="Narration">
    <div class="nlabel">${ic("video").replace('class="i"', 'class="i" style="display:none"')}Narration<span class="ai">AI voice, British English</span></div>
    <button class="nbtn play" type="button" id="nPlay">${ic("play")}<span>Play</span></button>
    <button class="nbtn" type="button" id="nRep">${ic("rotate")}<span>Replay</span></button>
    <div class="speed" role="group" aria-label="Narration speed">${[0.75, 1, 1.25].map(v => `<button type="button" data-rate="${v}" aria-pressed="${v === S.speed}">${v}×</button>`).join("")}</div>
    <button class="nbtn" type="button" id="nTx" aria-expanded="false" aria-controls="tx">${ic("text")}<span>Transcript</span></button>
    <span class="ntime" id="nTime">0:00 / ${fmt(dur)}</span>
    <div class="nbar" aria-hidden="true"><div id="nProg"></div></div>
    <div class="transcript" id="tx" hidden><strong>Transcript:</strong> ${esc(sc.narr)}</div>
  </section>`;
}
function bindNarr(sc) {
  aud.pause(); aud.src = AUDIO[sc.id] || ""; aud.playbackRate = S.speed; aud.preservesPitch = true;
  const pb = $("#nPlay"), set = p => { pb.innerHTML = ic(p ? "pause" : "play") + `<span>${p ? "Pause" : "Play"}</span>`; };
  pb.addEventListener("click", () => { if (aud.paused) { aud.playbackRate = S.speed; aud.play().catch(() => {}); } else aud.pause(); });
  $("#nRep").addEventListener("click", () => { aud.currentTime = 0; aud.playbackRate = S.speed; aud.play().catch(() => {}); });
  $$(".speed button").forEach(b => b.addEventListener("click", () => {
    S.speed = +b.dataset.rate; aud.playbackRate = S.speed; save();
    $$(".speed button").forEach(x => x.setAttribute("aria-pressed", String(+x.dataset.rate === S.speed)));
  }));
  $("#nTx").addEventListener("click", e => { const t = $("#tx"), o = t.hidden; t.hidden = !o; e.currentTarget.setAttribute("aria-expanded", String(o)); });
  aud.onplay = () => set(true); aud.onpause = () => set(false); aud.onended = () => set(false);
  aud.ontimeupdate = () => {
    const d = aud.duration || (TIMING[sc.id] || {}).dur || 0;
    $("#nTime").textContent = fmt(aud.currentTime) + " / " + fmt(d);
    $("#nProg").style.width = (d ? aud.currentTime / d * 100 : 0) + "%";
  };
  if (S.autoplay) aud.play().catch(() => {});
}

/* ---------- screens ---------- */
function go(i, focus = true) {
  if (i < 0 || i >= FLAT.length || !allowed(i)) return;
  S.cur = i; S.max = Math.max(S.max, i); S.visited[FLAT[i].sc.id] = true; save();
  renderScreen(focus); renderSide();
}
function renderScreen(focus) {
  const { sc, L, si } = FLAT[S.cur];
  const nextI = S.cur + 1, prevI = S.cur - 1;
  const next = FLAT[nextI], prev = FLAT[prevI];
  let nextLabel = "Next";
  if (next && next.L !== L) nextLabel = next.L.num && next.L.num < 5 ? `Start Lesson ${next.L.num}` : `Go to ${next.L.title}`;
  const head = L.num === 0 ? `<div class="lesson-head"><div class="eyebrow">Start here</div><div class="lt">${esc(C.title)}</div><div class="banner">${ic("info")}${esc(C.subtitle)}</div></div>`
    : L.num === 5 ? `<div class="lesson-head"><div class="eyebrow">Course complete</div><div class="lt">${esc(L.title)}</div></div>`
    : `<div class="lesson-head"><div class="eyebrow">Lesson ${L.num} of 4 · ${MODES[L.mode]}</div><div class="lt">${esc(L.title)}</div>${L.banner ? `<div class="banner">${ic(L.mode === "guided" ? "users" : "key")}${esc(L.banner)}</div>` : ""}</div>`;
  col.innerHTML = `${head}
    <div class="screen-count">Screen ${si + 1} of ${L.screens.length}</div>
    <h1 class="st" tabindex="-1" id="stitle">${esc(sc.title)}</h1>
    ${narrBar(sc)}
    <div class="content">${tok(sc.html)}</div>
    <nav class="pager" aria-label="Screen">
      ${prev ? `<button class="btn" type="button" id="pPrev">${ic("left")}Back</button>` : ""}
      ${next ? `<button class="btn primary next" type="button" id="pNext">${nextLabel}${ic("right")}</button>` : `<button class="btn primary next" type="button" id="pStart">${ic("repeat")}Back to the start</button>`}
    </nav>`;
  bindNarr(sc);
  $$("[data-ia]", col).forEach(el => { const f = IA[el.dataset.ia]; if (f) f(el, ctx(sc)); });
  $$("[data-print]", col).forEach(b => b.addEventListener("click", () => window.print()));
  if ($("#pPrev")) $("#pPrev").addEventListener("click", () => go(prevI));
  if ($("#pNext")) $("#pNext").addEventListener("click", () => go(nextI));
  if ($("#pStart")) $("#pStart").addEventListener("click", () => go(0));
  window.scrollTo(0, 0);
  if (focus) $("#stitle").focus();
}
function ctx(sc) {
  return { id: sc.id, done: () => { if (!S.done[sc.id]) { S.done[sc.id] = true; save(); } }, go: id => go(idxOf(id)) };
}

/* ---------- interaction helpers ---------- */
const live = (cls = "") => `<div class="fb ${cls}" role="status" aria-live="polite"></div>`;
function say(el, type, html) { el.className = "fb " + type; el.innerHTML = html ? ic(type === "ok" ? "checkc" : "info") + `<span>${html}</span>` : ""; }
const uid = (() => { let n = 0; return p => p + (++n); })();

const IA = {};

IA.autoplay = el => {
  el.innerHTML = `<div class="ia"><h2>Your choice</h2><button type="button" class="switch" role="switch" aria-checked="${S.autoplay}" id="apSw"><span class="track" aria-hidden="true"></span><span>Start narration automatically on each screen</span><span class="sv">${S.autoplay ? "On" : "Off"}</span></button><p class="muted" style="margin:.7rem 0 0;color:var(--muted);font-size:.85rem">Off is the default. You can press Play yourself on every screen.</p></div>`;
  const b = $("#apSw", el);
  b.addEventListener("click", () => { S.autoplay = !S.autoplay; save(); b.setAttribute("aria-checked", String(S.autoplay)); $(".sv", b).textContent = S.autoplay ? "On" : "Off"; });
};

const GOALS = [["family", "Talk to my family on video calls", "users"], ["safety", "Stay safe from scams", "shield"], ["confident", "Feel confident using the computer", "laptop"]];
IA.goal = (el, c) => {
  const n = uid("g");
  el.innerHTML = `<div class="ia"><fieldset><legend>1. What matters most to you?</legend><div class="radios">${GOALS.map(([v, t]) =>
    `<label><input type="radio" name="${n}" value="${v}"${S.goal === v ? " checked" : ""}>${esc(t)}</label>`).join("")}</div></fieldset>${live()}</div>`;
  const fb = $(".fb", el);
  $$("input", el).forEach(r => r.addEventListener("change", () => { S.goal = r.value; save(); c.done(); say(fb, "ok", "Thanks. I'll suggest a practice activity for this in Lesson 4."); }));
};

const CONF = ["I can use a mouse or touchpad", "I can make a video call", "I can spot a scam message"];
const LEVELS = ["Not yet", "A little", "Yes"];
IA.confidence = (el, c) => {
  const when = el.dataset.when;
  el.innerHTML = `<div class="ia"><h2>${when === "before" ? "2. How confident do you feel today?" : "Answer for how you feel now"}</h2>${CONF.map((q, qi) => {
    const n = uid("c");
    return `<fieldset class="conf-row"><legend style="font:600 1rem/1.3 var(--font-body);margin:0">${esc(q)}</legend><div class="radios row" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.5rem">${LEVELS.map((lv, li) =>
      `<label style="margin:0;min-width:8rem"><input type="radio" name="${n}" value="${li}" data-q="${qi}"${S.conf[when][qi] === li ? " checked" : ""}>${lv}</label>`).join("")}</div></fieldset>`;
  }).join("")}${live()}</div>`;
  const fb = $(".fb", el);
  $$("input", el).forEach(r => r.addEventListener("change", () => {
    S.conf[when][r.dataset.q] = +r.value; save();
    if (Object.keys(S.conf[when]).length === 3) { c.done(); say(fb, "ok", when === "before" ? "All done. There are no wrong answers." : "Thank you. Your results are below."); }
    document.dispatchEvent(new CustomEvent("confchange"));
  }));
};
IA.compare = el => {
  const draw = () => {
    const b = S.conf.before, a = S.conf.after;
    const cell = v => v === undefined ? "<span style='color:var(--muted)'>No answer</span>" : LEVELS[v];
    el.innerHTML = `<div class="ia"><h2>Your progress</h2><div class="cmpwrap" role="region" aria-label="Your progress table" tabindex="0"><table class="cmp"><caption class="sr">Confidence at the start compared with now</caption><thead><tr><th scope="col">Statement</th><th scope="col">At the start</th><th scope="col">Now</th></tr></thead><tbody>${CONF.map((q, i) =>
      `<tr><th scope="row" style="font:600 .9rem/1.4 var(--font-body);text-transform:none;letter-spacing:0;color:var(--text)">${esc(q)}</th><td>${cell(b[i])}</td><td>${cell(a[i])}${a[i] !== undefined && b[i] !== undefined && a[i] > b[i] ? ' <span class="up">Up!</span>' : ""}</td></tr>`).join("")}</tbody></table></div>`;
  };
  draw(); document.addEventListener("confchange", draw);
};

IA.parts = (el, c) => {
  const PARTS = [["screen", "Screen", "Where you see everything, a bit like a television."], ["keyboard", "Keyboard", "For typing letters and pressing keys, like a typewriter."], ["touchpad", "Touchpad or mouse", "Moves the pointer, the small arrow on the screen."], ["power", "Power button", "Turns the computer on. Press it once, then wait."]];
  const keys = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 12; k++) keys.push(`<rect class="key" x="${76 + k * 21}" y="${178 + r * 11}" width="17" height="8" rx="2"/>`);
  el.innerHTML = `<div class="ia"><div class="parts">
    <svg class="laptop" viewBox="0 0 400 300" role="img" aria-label="A laptop computer. The selected part is highlighted.">
      <g id="pp-screen"><rect class="pt" x="70" y="18" width="260" height="150" rx="10"/><rect x="84" y="30" width="232" height="126" rx="4" fill="#e0f2fe"/></g>
      <path d="M40 170 H360 L392 262 H8 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
      <g id="pp-keyboard"><rect class="pt" x="68" y="172" width="264" height="50" rx="6"/>${keys.join("")}</g>
      <rect id="pp-touchpad" class="pt" x="160" y="230" width="80" height="26" rx="5"/>
      <circle id="pp-power" class="pt" cx="348" cy="181" r="8"/>
    </svg>
    <div><div class="choice-list" role="group" aria-label="Parts of a computer">${PARTS.map(([k, t]) => `<button type="button" class="choice" data-p="${k}" aria-pressed="false"><span class="rb" aria-hidden="true"></span>${t}</button>`).join("")}</div></div>
  </div><div class="part-desc" role="status" aria-live="polite"></div>${live()}</div>`;
  const seen = new Set(), desc = $(".part-desc", el), fb = $(".fb", el);
  $$(".choice", el).forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.p, p = PARTS.find(x => x[0] === k);
    $$(".choice", el).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $$(".pt", el).forEach(x => x.classList.remove("on")); $$("[id^=pp-]", el).forEach(g => g.classList.remove("on"));
    const g = $("#pp-" + k, el); g.classList.add("on"); $$(".pt", g).forEach(x => x.classList.add("on")); if (g.classList.contains("pt")) g.classList.add("on");
    desc.innerHTML = `<p style="margin:0"><strong>${p[1]}:</strong> ${p[2]}</p>`;
    seen.add(k);
    if (seen.size === 4) { c.done(); say(fb, "ok", "You've found all four parts. Well done."); }
    else say(fb, "hint", `${seen.size} of 4 parts found.`);
  }));
};

IA.clicker = (el, c) => {
  const POS = [[8, 12], [62, 48], [34, 30]];
  el.innerHTML = `<div class="ia"><div class="arena" id="arena"><button type="button" class="target" style="left:${POS[0][0]}%;top:${POS[0][1]}%">Click me</button></div>
    <div class="counter" aria-hidden="true"><i></i><i></i><i></i><span style="margin-left:.4rem">clicks</span></div>${live()}</div>`;
  let n = 0; const t = $(".target", el), fb = $(".fb", el), dots = $$(".counter i", el);
  t.addEventListener("click", e => {
    e.stopPropagation(); if (n >= 3) return;
    n++; dots.forEach((d, i) => d.classList.toggle("on", i < n));
    if (n < 3) { t.style.left = POS[n][0] + "%"; t.style.top = POS[n][1] + "%"; say(fb, "ok", `${n} of 3. ${n === 1 ? "Nice click! Now follow the circle." : "One more."}`); }
    else { t.textContent = "Done!"; c.done(); say(fb, "ok", "Three clicks. Well done! You're clicking like a pro."); }
  });
  $("#arena", el).addEventListener("click", () => { if (n < 3) say(fb, "hint", "Nearly! Move the pointer onto the blue circle, then click."); });
};

IA.keys = (el, c) => {
  const ASK = [["Enter", "Enter", "Look for Enter on the right of the letters. It may show a bent arrow."], [" ", "space bar", "The space bar is the long key at the very bottom."], ["arrow", "any arrow key", "The arrow keys are at the bottom right, pointing up, down, left and right."], ["Escape", "Esc", "Esc is usually at the top left corner of the keyboard."]];
  const NAMES = { " ": "space bar", Enter: "Enter", Escape: "Esc", Backspace: "Backspace", Shift: "Shift", Control: "Control", Alt: "Alt", Meta: "Windows or Command", CapsLock: "Caps Lock" };
  el.innerHTML = `<div class="ia"><h2>Practice box</h2><button type="button" class="keyzone" id="kz"><span>Select this box, then press:</span><span class="ask"><kbd>Enter</kbd></span><span style="font-size:.8rem;font-weight:500;color:var(--muted)">Key 1 of 4</span></button>${live()}</div>`;
  const kz = $("#kz", el), fb = $(".fb", el); let step = 0;
  const show = () => { if (step < 4) { $(".ask", kz).innerHTML = `<kbd>${ASK[step][1]}</kbd>`; kz.lastElementChild.textContent = `Key ${step + 1} of 4`; } };
  kz.addEventListener("click", e => { if (e.detail > 0) { kz.focus(); if (step < 4) say(fb, "hint", `Now press ${ASK[step][1]}.`); } });
  kz.addEventListener("keydown", e => {
    if (e.key === "Tab" || step >= 4) return;
    const want = ASK[step][0];
    const hit = want === "arrow" ? e.key.startsWith("Arrow") : e.key === want;
    if (["Enter", " ", "Escape"].includes(e.key) || e.key.startsWith("Arrow")) { e.preventDefault(); e.stopPropagation(); }
    if (hit) {
      step++;
      if (step === 4) { c.done(); $(".ask", kz).innerHTML = ic("checkc"); kz.lastElementChild.textContent = "All four keys found"; say(fb, "ok", "That's all four keys. Well done!"); }
      else { show(); say(fb, "ok", `Yes, that's ${ASK[step - 1][1]}. Now press ${ASK[step][1]}.`); }
    } else {
      const nm = NAMES[e.key] || (e.key.startsWith("Arrow") ? "an arrow key" : (e.key.length === 1 ? `the letter ${e.key.toUpperCase()}` : e.key));
      say(fb, "hint", `That was ${nm.startsWith("the") || nm.startsWith("an") ? nm : "the " + nm + " key"}. ${ASK[step][2]}`);
    }
  });
};

IA.tabdemo = (el, c) => {
  el.innerHTML = `<div class="ia"><h2>Try the Tab key</h2><p>Select the first button, then press <kbd>Tab</kbd> to move along. <kbd>Shift</kbd> + <kbd>Tab</kbd> goes back.</p><div class="tabrow">${["First", "Second", "Third"].map(w => `<button type="button" class="btn">${w}</button>`).join("")}</div>${live()}</div>`;
  const seen = new Set(), fb = $(".fb", el);
  $$(".tabrow .btn", el).forEach((b, i) => b.addEventListener("focus", () => {
    $$(".tabrow .btn", el).forEach(x => x.classList.toggle("lit", x === b)); seen.add(i);
    if (seen.size === 3) { c.done(); say(fb, "ok", "You moved along all three buttons. That's the Tab key."); }
    else say(fb, "hint", `You're on the ${["first", "second", "third"][i]} button.`);
  }));
};

IA.desktop = (el, c) => {
  const APPS = [["photos", "Photos", "image", "#0e7490"], ["notes", "Notes", "note", "#b45309"], ["mail", "Mail", "mail", "#047857"]];
  el.innerHTML = `<div class="ia"><span class="pill-label">Practice desktop · nothing is changed</span>
    <p class="task"><span class="tn">1</span><span id="dTask">Open <strong>Photos</strong>: double-click it, or select it and press Enter.</span></p>
    <div class="device"><div class="scr" id="dScr">
      <div class="dicons" role="group" aria-label="Desktop icons">${APPS.map(([k, t, i, col]) => `<button type="button" class="dicon" data-app="${k}" aria-pressed="false"><span class="ic" style="background:${col}">${ic(i)}</span>${t}</button>`).join("")}</div>
      <div class="win" id="dWin" role="region" aria-labelledby="dWinT" hidden><div class="bar"><span id="dWinT" tabindex="-1">${ic("image")} Photos</span><button type="button" class="x" id="dX" aria-label="Close the Photos window">${ic("x")}Close</button></div><div class="body"><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
    </div></div>${live()}</div>`;
  const fb = $(".fb", el), win = $("#dWin", el), task = $("#dTask", el), tn = $(".tn", el);
  const open = k => {
    if (k !== "photos") { say(fb, "hint", `That's ${k === "notes" ? "Notes" : "Mail"}. This time, open Photos, the blue icon.`); return; }
    win.hidden = false; tn.textContent = "2"; task.innerHTML = "Now close the window with the <strong>Close (X)</strong> button in the top corner.";
    say(fb, "ok", "You opened Photos. Now close the window."); $("#dX", el).focus();
  };
  $$(".dicon", el).forEach(b => {
    b.addEventListener("click", e => {
      $$(".dicon", el).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (e.detail === 0) open(b.dataset.app);
      else if (e.detail === 1) say(fb, "hint", b.dataset.app === "photos" ? "Selected! Now click twice quickly to open it." : `That's ${b.dataset.app === "notes" ? "Notes" : "Mail"}. Look for Photos, the blue icon.`);
    });
    b.addEventListener("dblclick", () => open(b.dataset.app));
  });
  $("#dX", el).addEventListener("click", () => {
    win.hidden = true; tn.innerHTML = ic("check"); task.innerHTML = "<strong>Done.</strong> You opened and closed a window.";
    c.done(); say(fb, "ok", "Well done! You opened a window and closed it again."); $('[data-app="photos"]', el).focus();
  });
};

IA.reflect = (el, c) => {
  const OPT = [["That was easy", "Great. Lesson 2 builds on everything you just did."], ["Some parts were tricky", "That's completely normal. Every expert started here. You can replay any screen from the Menu."], ["I'd like more practice", "Good to know. Lesson 4 has extra practice, and you can come back to Lesson 1 any time."]];
  el.innerHTML = `<div class="ia"><h2>How did Lesson 1 go for you?</h2><div class="choice-list" role="group" aria-label="How did Lesson 1 go?">${OPT.map(([t], i) => `<button type="button" class="choice" data-i="${i}" aria-pressed="false"><span class="rb" aria-hidden="true"></span>${t}</button>`).join("")}</div>${live()}</div>`;
  const fb = $(".fb", el);
  $$(".choice", el).forEach(b => b.addEventListener("click", () => { $$(".choice", el).forEach(x => x.setAttribute("aria-pressed", String(x === b))); c.done(); say(fb, "ok", OPT[+b.dataset.i][1]); }));
};

/* phone simulations */
function phoneShell(inner) { return `<div class="device phone"><div class="scr">${inner}</div></div>`; }

IA.answer = (el, c) => {
  el.innerHTML = `<div class="ia"><span class="pill-label">Practice phone · no real call is made</span><p class="task"><span class="tn">1</span><span>Mary is calling. <strong>Answer her video call.</strong></span></p>
    <div id="ph">${phoneShell(`<div class="avatar ringing" aria-hidden="true">M</div><div class="who">Mary</div><div class="sub">Video call · your daughter</div>
      <div class="callbtns"><button type="button" class="cbtn r" id="dec"><span class="c">${ic("phoneoff")}</span>Decline</button><button type="button" class="cbtn g" id="ans"><span class="c">${ic("video")}</span>Answer</button></div>`)}</div>${live()}</div>`;
  const fb = $(".fb", el);
  $("#dec", el).addEventListener("click", () => say(fb, "hint", "That would say no to the call, and Mary would hear it ringing out. Try the green Answer button."));
  $("#ans", el).addEventListener("click", () => {
    $("#ph", el).innerHTML = phoneShell(`<div class="callview"><div class="videotile"><div class="avatar" aria-hidden="true">M</div><div class="selftile">You</div></div><div class="who" tabindex="-1" id="conn">You're talking with Mary</div><div class="sub">Connected · 0:01</div></div>`);
    $(".task", el).innerHTML = `<span class="tn">${ic("check")}</span><span><strong>Done.</strong> You answered the call.</span>`;
    c.done(); say(fb, "ok", "Well done! You answered Mary's call. The green button always answers."); $("#conn", el).focus();
  });
};

function callControls(st) {
  return `<div class="callbtns" role="group" aria-label="Call controls">
    <button type="button" class="cbtn" data-c="mic"${st.muted ? ' aria-pressed="true"' : ""}><span class="c">${ic(st.muted ? "micoff" : "mic")}</span>${st.muted ? "Unmute" : "Mute"}</button>
    <button type="button" class="cbtn" data-c="cam"${st.camOff ? ' aria-pressed="true"' : ""}><span class="c">${ic(st.camOff ? "videooff" : "video")}</span>${st.camOff ? "Camera on" : "Camera off"}</button>
    <button type="button" class="cbtn r" data-c="end"><span class="c">${ic("phoneoff")}</span>End call</button></div>`;
}
function callView(name, st) {
  return `<div class="callview"><div class="videotile"><div class="avatar" aria-hidden="true">${name[0]}</div><div class="selftile">${st.camOff ? "Camera off" : "You"}</div></div><div class="who">${name}</div>
    <div class="status" aria-live="polite"><span>Microphone: ${st.muted ? "muted" : "on"}</span><span>Camera: ${st.camOff ? "off" : "on"}</span></div>${callControls(st)}</div>`;
}

IA.incall = (el, c) => {
  const STEPS = [["mic", "Mute your microphone, so Mary can't hear you."], ["mic", "Unmute your microphone, so Mary can hear you again."], ["cam", "Turn your camera off."], ["end", "End the call."]];
  const NAMES = { mic: "microphone button", cam: "camera button", end: "red End call button" };
  let step = 0; const st = { muted: false, camOff: false };
  el.innerHTML = `<div class="ia"><span class="pill-label">Practice call · no real call is made</span><p class="task"><span class="tn">1</span><span id="tk"></span></p><div id="ph"></div>${live()}</div>`;
  const fb = $(".fb", el), tk = $("#tk", el), tn = $(".tn", el);
  const draw = refocus => {
    $("#ph", el).innerHTML = phoneShell(callView("Mary", st));
    $$(".cbtn", el).forEach(b => b.addEventListener("click", () => press(b.dataset.c)));
    if (refocus) { const b = $(`[data-c="${refocus}"]`, el); if (b) b.focus(); }
  };
  const task = () => { tn.textContent = step + 1; tk.textContent = STEPS[step][1]; };
  function press(k) {
    const want = STEPS[step][0];
    if (k !== want) { say(fb, "hint", k === "end" ? `That would end the call. First: ${STEPS[step][1].toLowerCase()}` : `That's the ${NAMES[k]}. Look for the ${NAMES[want]}${want === "mic" ? ", the first one" : want === "cam" ? ", in the middle" : ""}.`); return; }
    if (k === "mic") st.muted = !st.muted; if (k === "cam") st.camOff = !st.camOff;
    step++;
    if (k === "end") {
      $("#ph", el).innerHTML = phoneShell(`<div class="who" tabindex="-1" id="ended">Call ended</div><div class="sub">You can call Mary back any time.</div>`);
      tn.innerHTML = ic("check"); tk.innerHTML = "<strong>Done.</strong> You used all the call buttons."; c.done(); say(fb, "ok", "Well done! Mute, camera and end call: you've used them all."); $("#ended", el).focus(); return;
    }
    draw(k); task(); say(fb, "ok", ["Muted. Mary can't hear you now.", "Unmuted. Mary can hear you again.", "Camera off. Mary can't see you now."][step - 1]);
  }
  draw(); task();
};

const CONTACTS = [["Mary", "Your daughter"], ["Tom", "Your grandson"], ["Joan", "Friend from bowls"], ["Dr Lee's clinic", "Doctor"]];
function contactSim(el, c, opts) {
  // opts: target, full (mute/unmute/end after connecting), hintsOnRequest
  const T = opts.target; let stage = "list", sel = null; const st = { muted: false, camOff: false }; let callStep = 0;
  el.innerHTML = `<div class="ia"><span class="pill-label">Practice phone · no real call is made</span>
    <p class="task"><span class="tn">${ic("phone")}</span><span>${opts.task}</span></p>
    <div id="ph"></div><div class="actions" style="margin:1rem 0 0"><button type="button" class="btn small" id="hintBtn">${ic("bulb")}Show me a hint</button></div>${live()}</div>`;
  const ph = $("#ph", el), fb = $(".fb", el);
  const hint = () => {
    if (stage === "list") return `Choose <strong>${T}</strong> in the contacts list.`;
    if (stage === "detail") return sel === T ? "Press the green <strong>Video call</strong> button." : `This is ${sel}. Press <strong>Back</strong>, then choose ${T}.`;
    if (stage === "call") return ["Press <strong>Mute</strong>, the microphone button.", "Press <strong>Unmute</strong> to turn your microphone back on.", "Press the red <strong>End call</strong> button."][callStep];
    return "You're nearly there.";
  };
  $("#hintBtn", el).addEventListener("click", () => say(fb, "hint", hint()));
  function list(focusName) {
    stage = "list";
    ph.innerHTML = phoneShell(`<div class="who" style="font-size:1.2rem;align-self:flex-start">Contacts</div><ul class="contacts">${CONTACTS.map(([n, r]) => `<li><button type="button" data-n="${esc(n)}"><span class="avatar sm" aria-hidden="true">${n[0]}</span><span>${esc(n)}<small>${r}</small></span></button></li>`).join("")}</ul>`);
    $$(".contacts button", ph).forEach(b => b.addEventListener("click", () => detail(b.dataset.n)));
    if (focusName) $(`[data-n="${focusName}"]`, ph).focus();
  }
  function detail(n) {
    stage = "detail"; sel = n; const r = CONTACTS.find(x => x[0] === n)[1];
    ph.innerHTML = phoneShell(`<button type="button" class="back" id="bk">${ic("left")}Back</button><div class="avatar" aria-hidden="true">${n[0]}</div><div class="who" tabindex="-1" id="dn">${esc(n)}</div><div class="sub">${r}</div>
      <div class="callbtns"><button type="button" class="cbtn" id="voice"><span class="c">${ic("phone")}</span>Voice call</button><button type="button" class="cbtn g" id="vid"><span class="c">${ic("video")}</span>Video call</button></div>`);
    $("#dn", ph).focus();
    $("#bk", ph).addEventListener("click", () => list(n));
    $("#voice", ph).addEventListener("click", () => say(fb, "hint", "That's a voice call, with sound only. Choose the green Video call button so you can see each other."));
    $("#vid", ph).addEventListener("click", () => {
      if (n !== T) { say(fb, "hint", `This is ${esc(n)}, not ${T}. Press Back, then choose ${T}.`); return; }
      stage = "ringing"; ph.innerHTML = phoneShell(`<div class="avatar ringing" aria-hidden="true">${T[0]}</div><div class="who" tabindex="-1" id="rg">Calling ${T}…</div><div class="sub">Video call</div>`);
      $("#rg", ph).focus(); say(fb, "ok", `Calling ${T}…`);
      setTimeout(connected, 1600);
    });
  }
  function connected() {
    if (!opts.full) {
      stage = "done"; ph.innerHTML = phoneShell(`<div class="callview"><div class="videotile"><div class="avatar" aria-hidden="true">${T[0]}</div><div class="selftile">You</div></div><div class="who" tabindex="-1" id="cn">${T} answered!</div><div class="sub">Connected</div></div>`);
      $(".task", el).innerHTML = `<span class="tn">${ic("check")}</span><span><strong>Done.</strong> You made a video call to ${T}.</span>`;
      c.done(); say(fb, "ok", `Well done! ${T} answered your video call.`); $("#cn", ph).focus(); return;
    }
    stage = "call"; drawCall(); say(fb, "ok", `${T} answered. Now mute your microphone.`); $(".callview .who", ph).focus();
  }
  function drawCall(refocus) {
    ph.innerHTML = phoneShell(callView(T, st)); $(".callview .who", ph).setAttribute("tabindex", "-1");
    $$(".cbtn", ph).forEach(b => b.addEventListener("click", () => cpress(b.dataset.c)));
    if (refocus) $(`[data-c="${refocus}"]`, ph).focus();
  }
  function cpress(k) {
    const want = ["mic", "mic", "end"][callStep];
    if (k !== want) { say(fb, "hint", k === "end" ? "Not yet. Mute and unmute your microphone first." : "That's the camera button. The microphone button is the first one."); return; }
    callStep++;
    if (k === "mic") { st.muted = !st.muted; drawCall("mic"); say(fb, "ok", st.muted ? "Muted. Now unmute." : "Unmuted. Now end the call."); return; }
    stage = "done"; ph.innerHTML = phoneShell(`<div class="who" tabindex="-1" id="en">Call ended</div><div class="sub">Great call!</div>`);
    $(".task", el).innerHTML = `<span class="tn">${ic("check")}</span><span><strong>Done.</strong> A whole video call, on your own.</span>`;
    c.done(); say(fb, "ok", "Brilliant! You made, controlled and ended a whole video call on your own."); $("#en", ph).focus();
  }
  list();
}
IA.makecall = (el, c) => contactSim(el, c, { target: "Tom", task: "Make a <strong>video call</strong> to your grandson, <strong>Tom</strong>." });
IA.fullcall = (el, c) => contactSim(el, c, { target: "Mary", full: true, task: "Video-call <strong>Mary</strong>. When she answers, <strong>mute</strong>, then <strong>unmute</strong>, then <strong>end the call</strong>." });

IA.quiz = (el, c) => {
  const Q = [
    ["You can see Mary, but she can't hear you. Which button should you check?", ["The microphone button", "The camera button", "The End call button"], 0,
      "The microphone button controls whether people can hear you. If it shows Unmute, press it.", "Not quite. The camera controls your picture, not your voice. Think about which button is for sound."],
    ["During a call, what does the red button with a phone do?", ["Makes the sound louder", "Ends the call", "Turns on the camera"], 1,
      "Yes. The red button ends the call, just like hanging up a phone.", "Not quite. Red on a call screen usually means stop. Have another go."]];
  let right = new Set();
  el.innerHTML = Q.map((q, qi) => { const n = uid("q"); return `<div class="ia"><fieldset><legend>Question ${qi + 1} of 2: ${esc(q[0])}</legend><div class="radios">${q[1].map((o, oi) => `<label><input type="radio" name="${n}" value="${oi}">${esc(o)}</label>`).join("")}</div></fieldset>
    <button type="button" class="btn primary small" data-q="${qi}">Check</button>${live()}</div>`; }).join("");
  $$("[data-q]", el).forEach(b => b.addEventListener("click", () => {
    const qi = +b.dataset.q, box = b.closest(".ia"), fb = $(".fb", box), v = $("input:checked", box);
    if (!v) { say(fb, "hint", "Choose an answer first, then press Check."); return; }
    if (+v.value === Q[qi][2]) { right.add(qi); say(fb, "ok", Q[qi][3]); if (right.size === 2) c.done(); }
    else say(fb, "hint", Q[qi][4]);
  }));
};

IA.accordion = (el, c) => {
  const A = [["Make it long", "key", "Join four random words, like <strong>purple kettle beach river</strong>. Long passwords are much harder to guess than short, clever ones."],
    ["Keep it to yourself", "shield", "Your bank, the government and real companies will <strong>never</strong> ask for your password by phone, text or email."],
    ["Don't reuse it", "lock", "Use a different password for your email and your banking, just as you wouldn't use one key for every door. A password manager can remember them for you."]];
  const seen = new Set();
  el.innerHTML = A.map(([t, i, b], k) => `<div class="acc"><h2><button type="button" class="ah" aria-expanded="false" aria-controls="acb${k}" id="ach${k}"><span class="tc-ico ${["ac", "mi", "co"][k]}" style="margin:0" aria-hidden="true">${ic(i)}</span>${t}${ic("chev").replace('class="i"', 'class="i chev"')}</button></h2><div class="ab" id="acb${k}" role="region" aria-labelledby="ach${k}" hidden><p>${b}</p></div></div>`).join("") + live();
  const fb = $(".fb", el);
  $$(".ah", el).forEach((b, k) => b.addEventListener("click", () => {
    const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(o)); $("#acb" + k, el).hidden = !o;
    if (o) seen.add(k); if (seen.size === 3) { c.done(); say(fb, "ok", "You've read all three tips."); }
  }));
};

IA.sorter = (el, c) => {
  const M = [
    ["Text message", "Parcel Delivery", "Your parcel is on hold. Pay $2.99 now to release it: parcel-help-now.info", 1, "Suspicious. It's unexpected, asks for a small payment and has a strange web link. Delivery companies don't text links for payment like this."],
    ["Email", "Mary (your daughter)", "Here are the photos from Sunday's lunch. Love, Mary", 0, "Looks safe. It's from someone you know, it's what you'd expect, and it doesn't rush you or ask for anything. If you're ever unsure, ask Mary."],
    ["Email", "Your Bank Security Team", "Your account is locked. Confirm your password within 24 hours or it will be closed.", 1, "Suspicious. It rushes you and asks for your password. Real banks never ask for your password."],
    ["Text message", "Riverside Medical Clinic", "Reminder: your appointment with Dr Lee is on Tuesday at 10:30 am. Reply C to confirm.", 0, "Looks safe. You were expecting it, there's no link and it doesn't ask for money or details."]];
  const ans = {};
  el.innerHTML = M.map(([kind, from, text], i) => `<div class="msg"><div class="from"><span class="tag">${kind}</span>From: <b>${esc(from)}</b></div><div class="mtext">${esc(text)}</div>
    <div class="row" role="group" aria-label="Message ${i + 1}: safe or suspicious?"><button type="button" class="btn small" data-m="${i}" data-v="0" aria-pressed="false">${ic("checkc")}Looks safe</button><button type="button" class="btn small" data-m="${i}" data-v="1" aria-pressed="false">${ic("info")}Suspicious</button></div>${live()}</div>`).join("");
  $$("[data-m]", el).forEach(b => b.addEventListener("click", () => {
    const i = +b.dataset.m, box = b.closest(".msg"), fb = $(".fb", box);
    $$("[data-m]", box).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const ok = +b.dataset.v === M[i][3];
    say(fb, ok ? "ok" : "hint", (ok ? "Good spotting. " : "Have another look. ") + M[i][4]);
    if (ok) ans[i] = true; if (Object.keys(ans).length === 4) c.done();
  }));
};

IA.scenario = (el, c) => {
  const O = [["Send the money quickly. He sounds upset.", 0, "Scammers want you to act fast, before you can check. Hang up and call Tom on the number you already have for him."],
    ["Hang up and call Tom on his usual number.", 1, "Exactly right. Calling back on a number you already know is the safest check. If it really was Tom, he'll understand."],
    ["Give the caller your bank details so he can take it himself.", 0, "Never share bank details with a caller. Hang up and call Tom, or a family member, on a number you already have."]];
  el.innerHTML = `<div class="callcard"><span class="avatar sm" aria-hidden="true">${ic("phone")}</span><div><div class="meta">Incoming call · unknown number</div><p class="quote" style="margin:0">"Hi, it's Tom. I'm in trouble and I need $800 today. My phone's broken, so I'm calling from a friend's. Please don't tell Mum."</p></div></div>
    <div class="ia"><fieldset><legend>What would you do?</legend><div class="choice-list">${O.map(([t], i) => `<button type="button" class="choice" data-i="${i}" aria-pressed="false"><span class="rb" aria-hidden="true"></span>${t}</button>`).join("")}</div></fieldset>${live()}
    <p class="note" style="margin-top:1rem">${ic("info")}<span><strong>Warning signs:</strong> a new number, a rush, a request for money and "don't tell anyone".</span></p></div>`;
  const fb = $(".fb", el);
  $$(".choice", el).forEach(b => b.addEventListener("click", () => {
    $$(".choice", el).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const o = O[+b.dataset.i]; say(fb, o[1] ? "ok" : "hint", o[2]); if (o[1]) c.done();
  }));
};

IA.hub = (el, c) => {
  const H = [["l4s2", "A call from start to finish", "Make, control and end a whole video call.", "family", "video"], ["l4s3", "Safe or scam? Quick five", "Five quick situations to judge.", "safety", "shield"], ["l4s4", "Keyboard confidence", "Fill in a short form with the keyboard only.", "confident", "laptop"]];
  const sug = S.goal || "family";
  el.innerHTML = `<div class="hub">${H.map(([id, t, d, g, i], k) => `<div class="hubcard${g === sug ? " sugg" : ""}"><span class="tc-ico ${["ac", "mi", "co"][k]}" aria-hidden="true">${ic(i)}</span><div class="body"><h2 class="tc-t">${t}${g === sug ? '<span class="badge s">Suggested for you</span>' : ""}${S.done[id] ? `<span class="badge d">${ic("check")}Done</span>` : ""}</h2><p>${d}</p><button type="button" class="btn ${g === sug ? "primary" : ""} small" data-goto="${id}">${S.done[id] ? "Do it again" : "Start"}<span class="sr">: ${t}</span>${ic("right")}</button></div></div>`).join("")}</div>
    <p class="note" style="margin-top:1.2rem">${ic("info")}<span>When you're ready, finish with the <strong>Well done</strong> screens in the Menu, or press Next.</span></p>`;
  c.done();
  $$("[data-goto]", el).forEach(b => b.addEventListener("click", () => c.go(b.dataset.goto)));
};

IA.quick5 = (el, c) => {
  const Q = [["A pop-up on your screen says your computer has a virus and you must call a number now.", 1, "Scam. Real security warnings never ask you to phone a number. Close the window."],
    ["Your grandson emails holiday photos, as he said he would.", 0, "Safe. You were expecting it and it asks for nothing."],
    ["A text says you've won a prize and asks for your card details to send it.", 1, "Scam. You can't win a prize you didn't enter, and prizes never need your card details."],
    ["You open your bank's app yourself and check your balance.", 0, "Safe. You went to the bank yourself, rather than following a message."],
    ["A caller says he's from the tax office and you'll be arrested unless you pay in gift cards.", 1, "Scam. Government agencies never ask for payment in gift cards or threaten arrest by phone."]];
  let i = 0, score = 0, answered = false;
  el.innerHTML = `<div class="ia"><div class="screen-count" id="qn"></div><p class="lead" id="qt" style="margin-bottom:1rem"></p><div class="actions" role="group" aria-label="Safe or scam?"><button type="button" class="btn" data-v="0">${ic("checkc")}Sounds safe</button><button type="button" class="btn" data-v="1">${ic("info")}Sounds like a scam</button></div>${live()}<div class="actions" style="margin-top:1rem"><button type="button" class="btn primary small" id="qNext" hidden>Next situation${ic("right")}</button></div></div>`;
  const fb = $(".fb", el), nx = $("#qNext", el);
  const draw = () => { $("#qn", el).textContent = `Situation ${i + 1} of 5`; $("#qt", el).textContent = Q[i][0]; say(fb, "", ""); nx.hidden = true; answered = false; };
  $$("[data-v]", el).forEach(b => b.addEventListener("click", () => {
    if (answered) return; answered = true;
    const ok = +b.dataset.v === Q[i][1]; if (ok) score++;
    say(fb, ok ? "ok" : "hint", (ok ? "Right. " : "Not this time. ") + Q[i][2]);
    if (i < 4) { nx.hidden = false; }
    else { c.done(); say(fb, ok ? "ok" : "hint", (ok ? "Right. " : "Not this time. ") + Q[i][2] + ` <br><strong>You spotted ${score} of 5.</strong> ${score >= 4 ? "Excellent instincts!" : "Every one you check makes you safer. Try again any time."}`); }
  }));
  nx.addEventListener("click", () => { i++; draw(); $("#qt", el).setAttribute("tabindex", "-1"); $("#qt", el).focus(); });
  draw();
};

IA.form = (el, c) => {
  const n = uid("r");
  el.innerHTML = `<form class="ia" novalidate><span class="pill-label">Practice form · nothing is sent</span>
    <div class="field"><label for="fName">Your first name</label><input type="text" id="fName" autocomplete="given-name" aria-describedby="fErr"><div class="err" id="fErr" hidden></div></div>
    <fieldset><legend style="font:700 1rem/1.3 var(--font-body)">Your favourite way to keep in touch</legend><div class="radios">${["Phone call", "Video call", "Email"].map((o, i) => `<label><input type="radio" name="${n}" value="${o}"${i === 1 ? " checked" : ""}>${o}</label>`).join("")}</div></fieldset>
    <button type="submit" class="btn primary">${ic("check")}Save</button>${live()}</form>`;
  const f = $("form", el), inp = $("#fName", el), err = $("#fErr", el), fb = $(".fb", el);
  f.addEventListener("submit", e => {
    e.preventDefault();
    const v = inp.value.trim();
    if (!v) { inp.setAttribute("aria-invalid", "true"); err.hidden = false; err.innerHTML = ic("info") + "Please type your first name in the box, then press Save."; inp.focus(); return; }
    inp.removeAttribute("aria-invalid"); err.hidden = true;
    const way = $("input:checked", f).value;
    c.done(); say(fb, "ok", `Thanks, ${esc(v)}! You filled in a form with the keyboard. Favourite way to keep in touch: ${esc(way)}.`);
  });
};

/* ---------- start ---------- */
if (!allowed(S.cur)) S.cur = 0;
go(S.cur, false);
})();
