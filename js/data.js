/* ============================================================
   data.js — All Static Data, Templates & Constants
   SentimentScope | MCA Final Year Project

   HOW TO CUSTOMIZE:
   - Add more post templates to POSTS.pos / POSTS.neg / POSTS.neu
   - Add more sample chips in index.html
   - Add more usernames to USERS array
   ============================================================ */

/* ── Post Templates ──
   {T} is a placeholder — it gets replaced with the topic at runtime.
   Each array has 10 templates (one per post generated).
   You can add/edit these freely!
*/
var POSTS = {

  /* Positive posts */
  pos: [
    "Absolutely loving {T} right now — genuinely impressed by the quality!",
    "Just tried {T} for the first time and wow, it exceeded every expectation.",
    "{T} keeps getting better and better. Highly recommend to everyone!",
    "Shoutout to the team behind {T} — you guys are absolutely killing it.",
    "Switched to {T} last month and it has been the best decision. No regrets.",
    "The latest {T} update is so smooth. This is how it should have always been.",
    "Can't believe how good {T} has become. This is the future right here.",
    "{T} is hands down the best in its category. Nothing else even comes close.",
    "Been using {T} for 3 months now — productivity is through the roof!",
    "The new {T} features are exactly what we asked for. Love this product."
  ],

  /* Negative posts */
  neg: [
    "Really disappointed with {T} lately. The quality has seriously dropped.",
    "Why is {T} so overpriced now? Completely lost the plot with their pricing.",
    "{T} just crashed again and I lost 2 hours of work. Absolutely furious.",
    "I am done with {T}. Switched to a competitor and never looked back.",
    "The {T} customer support is a nightmare. No one responds to anything.",
    "Can we stop pretending {T} has no issues? The bugs are real and annoying.",
    "{T} was great 2 years ago. Now it is just a money grab. Very sad.",
    "The new {T} update broke everything. Who approved this disaster?",
    "My experience with {T} has been one frustration after another. Avoid.",
    "{T} needs to seriously rethink its direction. This is unacceptable."
  ],

  /* Neutral posts */
  neu: [
    "Anyone have thoughts on {T}? Genuinely curious what the community thinks.",
    "Mixed feelings about {T} honestly — some things great, others not so much.",
    "Comparing {T} with alternatives right now. Both have clear pros and cons.",
    "Just read the {T} report. Interesting numbers — a lot to unpack here.",
    "The {T} debate continues. Hard to say who is right at this point.",
    "So many opinions flying around about {T}. Truth is probably in the middle.",
    "Has anyone done a deep dive on {T}? Would love some solid analysis.",
    "Watching the {T} situation closely. Way too early to make a final call.",
    "The {T} announcement was interesting but I need more time to think.",
    "Reading up on {T} — more nuanced and complex than the headlines suggest."
  ]
};

/* ── Platforms ── */
var PLATFORMS = ['Twitter/X', 'Reddit', 'Instagram', 'YouTube'];

/* ── Platform Icons (used in post display) ── */
var PLATFORM_ICONS = {
  'Twitter/X':  '𝕏',
  'Reddit':     'R',
  'Instagram':  'IG',
  'YouTube':    'YT'
};

/* ── Sample Usernames ── */
var USERS = [
  'raj_techie', 'priya_dev', 'kiran_codes', 'ananya_live', 'vikram99',
  'deepa_posts', 'arjun_views', 'meera_social', 'sanjay_tweets', 'rohit_talks'
];

/* ── Relative Times for posts ── */
var TIMES = [
  '2m ago', '10m ago', '25m ago', '45m ago', '1h ago',
  '2h ago', '4h ago',  '6h ago',  '10h ago', '1d ago'
];

/* ── Avatar Color Pairs (background + text color) ── */
var AVATARS = [
  { bg: '#dbeafe', c: '#1d4ed8' },  /* Blue */
  { bg: '#dcfce7', c: '#15803d' },  /* Green */
  { bg: '#fce7f3', c: '#9d174d' },  /* Pink */
  { bg: '#fef3c7', c: '#92400e' },  /* Yellow */
  { bg: '#ede9fe', c: '#6d28d9' },  /* Purple */
  { bg: '#fee2e2', c: '#b91c1c' }   /* Red */
];

/* ── Sentiment Colors (used in charts) ── */
var SENTIMENT_COLORS = {
  pos: '#22c55e',    /* green  */
  neg: '#ef4444',    /* red    */
  neu: '#f59e0b'     /* amber  */
};

/* ── Post types in order (4 pos, 3 neg, 3 neu per analysis) ── */
var POST_TYPES = ['pos', 'pos', 'pos', 'pos', 'neg', 'neg', 'neg', 'neu', 'neu', 'neu'];
