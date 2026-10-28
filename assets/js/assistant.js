/* Shammim's portfolio assistant.
   A built-in assistant that answers from the portfolio's own content (kb.js, generated from cases.py).
   No API key or server needed. Conversation is kept for the browser session so it follows you between pages. */
(function () {
  'use strict';
  var KB = window.SHAMMIM_KB || { cases: [], sectors: {}, home: 'home.html' };
  var CASES = KB.cases;
  var P = KB.profile || {};
  var REAL = CASES.filter(function (c) { return c.ptype && c.ptype !== 'Self-initiated'; });
  var HOME = KB.home || 'home.html';
  var STORE = 'shammim-chat-v1';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- small helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  function norm(s) { return ' ' + String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.+#\s-]/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }
  function has(t, words) { for (var i = 0; i < words.length; i++) { if (t.indexOf(' ' + words[i] + ' ') > -1 || (words[i].length > 5 && t.indexOf(words[i]) > -1)) return true; } return false; }
  function count(t, words) { var n = 0; for (var i = 0; i < words.length; i++) if (t.indexOf(' ' + words[i] + ' ') > -1 || (words[i].length > 6 && t.indexOf(words[i]) > -1)) n++; return n; }
  function load() { try { return JSON.parse(sessionStorage.getItem(STORE)) || { msgs: [], last: null }; } catch (e) { return { msgs: [], last: null }; } }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify({ msgs: state.msgs.slice(-40), last: state.last })); } catch (e) {} }
  var state = load();

  var ICON = {
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    board: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>',
    aid: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>'; }
  function caseUrl(c, tab) { return 'case-' + c.slug + '.html' + (tab ? '#' + tab : ''); }
  function bySlug(s) { for (var i = 0; i < CASES.length; i++) if (CASES[i].slug === s) return CASES[i]; return null; }

  /* ---------- knowledge ---------- */
  var SECTOR_WORDS = {
    ecec: ['early childhood', 'childcare', 'child care', 'ecec', 'kindergarten', 'kinder', 'preschool', 'educator', 'educators', 'toddler', 'toddlers', 'eylf', 'children', 'child', 'daycare'],
    health: ['health', 'healthcare', 'nurse', 'nurses', 'nursing', 'clinical', 'hospital', 'aged care', 'ndis', 'disability', 'medical', 'care', 'patient', 'residential'],
    workplace: ['software', 'excel', 'technology', 'tech', 'microsoft', 'office', 'spreadsheet', 'corporate', 'workplace skills', 'digital skills'],
    emergency: ['emergency services', 'emergency call', 'call taker', 'call-taker', 'call taking', 'dispatch', 'dispatcher', 'triple zero', '000', 'triage', 'police', 'ambulance', 'multi-agency', 'cad'],
    compliance: ['compliance', 'onboarding', 'induction', 'environment', 'environmental', 'field', 'regulatory', 'biosecurity']
  };
  var INTENTS = [
    { id: 'greet', w: ['hi', 'hello', 'hey', 'g day', 'gday', 'good morning', 'good afternoon', 'good evening', 'yo', 'hiya'] },
    { id: 'bot', w: ['are you ai', 'are you a bot', 'are you real', 'who are you', 'what are you', 'chatbot', 'are you human', 'how do you work'] },
    { id: 'role', w: ['your role', 'her role', 'role in', 'role on', 'what did she do', 'what did you do', 'real project', 'real projects', 'real work', 'real client', 'self-initiated', 'self initiated', 'concept project', 'concept', 'fictional', 'solo', 'sme', 'subject matter expert', 'client work', 'genuine', 'who built', 'who made', 'did she build', 'did you build', 'own work'] },
    { id: 'walk', w: ['walkthrough', 'walk through', 'walkthroughs', 'video', 'videos', 'watch', 'screen recording', 'tour'] },
    { id: 'about', w: ['about shammim', 'who is', 'tell me about her', 'tell me about yourself', 'about you', 'background', 'bio', 'experience', 'introduce', 'who is shammim', 'tell me about shammim', 'qualifications', 'education', 'study', 'degree'] },
    { id: 'tools', w: ['tools', 'tool', 'software do', 'articulate', 'storyline', 'rise', 'vyond', 'canva', 'authoring', 'lms', 'scorm', 'xapi', 'moodle', 'canvas', 'html', 'css', 'javascript', 'code', 'coding', 'tech stack', 'skills'] },
    { id: 'process', w: ['process', 'approach', 'methodology', 'how do you design', 'how does she design', 'how do you work', 'addie', 'sam', 'design process', 'steps', 'workflow'] },
    { id: 'services', w: ['services', 'service', 'offer', 'what can you do', 'what does she do', 'help with', 'capabilities', 'workshop', 'facilitation', 'training'] },
    { id: 'portfolio', w: ['portfolio', 'case study', 'case studies', 'projects', 'project', 'work', 'examples', 'example', 'samples', 'courses', 'course list', 'show me', 'what have you', 'best work', 'designed for', 'hiring for', 'built'] },
    { id: 'interface', w: ['interface', 'interfaces', 'ui', 'mockup', 'mockups', 'mock-up', 'mock up', 'figma', 'screens', 'screen design', 'storyboard', 'storyboards', 'story board', 'wireframe', 'prototype', 'look like'] },
    { id: 'jobaid', w: ['job aid', 'job aids', 'jobaid', 'cheat sheet', 'quick reference', 'performance support', 'checklist', 'card', 'printable', 'handout'] },
    { id: 'launch', w: ['launch', 'demo', 'try', 'play', 'open the course', 'see the course', 'view the course', 'live course', 'run it', 'take the course'] },
    { id: 'access', w: ['accessibility', 'accessible', 'wcag', 'screen reader', 'inclusive', 'keyboard', 'captions', 'a11y', 'disability access'] },
    { id: 'ai', w: ['ai', 'artificial intelligence', 'chatgpt', 'claude', 'role-play', 'roleplay', 'role play', 'voice-over', 'voiceover', 'avatar', 'ai tutor', 'generative'] },
    { id: 'assess', w: ['assessment', 'assessments', 'quiz', 'evaluation', 'evaluate', 'kirkpatrick', 'knowledge check', 'test me', 'rubric', 'measure'] },
    { id: 'impact', w: ['impact', 'results', 'metrics', 'outcomes', 'roi', 'success', 'data', 'numbers', 'measurable'] },
    { id: 'standards', w: ['standards', 'standard', 'framework', 'frameworks', 'regulation', 'regulations', 'nqs', 'nqf', 'nsqhs', 'ascia', 'veyldf', 'compliance standards', 'legislation'] },
    { id: 'hire', w: ['available', 'availability', 'hire', 'hiring', 'recruit', 'job', 'role', 'position', 'freelance', 'contract', 'rate', 'rates', 'cost', 'price', 'pricing', 'budget', 'quote', 'full time', 'part time', 'open to'] },
    { id: 'contact', w: ['contact', 'email', 'reach', 'get in touch', 'message her', 'linkedin', 'phone', 'call', 'talk to', 'meet', 'connect'] },
    { id: 'resume', w: ['resume', 'cv', 'curriculum vitae'] },
    { id: 'location', w: ['where are you', 'where is she', 'based', 'location', 'remote', 'onsite', 'on-site', 'hybrid', 'melbourne', 'sydney', 'australia'] },
    { id: 'theme', w: ['dark mode', 'light mode', 'theme', 'dark theme'] },
    { id: 'more', w: ['more', 'tell me more', 'details', 'detail', 'explain', 'go on', 'elaborate'] },
    { id: 'thanks', w: ['thanks', 'thank you', 'cheers', 'ta', 'great', 'awesome', 'perfect', 'cool', 'nice'] },
    { id: 'bye', w: ['bye', 'goodbye', 'see you', 'later', 'that is all', 'thats all'] }
  ];
  var DEFAULT_CHIPS = ['Show me healthcare work', 'Which tools do you use?', 'Show me a walkthrough', 'Are you available?'];

  function detectSector(t) {
    var best = null, bs = 0;
    Object.keys(SECTOR_WORDS).forEach(function (k) { var s = count(t, SECTOR_WORDS[k]); if (s > bs) { bs = s; best = k; } });
    return best;
  }
  function scoreCases(t) {
    return CASES.map(function (c) {
      var s = 0;
      c.keywords.forEach(function (k) { if (t.indexOf(' ' + k + ' ') > -1 || (k.length > 5 && t.indexOf(k) > -1)) s += k.indexOf(' ') > -1 ? 3 : 2; });
      c.title.toLowerCase().split(/[^a-z0-9]+/).forEach(function (w) { if (w.length > 4 && t.indexOf(' ' + w + ' ') > -1) s += 1; });
      return { c: c, s: s };
    }).sort(function (a, b) { return b.s - a.s; });
  }
  function topIntents(t) {
    return INTENTS.map(function (it) { return { id: it.id, s: count(t, it.w) }; }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
  }

  /* ---------- answers ---------- */
  function caseAnswer(c, mode) {
    state.last = c.slug;
    var r = { p: [], links: [], chips: [] };
    if (mode === 'interface') {
      r.p.push('**' + c.title + '** opens with a narrated walkthrough video of the course, with captions built in. It shows the screens and interactions in action.');
      r.links.push({ l: 'Watch the walkthrough', h: caseUrl(c, 'walkthrough'), i: 'play' });
    } else if (mode === 'jobaid') {
      r.p.push('Job aids aren’t shown on this site. The case study for **' + c.title + '** opens with a walkthrough video of the course instead. To see a job aid, ask Shammim.');
      r.links.push({ l: 'Watch the walkthrough', h: caseUrl(c, 'walkthrough'), i: 'play' }, { l: 'Ask Shammim', h: 'contact.html', i: 'mail' });
    } else if (mode === 'launch') {
      r.p.push('You can try **' + c.title + '** yourself. It opens in a new tab and works on desktop, tablet and phone. The walkthrough video on the case study shows it in action first.');
      (c.courses || []).forEach(function (x) { r.links.push({ l: x.l === 'Course' ? 'Try the course' : x.l, h: x.h, i: 'ext' }); });
      r.links.push({ l: 'Watch the walkthrough', h: caseUrl(c, 'walkthrough'), i: 'play' });
    } else if (mode === 'role') {
      r.p.push('**' + c.title + '** is a **' + (c.ptype || 'portfolio project').toLowerCase() + '**.' + (c.ptype === 'Self-initiated' ? ' The organisation and people are fictional, and it hasn’t been through SME review yet.' : ''));
      if (c.role) r.list = Object.keys(c.role).filter(function (k) { return c.role[k]; }).map(function (k) { return '**' + k + ':** ' + c.role[k]; });
      r.links.push({ l: 'Read the case study', h: caseUrl(c), i: 'arrow' });
    } else if (mode === 'more') {
      r.p.push('**How it’s designed:** ' + c.strategy);
      r.p.push('**What learners do:** ' + c.interactions);
      r.links.push({ l: 'Read the case study', h: caseUrl(c), i: 'arrow' });
    } else {
      r.p.push('**' + c.title + '** (' + c.sector + ')');
      r.p.push(c.short);
      var f = [];
      if (c.facts.Audience) f.push('Audience: ' + c.facts.Audience);
      if (c.facts.Format) f.push('Format: ' + c.facts.Format);
      if (c.facts.Structure) f.push('Structure: ' + c.facts.Structure);
      if (c.ptype) f.push('Project type: ' + c.ptype);
      if (c.impact && c.impact.length) f.push('Impact: ' + c.impact.map(function (x) { return x[0] + ' ' + x[1]; }).join('; '));
      r.list = f;
      r.links.push({ l: 'Case study', h: caseUrl(c), i: 'arrow' }, { l: 'Walkthrough video', h: caseUrl(c, 'walkthrough'), i: 'play' });
      if (c.courses && c.courses.length) r.links.push({ l: 'Try the course', h: c.courses[0].h, i: 'ext' });
    }
    r.chips = ['Tell me more', mode === 'interface' ? 'What was her role?' : 'Show the walkthrough', 'Other case studies'];
    return r;
  }
  function listCases(list, intro) {
    state.last = null;
    return {
      p: [intro],
      list: list.map(function (c) { return '**' + c.title + '**: ' + c.short; }),
      links: list.slice(0, 4).map(function (c) { return { l: c.title.split(':')[0], h: caseUrl(c), i: 'arrow' }; }).concat(list.length > 4 ? [{ l: 'All case studies', h: 'portfolio.html', i: 'arrow' }] : []),
      chips: list.slice(0, 3).map(function (c) { return 'Tell me about ' + c.title.split(':')[0]; }).concat(['Which tools do you use?'])
    };
  }

  function answer(q) {
    var t = norm(q);
    var intents = topIntents(t);
    var ids = intents.map(function (x) { return x.id; });
    var top = ids[0] || null;
    var ranked = scoreCases(t);
    var hit = ranked[0] && ranked[0].s >= 2 ? ranked[0].c : null;
    var sector = detectSector(t);
    var last = state.last ? bySlug(state.last) : null;
    var wantsOther = /other case|other project|something else|another/.test(t);

    if (wantsOther) { state.last = null; return listCases(CASES, 'Here are all ' + CASES.length + ' case studies:'); }
    if (/top 3|top three|start here|best work|best projects|short on time/.test(t)) {
      var r3 = listCases(['safeguarding-the-start', 'asthma-management', 'excel-intermediate-advanced'].map(bySlug).filter(Boolean), 'Short on time? Start with these three:');
      r3.links.push({ l: 'Top 3 on the home page', h: KB.home + '#top-3', i: 'arrow' });
      return r3;
    }

    // A specific course named: answer about it, in the mode asked for
    if (hit && (!top || ['portfolio', 'interface', 'walk', 'jobaid', 'launch', 'more', 'about', 'impact', 'assess', 'ai', 'access', 'standards', 'role', 'hire'].indexOf(top) > -1) && !(sector && ranked[1] && ranked[1].s === ranked[0].s)) {
      var mode = ids.indexOf('role') > -1 ? 'role' : (ids.indexOf('interface') > -1 || ids.indexOf('walk') > -1) ? 'interface' : ids.indexOf('jobaid') > -1 ? 'jobaid' : ids.indexOf('launch') > -1 ? 'launch' : (ids.indexOf('more') > -1 && last === hit) ? 'more' : null;
      return caseAnswer(hit, mode);
    }
    // Follow-ups about the case study we were just discussing
    if (last && !hit && !sector && (top === 'interface' || top === 'walk' || top === 'jobaid' || top === 'launch' || top === 'more' || top === 'role')) return caseAnswer(last, top);

    // Sector questions
    if (sector && (!top || ['portfolio', 'hire', 'about', 'more', 'greet'].indexOf(top) > -1 || ids.indexOf('portfolio') > -1)) {
      var list = CASES.filter(function (c) { return c.sectors.indexOf(sector) > -1; });
      var lbl = KB.sectors[sector] ? KB.sectors[sector].label.toLowerCase() : sector;
      var r = listCases(list, 'Yes. Shammim has ' + list.length + ' case ' + (list.length === 1 ? 'study' : 'studies') + ' in ' + lbl + ':');
      r.links.push({ l: 'Filter the portfolio', h: 'portfolio.html#' + sector, i: 'arrow' });
      return r;
    }

    switch (top) {
      case 'greet': return { p: ['Hi! I’m Shammim’s portfolio assistant. I can walk you through her ' + CASES.length + ' case studies, her tools and process, or how to get in touch. What are you looking for?'], chips: DEFAULT_CHIPS };
      case 'bot': return { p: ['I’m a built-in assistant on Shammim’s site. I answer from the content of her portfolio: case studies, walkthrough videos, skills and process. For anything I can’t answer, the contact form goes straight to her.'], links: [{ l: 'Contact Shammim', h: 'contact.html', i: 'mail' }], chips: DEFAULT_CHIPS };
      case 'role': return { p: ['Shammim designed **and** built every project here: analysis, objectives, storyboards, job aids and the course build, working solo.', 'All ' + CASES.length + ' are **workplace projects**, built for an organisation’s internal staff across early childhood, health and care, compliance and workplace technology. She uses an **AI-assisted workflow** for drafting, code and voice-over, and reviews everything that ships.'], links: [{ l: 'All case studies', h: 'portfolio.html', i: 'arrow' }, { l: 'How she uses AI', h: 'process.html#ai-workflow', i: 'arrow' }], chips: ['What was her role on Safeguarding?', 'Show me a walkthrough', 'Are you available?'] };
      case 'walk': {
        var wv = CASES.filter(function (c) { return c.videos && c.videos.length; });
        return { p: ['Short narrated walkthroughs, with captions built in, are on these case studies:'], list: wv.map(function (c) { return '**' + c.title + ':** ' + c.videos.join(', '); }), links: wv.slice(0, 4).map(function (c) { return { l: c.title.split(':')[0], h: caseUrl(c) + '#walkthrough', i: 'play' }; }), chips: ['Show me healthcare work', 'What was her role?'] };
      }
      case 'about': return { p: ['Shammim is a **learning designer and developer** based in **Melbourne**, with a background in **Computer Science and teaching**.', 'She designs practical, scenario-based learning for regulated work (early childhood, aged care, NDIS support, hospital nursing, clinical handover and field compliance) and software courses built on real workplace data. She builds in Articulate 360 and in hand-coded HTML, CSS and JavaScript course templates.'], links: [{ l: 'About Shammim', h: 'about.html', i: 'arrow' }, { l: 'Resume', h: 'resume.html', i: 'arrow' }], chips: ['What makes her different?', 'Show me her work', 'Which tools do you use?'] };
      case 'tools': return { p: ['Her toolkit:'], list: ['**Authoring:** Articulate 360 (Rise and Storyline), custom HTML/CSS/JavaScript course templates', '**Media:** Vyond animation, Canva job aids, AI voice-over and AI presenter video', '**Delivery:** LMS (Canvas, Moodle), SCORM 2004 and xAPI', '**Design:** ADDIE and SAM, Bloom’s taxonomy, learning UX and wireframing, WCAG 2.1 AA'], links: [{ l: 'Skills & Tools', h: 'skills.html', i: 'arrow' }], chips: ['How does she use AI?', 'Show me a software simulation', 'Design process'] };
      case 'process': return { p: ['Her process has five steps, with stakeholder touchpoints throughout:'], list: ['**Understand the challenge**: find the real performance issue', '**Map what success looks like**: actions on the job, not just answers', '**Build with intention**: storyboard, prototype and test early', '**Layer in feedback**: coaching, consequences and debriefs', '**Refine and deliver**: accessibility checks, SCORM/xAPI'], links: [{ l: 'See the process with examples', h: 'process.html', i: 'arrow' }], chips: ['Show me a walkthrough', 'Accessibility', 'Which tools do you use?'] };
      case 'services': return { p: ['Shammim’s capabilities:'], list: ['Instructional design and storyboards', 'eLearning modules, branching scenarios and software simulations', 'Instructor-led and virtual workshops', 'Learning UX, course templates and visual design', 'Assessment and evaluation', 'Job aids and microlearning video scripts'], links: [{ l: 'Capabilities', h: 'services.html', i: 'arrow' }, { l: 'Get in touch', h: 'contact.html', i: 'mail' }], chips: ['Are you available?', 'Show me her work'] };
      case 'portfolio': return listCases(CASES, 'Shammim’s ' + CASES.length + ' case studies. Each one has an Interface tab and a Job Aid tab:');
      case 'interface': return { p: ['Every case study opens with a narrated **walkthrough video** of the course, with captions built in. A few good places to start:'], links: [{ l: 'Care That Counts', h: 'case-care-that-counts-onboarding.html#walkthrough', i: 'play' }, { l: 'ISBAR', h: 'case-clinical-handover-isbar.html#walkthrough', i: 'play' }, { l: 'Excel', h: 'case-excel-intermediate-advanced.html#walkthrough', i: 'play' }], chips: ['What was her role?', 'Design process'] };
      case 'jobaid': return { p: ['Job aids aren’t shown on this site at the moment. Each case study opens with a narrated walkthrough video of the course instead. To see Shammim’s job aids, ask her directly.'], links: [{ l: 'Ask Shammim', h: 'contact.html', i: 'mail' }, { l: 'All case studies', h: 'portfolio.html', i: 'arrow' }], chips: ['Show me a walkthrough', 'Which tools do you use?'] };
      case 'launch': return { p: ['Every course in the portfolio can be tried in the browser. Open a case study and select **Course**, or start with one of these:'], links: [{ l: 'Behind the Behaviour', h: 'courses/behind-the-behaviour.html', i: 'ext' }, { l: 'Clinical Handover with ISBAR', h: 'courses/clinical-handover-isbar.html', i: 'ext' }, { l: 'Safeguarding the Start', h: 'courses/safeguarding-the-start.html', i: 'ext' }, { l: 'All case studies', h: 'portfolio.html', i: 'arrow' }], chips: ['Show me a walkthrough video', 'Show me healthcare work'] };
      case 'access': return { p: ['Accessibility is built in, not bolted on. Courses target **WCAG 2.1 AA**: keyboard navigation (including a keyboard alternative for drag and drop), screen reader support, captions and transcripts, reduced motion, and light and dark themes. Audio is never the only channel. In the supervision scenario, a noise meter and captions carry the same information.'], links: [{ l: 'Environmental Compliance', h: caseUrl(bySlug('environmental-compliance')), i: 'arrow' }, { l: 'ISBAR', h: caseUrl(bySlug('clinical-handover-isbar')), i: 'arrow' }], chips: ['Which tools do you use?', 'Design process'] };
      case 'ai': return { p: ['Shammim works with an **AI-assisted workflow**: AI helps with first drafts, code and voice-over, and she reviews, tests and owns everything that ships. In the courses, AI adds practice, not noise:'], list: ['**AI role-play:** trainees talk an unfamiliar plant through with "Jordan", an AI team leader, and get feedback against each aim (Environmental Compliance)', '**AI registrar call:** a live escalation role-play slot scored against ISBAR criteria (Clinical Handover)', '**AI voice-over and presenter video** in the Microsoft technology series', '**Voiced characters** with per-character pitch and rate in the Asthma courses'], links: [{ l: 'Her AI-assisted workflow', h: 'process.html#ai-workflow', i: 'arrow' }, { l: 'Environmental Compliance', h: caseUrl(bySlug('environmental-compliance'), 'walkthrough'), i: 'play' }], chips: ['Accessibility', 'Show me her work'] };
      case 'assess': return { p: ['Assessment is scenario-based and tied to decisions on the job: branching Test Me simulations, timed simulations, validation on publish in a software simulation, knowledge checks with rationale, and final assessments with an 80% pass mark. Evidence is captured with SCORM and xAPI, and evaluation is aligned to Kirkpatrick’s levels.'], links: [{ l: 'Anaphylaxis simulation', h: caseUrl(bySlug('anaphylaxis-asthma-response'), 'walkthrough'), i: 'play' }], chips: ['Results and impact', 'Design process'] };
      case 'impact': {
        var withImpact = CASES.filter(function (c) { return c.impact && c.impact.length; });
        return { p: ['Shammim doesn’t quote results she can’t back up, so the case studies show the design rather than headline figures. Each course is built to collect evidence once it’s live (SCORM and xAPI tracking, scored assessments). What the work does show:'], list: withImpact.map(function (c) { return '**' + c.title.split(':')[0] + ':** ' + c.impact.map(function (x) { return x[0] + ' ' + x[1]; }).join('; '); }), links: [{ l: 'Portfolio', h: 'portfolio.html', i: 'arrow' }], chips: ['How do you assess learning?', 'Design process'] };
      }
      case 'standards': return { p: ['Standards she has designed to include NQS 2.2.1 and the National Law, the Child Safe Principles, the updated VEYLDF and Victoria’s Child Safe Standards, ASCIA Action Plans and NQF r.136, EYLF V2.0, the Privacy Act 1988, National Asthma Council guidance, NSQHS Standard 6 and WCAG 2.1 AA.'], links: [{ l: 'See where each was applied', h: 'skills.html', i: 'arrow' }], chips: ['Show me healthcare work', 'Show me early childhood work'] };
      case 'hire': return { p: ['Yes. Shammim is looking for a **full-time learning designer and developer role in Melbourne**. She’d be glad to walk you through any project and the decisions behind it. The contact form goes straight to her.'], links: [{ l: 'Contact Shammim', h: 'contact.html', i: 'mail' }, { l: 'Resume', h: 'resume.html', i: 'arrow' }].concat(P.linkedin ? [{ l: 'LinkedIn', h: P.linkedin, i: 'arrow' }] : []), chips: ['What was her role?', 'Show me her top 3 projects'] };
      case 'contact': return { p: ['You can reach Shammim through the contact form. Choose what you’re getting in touch about and add a few details.'], links: [{ l: 'Open the contact form', h: 'contact.html', i: 'mail' }].concat(P.linkedin ? [{ l: 'LinkedIn', h: P.linkedin, i: 'arrow' }] : []), chips: ['Are you available?', 'Resume'] };
      case 'resume': return { p: ['Her resume page has a snapshot of her background, tools and capabilities, with a link to the full PDF or a request for a copy.'], links: [{ l: 'Resume', h: 'resume.html', i: 'arrow' }], chips: ['Are you available?', 'Which tools do you use?'] };
      case 'location': return { p: ['Shammim is based in **Melbourne, Victoria**, and is looking for full-time roles there. Her courses are built around Australian standards and regulation. To talk about hybrid or on-site arrangements, send her a quick message.'], links: [{ l: 'Contact Shammim', h: 'contact.html', i: 'mail' }], chips: ['Are you available?'] };
      case 'theme': return { p: ['Use the moon or sun button at the top of any page to switch between light and dark themes. Your choice is remembered on this device.'], chips: DEFAULT_CHIPS };
      case 'more': if (last) return caseAnswer(last, 'more'); break;
      case 'thanks': return { p: ['You’re welcome! Anything else you’d like to see?'], chips: DEFAULT_CHIPS };
      case 'bye': return { p: ['Thanks for visiting. If you’d like to talk about a role or project, the contact form goes straight to Shammim.'], links: [{ l: 'Contact', h: 'contact.html', i: 'mail' }] };
    }
    if (hit) return caseAnswer(hit, null);
    return { p: ['I’m not sure about that one. I can tell you about Shammim’s case studies, walkthrough videos, tools, process or availability. Or send her your question directly.'], links: [{ l: 'Ask Shammim', h: 'contact.html', i: 'mail' }], chips: DEFAULT_CHIPS };
  }

  /* ---------- UI ---------- */
  var launcher, panel, log, input, sugg, lastFocus;
  function build() {
    launcher = document.createElement('button');
    launcher.className = 'ai-launch'; launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-controls', 'ai-panel');
    launcher.innerHTML = '<img src="assets/img/designer-laptop.webp" alt="" width="38" height="38"><span>Ask<span class="lbl-long"> my assistant</span><span class="lbl-short" aria-hidden="true"> me</span></span><span class="pulse" aria-hidden="true"></span>';
    panel = document.createElement('section');
    panel.className = 'ai-panel'; panel.id = 'ai-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Shammim’s portfolio assistant');
    panel.innerHTML =
      '<div class="ai-head"><img src="assets/img/designer-laptop.webp" alt="" width="42" height="42"><div><b>Shammim’s assistant</b><small><i></i>Answers about her work, instantly</small></div>' +
      '<button class="icon-btn" type="button" data-reset aria-label="Start a new conversation">' + svg('reset') + '</button>' +
      '<button class="icon-btn" type="button" data-close aria-label="Close assistant">' + svg('x') + '</button></div>' +
      '<div class="ai-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="ai-suggest" aria-label="Suggested questions"></div>' +
      '<form class="ai-form"><label class="sr-only" for="ai-input">Ask a question</label><input id="ai-input" type="text" autocomplete="off" maxlength="300" placeholder="Ask about her work…"><button type="submit" aria-label="Send">' + svg('send') + '</button></form>' +
      '<p class="ai-foot">A built-in assistant that answers from this portfolio.</p>';
    document.body.appendChild(launcher); document.body.appendChild(panel);
    log = panel.querySelector('.ai-log'); input = panel.querySelector('input'); sugg = panel.querySelector('.ai-suggest');
    launcher.addEventListener('click', function () { open(); });
    panel.querySelector('[data-close]').addEventListener('click', close);
    panel.querySelector('[data-reset]').addEventListener('click', function () { state = { msgs: [], last: null }; save(); log.innerHTML = ''; greet(); input.focus(); });
    panel.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); var v = input.value.trim(); if (v) { input.value = ''; ask(v); } });
    sugg.addEventListener('click', function (e) { var c = e.target.closest('.chip'); if (c) ask(c.textContent); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    // restore
    if (state.msgs.length) { state.msgs.forEach(function (m) { render(m, false); }); chips(state.msgs[state.msgs.length - 1].r && state.msgs[state.msgs.length - 1].r.chips); }
  }
  function open(q) {
    lastFocus = document.activeElement;
    panel.hidden = false; launcher.setAttribute('aria-expanded', 'true');
    if (!state.msgs.length) greet();
    log.scrollTop = log.scrollHeight;
    if (q) ask(q); else setTimeout(function () { input.focus(); }, 30);
  }
  function close() { panel.hidden = true; launcher.setAttribute('aria-expanded', 'false'); (lastFocus && lastFocus.focus ? lastFocus : launcher).focus(); }
  function greet() {
    var r = { p: ['Hi! I’m Shammim’s portfolio assistant. Ask me about her case studies, walkthrough videos, tools or availability.'], chips: DEFAULT_CHIPS };
    push({ who: 'bot', r: r });
  }
  function chips(list) {
    sugg.innerHTML = (list || DEFAULT_CHIPS).map(function (c) { return '<button class="chip" type="button">' + esc(c) + '</button>'; }).join('');
  }
  function render(m, scroll) {
    var d = document.createElement('div');
    d.className = 'msg ' + (m.who === 'user' ? 'user' : 'bot');
    if (m.who === 'user') d.textContent = m.text;
    else {
      var r = m.r, h = '';
      (r.p || []).forEach(function (p) { h += '<p>' + fmt(p) + '</p>'; });
      if (r.list && r.list.length) h += '<ul>' + r.list.map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>';
      if (r.links && r.links.length) h += '<div class="msg-links">' + r.links.map(function (l) { return '<a href="' + esc(l.h) + '"' + (/^courses\//.test(l.h) ? ' target="_blank" rel="noopener"' : '') + '>' + svg(l.i || 'arrow') + esc(l.l) + '</a>'; }).join('') + '</div>';
      d.innerHTML = h;
    }
    log.appendChild(d);
    if (scroll !== false) log.scrollTop = log.scrollHeight;
  }
  function push(m) { state.msgs.push(m); save(); render(m); if (m.who === 'bot') chips(m.r.chips); }
  function ask(q) {
    push({ who: 'user', text: q });
    var t = document.createElement('div'); t.className = 'msg bot typing'; t.setAttribute('aria-label', 'Assistant is typing'); t.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t); log.scrollTop = log.scrollHeight;
    var r = answer(q);
    var delay = reduce ? 120 : 380 + Math.min(((r.p || []).join(' ').length) * 3, 700);
    setTimeout(function () { t.remove(); push({ who: 'bot', r: r }); }, delay);
  }

  function init() {
    build();
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ask]'); if (!b) return;
      e.preventDefault(); open(b.getAttribute('data-ask') || '');
    });
    document.querySelectorAll('[data-ask-form]').forEach(function (f) {
      f.addEventListener('submit', function (e) { e.preventDefault(); var i = f.querySelector('input'); var v = i.value.trim(); i.value = ''; open(v); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
