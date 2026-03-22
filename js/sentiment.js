/* ============================================================
   sentiment.js — Core Sentiment Analysis Logic
   SentimentScope | MCA Final Year Project

   HOW IT WORKS:
   1. We use a "hash" function to turn any topic string into a
      consistent number. Same topic → same number every time.
   2. We use that number to deterministically generate sentiment
      percentages (positive, negative, neutral).
   3. This simulates what a real ML model would return, but
      works 100% offline without any API.

   In a real production system, you would:
   - Replace computeMetrics() with a call to a Python ML backend
   - Use libraries like VADER, TextBlob, or a fine-tuned BERT model
   - Feed real scraped tweets/posts into the model
   ============================================================ */


/* ── Hash Function ──
   Converts a string into a consistent integer.
   Same string always gives same number (deterministic).
   This is the djb2 algorithm — very common in CS.
*/
function hash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    /* Bitwise left shift + subtract = fast multiply by 31 */
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}


/* ── Seeded Random Number (0 to 1) ──
   Like Math.random() but takes a seed number,
   so it always returns the same value for the same seed.
   Uses the sine wave trick for pseudo-randomness.
*/
function seededRandom(seed) {
  var x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);   /* Fractional part only → 0 to 1 */
}


/* ── Random Integer in a Range ──
   Returns a whole number between min and max (inclusive).
   Example: randomInt(900, 4500) → 2347
*/
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* ── Compute Sentiment Metrics ──
   Takes a topic string and returns all the numbers
   needed to fill the dashboard.

   Returns an object like:
   {
     pos: 58,          ← positive %
     neg: 22,          ← negative %
     neu: 20,          ← neutral %
     score: 7.3,       ← sentiment score out of 10
     label: 'Mostly Positive',
     total: 2341,      ← total posts analyzed
     platData: [...]   ← per-platform data
   }
*/
function computeMetrics(topic) {
  var h = hash(topic);

  /* ── Calculate positive % ──
     Range: 38% to 76% (38 + 0..38)
     seededRandom(h) gives a value 0 to 1
  */
  var pos = Math.round(38 + seededRandom(h) * 38);

  /* ── Calculate negative % ──
     Range: 14% to 42% (14 + 0..28)
     Uses a different seed (h+1) so it's independent
  */
  var neg = Math.round(14 + seededRandom(h + 1) * 28);

  /* ── Make sure pos + neg doesn't exceed 92% ──
     Leaves at least 8% for neutral
  */
  if (pos + neg > 92) {
    neg = 92 - pos;
  }

  /* ── Neutral = whatever is left ── */
  var neu = 100 - pos - neg;

  /* ── Sentiment Score (0 to 10) ──
     Formula: base 3.5 + up to 6.5 based on positive %
     More positive → higher score
  */
  var score = parseFloat((3.5 + (pos / 100) * 6.5).toFixed(1));

  /* ── Sentiment Label ── */
  var label;
  if      (score >= 7.5) label = 'Very Positive';
  else if (score >= 6.0) label = 'Mostly Positive';
  else if (score >= 4.5) label = 'Balanced';
  else if (score >= 3.0) label = 'Mixed';
  else                   label = 'Mostly Negative';

  /* ── Total post count (random each run) ── */
  var total = randomInt(900, 4500);

  /* ── Per-Platform Data ──
     Each platform gets its own score, seeded differently
  */
  var platData = PLATFORMS.map(function(platform, index) {
    /* Different seed per platform using index */
    var platformScore = Math.round(28 + seededRandom(h + index + 10) * 60);

    /* Dominant sentiment for color coding */
    var dominant;
    if      (platformScore > 58) dominant = 'pos';
    else if (platformScore < 40) dominant = 'neg';
    else                          dominant = 'neu';

    return {
      platform: platform,
      score:    platformScore,
      dom:      dominant
    };
  });

  return { pos, neg, neu, score, label, total, platData };
}


/* ── Generate AI Insight Text ──
   Creates a human-readable summary paragraph
   based on the computed metrics.
*/
function generateInsight(topic, metrics) {
  var tone;
  if      (metrics.pos > 60)           tone = 'strongly positive';
  else if (metrics.pos > metrics.neg)  tone = 'generally positive';
  else if (metrics.neg > metrics.pos)  tone = 'leaning negative';
  else                                  tone = 'fairly balanced';

  var driver = (metrics.pos > metrics.neg)
    ? 'enthusiasm and satisfaction among users'
    : 'criticism and concern from the community';

  var outlook;
  if      (metrics.score >= 6.0) outlook = 'Overall sentiment is favorable. Engagement is high and audience reception looks good.';
  else if (metrics.score >= 4.5) outlook = 'Sentiment is mixed with passionate voices on both sides of the debate.';
  else                            outlook = 'Negative discourse is outpacing positive mentions — worth monitoring closely.';

  return (
    'Public sentiment around "' + topic + '" is ' + tone + ', with ' +
    metrics.pos + '% positive and ' + metrics.neg + '% negative posts across platforms. ' +
    'The main conversation driver appears to be ' + driver + '. ' +
    outlook + ' Recommended action: track trending keywords and monitor daily sentiment shifts for deeper insights.'
  );
}
