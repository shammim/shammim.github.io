window.LESSON = {
  id: 'ecl-trainee-onboarding',
  series: 'Field trainee onboarding',
  brand: 'Shammim',
  title: 'Environmental Compliance & Land Management',
  minutes: 25,
  pass: 80,
  sections: [
    { id: 'hero', nav: 'Welcome' },
    { id: 'intro', nav: 'Module 1 · Why it matters' },
    { id: 'whatis', nav: 'What is conservation?' },
    { id: 'resp', nav: 'Five responsibilities' },
    { id: 'spot', nav: 'Spot what needs attention' },
    { id: 'native', nav: 'Module 2 · Native vegetation' },
    { id: 'weeds', nav: 'Weed management' },
    { id: 'safety', nav: 'Safety on site' },
    { id: 'scenario', nav: 'Module 3 · An unfamiliar plant' },
    { id: 'quiz', nav: 'Knowledge check' },
    { id: 'done', nav: 'Ready for placement' }
  ],
  img: {
    host: { src: 'img/host.webp', alt: 'A smiling trainer in a lilac suit holds a clipboard and points upward.' },
    tree: { src: 'img/tree.webp', alt: 'A painted tree with a full green crown and a wide root system.' },
    land: { src: 'img/land.webp', alt: 'Illustration of degraded land: a dry paddock, rubbish, a gully washing mud into the water table and storm clouds over nearby houses.' },
    team: { src: 'img/team.webp', alt: 'Three people each carrying a green recycling box of bottles and containers.' },
    sow: { src: 'img/sow.webp', alt: 'A worker in a hat scatters seed over bare soil where young seedlings are growing.' },
    site: { src: 'img/site.jpg', alt: 'A four-wheel drive parked on a muddy track beside a creek. Rubbish lies on the ground, branches are broken, a fuel spill darkens the mud and a sign reads Sensitive Ecosystem, Protected Area.' }
  },
  outcomes: [
    'Explain what conservation is and why it matters',
    'Describe your five environmental responsibilities',
    'Spot environmental risks on a work site',
    'Recognise native vegetation and invasive weeds',
    'Describe basic site safety and biosecurity steps',
    'Report an unfamiliar plant clearly to your team leader'
  ],
  pillars: [
    { t: 'Protect', x: 'Keep healthy ecosystems, plants, animals and waterways from harm.' },
    { t: 'Manage', x: 'Plan and carry out everyday work, such as weed control and track care, so land stays healthy.' },
    { t: 'Restore', x: 'Repair damaged areas, for example by replanting native species.' }
  ],
  steps: [
    { title: 'Observe', text: 'Pay attention to your surroundings: the ground, plants, water and the people around you. Notice what is normal here, so you notice what is not.', say: '“The creek looks cloudy today. It was clear yesterday.”' },
    { title: 'Follow', text: 'Follow site rules, signs, marked tracks and procedures, including no-go areas and wash-down points.', say: '“That sign says protected area. We stay on the track.”' },
    { title: 'Protect', text: 'Take care to minimise unnecessary environmental impacts from your work, vehicles and equipment.', say: '“I’ll park on the hardstand, away from the water.”' },
    { title: 'Report', text: 'Tell your supervisor or team leader about hazards, damage, spills and unusual finds. Include a photo, the location and the time.', say: '“Fuel spill near the creek, here is a photo and the pin.”' },
    { title: 'Ask', text: 'If you are unsure, ask before you act. Asking is part of the job, not a sign you are not ready.', say: '“I can’t identify this plant. Can you help before we touch it?”' }
  ],
  spot: [
    { id: 'veg', t: 'Damaged vegetation', x: 61.0, y: 72.5, why: 'Broken branches and churned ground near the water can mean vehicles or equipment have left the track. Damaged plants lose habitat value and bare soil washes into the creek. Stay on marked tracks and report damage.' },
    { id: 'rub', t: 'Rubbish', x: 81.0, y: 67.3, why: 'Discarded waste pollutes soil and water and can harm wildlife. Take all waste out with you and report dumped rubbish rather than leaving it.' },
    { id: 'veh', t: 'Vehicle', x: 35.0, y: 52.3, why: 'Vehicles can compact soil, damage vegetation, leak fluids and carry weed seed on tyres. Park on hardstand, keep to tracks and clean down before moving between sites.' },
    { id: 'wat', t: 'Waterway', x: 56.0, y: 40.0, why: 'Creeks and rivers are sensitive. Anything on the bank, such as soil, fuel or rubbish, can end up in the water. Keep a safe distance and keep work away from the bank.' },
    { id: 'fuel', t: 'Fuel', x: 24.9, y: 86.3, why: 'Fuel and oil are harmful to soil, water and wildlife. Never refuel next to a waterway. If you see a spill, keep people away, make it safe if you can and report it straight away.' }
  ],
  flips: [
    { t: 'Understand what you’re observing', x: 'Knowing what you are looking at turns a patch of green into information you can act on.' },
    { t: 'Avoid damaging protected plants', x: 'Some native species are protected. Damaging them can breach legal and site requirements.' },
    { t: 'Identify invasive species', x: 'Spotting weeds early stops them spreading into new areas.' },
    { t: 'Recognise environmental risks', x: '1. Look for plants growing out of place or spreading fast. 2. Check for nearby disturbance such as tracks or dumped soil. 3. Flag anything unusual to your supervisor.' }
  ],
  weeds: [
    { t: 'They compete with native plants', x: 'Weeds take the light, water and nutrients that native plants need.' },
    { t: 'They alter habitats', x: 'When weeds take over, the food and shelter that native animals rely on can disappear.' },
    { t: 'They affect biodiversity', x: 'Fewer native species means a less healthy, less resilient ecosystem.' },
    { t: 'They spread into new areas', x: 'Seed travels on boots, tools, vehicles and water, so one small patch can become many.' }
  ],
  sort: {
    buckets: ['Safe and responsible', 'Puts people or the site at risk'],
    items: [
      { text: 'Wearing sturdy boots, a hat, sunscreen and the PPE your site requires', to: 0, why: 'Right gear protects you from heat, sun and ground hazards.' },
      { text: 'Starting work before your site induction because the crew is waiting', to: 1, why: 'The induction explains hazards, no-go areas and emergency steps.' },
      { text: 'Telling your team leader where you are working and when you expect to be back', to: 0, why: 'Someone needs to know where you are if something goes wrong.' },
      { text: 'Refuelling a vehicle on the creek bank because it is closer', to: 1, why: 'A small spill near water can contaminate it quickly.' },
      { text: 'Cleaning soil and seed off boots and tyres at the wash-down point', to: 0, why: 'Cleaning down stops weeds and disease travelling between sites.' },
      { text: 'Taking a shortcut through the creek instead of the marked crossing', to: 1, why: 'It damages the bank and the water, and creeks can be deeper and faster than they look.' }
    ]
  },
  scenario: {
    persona: { name: 'Jordan', initials: 'J', role: 'Team leader' },
    brief: [['Location', 'Creek buffer'], ['Plant', 'Unidentified'], ['Flowering', 'Yes'], ['Team leader', 'Nearby']],
    aims: ['Stop, and don’t remove or ignore the plant', 'Explain why it matters near a sensitive area', 'Seek guidance or expert identification', 'Record and report it: photo, location, log'],
    intro: 'You are working near a creek and notice a flowering plant you cannot identify. It is in the sensitive creek buffer. Talk it through with Jordan, your team leader. Choose what you would say. You get feedback after every reply.',
    turns: [
      { aim: 0, say: 'You’ve stopped. Everything all right? What’s caught your eye over there?', options: [
        { text: 'There’s a flowering plant by the creek I can’t identify. I don’t want to pull it in case it’s native.', pts: 2, fb: 'You stopped, and you said what you noticed. Not touching it keeps every option open.' },
        { text: 'Nothing, it’s just a weed. I’ll pull it out quickly.', pts: 0, fb: 'You have not identified it. If it is a protected native you could damage it, and pulling a weed wrongly can spread seed.' },
        { text: 'It might be a weed. I’ll mention it later.', pts: 1, fb: 'You noticed it, but later may be too late. Flag unusual finds while you are still there.' } ] },
      { aim: 1, say: 'Fair enough. Why not just pull it out and be done with it?', options: [
        { text: 'It’s on the creek buffer. If it’s a protected native or a weed, pulling it wrongly could damage the bank or spread seed into the water.', pts: 2, fb: 'Clear reasoning: the location is sensitive and the plant is unknown, so the risk goes both ways.' },
        { text: 'I suppose we could. It’s only one plant.', pts: 0, fb: 'One plant can be the start of a spread, or a protected species. Slow down near sensitive areas.' },
        { text: 'I’m not sure. It just seems risky.', pts: 1, fb: 'Good instinct. Next time say why: the creek buffer is sensitive and you do not know what the plant is.' } ] },
      { aim: 2, say: 'So what do you want to do about it?', options: [
        { text: 'Can we get it identified before anyone touches it? You or the ecologist would know.', pts: 2, fb: 'You asked before acting. Expert identification decides whether it is protected, invasive or harmless.' },
        { text: 'Pull it and bag it so it can’t spread.', pts: 0, fb: 'Bagging sounds careful, but removal comes after identification, not before.' },
        { text: 'Leave it and carry on.', pts: 1, fb: 'Leaving it alone is safer than pulling it, but nobody finds out what it is.' } ] },
      { aim: 3, say: 'Good thinking. What does the weed team need from us to find it again?', options: [
        { text: 'A photo, a pin dropped on the map and a log entry with the date.', pts: 2, fb: 'Photo, location and log is the full record. Anyone can find the plant again from that.' },
        { text: 'I’ll remember roughly where it was.', pts: 0, fb: 'Memory is not a record. Others cannot find a plant from “roughly there”.' },
        { text: 'Just the plant name once we work it out.', pts: 1, fb: 'The name helps, but the photo, the location and the log come first.' } ] }
    ],
    outro: 'Perfect. Snap it, drop a pin and log it, and I’ll flag it with the ecologist this arvo.',
    next: 'Next time, mention the wash-down point before you leave the area, so seed does not travel on boots and tyres.'
  },
  quiz: [
    { q: 'What is one purpose of conservation?', options: ['Removing all vegetation from a site', 'Protecting and managing natural environments', 'Avoiding outdoor work', 'Making sites look tidy'], answer: 1, why: 'Conservation protects and manages natural environments so they stay healthy.' },
    { q: 'Why is native vegetation important?', options: ['It gives habitat and food to native wildlife, and helps keep soil and waterways healthy', 'It makes work sites easier to drive through', 'It is only important in national parks', 'It does not matter once weeds are removed'], answer: 0, why: 'Native plants support wildlife and protect soil and water.' },
    { q: 'Which of these describes the “Protect” responsibility?', options: ['Telling your supervisor what you saw', 'Reading the signs on site', 'Taking care to minimise unnecessary impacts from your work, vehicles and equipment', 'Asking someone to identify a plant'], answer: 2, why: 'Protect means minimising unnecessary environmental impacts from your work, vehicles and equipment.' },
    { q: 'You find an unfamiliar flowering plant beside a creek. What should you do first?', options: ['Pull it out so it cannot spread', 'Ignore it, because it is probably harmless', 'Spray it straight away', 'Stop, leave it alone, then photograph it, record the location and tell your team leader'], answer: 3, why: 'Stop, do not remove it, and record and report it so an expert can identify it.' },
    { q: 'Which statement is most appropriate?', options: ['Environmental responsibility is everyone’s concern', 'Only environmental specialists need to care about environmental impacts', 'Procedures are optional when you are in a hurry', 'Safety is separate from conservation work'], answer: 0, why: 'Everyone on site shares responsibility for protecting the environment.' }
  ],
  takeaway: { title: 'Your first-placement takeaway', text: 'Before your first placement, remember the five responsibilities: Observe, Follow, Protect, Report, Ask. If you find something you do not recognise, stop, record it and ask.' },
  video: {
    src: 'media/walkthrough.mp4',
    title: 'See how the full course works',
    desc: 'A one-minute silent walkthrough of the Environmental Compliance and Land Management trainee course: lesson menu, the “Five responsibilities” workflow, the “Spot what needs attention” image activity, the Weed management role-play with Jordan, and the knowledge check, shown in light and dark themes.'
  },
  basis: 'This course supports your organisation’s environmental, biosecurity and safety procedures. In Victoria, relevant frameworks include the Environment Protection Act 2017 (general environmental duty), the Flora and Fauna Guarantee Act 1988 and the Catchment and Land Protection Act 1994. Always follow your site induction and your organisation’s own policies. Check legal references with your compliance lead before you publish.'
};
