/* Digital Skills for Seniors — course content. Narration (narr) is spoken by the AI voice and shown as the transcript.
   On-screen text is kept short (Mayer's redundancy principle); the full words live in the transcript. */
window.COURSE = {
  title: "Digital Skills for Seniors",
  subtitle: "Your first steps with computers, video calls and staying safe online",
  lessons: [
  { id: "w", num: 0, title: "Welcome", mode: "guided", banner: "",
    screens: [
    { id: "w1", title: "Welcome to Digital Skills for Seniors",
      narr: "Welcome. I'm your guide for this course. I'm an A I voice, not a real person, and I'll explain each screen as you go. In this course, you'll learn to use a computer, make a video call to your family, and stay safe online. There's no rush and no test to pass. You can't break anything here, so feel free to try things and make mistakes.",
      html: `<p class="lead">Learn to use a computer, video-call your family and stay safe online, at your own pace.</p>
      <div class="grid3">
        <div class="tile-card"><span class="tc-ico ac" aria-hidden="true">${'{i:clock}'}</span><h2 class="tc-t">Go at your own pace</h2><p>No timers. Pause or replay anything.</p></div>
        <div class="tile-card"><span class="tc-ico mi" aria-hidden="true">${'{i:shield}'}</span><h2 class="tc-t">Nothing can break</h2><p>Practice screens are safe. No real calls or messages are sent.</p></div>
        <div class="tile-card"><span class="tc-ico co" aria-hidden="true">${'{i:heart}'}</span><h2 class="tc-t">No tests to pass</h2><p>Checks are for you. Try as many times as you like.</p></div>
      </div>
      <div class="block outline">
        <h2 class="bh">What you'll learn</h2>
        <ol class="steps">
          <li><strong>Getting started:</strong> the parts of a computer, clicking, keys and windows</li>
          <li><strong>Video-call your family:</strong> answer, make and end a call</li>
          <li><strong>Staying safe online:</strong> passwords, scam messages and scam calls</li>
          <li><strong>Your practice, your choice:</strong> pick the activities you want</li>
        </ol>
      </div>
      <p class="note">${'{i:info}'}<span>Your guide is an AI voice, not a real person. About 45 minutes in total, and you can stop and come back at any time.</span></p>` },
    { id: "w2", title: "How this course works",
      narr: "Every screen has a narration bar like the one above. Press Play to listen, and Pause to stop. Replay starts again from the beginning. If I'm talking too fast, choose a slower speed. You can also read my words by opening the transcript. Make the text bigger with the buttons at the top of the screen. If you prefer the keyboard, the Tab key moves between buttons, and Enter presses them. When you're ready, press Next.",
      html: `<div class="block">
        <h2 class="bh">The narration bar</h2>
        <ul class="legend">
          <li><span class="lg-ico" aria-hidden="true">${'{i:play}'}</span><span><strong>Play and Pause</strong> start and stop my voice.</span></li>
          <li><span class="lg-ico" aria-hidden="true">${'{i:rotate}'}</span><span><strong>Replay</strong> starts again from the beginning.</span></li>
          <li><span class="lg-ico txt" aria-hidden="true">0.75×</span><span><strong>Speed</strong> makes me slower or faster.</span></li>
          <li><span class="lg-ico" aria-hidden="true">${'{i:text}'}</span><span><strong>Transcript</strong> shows my words to read.</span></li>
        </ul>
      </div>
      <div class="grid2">
        <div class="block">
          <h2 class="bh">At the top of every screen</h2>
          <ul class="legend">
            <li><span class="lg-ico txt" aria-hidden="true">A+</span><span><strong>Text size</strong> makes words bigger or smaller.</span></li>
            <li><span class="lg-ico" aria-hidden="true">${'{i:help}'}</span><span><strong>Need help?</strong> is always in the same place.</span></li>
            <li><span class="lg-ico" aria-hidden="true">${'{i:menu}'}</span><span><strong>Menu</strong> shows all the lessons.</span></li>
          </ul>
        </div>
        <div class="block">
          <h2 class="bh">Using the keyboard</h2>
          <ul class="legend">
            <li><kbd>Tab</kbd><span>moves to the next button</span></li>
            <li><kbd>Enter</kbd><span>presses the button</span></li>
            <li><kbd>Esc</kbd><span>closes a box</span></li>
          </ul>
        </div>
      </div>
      <div data-ia="autoplay"></div>` },
    { id: "w3", title: "What would you like to do?",
      narr: "Before we start, tell me a little about you. First, choose what matters most to you. I'll use this to suggest a practice activity later. Then, answer three quick questions about how confident you feel today. There are no right or wrong answers, and nobody else will see them. At the end, we'll look at them again to see how far you've come.",
      html: `<div data-ia="goal"></div><div data-ia="confidence" data-when="before"></div>` }
    ]},
  { id: "l1", num: 1, title: "Getting started with your computer", mode: "guided",
    banner: "Guided lesson. I'll take you through each step, in order.",
    screens: [
    { id: "l1s1", title: "The parts of a computer",
      narr: "Let's start with the main parts of a computer. Choose each button below to see where that part is. The screen is where you see everything, a bit like a television. The keyboard is for typing, like a typewriter. The touchpad, or a mouse, moves a small arrow on the screen called the pointer. And the power button turns the computer on.",
      html: `<p class="lead">Choose each part to see where it is.</p><div data-ia="parts"></div>` },
    { id: "l1s2", title: "Clicking with the mouse or touchpad",
      narr: "Now let's practise clicking. Rest your hand gently on the mouse, or one finger on the touchpad. Move the pointer onto the big circle, then press the left button once. That's called a click. The circle will move, so follow it and click three times. Take your time. If the mouse is tricky, you can press Enter instead.",
      html: `<p class="lead">Click the circle three times. It moves after each click.</p><div data-ia="clicker"></div>
      <p class="note">${'{i:info}'}<span>On a touchpad, a click is a firm press, or a light tap with one finger.</span></p>` },
    { id: "l1s3", title: "Keys that do most of the work",
      narr: "A few keys do most of the work. Enter means yes, or go. The space bar, the long key at the bottom of the keyboard, also presses buttons. The arrow keys move up, down, left and right. And Escape, often marked E S C, closes things. Select the practice box, then press each key when I ask. Last of all, try the Tab key on the three buttons at the bottom of the screen.",
      html: `<div class="grid4 keysgrid">
        <div class="keycard"><kbd class="big">Enter</kbd><p>Yes, or go</p></div>
        <div class="keycard"><kbd class="big wide">Space bar</kbd><p>Presses buttons</p></div>
        <div class="keycard"><kbd class="big">← ↑ → ↓</kbd><p>Moves around</p></div>
        <div class="keycard"><kbd class="big">Esc</kbd><p>Closes things</p></div>
      </div>
      <div data-ia="keys"></div><div data-ia="tabdemo"></div>` },
    { id: "l1s4", title: "Open and close a window",
      narr: "Programs open in boxes called windows. To open one, point at its picture, called an icon, and click twice quickly. That's a double-click. On the practice desktop, open Photos. Then close the window again with the close button in the top corner. If you click only once, that's fine. The icon is just selected. Click twice, or press Enter.",
      html: `<div data-ia="desktop"></div>` },
    { id: "l1s5", title: "How did that go?",
      narr: "Well done. You've finished the first lesson. Take a moment to think about how that went, and choose the answer that fits best. Whatever you choose is fine. Learning something new takes time, and everyone finds different parts tricky. Below is a short summary of what you learned. You can print it at the end of the course.",
      html: `<div data-ia="reflect"></div>
      <div class="block summary">
        <h2 class="bh">Lesson 1 in four lines</h2>
        <ul class="ticks">
          <li><strong>Click once</strong> to select something.</li>
          <li><strong>Double-click</strong> an icon to open it.</li>
          <li><strong>The close button (X)</strong> in the top corner closes a window.</li>
          <li><strong>Enter</strong> means yes or go. <strong>Tab</strong> moves to the next button.</li>
        </ul>
      </div>` }
    ]},
  { id: "l2", num: 2, title: "Video-call your family", mode: "guided",
    banner: "Guided lesson. I'll give you a little less help as you go.",
    screens: [
    { id: "l2s1", title: "What you need for a video call",
      narr: "A video call lets you see and talk to someone at the same time, wherever they are. You need three things. A device with a camera, like a laptop, tablet or phone. An internet connection, usually Wi-Fi at home. And a video-call app, such as FaceTime, WhatsApp or Zoom. Ask your family which app they use, so you're both on the same one.",
      html: `<p class="lead">You need three things.</p>
      <div class="grid3">
        <div class="tile-card"><span class="tc-ico ac" aria-hidden="true">${'{i:laptop}'}</span><h2 class="tc-t">A device with a camera</h2><p>A laptop, tablet or smartphone.</p></div>
        <div class="tile-card"><span class="tc-ico mi" aria-hidden="true">${'{i:wifi}'}</span><h2 class="tc-t">An internet connection</h2><p>Usually Wi-Fi at home.</p></div>
        <div class="tile-card"><span class="tc-ico co" aria-hidden="true">${'{i:video}'}</span><h2 class="tc-t">A video-call app</h2><p>Such as FaceTime, WhatsApp or Zoom.</p></div>
      </div>
      <p class="note">${'{i:users}'}<span><strong>Tip:</strong> ask your family which app they use, so you're both on the same one. They can help you set it up.</span></p>` },
    { id: "l2s2", title: "Answer a call",
      narr: "When someone calls, your screen shows their name and two buttons. The green button answers the call. The red button declines it, which means saying no. On this practice screen, Mary, your daughter, is calling. Answer her call. Don't worry, no real call is made.",
      html: `<div data-ia="answer"></div>` },
    { id: "l2s3", title: "Buttons during a call",
      narr: "During a call, you'll see a row of buttons along the bottom. The microphone button mutes you, so the other person can't hear you. Press it again to unmute. The camera button turns your picture on or off. And the red button ends the call. Follow the steps on the practice screen, one at a time.",
      html: `<div data-ia="incall"></div>` },
    { id: "l2s4", title: "Make a call on your own",
      narr: "Now it's your turn to make a call, with less help from me. Your grandson, Tom, would love to see you. Find Tom in the contacts list, then start a video call. If you get stuck, press Show me a hint. Remember, you can't break anything here.",
      html: `<div data-ia="makecall" data-target="Tom" data-hints="1"></div>` },
    { id: "l2s5", title: "Quick check",
      narr: "Let's check what you remember. This isn't a test, and you can try as many times as you like. Read each question, choose an answer, then press Check. I'll explain each answer.",
      html: `<div data-ia="quiz"></div>` }
    ]},
  { id: "l3", num: 3, title: "Staying safe online", mode: "choice",
    banner: "You're in charge now. Explore these screens in any order you like.",
    screens: [
    { id: "l3s1", title: "Passwords are like house keys",
      narr: "A password is like the key to your house. It keeps other people out. A strong password is long. Try joining four random words, like purple kettle beach river. Keep it to yourself. Your bank, and real companies, will never ask for your password. And use a different password for your email and your banking, just as you wouldn't use one key for every door. Choose each card to read more.",
      html: `<p class="lead">Choose each card to read more.</p><div data-ia="accordion"></div>` },
    { id: "l3s2", title: "Spot the scam message",
      narr: "Scammers send messages that look real. They often rush you, ask for money or passwords, or include a strange link. Read each message below and decide whether it looks safe or suspicious. I'll tell you which clues to look for. If you're ever unsure about a real message, don't click anything. Ask someone you trust first.",
      html: `<p class="lead">Is each message safe or suspicious?</p><div data-ia="sorter"></div>` },
    { id: "l3s3", title: "Phone calls and voice scams",
      narr: "Some scams come by phone. A caller may pretend to be from your bank, the government, or even your family. Today, scammers can use A I to copy a voice, so it may even sound like someone you love. Read this call from someone who sounds like your grandson, then choose what you would do.",
      html: `<div data-ia="scenario"></div>` },
    { id: "l3s4", title: "If something feels wrong",
      narr: "If something feels wrong, remember three words: stop, check, ask. Stop. Don't click, pay, or share any details. Check. Contact the person or company yourself, using a number you already have, like the one on the back of your bank card. Ask. Talk to someone you trust. You can report scams to Scamwatch, at scamwatch dot gov dot A U. And if you've lost money, call your bank straight away.",
      html: `<ol class="process">
        <li><span class="pn ac">1</span><div><h2 class="tc-t">Stop</h2><p>Don't click, pay or share any details.</p></div></li>
        <li><span class="pn mi">2</span><div><h2 class="tc-t">Check</h2><p>Contact the person or company yourself, using a number you already have, like the one on your bank card.</p></div></li>
        <li><span class="pn co">3</span><div><h2 class="tc-t">Ask</h2><p>Talk to someone you trust before you act.</p></div></li>
      </ol>
      <div class="block">
        <h2 class="bh">Where to get help in Australia</h2>
        <ul class="links">
          <li><strong>Report a scam:</strong> Scamwatch, <span class="url">scamwatch.gov.au</span></li>
          <li><strong>Lost money?</strong> Call your bank straight away, on the number on your card.</li>
          <li><strong>Keep learning for free:</strong> Be Connected, <span class="url">beconnected.esafety.gov.au</span></li>
        </ul>
      </div>` }
    ]},
  { id: "l4", num: 4, title: "Your practice, your choice", mode: "free",
    banner: "Self-directed lesson. Choose any activity, in any order.",
    screens: [
    { id: "l4s1", title: "Choose your practice",
      narr: "This lesson is yours to plan. Choose any practice activity, in any order, and do as many as you like. I've marked one as suggested, based on what you told me at the start. These activities have no hints unless you ask for one, so you can see how much you've learned.",
      html: `<div data-ia="hub"></div>` },
    { id: "l4s2", title: "Practice: a call from start to finish",
      narr: "Make a complete video call on your own. Call your daughter, Mary. When she answers, mute your microphone, then unmute it, and then end the call. Press Show me a hint whenever you need one.",
      html: `<div data-ia="fullcall"></div>` },
    { id: "l4s3", title: "Practice: safe or scam? Quick five",
      narr: "Here are five quick situations. For each one, decide whether it sounds safe or like a scam. You'll see the answer straight away, with a short reason.",
      html: `<div data-ia="quick5"></div>` },
    { id: "l4s4", title: "Practice: keyboard confidence",
      narr: "Forms are everywhere online, from booking appointments to ordering shopping. Try filling in this short form using only the keyboard. Press Tab to move between parts, type your name, use the arrow keys to choose an option, and press Enter to save.",
      html: `<div data-ia="form"></div>` }
    ]},
  { id: "end", num: 5, title: "Well done", mode: "free", banner: "",
    screens: [
    { id: "e1", title: "How confident do you feel now?",
      narr: "You've reached the end of the course. Let's look again at the three questions from the start. Answer them for how you feel now, and you'll see how your confidence has changed. Every step forward counts.",
      html: `<div data-ia="confidence" data-when="after"></div><div data-ia="compare"></div>` },
    { id: "e2", title: "Your summary card",
      narr: "Here is your summary card. It lists the key steps from every lesson. Press Print to keep a paper copy near your computer. If you'd like to keep learning, Be Connected has more free courses for older Australians. Thank you for learning with me, and enjoy your next video call.",
      html: `<div class="block summary printable" id="summary-card">
        <h2 class="bh">Digital Skills for Seniors: my summary card</h2>
        <div class="grid3 sumgrid">
          <div><h3 class="sh ac">Using the computer</h3><ul class="ticks"><li>Click once to select</li><li>Double-click to open</li><li>X closes a window</li><li>Tab moves, Enter presses</li></ul></div>
          <div><h3 class="sh mi">Video calls</h3><ul class="ticks"><li>Green answers, red ends</li><li>Microphone button mutes you</li><li>Camera button hides your picture</li><li>Choose the contact, then Video call</li></ul></div>
          <div><h3 class="sh co">Staying safe</h3><ul class="ticks"><li>Long password: four random words</li><li>Never share your password</li><li>Stop, check, ask</li><li>Report scams: scamwatch.gov.au</li></ul></div>
        </div>
      </div>
      <div class="actions"><button class="btn primary" type="button" data-print>${'{i:print}'}Print my summary card</button></div>
      <p class="note">${'{i:info}'}<span>Keep learning for free with Be Connected: <span class="url">beconnected.esafety.gov.au</span>. You can come back to any screen from the menu.</span></p>` }
    ]}
  ]
};
