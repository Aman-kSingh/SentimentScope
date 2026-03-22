/* ============================================================
   app.js — Main App Controller (Real-Time API Version)
   SentimentScope | MCA Final Year Project

   WHAT CHANGED FROM PREVIOUS VERSION:
   - go() is now async — it calls the real Flask backend
   - Falls back to offline mode if backend is not running
   - Added loading state, error banner, and live/offline badge
   ============================================================ */

// ── Backend URL — change this if you deploy to a server ──
//var API_URL = "http://localhost:5000";
var API_URL = "https://sentimentscope-jlqu.onrender.com";

// ── Global State ──
var platSel  = "All";
var allPosts = [];

// ── Platform Selector ──
function selPlat(el, p) {
  document.querySelectorAll(".pb").forEach(function(btn) {
    btn.classList.remove("on");
  });
  el.classList.add("on");
  platSel = p;
}

// ── Quick Topic Fill ──
function q(topic) {
  document.getElementById("tin").value = topic;
}

// ── Loading State ──
function setLoading(on) {
  var btn     = document.getElementById("analyze-btn");
  var spinner = document.getElementById("spinner");
  if (on) {
    btn.disabled          = true;
    btn.textContent       = "Fetching real data...";
    spinner.style.display = "block";
  } else {
    btn.disabled          = false;
    btn.textContent       = "🔍 Analyze";
    spinner.style.display = "none";
  }
}

// ── Error Banner ──
function showError(msg) {
  var el = document.getElementById("error-banner");
  el.textContent   = "⚠️ " + msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 6000);
}

// ── API Status Badge ──
function showApiStatus(isLive) {
  var el = document.getElementById("api-status");
  if (!el) return;
  if (isLive) {
    el.textContent      = "✅ Live data — YouTube & Reddit";
    el.style.background = "#dcfce7";
    el.style.color      = "#15803d";
  } else {
    el.textContent      = "⚡ Offline mode — run Flask backend for live data";
    el.style.background = "#fef9c3";
    el.style.color      = "#a16207";
  }
  el.style.display = "block";
}

// ════════════════════════════════════════════
//  MAIN ANALYZE FUNCTION
// ════════════════════════════════════════════
async function go() {
  var topic = document.getElementById("tin").value.trim();
  if (!topic) { document.getElementById("tin").focus(); return; }

  document.getElementById("empty").style.display        = "none";
  document.getElementById("results").style.display      = "none";
  document.getElementById("error-banner").style.display = "none";
  setLoading(true);

  var metrics = null;
  var isLive  = false;

  // ── Try real Flask backend ──
  try {
    var url = API_URL + "/analyze"
            + "?topic="    + encodeURIComponent(topic)
            + "&platform=" + encodeURIComponent(platSel);

    var response = await fetch(url, { signal: AbortSignal.timeout(15000) });

    if (!response.ok) {
      var errData = await response.json();
      throw new Error(errData.error || "API returned an error");
    }

    metrics = await response.json();
    isLive  = true;

  } catch (err) {
    // Backend not running — use offline simulation
    console.warn("Backend offline, using simulated data:", err.message);
    metrics = computeMetrics(topic);
    isLive  = false;
  }

  setLoading(false);

  // ── Metric Cards ──
  document.getElementById("m-total").textContent = metrics.total.toLocaleString();
  document.getElementById("m-tsub").textContent  = "via " + platSel.toLowerCase();
  document.getElementById("m-pos").textContent   = metrics.pos + "%";
  document.getElementById("m-neg").textContent   = metrics.neg + "%";
  document.getElementById("m-score").textContent = metrics.score + "/10";
  document.getElementById("m-label").textContent = metrics.label;

  // ── Charts ──
  drawDonut(metrics.pos, metrics.neg, metrics.neu);
  renderPlatformBars(metrics.platData);
  drawBarChart(topic, metrics.platData);

  // ── Insight ──
  document.getElementById("insight-txt").textContent = isLive
    ? buildLiveInsight(topic, metrics)
    : generateInsight(topic, metrics);

  // ── Posts ──
  if (isLive && metrics.posts && metrics.posts.length) {
    allPosts = metrics.posts.map(function(p) {
      return {
        user:      p.user,
        platform:  p.platform,
        text:      p.text,
        sentiment: p.sentiment === "positive" ? "pos"
                 : p.sentiment === "negative" ? "neg" : "neu",
        time:      p.time
      };
    });
  } else {
    allPosts = generatePosts(topic, platSel);
  }

  renderPosts(allPosts);
  document.querySelectorAll(".ftab").forEach(function(t, i) {
    t.classList.toggle("on", i === 0);
  });

  document.getElementById("results").style.display = "block";
  showApiStatus(isLive);
  document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Build insight from real API data ──
function buildLiveInsight(topic, metrics) {
  var tone = metrics.pos > 60 ? "strongly positive"
           : metrics.pos > metrics.neg ? "generally positive"
           : metrics.neg > metrics.pos ? "leaning negative"
           : "fairly balanced";

  var platforms = (metrics.platData || []).map(function(p) { return p.platform; }).join(" and ");
  var out = metrics.score >= 6   ? "Overall public reception is favorable."
          : metrics.score >= 4.5 ? "Opinions are mixed with significant voices on both sides."
          :                        "Negative sentiment is dominating the conversation.";

  return 'Based on ' + metrics.total + ' real posts fetched live from ' + (platforms || "social media") +
         ', public sentiment around "' + topic + '" is ' + tone + ' — ' +
         metrics.pos + '% positive, ' + metrics.neg + '% negative, ' + metrics.neu + '% neutral. ' +
         out + ' Analysis powered by VADER NLP on your local Flask backend.';
}
