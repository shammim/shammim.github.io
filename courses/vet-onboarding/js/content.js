window.LESSON = {
  id: 'vet-learner-onboarding-induction',
  series: 'VET Learner Onboarding & Induction',
  brand: 'Shammim',
  title: 'Your first 30 days in vocational learning',
  minutes: 25,
  pass: 80,
  sections: [
    { id: 'hero', nav: 'Welcome' },
    { id: 'expect', nav: 'Module 1 · What to expect' },
    { id: 'support', nav: 'Who can support you' },
    { id: 'kc1', nav: 'Knowledge check 1' },
    { id: 'journey', nav: 'Module 2 · Your journey' },
    { id: 'order', nav: 'Put the journey in order' },
    { id: 'resp', nav: 'Module 3 · Your responsibilities' },
    { id: 'kc2', nav: 'Knowledge check 2' },
    { id: 'scenario', nav: 'Practical scenario' },
    { id: 'quiz', nav: 'Final quiz' },
    { id: 'done', nav: 'Key takeaways' }
  ],
  img: {
    welcome: { src: 'img/welcome.svg', alt: 'Illustration of three smiling learners sitting together in front of a campus building. One has a laptop open.' },
    guide: { src: 'img/guide.svg', alt: 'Illustration of your course guide, a trainer in a dark blazer, with both hands open in a welcome.' },
    think: { src: 'img/think.svg', alt: 'Illustration of your course guide with a finger raised to her temple, thinking.' },
    cross: { src: 'img/cross.svg', alt: 'Illustration of your course guide with arms folded, looking confident.' },
    trainer: { src: 'img/trainer.svg', alt: 'Illustration of a trainer and a learner at a desk, reviewing a printed document. A progress chart is on the wall behind them.' },
    support: { src: 'img/support.svg', alt: 'Illustration of a Student Support officer and a learner talking at a desk under a Student Support sign, with a laptop between them.' },
    admin: { src: 'img/admin.svg', alt: 'Illustration of an administration officer and a learner at the Administration counter, with forms and a calendar nearby.' },
    it: { src: 'img/it.svg', alt: 'Illustration of an IT and LMS support officer pointing at a laptop screen that shows a login confirmation, while a learner watches.' }
  },
  expect: {
    objectives: ['Identify what to expect from your vocational learning experience', 'Identify where to access learning resources and support', 'Recognise the key people who can assist you'],
    modes: ['Online learning', 'Classroom sessions', 'Workplace activities', 'Practical demonstrations', 'Projects and assessments', 'Trainer feedback']
  },
  roles: [
    { key: 'trainer', t: 'Trainer/Assessor', x: 'Your Trainer/Assessor helps you understand learning and assessment requirements and gives you feedback.', when: 'Go to them when you are unsure what a task or assessment is asking.' },
    { key: 'support', t: 'Student Support', x: 'Student Support can assist with personal, study or support needs that may affect your learning.', when: 'Go to them when life or study pressures are getting in the way.' },
    { key: 'admin', t: 'Administration Team', x: 'The Administration Team can help with enrolment, records, schedules and administrative questions.', when: 'Go to them for enrolment details, your timetable or your records.' },
    { key: 'it', t: 'IT/LMS Support', x: 'IT/LMS Support can help when you are having technical problems accessing digital learning systems.', when: 'Go to them when you cannot log in or something online is not working.' }
  ],
  kc1: {
    q: 'Who should you contact if you need help accessing assessment instructions?',
    options: [
      { text: 'Student Support', fb: 'Student Support helps with personal or study-related issues, not assessment instructions.' },
      { text: 'Administration Team', fb: 'The Administration Team handles enrolment, records and schedules, not assessment instructions.' },
      { text: 'IT/LMS Support', fb: 'IT/LMS Support assists with technical issues related to digital learning systems, not assessment instructions.' },
      { text: 'Trainer/Assessor', fb: 'Your Trainer/Assessor is the correct person to contact for help with understanding learning and assessment requirements.' }
    ],
    answer: 3
  },
  stages: [
    { t: 'Enrol', x: 'Complete your enrolment and receive information about your qualification.' },
    { t: 'Induct', x: 'Learn about your training environment, course expectations, responsibilities, policies and support services.' },
    { t: 'Access', x: 'Log in to your Moodle and locate your learning resources, timetable, assessments and announcements.' },
    { t: 'Connect', x: 'Meet your trainer, assessor and other relevant support staff.' },
    { t: 'Learn', x: 'Begin developing the knowledge and skills required for your qualification.' },
    { t: 'Practise', x: 'Apply your learning through activities, exercises and practical tasks.' },
    { t: 'Assess', x: 'Demonstrate your knowledge and skills through the required assessment activities.' },
    { t: 'Progress', x: 'Review feedback, address learning gaps and continue progressing through your qualification.' }
  ],
  journey: {
    objectives: ['Identify the key onboarding stages', 'Explain what you need to do at each stage', 'Locate important course information', 'Identify actions you can take to prepare for learning'],
    intro: 'Your onboarding journey begins before your first learning activity. Each stage helps you become familiar with your qualification, learning environment, responsibilities and support services.',
    start: [6, 2, 0, 7, 4, 1, 5, 3]
  },
  resp: {
    objectives: ['Identify your key learner responsibilities', 'Recognise behaviours that support successful learning', 'Identify when you should seek assistance'],
    intro: 'Your training provider, trainers and support staff are there to help you succeed. You also have responsibilities that contribute to a positive learning experience.',
    items: [
      { t: 'Attend and participate', x: 'Attend required training and participate actively in learning activities.', eg: 'Join the session, switch on your camera if asked, and take part in the activity.' },
      { t: 'Stay organised', x: 'Keep track of learning activities, assessment requirements and important dates.', eg: 'Add due dates to your phone calendar the day you see them.' },
      { t: 'Complete your own work', x: 'Follow assessment requirements and submit your own work.', eg: 'Ask for help to understand a task, but write your own answers.' },
      { t: 'Communicate respectfully', x: 'Communicate respectfully with trainers, staff and other learners.', eg: 'Use a polite tone in emails and forum posts, and listen in group work.' },
      { t: 'Ask for help', x: 'Speak with your trainer or support team when you need clarification or assistance.', eg: 'Message your trainer as soon as you are unsure, not the night before the deadline.' },
      { t: 'Follow requirements', x: 'Follow relevant course, workplace, safety and organisational requirements.', eg: 'Read the safety rules before a practical session and follow them.' }
    ]
  },
  kc2: {
    q: 'You have missed two learning activities and are unsure about an upcoming assessment. What should you do?',
    options: [
      { text: 'Attempt to resolve the issue on your own without seeking help.', fb: 'While self-reliance is valuable, seeking help ensures you receive the necessary support.' },
      { text: 'Withdraw from the course immediately.', fb: 'Withdrawing should be a last resort after exploring all available support options.' },
      { text: 'Reach out to your assigned trainer or support team for assistance.', fb: 'This is the correct action to take when facing difficulties with assessments or attendance.' },
      { text: 'Ignore the issue and hope it resolves itself.', fb: 'Ignoring the issue will not help resolve it and may lead to further complications.' }
    ],
    answer: 2
  },
  scenario: {
    persona: { name: 'Sam', initials: 'S', role: 'You, a new learner in week 1' },
    brief: [['Where', 'Your first fortnight'], ['Your role', 'New learner'], ['Moments', '3'], ['Helpers', 'Trainer, Support, Admin, IT']],
    intro: 'You are Sam, a new learner. Three moments from your first weeks come up. For each one, choose what you would do. You get feedback straight away.',
    aims: ['Get technical help from the right team', 'Clarify assessment requirements with your trainer', 'Ask for help early when you fall behind'],
    turns: [
      { aim: 0, title: 'Day 1: the login that will not work', say: 'It is the morning of your first day. You try to log in to Moodle to see your timetable, but your password is rejected three times and the page shows an error.', options: [
        { text: 'Contact IT/LMS Support, give your student ID and describe the error message.', pts: 2, fb: 'IT/LMS Support fixes access problems. Giving your student ID and the exact error helps them solve it fast.' },
        { text: 'Ask your trainer to reset your password in class.', pts: 1, fb: 'Your trainer will point you in the right direction, but IT/LMS Support is the quickest route for access problems.' },
        { text: 'Wait and try again tomorrow.', pts: 0, fb: 'You will miss your timetable and announcements. Contact IT/LMS Support the same day.' } ] },
      { aim: 1, title: 'Week 1: the unclear assessment', say: 'Your first assessment is due in ten days. You have read the instructions twice, but you are not sure what evidence is expected.', options: [
        { text: 'Message your Trainer/Assessor now and quote the part you are unsure about.', pts: 2, fb: 'Your Trainer/Assessor explains assessment requirements. Asking early, and naming the exact part, gets a useful answer.' },
        { text: 'Ask a classmate what they think it means, then check with your trainer.', pts: 1, fb: 'A classmate can help you think, but your trainer has the final word on what is required. Check with them first next time.' },
        { text: 'Ask the Administration Team to explain what the task needs.', pts: 0, fb: 'The Administration Team handles enrolment, records and schedules, not assessment instructions.' } ] },
      { aim: 2, title: 'Week 3: falling behind', say: 'Personal circumstances meant you missed two learning activities. An assessment is due next week and you feel behind and a bit overwhelmed.', options: [
        { text: 'Tell your trainer what happened and contact Student Support to talk through your options.', pts: 2, fb: 'Reaching out early gives your trainer and Student Support time to help you get back on track.' },
        { text: 'Try to catch up quietly on your own over the weekend.', pts: 1, fb: 'Catching up is a good aim, but doing it alone means you miss support that may be available.' },
        { text: 'Withdraw from the course.', pts: 0, fb: 'Withdrawing should be a last resort after you have explored your support options.' } ] }
    ],
    debrief: { hi: 'Strong response. You chose the right helper every time and you asked early.', mid: 'Good effort. Check the feedback for the moments where another person was a better first contact.', lo: 'A tough start, and that is what practice is for. Read the feedback for each moment, then replay.' },
    next: 'Keep the support list handy: Trainer/Assessor for requirements, Student Support for personal and study needs, Administration for enrolment and schedules, IT/LMS Support for technical access.'
  },
  quiz: [
    { q: 'Your Moodle login is not working on day one. Who is the best first contact?', options: ['IT/LMS Support', 'The Administration Team', 'Your Trainer/Assessor', 'Student Support'], answer: 0, why: 'IT/LMS Support helps when you are having technical problems accessing digital learning systems.' },
    { q: 'Which stage of the onboarding journey comes straight after Induct?', options: ['Connect', 'Access', 'Learn', 'Assess'], answer: 1, why: 'The order is Enrol, Induct, Access, Connect, Learn, Practise, Assess, Progress. At Access you log in to Moodle and find your resources.' },
    { q: 'Which of these is a learner responsibility?', options: ['Letting a friend submit your assessment', 'Waiting for staff to chase you about due dates', 'Following assessment requirements and submitting your own work', 'Only contacting people once an assessment has been marked'], answer: 2, why: 'Following assessment requirements and submitting your own work is one of your core responsibilities.' },
    { q: 'You need to confirm your timetable and enrolment record. Who can help?', options: ['IT/LMS Support', 'Student Support', 'Your Trainer/Assessor', 'The Administration Team'], answer: 3, why: 'The Administration Team helps with enrolment, records, schedules and administrative questions.' },
    { q: 'Personal circumstances are affecting your study and you feel overwhelmed. Who can assist?', options: ['Student Support', 'The Administration Team', 'IT/LMS Support', 'Nobody, you should wait it out'], answer: 0, why: 'Student Support can assist with personal, study or support needs that may affect your learning.' }
  ],
  takeaways: [
    { img: 'think', t: 'Not sure who to ask?', x: 'Start by asking your trainer or student support team.' },
    { img: 'cross', t: 'Know the journey', x: 'Understanding the onboarding journey helps you know what to expect and what action to take next.' },
    { img: 'guide', t: 'Do your part, ask early', x: 'Learning is shared. You attend, stay organised and complete your own work, and you ask for help as soon as something feels off.' }
  ],
  basis: 'This module is general onboarding guidance for vocational education and training (VET) learners. Always follow your own training provider’s policies, learner handbook and contact details.'
};

/* ---- additions: study habits, checklist, glossary, reflection, film ---- */
(function (L) {
  const at = (id, nav, after) => { const i = L.sections.findIndex(s => s.id === after); L.sections.splice(i + 1, 0, { id, nav }); };
  at('habits', 'Study habits and wellbeing', 'resp');
  at('checklist', 'Your 30-day checklist', 'quiz');
  at('glossary', 'Glossary of VET terms', 'checklist');
  at('reflect', 'Your first step', 'glossary');
  L.habits = {
    intro: 'Good habits make the first 30 days easier. Open each card for a simple idea you can use this week.',
    items: [
      { t: 'Plan your week', x: 'Block out set study times and add every due date to your calendar the day you see it.', eg: 'Two evenings and one weekend slot, each with a clear task.' },
      { t: 'Break big tasks into steps', x: 'Split an assessment into small steps, such as read the instructions, gather evidence, draft, check, submit.', eg: 'Tick off one step each session so progress is visible.' },
      { t: 'Set up your space and your tech', x: 'Find a quiet spot, and check your login, internet and files before a session starts.', eg: 'Log in to Moodle ten minutes early. If it fails, contact IT/LMS Support straight away.' },
      { t: 'Look after yourself', x: 'Sleep, take breaks and move your body. Notice stress early, and do not wait until it builds up.', eg: 'A short walk between study blocks, and a fixed finish time each night.' },
      { t: 'Talk early', x: 'If something is getting in the way, say so. Your trainer can help with tasks, and Student Support can help with personal and study needs.', eg: 'Send a short message as soon as you are worried, not the night before a deadline.' }
    ],
    urgent: 'If you need urgent support, call Lifeline on 13 11 14. In an emergency, call 000. Also check your training provider’s own support information.'
  };
  L.checklist = {
    intro: 'Tick off each item as you go. Your ticks are saved, so you can come back any time during your first 30 days.',
    weeks: [
      { t: 'Week 1: Get set up', items: ['Complete your induction', 'Log in to Moodle and find your timetable', 'Save your trainer’s and Student Support’s contact details', 'Read the overview of your first assessment'] },
      { t: 'Week 2: Connect', items: ['Introduce yourself to your trainer', 'Add due dates to your calendar', 'Attend your first session and join in', 'Try one practice activity'] },
      { t: 'Week 3: Check in', items: ['Look at your progress and any feedback', 'Ask about any task you are unsure of', 'Book study time for assessment preparation'] },
      { t: 'Week 4: Plan ahead', items: ['Submit or plan your first assessment', 'Review feedback and note what to improve', 'Tell Student Support if anything is affecting your study', 'Set one goal for your next month'] }
    ]
  };
  L.glossary = {
    intro: 'Plain-English meanings of terms you will hear in your first weeks. Type in the box to filter the list.',
    terms: [
      { t: 'VET', x: 'Vocational Education and Training. Learning that builds practical knowledge and skills for work.' },
      { t: 'RTO', x: 'Registered Training Organisation. A provider approved to deliver nationally recognised training.' },
      { t: 'Qualification', x: 'The formal result you earn, such as a certificate or diploma, when you complete the required units.' },
      { t: 'Unit of competency', x: 'One skill area within a qualification. You are assessed on each unit.' },
      { t: 'Competent and Not Yet Competent', x: 'Common assessment outcomes in VET. Not Yet Competent means you need more learning or another attempt. It is not a final fail.' },
      { t: 'RPL', x: 'Recognition of Prior Learning. Credit for skills and knowledge you already have, assessed against a unit.' },
      { t: 'Credit transfer', x: 'Credit for a unit you have already completed with another provider.' },
      { t: 'USI', x: 'Unique Student Identifier. A lifetime reference number for your nationally recognised training records.' },
      { t: 'LMS', x: 'Learning Management System. The online place where your course lives.' },
      { t: 'Moodle', x: 'The LMS used in this course. You log in to find resources, your timetable, assessments and announcements.' },
      { t: 'Trainer/Assessor', x: 'The person who teaches you, explains assessment requirements and gives you feedback.' }
    ],
    note: 'These are general meanings. Confirm details with your own training provider.'
  };
  L.reflect = {
    intro: 'Choose the one thing you will do first. You can change your mind.',
    options: [
      { t: 'Log in to Moodle and find my timetable', fb: 'A great start. Knowing where things are removes a lot of stress.' },
      { t: 'Save my trainer’s and Student Support’s contact details', fb: 'Good thinking. Having them ready means you can ask early.' },
      { t: 'Add every due date to my calendar', fb: 'Smart. Dates in your calendar are hard to miss.' },
      { t: 'Introduce myself to my trainer', fb: 'A strong move. A trainer who knows you can help sooner.' },
      { t: 'Plan my study times for this week', fb: 'Excellent. A plan turns good intentions into action.' },
      { t: 'Read the overview of my first assessment', fb: 'Well done. Early reading shows you what you need to ask.' }
    ]
  };
  L.film = { src: 'media/welcome-film.mp4', vtt: 'media/welcome-film.en.vtt', title: 'Watch the welcome film', desc: 'A 90-second narrated film with captions. It shows the title Welcome to vocational learning, a 30-day timeline, the four support teams (Trainer or Assessor, Student Support, Administration, IT and LMS Support), the eight journey stages from Enrol to Progress, six learner responsibilities, and the message to start with your trainer or student support team if you are not sure who to ask.' };
})(window.LESSON);

/* ---- 30 days at a glance (replaces the welcome film) ---- */
(function (L) {
  delete L.film;
  L.days = {
    title: 'Your first 30 days at a glance',
    intro: 'What happens when, and who to go to. Select a stage to see what to do.',
    stops: [
      { when: 'Day 1', t: 'Get started', stages: 'Enrol · Induct · Access', x: 'Complete your induction, log in to Moodle and find your timetable.', who: 'IT/LMS Support if you cannot log in' },
      { when: 'Days 2 to 7', t: 'Connect', stages: 'Connect', x: 'Meet your trainer, save the contact details you need and read the overview of your first assessment.', who: 'Your Trainer/Assessor' },
      { when: 'Days 8 to 14', t: 'Learn', stages: 'Learn', x: 'Attend your sessions, add every due date to your calendar and try a practice activity.', who: 'Administration for your timetable' },
      { when: 'Days 15 to 21', t: 'Practise and check in', stages: 'Practise', x: 'Look at your progress and feedback, ask about anything you are unsure of and book study time.', who: 'Student Support if life gets in the way' },
      { when: 'Days 22 to 30', t: 'Assess and plan ahead', stages: 'Assess · Progress', x: 'Submit or plan your first assessment, review feedback and set one goal for next month.', who: 'Your Trainer/Assessor for feedback' }
    ]
  };
})(window.LESSON);
