export const TIER_ORDER = ["FJ", "SL", "RU", "VM", "WO", "10", "QP", "Z/"];

const TIER_INFO = {
  FJ: {
    name: "Home Row",
    description: "Short, common words. Fingers never leave home position.",
    skillsIntroduced: ["short common words", "single clause"],
  },
  SL: {
    name: "Near Reach",
    description: "A little longer. Still calm, still simple.",
    skillsIntroduced: ["longer sentences", "compound subjects"],
  },
  RU: {
    name: "Top Reach",
    description: "Commas and multi-clause sentences start appearing.",
    skillsIntroduced: ["commas", "multi-clause sentences"],
  },
  VM: {
    name: "Bottom Reach",
    description: "Semicolons, colons, and contractions join in.",
    skillsIntroduced: ["semicolons", "colons", "contractions"],
  },
  WO: {
    name: "Full Keyboard",
    description: "Dialogue, quotation marks, and em dashes.",
    skillsIntroduced: ["quotation marks", "em dashes", "dialogue"],
  },
  10: {
    name: "Number Row",
    description: "Digits, currency, dates, and percentages.",
    skillsIntroduced: ["numbers", "currency", "dates", "percentages"],
  },
  QP: {
    name: "Pinky Corners",
    description: "Parentheses, ALL CAPS, and nested clauses.",
    skillsIntroduced: [
      "parentheses",
      "ALL CAPS phrases",
      "nested clauses",
      "uncommon vocabulary",
    ],
  },
  "Z/": {
    name: "Full Reach",
    description:
      "The pinky's hardest stretch, layered on every challenge that came before it.",
    skillsIntroduced: [
      "everything above, combined",
      "code-like syntax",
      "dense punctuation",
    ],
  },
};

// tier -> assumed typing speed (WPM), used to estimate typing time.
// Harder tiers assume a slower realistic WPM, since denser text slows
// typists down.
const TIER_ASSUMED_WPM = {
  FJ: 48,
  SL: 44,
  RU: 41,
  VM: 38,
  WO: 35,
  10: 32,
  QP: 28,
  "Z/": 23,
};

// Minimum recommended round duration per tier (seconds), as a floor --
// harder tiers get more breathing room even for a short prompt.
const TIER_DURATION_FLOOR = {
  FJ: 20,
  SL: 30,
  RU: 40,
  VM: 50,
  WO: 60,
  10: 60,
  QP: 75,
  "Z/": 90,
};

export const PROMPTS = [
  {
    id: "fj-1",
    title: "Warm Sun, Soft Grass",
    tier: "FJ",
    tags: ["daily-life", "nature"],
    text: "The sun was warm and the grass was soft under our feet as we walked.",
  },
  {
    id: "sl-4",
    title: "The Hallway Clock",
    tier: "SL",
    tags: ["daily-life"],
    text: "The old clock in the hallway still ticks loudly, even though nobody has wound it in years.",
  },
  {
    id: "vm-3",
    title: "Delayed at the Gate",
    tier: "VM",
    tags: ["travel"],
    text: "The flight was delayed for hours; passengers wandered the terminal, bought overpriced coffee, and complained loudly about missing connections they'd never make on time.",
  },
  {
    id: "num-2",
    title: "Flight 482",
    tier: "10",
    tags: ["travel", "numbers"],
    text: "Flight 482 departs at 7:45 AM from Gate 22B; boarding begins 30 minutes prior, and passengers must arrive at least 2 hours before departure.",
  },
  {
    id: "fr-1",
    title: "Shipment #88213-B",
    tier: "Z/",
    tags: ["dialogue", "finance", "numbers"],
    text: '"Confirm shipment #88213-B," the dispatcher read aloud, "Qty: 12 units @ $3.49/ea (=$41.88), plus 8.25% tax ($3.46) -- total due: $45.34, payable by 11/30 -- and, if it\'s not too much trouble, could someone finally fix the printer in Bay 6? It\'s been jamming since Tuesday, and frankly, nobody\'s had the patience (or the screwdriver) to deal with it properly."',
  },
  {
    id: "fj-4",
    title: "Morning Air",
    tier: "FJ",
    tags: ["daily-life"],
    text: "He opened the window and let the cool morning air fill the room.",
  },
  {
    id: "ru-3",
    title: "The Old Bookstore",
    tier: "RU",
    tags: ["daily-life"],
    text: "The old bookstore smelled of dust and paper, its narrow aisles crowded with novels, maps, and forgotten diaries nobody had opened in decades.",
  },
  {
    id: "wo-2",
    title: "He's Just Tired",
    tier: "WO",
    tags: ["dialogue"],
    text: "\"I don't think that's what he meant,\" she whispered, glancing nervously toward the door. \"He's not angry -- he's just tired, and he hasn't eaten since morning.\"",
  },
  {
    id: "qp-1",
    title: "The Ancient Manuscript",
    tier: "QP",
    tags: ["mystery"],
    text: "The ancient manuscript (found, remarkably, in near-perfect condition) described a ritual so obscure that even the university's most seasoned archivists -- normally unshakeable -- admitted they'd never encountered anything quite like it before; naturally, the exhibit sold out within hours.",
  },
  {
    id: "fr-4",
    title: "Protocol #7",
    tier: "Z/",
    tags: ["instructional", "all-caps", "numbers"],
    text: 'DO NOT -- under any circumstances -- attempt to override Protocol #7 without written authorization (Form 22-C, signed & dated); violations, however minor, will be logged, reviewed, and reported to Compliance within 24 hrs., no exceptions, no appeals, and absolutely no "I didn\'t know" excuses accepted after 11:59 PM tonight.',
  },
  {
    id: "sl-3",
    title: "The Evening Garden",
    tier: "SL",
    tags: ["daily-life", "nature"],
    text: "My neighbor waters her garden every evening, humming quietly to herself while the birds settle in the trees.",
  },
  {
    id: "vm-2",
    title: "Measure Twice, Cut Once",
    tier: "VM",
    tags: ["motivational"],
    text: "There's a simple rule in carpentry: measure twice, cut once. It's a lesson my grandfather taught me long before I ever picked up a saw myself.",
  },
  {
    id: "num-1",
    title: "The Renovation Quote",
    tier: "10",
    tags: ["business", "numbers"],
    text: "The contractor quoted $12,450 for the renovation, due in 3 installments of $4,150 each, with the final payment expected no later than 06/30.",
  },
  {
    id: "qp-4",
    title: "Season It Until It Scares You",
    tier: "QP",
    tags: ["dialogue", "food"],
    text: 'The chef\'s philosophy was simple, if a little eccentric: "Season it until it scares you, then pull back exactly one pinch" -- advice that, admittedly, took years of scorched sauces to fully appreciate.',
  },
  {
    id: "fj-3",
    title: "By the Fire",
    tier: "FJ",
    tags: ["daily-life"],
    text: "We sat by the fire and talked until it was very late at night.",
  },
  {
    id: "ru-2",
    title: "The Meeting That Ran Late",
    tier: "RU",
    tags: ["business"],
    text: "Even though the meeting ran late, everyone stayed focused, taking careful notes and asking thoughtful questions until every detail had been settled.",
  },
  {
    id: "wo-1",
    title: "Over a Little Rain?",
    tier: "WO",
    tags: ["dialogue", "travel"],
    text: '"You can\'t be serious," Maria said, laughing despite herself. "We\'ve been planning this trip for six months, and now you want to cancel it over a little rain?"',
  },
  {
    id: "num-4",
    title: "Room 314",
    tier: "10",
    tags: ["logistics", "numbers"],
    text: "Room 314 is booked from 9:00 to 11:30 on the 14th; please confirm attendance for all 8 participants by end of day Thursday.",
  },
  {
    id: "fr-3",
    title: "Six Lines, Two All-Nighters",
    tier: "Z/",
    tags: ["code", "humor"],
    text: 'function validate(input) { if (!input || input.length === 0) throw new Error("Empty input @ line 42!"); return input.trim().toLowerCase(); } -- a six-line function, yet it took three engineers, two coffee-fueled all-nighters, and exactly 1 very awkward code review to finally get it right.',
  },
  {
    id: "sl-2",
    title: "Sandcastle at the Shore",
    tier: "SL",
    tags: ["daily-life", "nature"],
    text: "The children built a small sandcastle near the water and watched the waves slowly wash it away.",
  },
  {
    id: "vm-1",
    title: "Patience and Dough",
    tier: "VM",
    tags: ["food"],
    text: "The recipe wasn't complicated; it just required patience, a steady hand, and enough time for the dough to rise properly before it went into the oven.",
  },
  {
    id: "wo-4",
    title: "We'll Figure It Out",
    tier: "WO",
    tags: ["dialogue"],
    text: '"We\'ll figure it out," he said, though his voice wavered just enough that nobody in the room actually believed him.',
  },
  {
    id: "qp-3",
    title: "The Tribunal's Ruling",
    tier: "QP",
    tags: ["legal", "formal"],
    text: "Notwithstanding the ambiguity of the original clause, the tribunal concluded (somewhat reluctantly) that the defendant's obligation persisted -- a decision that surprised almost nobody familiar with the judge's famously exacting interpretation of precedent.",
  },
  {
    id: "fj-2",
    title: "A Puppy and Some Bread",
    tier: "FJ",
    tags: ["animals", "daily-life"],
    text: "She smiled at the puppy and gave it a small piece of bread.",
  },
  {
    id: "ru-1",
    title: "Trail to the Summit",
    tier: "RU",
    tags: ["nature", "travel"],
    text: "The mountain trail was steeper than we expected, winding through thick pine forest before opening onto a wide, sunlit meadow near the summit.",
  },
  {
    id: "vm-4",
    title: "Two Apartments",
    tier: "VM",
    tags: ["daily-life"],
    text: "She couldn't decide between the two apartments: one had better light, the other a shorter commute. In the end, the view from the balcony won her over.",
  },
  {
    id: "num-3",
    title: "25% Off",
    tier: "10",
    tags: ["finance", "numbers"],
    text: "The store is offering 25% off all items over $50, plus an additional 10% for members -- bringing a $120 jacket down to roughly $81.",
  },
  {
    id: "fr-2",
    title: "Section 4.2, Subsection B",
    tier: "Z/",
    tags: ["legal", "formal"],
    text: "Although the committee had, after considerable -- and frankly exhausting -- deliberation, agreed in principle to the proposal (Section 4.2, Subsection B), its implementation was delayed indefinitely by a series of minor, seemingly unrelated bureaucratic obstacles; notwithstanding the foregoing, the party of the first part shall retain all rights not expressly and unambiguously waived herein.",
  },
  {
    id: "sl-1",
    title: "The Long Way Home",
    tier: "SL",
    tags: ["travel", "daily-life"],
    text: "After breakfast, we decided to take the long path through the forest instead of the usual shortcut home.",
  },
  {
    id: "ru-4",
    title: "Stuck in Traffic",
    tier: "RU",
    tags: ["daily-life", "travel"],
    text: "Traffic crawled along the highway for nearly an hour, so we turned on the radio, rolled down the windows, and let the afternoon pass slowly.",
  },
  {
    id: "wo-3",
    title: "Wet Paint",
    tier: "WO",
    tags: ["dialogue", "humor"],
    text: 'The sign above the door read: "Wet Paint -- Do Not Touch," which, naturally, was the first thing everyone reached out to check for themselves.',
  },
  {
    id: "qp-2",
    title: "Disconnect the Power Supply",
    tier: "QP",
    tags: ["instructional", "all-caps"],
    text: "WARNING: DO NOT ATTEMPT TO RECALIBRATE THE SENSOR WITHOUT FIRST DISCONNECTING THE POWER SUPPLY -- failure to follow this procedure (even once) has, in prior incidents, resulted in irreversible damage to the primary unit.",
  },
];

// ---------- Duration estimation ----------

const DURATION_ROUNDING_INTERVAL_SECONDS = 15;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateDurationSeconds(text, tier) {
  const words = countWords(text);
  const wpm = TIER_ASSUMED_WPM[tier];
  const rawSeconds = (words / wpm) * 60;

  const rounded =
    Math.ceil(rawSeconds / DURATION_ROUNDING_INTERVAL_SECONDS) *
    DURATION_ROUNDING_INTERVAL_SECONDS;

  return Math.max(rounded, TIER_DURATION_FLOOR[tier]);
}

function formatDurationLabel(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

for (const prompt of PROMPTS) {
  const seconds = estimateDurationSeconds(prompt.text, prompt.tier);
  prompt.recommendedRoundDurationSeconds = seconds;
  prompt.recommendedRoundDurationLabel = formatDurationLabel(seconds);
}
