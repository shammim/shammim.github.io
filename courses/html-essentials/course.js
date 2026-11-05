/* HTML Essentials: Interactive Microlearning Module — Rise-style, Shammim Design System (Mint lagoon).
   5 units of 5–7 minutes + final quiz. Australian English. WCAG 2.1 AA.
   Each unit: one idea → worked example → live sandbox → scenario-based check → coding task with instant feedback.
   Block types as in the Word module, plus: code (read-only example), sandbox (live editor + preview), codetask (graded). */
(function () {
  /* ---- helpers for code-task checks: each test gets (doc, src) where doc is the parsed learner page ---- */
  const $ = (d, s) => d.querySelector(s), $$ = (d, s) => [...d.querySelectorAll(s)];
  const txt = el => (el && el.textContent || '').replace(/\s+/g, ' ').trim();
  const labelled = (d, el) => {
    if (el.getAttribute('aria-label')) return true;
    if (el.closest('label') && txt(el.closest('label'))) return true;
    const id = el.getAttribute('id'); if (!id) return false;
    const l = $$(d, 'label').find(x => x.getAttribute('for') === id); return !!(l && txt(l));
  };
  const VAGUE = ['click here', 'here', 'read more', 'more', 'link', 'this link', 'click this', 'learn more'];

  window.COURSE = {
    id: 'shammim-html-essentials-v1',
    title: 'HTML Essentials',
    kicker: 'Tech Skills · Interactive microlearning',
    brand: 'Tech Skills · Web foundations',
    unit: 'Unit',
    desc: 'Learn the core of HTML5 one idea at a time. Five short units, each with a live code sandbox, a workplace scenario and a coding task that checks your work instantly.',
    about: 'For beginners who need to read, write or fix web pages at work, such as content editors, marketers, designers and new developers. No experience needed.',
    features: ['5 units of 5–7 minutes: one idea at a time', 'Live code sandbox in every unit', 'Coding tasks with instant feedback', 'Scenario-based checks and a final quiz (80% to pass)', 'AI voice-over with transcripts', 'Reference guide, job aids and practice files', 'Keyboard accessible, built to WCAG 2.1 AA'],
    restricted: true,
    cover: { image: 'media/img/cover.webp', w: 1200, h: 750 },
    resources: [
      { title: 'Practice files', desc: 'Starter code for every unit, sample images and finished solutions to compare with. Opens in a new tab.', url: 'media/files/practice-files.html' },
      { title: 'HTML5 quick reference guide', desc: 'The elements and attributes from this module on two pages, with examples.', download: 'media/files/HTML5-Quick-Reference.pdf', file: 'HTML5-Quick-Reference.pdf', meta: 'PDF, 2 pages' },
      { title: 'Job aids 1–5', desc: 'One-page checklists: page skeleton, semantic structure, links and images, tables, accessible forms.', download: 'media/files/HTML-Essentials-Job-Aids.pdf', file: 'HTML-Essentials-Job-Aids.pdf', meta: 'PDF, 5 pages' },
      { title: 'MDN: HTML elements reference', desc: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element' },
      { title: 'web.dev: Learn HTML', desc: 'Google web.dev course', url: 'https://web.dev/learn/html' },
      { title: 'An alt decision tree', desc: 'W3C Web Accessibility Initiative', url: 'https://www.w3.org/WAI/tutorials/images/decision-tree/' },
      { title: 'Web Content Accessibility Guidelines (WCAG) 2.1', desc: 'W3C Recommendation', url: 'https://www.w3.org/TR/WCAG21/' },
      { title: 'W3C Markup Validation Service', desc: 'Check any HTML page for errors', url: 'https://validator.w3.org/' }
    ],
    lessons: [
      /* ================= Unit 1 ================= */
      { id: 'u1', title: 'The anatomy of a web page', min: 6, blocks: [
        { t: 'audio', vo: 'u1' },
        { t: 'statement', style: 'b', text: 'Every web page is a plain text file. **HTML** gives that text structure and meaning, so browsers, search engines and screen readers know what each part is.' },
        { t: 'text', heading: 'One idea at a time', paras: ['Learning HTML can feel like learning a new alphabet and a new grammar at once. This module takes them one at a time. Each unit covers **one idea**: you see an example, try it in a live sandbox, then show what you can do in a short coding task.'] },
        { t: 'note', tone: 'info', title: 'How the code sandboxes work', text: 'Type in the editor and the preview updates as you go. In the editor, [[Tab]] moves to the next control so you never get stuck; press [[Enter]] and the new line keeps your indent. Scripts are switched off in the preview, so nothing you type can harm your computer.' },
        { t: 'continue' },
        { t: 'tabs', heading: 'Elements, tags and attributes', intro: 'Four words you’ll hear all the time. Select each tab.', items: [
          { title: 'Element', text: ['An **element** is one piece of the page, such as a heading or a paragraph. Most elements have an opening tag, some content and a closing tag.'], bullets: ['`<p>Welcome to the team.</p>` is a paragraph element'] },
          { title: 'Tag', text: ['A **tag** is the label in angle brackets. The closing tag has a forward slash.'], bullets: ['Opening tag: `<h1>`', 'Closing tag: `</h1>`', 'Some elements have no closing tag, such as `<img>` and `<meta>`'] },
          { title: 'Attribute', text: ['An **attribute** adds information to an element. It goes inside the opening tag, as a name and a value in quotes.'], bullets: ['`<html lang="en-AU">`: the page is in Australian English', '`<a href="https://example.com">`: where the link goes'] },
          { title: 'Nesting', text: ['Elements sit inside other elements, like boxes in boxes. Close them in the reverse order you opened them.'], bullets: ['Right: `<p>Read <strong>this</strong> first.</p>`', 'Wrong: `<p>Read <strong>this</p></strong>`'] }
        ] },
        { t: 'code', heading: 'A complete, minimal web page', caption: 'Every page you build starts from this skeleton.', src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Staff portal – Welcome</title>
  </head>
  <body>
    <h1>Welcome to the staff portal</h1>
    <p>Find policies, forms and news in one place.</p>
  </body>
</html>` },
        { t: 'accordion', heading: 'What each line does', items: [
          { title: '<!doctype html>', text: 'Tells the browser this is a modern HTML5 page. Always the very first line.' },
          { title: '<html lang="en-AU">', text: 'Wraps the whole page. The `lang` attribute tells screen readers which language and accent to use, and helps translation tools.' },
          { title: '<head>', text: 'Information **about** the page that isn’t shown in it: character set, title, links to styles.' },
          { title: '<meta charset="utf-8">', text: 'Makes characters such as apostrophes, accents and the dash display correctly. Without it, you might see `â€™` instead of `’`.' },
          { title: '<meta name="viewport">', text: 'Makes the page fit phone screens instead of showing a tiny desktop version.' },
          { title: '<title>', text: 'The name in the browser tab, bookmarks and search results. Screen readers read it first, so make it describe the page.' },
          { title: '<body>', text: 'Everything people see on the page goes here.' }
        ] },
        { t: 'continue' },
        { t: 'sandbox', wide: true, heading: 'Try it: edit a real page', intro: 'Change the code and watch the preview.', tries: ['Change the text inside `<h1>`', 'Add a second paragraph with `<p>` and `</p>`', 'Make one word important with `<strong>`'], src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Staff portal – Welcome</title>
  </head>
  <body>
    <h1>Welcome to the staff portal</h1>
    <p>Find policies, forms and news in one place.</p>
  </body>
</html>` },
        { t: 'continue' },
        { t: 'kc', kind: 'mr', label: 'Scenario check', ctx: '**Scenario:** Mia in Communications has published a new page. The browser tab just says “index.html”, and the apostrophes show as `â€™`.', q: 'Which two lines are missing from her page?', options: ['`<meta charset="utf-8">`', '`<title>…</title>`', '`<html lang="en-AU">`', '`<meta name="viewport" …>`'], correct: [0, 1], fb: { ok: 'Yes. The **title** names the tab, and the **character set** makes apostrophes display properly. Both belong in the `<head>`.', no: 'Look at the two symptoms. The tab name comes from `<title>`, and broken apostrophes mean the browser doesn’t know the character set: `<meta charset="utf-8">`.' } },
        { t: 'codetask', wide: true, heading: 'Coding task: build the page skeleton', brief: 'Mia’s page only has body content. Turn it into a complete HTML5 page.', steps: ['Start with the doctype', 'Wrap everything in `<html>` with `lang="en-AU"`', 'Add a `<head>` with the character set and a title', 'Keep one `<h1>` and the paragraph inside `<body>`'],
          src: `<h1>Leave policy update</h1>
<p>From 1 July, you can request leave through the staff portal.</p>
`,
          solution: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Leave policy update – Staff portal</title>
  </head>
  <body>
    <h1>Leave policy update</h1>
    <p>From 1 July, you can request leave through the staff portal.</p>
  </body>
</html>
`,
          checks: [
            { label: 'Starts with <!doctype html>', hint: 'Type `<!doctype html>` on the very first line, before anything else.', test: (d, s) => /^\s*<!doctype html>/i.test(s) },
            { label: '<html> has lang="en-AU"', hint: 'Open the page with `<html lang="en-AU">` and close it with `</html>` at the end.', test: (d, s) => /<html[^>]*\slang\s*=\s*["']?en-AU/i.test(s) },
            { label: 'Character set is UTF-8', hint: 'Inside `<head>`, add `<meta charset="utf-8">`.', test: d => /utf-?8/i.test(($(d, 'meta[charset]') || { getAttribute: () => '' }).getAttribute('charset')) },
            { label: 'The page has a descriptive title', hint: 'Inside `<head>`, add `<title>` with a few words that describe the page, then `</title>`.', test: d => d.title.trim().length >= 5 },
            { label: 'One <h1> and the paragraph are in the body', hint: 'Keep exactly one `<h1>` and the `<p>` between `<body>` and `</body>`.', test: (d, s) => /<body[\s>]/i.test(s) && $$(d, 'body h1').length === 1 && !!$(d, 'body p') }
          ] },
        { t: 'continue', gate: true },
        { t: 'list', heading: 'Key points', style: 'check', items: ['Every page starts with `<!doctype html>` and an `<html>` element with a `lang` attribute', 'The `<head>` holds information about the page: character set, viewport and title', 'The `<body>` holds everything people see', 'Close elements in the reverse order you opened them'] }
      ] },

      /* ================= Unit 2 ================= */
      { id: 'u2', title: 'Headings, text and semantic structure', min: 6, blocks: [
        { t: 'audio', vo: 'u2' },
        { t: 'statement', style: 'a', text: 'Choose an element for what the content **is**, not for how you want it to **look**. Looks are the job of CSS.' },
        { t: 'text', heading: 'Why meaning matters', paras: ['To you, big bold text looks like a heading. To a screen reader or a search engine, it’s just text, unless you mark it up as a heading.', 'Many screen reader users move around a page by jumping from heading to heading, or from one region to the next. Good structure lets them skim, just like you do with your eyes.'] },
        { t: 'flashcards', heading: 'Text elements to know', intro: 'Flip each card.', cards: [
          { front: '<h1> to <h6>', back: 'Headings, from most to least important. Use **one** `<h1>` for the page topic, then `<h2>` for sections and `<h3>` inside them. Don’t skip levels.' },
          { front: '<p>', back: 'A paragraph. Don’t use empty paragraphs or `<br>` to add space; use CSS.' },
          { front: '<strong> vs <b>', back: '`<strong>` means **important** and some screen readers stress it. `<b>` is only bold-looking text with no extra meaning.' },
          { front: '<em> vs <i>', back: '`<em>` adds **emphasis**, changing how a sentence is read. `<i>` is for things like a book title or a term from another language.' }
        ] },
        { t: 'continue', gate: true },
        { t: 'table', heading: 'Landmarks: the regions of a page', intro: 'Landmark elements label the main regions, so people can jump straight to them.', cols: ['Element', 'Use it for', 'Screen readers call it'], caption: 'Landmark elements, what they are for and how screen readers announce them', rows: [
          ['`<header>`', 'Site name, logo, search', 'Banner'],
          ['`<nav>`', 'Main menu or a group of links', 'Navigation'],
          ['`<main>`', 'The main content. One per page', 'Main'],
          ['`<aside>`', 'Related content beside the main topic', 'Complementary'],
          ['`<footer>`', 'Contact details, copyright, policies', 'Content information'],
          ['`<section>`, `<article>`', 'A themed group with its own heading; a stand-alone item such as a news story', 'Region or article']
        ] },
        { t: 'sandbox', wide: true, outline: true, heading: 'Try it: from “div soup” to structure', intro: 'This page is built with plain `<div>` elements, so the outline next to the preview is almost empty.', tries: ['Change the first `<div>` to `<header>` (and its closing tag)', 'Change the others to `<nav>`, `<main>` and `<footer>`', 'Make “Upcoming training” an `<h2>` and watch the outline'], src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Staff news</title>
  </head>
  <body>
    <div>
      <h1>Staff news</h1>
    </div>
    <div>
      <a href="#">Home</a> | <a href="#">Policies</a>
    </div>
    <div>
      <p><b>Upcoming training</b></p>
      <p>HTML Essentials runs every Tuesday in March.</p>
    </div>
    <div>
      <p>© 2026 Shammim</p>
    </div>
  </body>
</html>` },
        { t: 'note', tone: 'tip', title: 'Notice the preview barely changed?', text: 'That’s the point. Semantic elements change what the page **means**, not how it looks. The outline shows what assistive technology now understands.' },
        { t: 'continue' },
        { t: 'sort', heading: 'HTML or CSS?', intro: 'Is each job for an HTML element, or for CSS styling?', piles: ['HTML element', 'CSS styling'], cards: [
          { text: 'Mark the main content of the page', pile: 0, why: 'Use `<main>`.' },
          { text: 'Make all headings teal', pile: 1, why: 'Colour is presentation.' },
          { text: 'Show a new section with its own title', pile: 0, why: 'Use `<h2>` for the section heading.' },
          { text: 'Add space between paragraphs', pile: 1, why: 'Use CSS margin, not empty paragraphs or `<br>`.' },
          { text: 'Stress a warning word', pile: 0, why: 'Use `<strong>`.' },
          { text: 'Centre the logo', pile: 1, why: 'Layout is CSS.' }
        ] },
        { t: 'continue', gate: true },
        { t: 'kc', kind: 'mc', label: 'Scenario check', ctx: '**Scenario:** Alex is building the team news page. He used `<h1>` for the page title, then jumped to `<h4>` for each story because `<h2>` “looked too big”.', q: 'What should Alex do?', options: ['Use `<h2>` for each story and change its size with CSS', 'Keep `<h4>`; heading levels don’t matter', 'Use bold paragraphs instead of headings', 'Make every heading an `<h1>`'], correct: 0, fb: { ok: 'Right. Heading levels describe the outline of the page. Pick the correct level, then style it with CSS.', no: 'Skipped levels make the outline confusing for screen reader users. Use `<h2>` for the stories and adjust the size with CSS.' } },
        { t: 'codetask', wide: true, outline: true, heading: 'Coding task: structure the news page', brief: 'Give this page landmarks and a proper heading outline.', steps: ['Put the site title in a `<header>` as the `<h1>`', 'Put both stories in `<main>`, each with an `<h2>`', 'Put the copyright line in a `<footer>`', 'Mark “Entries close Friday” as important with `<strong>`'],
          src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Team news</title>
  </head>
  <body>
    <div><b>Team news</b></div>
    <div>
      <p><b>New starter: Priya</b></p>
      <p>Priya joins the web team on Monday.</p>
      <p><b>Photo competition</b></p>
      <p>Send us your best workplace photo. Entries close Friday.</p>
    </div>
    <div>© 2026 Shammim</div>
  </body>
</html>
`,
          solution: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Team news</title>
  </head>
  <body>
    <header>
      <h1>Team news</h1>
    </header>
    <main>
      <h2>New starter: Priya</h2>
      <p>Priya joins the web team on Monday.</p>
      <h2>Photo competition</h2>
      <p>Send us your best workplace photo. <strong>Entries close Friday.</strong></p>
    </main>
    <footer>© 2026 Shammim</footer>
  </body>
</html>
`,
          checks: [
            { label: 'A <header> holds the one <h1>', hint: 'Wrap the site title in `<header>` and change `<b>Team news</b>` to `<h1>Team news</h1>`.', test: d => $$(d, 'h1').length === 1 && !!$(d, 'header h1') },
            { label: 'The stories are inside <main>', hint: 'Change the middle `<div>` to `<main>` (and its closing tag to `</main>`).', test: d => $$(d, 'main').length === 1 && txt($(d, 'main')).includes('Priya joins') },
            { label: 'Each story has an <h2>', hint: 'Replace each `<p><b>…</b></p>` story title with `<h2>…</h2>`.', test: d => $$(d, 'main h2').length >= 2 },
            { label: 'No skipped heading levels', hint: 'Go from `<h1>` to `<h2>`. Don’t jump to `<h3>` or `<h4>`.', test: d => { let last = 0; return $$(d, 'h1,h2,h3,h4,h5,h6').every(h => { const n = +h.tagName[1]; const ok = n <= last + 1; last = n; return ok; }); } },
            { label: 'The copyright line is in a <footer>', hint: 'Change the last `<div>` to `<footer>`.', test: d => txt($(d, 'footer')).includes('2026') },
            { label: '“Entries close Friday” uses <strong>', hint: 'Wrap the words in `<strong>` and `</strong>`.', test: d => $$(d, 'strong').some(s => /close friday/i.test(txt(s))) }
          ] },
        { t: 'continue', gate: true },
        { t: 'list', heading: 'Key points', style: 'check', items: ['Use one `<h1>`, then `<h2>` and `<h3>` in order: never skip levels', 'Use `<header>`, `<nav>`, `<main>` and `<footer>` to mark the regions of a page', 'Use `<strong>` and `<em>` for meaning; use CSS for size, colour and spacing'] }
      ] },

      /* ================= Unit 3 ================= */
      { id: 'u3', title: 'Links and images', min: 6, blocks: [
        { t: 'audio', vo: 'u3' },
        { t: 'statement', style: 'b', text: 'Links connect the web. Images bring it to life. Both need **words** to work for everyone.' },
        { t: 'code', heading: 'The anatomy of a link', caption: 'The href attribute says where the link goes; the words between the tags are the link text.', src: `<a href="https://www.w3.org/WAI/">Web Accessibility Initiative</a>` },
        { t: 'tabs', heading: 'Where can a link go?', items: [
          { title: 'Another site', text: 'Use the full (**absolute**) address, starting with `https://`.', bullets: ['`<a href="https://web.dev/learn/html">Learn HTML on web.dev</a>`'] },
          { title: 'Your own site', text: 'Use a **relative** path from the current page.', bullets: ['`<a href="policies/leave.html">Leave policy</a>`', '`<a href="../index.html">Home</a>` goes up one folder'] },
          { title: 'Same page', text: 'Link to an element’s `id` with a hash.', bullets: ['`<a href="#contact">Contact us</a>` jumps to `<h2 id="contact">`'] },
          { title: 'Email', text: 'Start the address with `mailto:`. Show the email address in the link text, so people know what will happen.', bullets: ['`<a href="mailto:web@example.com">web@example.com</a>`'] }
        ] },
        { t: 'note', tone: 'warn', title: 'Avoid “click here”', text: 'Screen reader users often pull up a list of every link on the page. Ten links called “click here” tell them nothing. Make the link text describe where it goes: “Download the 2026 leave policy (PDF)”.' },
        { t: 'continue' },
        { t: 'code', heading: 'The anatomy of an image', caption: 'img has no closing tag. alt is the text alternative; width and height stop the page jumping while the image loads.', src: `<img src="images/team-photo.jpg"
     alt="The web team standing outside the Melbourne office"
     width="800" height="533">` },
        { t: 'accordion', heading: 'Writing alt text: a quick decision guide', intro: 'Open each type of image.', items: [
          { title: 'Informative photo or illustration', text: 'Describe what matters in this context, in a short sentence. Don’t start with “Image of”: screen readers already say it’s an image.' },
          { title: 'Image inside a link or button', text: 'Describe where it goes or what it does, such as `alt="Shammim home page"` for a linked logo.' },
          { title: 'Decorative image', text: 'Use an empty alt, `alt=""`, so screen readers skip it. Leaving `alt` out completely is **not** the same: some screen readers read the file name instead.' },
          { title: 'Chart or diagram', text: 'Give a short alt with the key message, and put the full detail in the text or a table nearby.' },
          { title: 'Image of text', text: 'Use real text instead where you can. If you must use the image, the alt repeats the words.' }
        ] },
        { t: 'sandbox', wide: true, heading: 'Try it: links and alt text', intro: 'The photo file isn’t in the sandbox, so the browser shows the alt text instead. That’s what people get when an image doesn’t load, and close to what a screen reader announces.', tries: ['Change the alt text and watch the preview', 'Delete `alt="…"` completely and see what shows', 'Change the link text from “Click here” to something descriptive'], src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Meet the web team</title>
  </head>
  <body>
    <h1>Meet the web team</h1>
    <img src="images/team-photo.jpg" alt="Five members of the web team smiling outside the Melbourne office" width="400" height="260">
    <p>Want to work with us? <a href="https://example.com/careers">Click here</a>.</p>
  </body>
</html>` },
        { t: 'continue' },
        { t: 'kc', kind: 'mc', label: 'Scenario check', ctx: '**Scenario:** Your manager asks you to add a link to the new leave policy, a PDF, on the intranet home page.', q: 'Which link is best?', options: ['`<a href="leave-2026.pdf">Click here</a> for the leave policy`', '`<a href="leave-2026.pdf">Leave policy 2026 (PDF, 2 pages)</a>`', '`<a href="leave-2026.pdf">leave-2026.pdf</a>`', '`<a href="leave-2026.pdf">Read more</a>`'], correct: 1, fb: { ok: 'Yes. The link text makes sense on its own and warns people it opens a PDF.', no: 'Link text should make sense out of context. “Leave policy 2026 (PDF, 2 pages)” says where the link goes and what to expect.' } },
        { t: 'codetask', wide: true, heading: 'Coding task: fix the careers page', brief: 'This page has a vague link and two images without alt text. Fix them.', steps: ['Change the link text to describe where it goes (not “click here”)', 'Make the link go to `https://example.com/careers`', 'Give the team photo a meaningful `alt`', 'The divider line is decorative: give it an empty alt, `alt=""`', 'Give the photo `width` and `height` attributes'],
          src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Careers – Shammim</title>
  </head>
  <body>
    <h1>Work with us</h1>
    <img src="images/team-photo.jpg">
    <img src="images/divider.svg">
    <p>We’re hiring a content designer. <a href="">Click here</a>.</p>
  </body>
</html>
`,
          solution: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Careers – Shammim</title>
  </head>
  <body>
    <h1>Work with us</h1>
    <img src="images/team-photo.jpg" alt="Five members of the web team standing together" width="800" height="533">
    <img src="images/divider.svg" alt="">
    <p>We’re hiring a content designer. <a href="https://example.com/careers">See current jobs at Shammim</a>.</p>
  </body>
</html>
`,
          checks: [
            { label: 'The link goes to https://example.com/careers', hint: 'Put the address in the `href`: `<a href="https://example.com/careers">`.', test: d => $$(d, 'a[href]').some(a => /^https:\/\/example\.com\/careers\/?$/i.test(a.getAttribute('href').trim())) },
            { label: 'The link text describes where it goes', hint: 'Replace “Click here” with words such as “See current jobs at Shammim”.', test: d => { const a = $(d, 'a'); const t = txt(a).toLowerCase().replace(/[.!]$/, ''); return !!a && t.length >= 8 && !VAGUE.includes(t); } },
            { label: 'The team photo has meaningful alt text', hint: 'Add `alt="…"` to the team photo with a short description, without “image of”.', test: d => { const i = $(d, 'img[src*="team"]'); const a = i && (i.getAttribute('alt') || '').trim(); return !!a && a.length >= 10 && !/^(image|picture|photo) of/i.test(a) && !/\.(jpe?g|png)$/i.test(a); } },
            { label: 'The decorative divider has alt=""', hint: 'Add an empty alt to the divider: `<img src="images/divider.svg" alt="">`.', test: d => { const i = $(d, 'img[src*="divider"]'); return !!i && i.hasAttribute('alt') && i.getAttribute('alt').trim() === ''; } },
            { label: 'The photo has width and height', hint: 'Add `width="800" height="533"` to the team photo.', test: d => { const i = $(d, 'img[src*="team"]'); return !!i && +i.getAttribute('width') > 0 && +i.getAttribute('height') > 0; } }
          ] },
        { t: 'continue', gate: true },
        { t: 'list', heading: 'Key points', style: 'check', items: ['Use absolute URLs for other sites and relative paths for your own', 'Write link text that makes sense on its own, and say when a link opens a file', 'Give informative images meaningful alt text and decorative images `alt=""`', 'Add `width` and `height` so the page doesn’t jump while images load'] }
      ] },

      /* ================= Unit 4 ================= */
      { id: 'u4', title: 'Lists and tables', min: 6, blocks: [
        { t: 'audio', vo: 'u4' },
        { t: 'statement', style: 'a', text: 'Lists group related items. Tables show **data** in rows and columns. Neither should be used just for layout.' },
        { t: 'tabs', heading: 'Three kinds of list', items: [
          { title: 'Unordered', text: 'Use `<ul>` when the order doesn’t matter. Each item is an `<li>`.', bullets: ['`<ul><li>Laptop</li><li>Pass</li><li>Login details</li></ul>`'] },
          { title: 'Ordered', text: 'Use `<ol>` when order matters, such as steps. The browser numbers it for you.', bullets: ['`<ol><li>Log in</li><li>Open Leave</li><li>Submit</li></ol>`'] },
          { title: 'Nested', text: 'Put a whole new `<ul>` or `<ol>` **inside** an `<li>`, before its closing tag.', bullets: ['`<li>Forms<ul><li>Leave</li></ul></li>`'] },
          { title: 'Description', text: 'Use `<dl>` for terms and their descriptions, such as a glossary: `<dt>` for the term, `<dd>` for the description.' }
        ] },
        { t: 'note', tone: 'info', title: 'Why use real lists?', text: 'Screen readers announce “list, 3 items”, so people know how much is coming. Lines that just start with a dash don’t get that.' },
        { t: 'continue' },
        { t: 'process', heading: 'Build an accessible data table', intro: { title: 'Five parts of a good table', text: 'Step through how a table is put together. Each part helps someone understand the data.' }, steps: [
          { title: 'Start with <table>', text: 'Use a table only for data with rows and columns, never to lay out a page.' },
          { title: 'Add a <caption>', text: 'The caption is the table’s title. It’s announced when someone reaches the table.', code: '<table>\n  <caption>Training sessions, March</caption>' },
          { title: 'Group the header row in <thead>', text: 'Header cells use `<th>`, not `<td>`. Add `scope="col"` to say each one labels a column.', code: '<thead><tr><th scope="col">Session</th><th scope="col">Date</th></tr></thead>' },
          { title: 'Put the data in <tbody>', text: 'Each row is a `<tr>`. Data cells are `<td>`.' },
          { title: 'Label each row', text: 'If the first cell names the row, make it `<th scope="row">`. Now every cell can be read with both its row and column header.', code: '<tr><th scope="row">HTML Essentials</th><td>4 March</td></tr>' }
        ], summary: { title: 'Caption, headers, scope', text: 'With a caption and header cells, a screen reader can say “Date, HTML Essentials, 4 March” instead of just “4 March”.' } },
        { t: 'sandbox', wide: true, heading: 'Try it: improve the table', intro: 'This table has no caption and no header cells.', tries: ['Add `<caption>Training sessions, March</caption>` after `<table>`', 'Change the cells in the first row from `<td>` to `<th scope="col">`', 'Change each session name to `<th scope="row">`'], src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Training sessions</title>
    <style>table{border-collapse:collapse}th,td{border:1px solid #6F8C87;padding:6px 10px;text-align:left}caption{font-weight:bold;text-align:left;padding-bottom:6px}</style>
  </head>
  <body>
    <table>
      <tr><td>Session</td><td>Date</td><td>Room</td></tr>
      <tr><td>HTML Essentials</td><td>4 March</td><td>Yarra</td></tr>
      <tr><td>Writing for the web</td><td>11 March</td><td>Birrarung</td></tr>
    </table>
  </body>
</html>` },
        { t: 'continue' },
        { t: 'kc', kind: 'mc', label: 'Scenario check', ctx: '**Scenario:** Priya pasted the team roster into a web page. A colleague who uses a screen reader says she hears “Monday… 9 am… Sam” with no idea what each value means.', q: 'What’s most likely missing?', options: ['Header cells (`<th>` with `scope`) and a caption', 'A border around every cell', 'An ordered list inside each cell', 'Bold text in the first row'], correct: 0, fb: { ok: 'Exactly. Header cells give every value its context, and the caption names the table.', no: 'Visual styling doesn’t help a screen reader. The table needs `<th>` header cells with `scope` and a `<caption>` so each value is read with its headers.' } },
        { t: 'codetask', wide: true, heading: 'Coding task: make the roster accessible', brief: 'Turn Priya’s roster into an accessible data table.', steps: ['Add a `<caption>` that names the table', 'Put the header row in `<thead>` with `<th scope="col">` cells', 'Put the other rows in `<tbody>`', 'Make each day a row header: `<th scope="row">`'],
          src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Help desk roster</title>
    <style>table{border-collapse:collapse}th,td{border:1px solid #6F8C87;padding:6px 10px;text-align:left}caption{font-weight:bold;text-align:left;padding-bottom:6px}</style>
  </head>
  <body>
    <h1>Help desk roster</h1>
    <table>
      <tr><td>Day</td><td>Morning</td><td>Afternoon</td></tr>
      <tr><td>Monday</td><td>Sam</td><td>Priya</td></tr>
      <tr><td>Tuesday</td><td>Alex</td><td>Mei</td></tr>
      <tr><td>Wednesday</td><td>Priya</td><td>Sam</td></tr>
    </table>
  </body>
</html>
`,
          solution: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Help desk roster</title>
    <style>table{border-collapse:collapse}th,td{border:1px solid #6F8C87;padding:6px 10px;text-align:left}caption{font-weight:bold;text-align:left;padding-bottom:6px}</style>
  </head>
  <body>
    <h1>Help desk roster</h1>
    <table>
      <caption>Help desk roster, this week</caption>
      <thead>
        <tr><th scope="col">Day</th><th scope="col">Morning</th><th scope="col">Afternoon</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Monday</th><td>Sam</td><td>Priya</td></tr>
        <tr><th scope="row">Tuesday</th><td>Alex</td><td>Mei</td></tr>
        <tr><th scope="row">Wednesday</th><td>Priya</td><td>Sam</td></tr>
      </tbody>
    </table>
  </body>
</html>
`,
          checks: [
            { label: 'The table has a caption', hint: 'Straight after `<table>`, add `<caption>Help desk roster, this week</caption>`.', test: d => txt($(d, 'table > caption')).length >= 4 },
            { label: 'Header row is in <thead> with <th scope="col">', hint: 'Wrap the first row in `<thead>` and change its cells to `<th scope="col">`.', test: d => { const th = $$(d, 'thead th'); return th.length >= 3 && th.every(x => x.getAttribute('scope') === 'col') && !$(d, 'thead td'); } },
            { label: 'Data rows are in <tbody>', hint: 'Wrap the Monday to Wednesday rows in `<tbody>` and `</tbody>`.', test: d => $$(d, 'tbody tr').filter(r => /monday|tuesday|wednesday/i.test(txt(r))).length === 3 && !$$(d, 'thead tr').some(r => /monday/i.test(txt(r))) },
            { label: 'Each day is a row header (<th scope="row">)', hint: 'Change `<td>Monday</td>` to `<th scope="row">Monday</th>`, and the same for each day.', test: d => { const rows = $$(d, 'tbody tr'); return rows.length >= 3 && rows.every(r => { const c = r.firstElementChild; return c && c.tagName === 'TH' && c.getAttribute('scope') === 'row'; }); } },
            { label: 'Names are still data cells (<td>)', hint: 'Only the days and the header row should be `<th>`. Keep the names in `<td>`.', test: d => $$(d, 'tbody td').length >= 6 }
          ] },
        { t: 'continue', gate: true },
        { t: 'list', heading: 'Key points', style: 'check', items: ['Use `<ul>` when order doesn’t matter and `<ol>` when it does', 'Use tables for data only, never for page layout', 'Give every data table a `<caption>`, header cells and `scope`'] }
      ] },

      /* ================= Unit 5 ================= */
      { id: 'u5', title: 'Accessible forms', min: 7, blocks: [
        { t: 'audio', vo: 'u5' },
        { t: 'statement', style: 'b', text: 'A form is a conversation with your users. **Every** field needs a label they can see and a screen reader can announce.' },
        { t: 'code', heading: 'A labelled field', caption: 'The label’s for attribute matches the input’s id. Selecting the label also puts the cursor in the field.', src: `<label for="email">Work email</label>
<input type="email" id="email" name="email" autocomplete="email" required>` },
        { t: 'note', tone: 'warn', title: 'Placeholder text isn’t a label', text: 'Placeholder text disappears as soon as someone types, it’s often too faint to read, and some screen readers skip it. Always use a visible `<label>`.' },
        { t: 'table', heading: 'Choose the right input type', intro: 'The right type gives people the right keyboard on their phone and basic checking for free.', cols: ['Type', 'Use it for', 'What people get'], caption: 'Common input types and their benefits', rows: [
          ['`type="email"`', 'Email addresses', 'An @ key on phones; the browser checks the format'],
          ['`type="tel"`', 'Phone numbers', 'A number pad on phones'],
          ['`type="date"`', 'Dates', 'A date picker'],
          ['`type="checkbox"`', 'Yes/no, or choose several', 'Tick boxes'],
          ['`type="radio"`', 'Choose one of a few options', 'Option buttons; give them the same `name`'],
          ['`<textarea>`', 'Longer answers', 'A multi-line box'],
          ['`<select>`', 'Choose one from a long list', 'A drop-down list']
        ] },
        { t: 'continue' },
        { t: 'accordion', heading: 'Five habits of accessible forms', items: [
          { title: '1. Group related options with <fieldset> and <legend>', text: 'For radio buttons and checkboxes, the `<legend>` is the question, such as “How did you attend?”. Screen readers read it with each option.' },
          { title: '2. Mark required fields clearly', text: 'Add the `required` attribute, and say “(required)” in the label. Don’t rely on a red asterisk or colour alone.' },
          { title: '3. Help autofill', text: 'Add `autocomplete` values such as `name`, `email` and `tel`, so browsers can fill them in. This is part of WCAG 2.1 (1.3.5 Identify Input Purpose).' },
          { title: '4. Use a real button', text: 'Use `<button type="submit">Send feedback</button>`. A styled `<div>` can’t be reached with the keyboard and isn’t announced as a button.' },
          { title: '5. Write helpful error messages', text: 'Say what went wrong and how to fix it, next to the field, such as “Enter an email address like name@example.com”.' }
        ] },
        { t: 'sandbox', wide: true, names: true, heading: 'Try it: what does a screen reader hear?', intro: 'The panel next to the preview shows the name each field will be announced with. Two fields have no name yet.', tries: ['Add a `<label>` for the email field: `<label for="email">Work email</label>`', 'Give the comments box a label too, matching its `id`', 'Change the `<div>` “Send” to a real `<button type="submit">`'], src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Contact the web team</title>
  </head>
  <body>
    <h1>Contact the web team</h1>
    <form>
      <p>
        <label for="name">Your name</label>
        <input type="text" id="name" autocomplete="name">
      </p>
      <p>
        <input type="email" id="email" placeholder="Email">
      </p>
      <p>
        <textarea id="comments" rows="3"></textarea>
      </p>
      <div>Send</div>
    </form>
  </body>
</html>` },
        { t: 'continue' },
        { t: 'scenario', heading: 'Scenario: the launch review', intro: 'Mei, the web team lead, is reviewing your event feedback form before it goes live. Choose how to respond.', defaultChar: 'mei', start: 's1', bg: 'media/img/office.webp',
          characters: { mei: { name: 'Mei Chen', role: 'Web team lead', img: 'media/img/mei.webp' } },
          scenes: {
            s1: { say: 'The form looks clean! I see you used placeholder text instead of labels to save space. Is that okay to launch?', choices: [
              { text: 'Add visible labels above each field, linked with for and id.', tone: 'good', fb: 'Great call. Visible labels stay on screen while people type, and screen readers announce them.', next: 's2' },
              { text: 'Keep the placeholders, they look neater.', tone: 'bad', fb: 'Placeholders vanish as people type and are often too faint to read. Screen readers may skip them too. Try again.', next: 's1' },
              { text: 'Add aria-label to each field and keep the placeholders.', tone: 'ok', fb: 'Screen readers would now announce a name, but sighted users still lose the hint as soon as they type. Visible labels work for everyone.', next: 's1' }
            ] },
            s2: { say: 'Good. Next, the rating question uses five radio buttons with no question attached, just “1” to “5”. What should we do?', choices: [
              { text: 'Wrap them in a fieldset with a legend: “How useful was the event?”', tone: 'good', fb: 'Yes. The legend gives the group its question, so “3” becomes “How useful was the event? 3”.', next: 's3' },
              { text: 'Put the question in bold above them.', tone: 'ok', fb: 'Sighted users will see it, but it isn’t linked to the buttons, so screen readers won’t announce it with each option.', next: 's2' }
            ] },
            s3: { say: 'Last thing: the Send button is a styled div, and errors just turn the field border red. Anything to change?', choices: [
              { text: 'Use a real button element and add a text error message beside the field.', tone: 'good', fb: 'Perfect. A real button works with the keyboard, and a text message doesn’t rely on colour alone.', next: 'end' },
              { text: 'It’s fine; most people use a mouse.', tone: 'bad', fb: 'Keyboard and screen reader users couldn’t send the form, and people who can’t tell red apart wouldn’t see the errors. Try again.', next: 's3' }
            ] },
            end: { end: true, say: 'That’s ready to launch. Everyone can now complete our form, whatever device or assistive technology they use. Thanks!', endTitle: 'Form approved for launch', endText: 'You fixed labels, grouping, the button and error messages: the four most common form barriers.' }
          } },
        { t: 'continue', gate: true },
        { t: 'codetask', wide: true, names: true, heading: 'Coding task: build an accessible feedback form', brief: 'Fix the event feedback form so every field is labelled and it can be sent with a keyboard.', steps: ['Give the name and email fields visible labels linked with `for` and `id`', 'Make the email field `type="email"` and `required`', 'Group the rating radio buttons in a `<fieldset>` with a `<legend>`', 'Replace the `<div>` with a `<button type="submit">`'],
          src: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Event feedback</title>
  </head>
  <body>
    <h1>Event feedback</h1>
    <form>
      <p><input type="text" id="name" placeholder="Name" autocomplete="name"></p>
      <p><input type="text" id="email" placeholder="Email" autocomplete="email"></p>
      <p>How useful was the event?</p>
      <p>
        <input type="radio" id="r1" name="rating" value="1"><label for="r1">Not useful</label>
        <input type="radio" id="r2" name="rating" value="2"><label for="r2">Useful</label>
        <input type="radio" id="r3" name="rating" value="3"><label for="r3">Very useful</label>
      </p>
      <div class="btn">Send feedback</div>
    </form>
  </body>
</html>
`,
          solution: `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8">
    <title>Event feedback</title>
  </head>
  <body>
    <h1>Event feedback</h1>
    <form>
      <p>
        <label for="name">Name</label>
        <input type="text" id="name" autocomplete="name">
      </p>
      <p>
        <label for="email">Email (required)</label>
        <input type="email" id="email" autocomplete="email" required>
      </p>
      <fieldset>
        <legend>How useful was the event?</legend>
        <input type="radio" id="r1" name="rating" value="1"><label for="r1">Not useful</label>
        <input type="radio" id="r2" name="rating" value="2"><label for="r2">Useful</label>
        <input type="radio" id="r3" name="rating" value="3"><label for="r3">Very useful</label>
      </fieldset>
      <button type="submit">Send feedback</button>
    </form>
  </body>
</html>
`,
          checks: [
            { label: 'The name field has a visible label', hint: 'Add `<label for="name">Name</label>` before the name input.', test: d => { const i = $(d, '#name'); return !!i && $$(d, 'label').some(l => l.getAttribute('for') === 'name' && txt(l)) || (!!i && !!i.closest('label') && txt(i.closest('label')).length > 0); } },
            { label: 'The email field has a visible label', hint: 'Add `<label for="email">Email (required)</label>` before the email input.', test: d => { const i = $(d, '#email'); return !!i && ($$(d, 'label').some(l => l.getAttribute('for') === 'email' && txt(l)) || (!!i.closest('label') && txt(i.closest('label')).length > 0)); } },
            { label: 'Email is type="email" and required', hint: 'Change the email input to `type="email"` and add the `required` attribute.', test: d => { const i = $(d, '#email'); return !!i && i.getAttribute('type') === 'email' && i.hasAttribute('required'); } },
            { label: 'The radio buttons are in a fieldset with a legend', hint: 'Wrap the radio buttons in `<fieldset>`, and put the question in `<legend>How useful was the event?</legend>`.', test: d => { const f = $$(d, 'fieldset').find(f => $$(f, 'input[type=radio]').length >= 3); return !!f && txt($(f, 'legend')).length >= 5; } },
            { label: 'The form is sent with a real button', hint: 'Replace the `<div>` with `<button type="submit">Send feedback</button>`.', test: d => $$(d, 'form button, form input[type=submit]').some(b => (b.tagName === 'INPUT' || (b.getAttribute('type') || 'submit') === 'submit') && (txt(b) || b.getAttribute('value') || '').length >= 3) && !$$(d, 'form div').some(x => /send feedback/i.test(txt(x)) && !$(x, 'button')) },
            { label: 'Every field has an accessible name', hint: 'Check each input has a label. The panel next to the preview shows any field that has no name.', test: d => $$(d, 'input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea').every(el => labelled(d, el)) }
          ] },
        { t: 'continue', gate: true },
        { t: 'list', heading: 'Key points', style: 'check', items: ['Give every field a visible `<label>` linked with `for` and `id`; placeholders aren’t labels', 'Choose input types such as `email` and `tel`, and add `autocomplete`', 'Group radio buttons and checkboxes with `<fieldset>` and `<legend>`', 'Use a real `<button>`, and write errors in words, not colour alone'] },
        { t: 'note', tone: 'tip', title: 'Up next: the final quiz', text: 'Ten questions on everything in this module. You need 80% to pass, and you can retake it. Keep the quick reference guide handy for the real world.' }
      ] },

      /* ================= Final quiz ================= */
      { id: 'quiz', type: 'quiz', title: 'Final quiz', min: 6, pass: 80, questions: [
        { q: 'Which line must come first in every HTML5 page?', options: ['`<html>`', '`<!doctype html>`', '`<head>`', '`<meta charset="utf-8">`'], answer: 1, why: 'The doctype tells the browser to use modern HTML5 rules.' },
        { q: 'A page’s apostrophes show as strange symbols. What should you add to the head?', options: ['`<meta charset="utf-8">`', '`<title>`', '`<meta name="viewport" …>`', '`lang="en-AU"` on the body'], answer: 0, why: 'The UTF-8 character set makes punctuation and accents display correctly.' },
        { q: 'Where does the page title shown in the browser tab come from?', options: ['The first `<h1>`', 'The `<title>` element in the head', 'The file name', 'The `lang` attribute'], answer: 1, why: 'The `<title>` names the tab and is the first thing a screen reader announces.' },
        { q: 'A section heading looks too big as an `<h2>`. What’s the best fix?', options: ['Use `<h4>` instead', 'Use a bold paragraph', 'Keep `<h2>` and change its size with CSS', 'Use `<h1>`'], answer: 2, why: 'Choose the heading level for the outline, then style it with CSS.' },
        { q: 'Which elements are landmarks that help people jump to regions of a page?', kind: 'mr', options: ['`<header>`', '`<main>`', '`<div>`', '`<nav>`'], answer: [0, 1, 3], why: '`<header>`, `<main>` and `<nav>` are landmarks; `<div>` has no meaning on its own.' },
        { q: 'Which link text is the most accessible?', options: ['Click here', 'Read more', 'Download the 2026 leave policy (PDF)', 'https://example.com/docs/leave-2026.pdf'], answer: 2, why: 'It makes sense on its own and says what will open.' },
        { q: 'A thin decorative line is added as an image. What alt should it have?', options: ['`alt="line"`', '`alt=""`', 'No alt attribute at all', '`alt="decorative image"`'], answer: 1, why: 'An empty alt tells screen readers to skip it. Leaving alt out can make them read the file name.' },
        { q: 'Your steps for requesting leave must be followed in order. Which element should you use?', options: ['`<ul>`', '`<ol>`', '`<dl>`', '`<table>`'], answer: 1, why: 'Ordered lists are for steps where the order matters.' },
        { q: 'Which parts make a data table accessible?', kind: 'mr', options: ['A `<caption>`', '`<th>` cells with `scope`', 'Cell borders', 'Using the table for page layout'], answer: [0, 1], why: 'A caption names the table, and header cells with scope give every value its context.' },
        { q: 'Which is the best way to label an email field?', options: ['`<input type="email" placeholder="Email">`', '`<label for="email">Email</label><input type="email" id="email">`', '`<p>Email</p><input type="email">`', '`<b>Email</b><input type="text">`'], answer: 1, why: 'A visible label linked with `for` and `id` is announced by screen readers and stays visible while typing.' }
      ] }
    ]
  };
})();
