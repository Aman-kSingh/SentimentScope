/* ============================================================
   charts.js — Chart Drawing Functions (uses Chart.js library)
   SentimentScope | MCA Final Year Project

   Chart.js docs: https://www.chartjs.org/docs/latest/

   HOW TO CUSTOMIZE CHARTS:
   - Change colors in SENTIMENT_COLORS (in data.js)
   - Change chart height in charts.css (.bar-chart-wrap height)
   - Add new chart types by following the same pattern below
   ============================================================ */

/* Store chart instances so we can destroy them before redrawing.
   If we don't destroy, Chart.js throws an error on re-render. */
var donutInstance = null;
var barInstance   = null;


/* ── Draw Donut Chart ──
   Shows the % split of positive / negative / neutral
   as a ring (doughnut) chart.

   Parameters:
   - pos (number): positive percentage, e.g. 58
   - neg (number): negative percentage, e.g. 22
   - neu (number): neutral percentage,  e.g. 20
*/
function drawDonut(pos, neg, neu) {
  /* Destroy old chart if it exists */
  if (donutInstance) {
    donutInstance.destroy();
  }

  var ctx = document.getElementById('donut').getContext('2d');

  donutInstance = new Chart(ctx, {
    type: 'doughnut',

    data: {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [{
        data: [pos, neg, neu],
        backgroundColor: [
          SENTIMENT_COLORS.pos,   /* green  */
          SENTIMENT_COLORS.neg,   /* red    */
          SENTIMENT_COLORS.neu    /* amber  */
        ],
        borderWidth: 0,     /* No border between segments */
        hoverOffset: 4      /* Segments expand slightly on hover */
      }]
    },

    options: {
      responsive: false,       /* Fixed size (set by canvas width/height in HTML) */
      cutout: '65%',           /* Makes it a ring. 0% = pie chart, 100% = invisible */
      plugins: {
        legend: {
          display: false       /* We draw our own legend below */
        },
        tooltip: {
          callbacks: {
            /* Custom tooltip: show "Positive: 58%" */
            label: function(context) {
              return ' ' + context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });

  /* ── Draw Custom Legend ──
     Chart.js legend is ugly. We build our own in HTML.
  */
  var legendData = [
    { label: 'Positive', pct: pos, color: SENTIMENT_COLORS.pos },
    { label: 'Negative', pct: neg, color: SENTIMENT_COLORS.neg },
    { label: 'Neutral',  pct: neu, color: SENTIMENT_COLORS.neu }
  ];

  document.getElementById('dlegend').innerHTML = legendData
    .map(function(item) {
      return (
        '<div class="legend-item">'
        + '<div class="legend-dot" style="background:' + item.color + '"></div>'
        + '<span style="color:#6b7280">' + item.label + '</span>'
        + '<span style="font-weight:700;margin-left:6px;color:#1f2937">' + item.pct + '%</span>'
        + '</div>'
      );
    })
    .join('');
}


/* ── Render Platform Sentiment Bars ──
   Shows a horizontal progress bar for each platform.
   Built with pure HTML/CSS (not Chart.js).

   Parameter:
   - platData (array): from computeMetrics().platData
     Each item: { platform, score, dom }
*/
function renderPlatformBars(platData) {
  document.getElementById('pbars').innerHTML = platData
    .map(function(p) {
      /* Color the bar based on dominant sentiment */
      var fillColor = SENTIMENT_COLORS[p.dom];

      return (
        '<div class="bar-row">'
        + '<div class="bar-label">' + p.platform + '</div>'
        + '<div class="bar-bg">'
        +   '<div class="bar-fill" style="width:' + p.score + '%;background:' + fillColor + '"></div>'
        + '</div>'
        + '<div class="bar-val">' + p.score + '%</div>'
        + '</div>'
      );
    })
    .join('');
}


/* ── Draw Bar Chart ──
   Shows one vertical bar per platform with Chart.js.
   Bar color = green/red/amber based on dominant sentiment.

   Parameters:
   - topic    (string): the topic being analyzed
   - platData (array):  from computeMetrics().platData
*/
function drawBarChart(topic, platData) {
  /* Destroy old chart if it exists */
  if (barInstance) {
    barInstance.destroy();
  }

  var ctx = document.getElementById('barChart').getContext('2d');

  /* Extract labels and values from platData */
  var labels     = platData.map(function(p) { return p.platform; });
  var scores     = platData.map(function(p) { return p.score; });

  /* Color each bar based on dominant sentiment */
  var bgColors   = platData.map(function(p) {
    /* Using rgba for slight transparency effect */
    if      (p.dom === 'pos') return 'rgba(34, 197, 94, 0.8)';   /* green */
    else if (p.dom === 'neg') return 'rgba(239, 68, 68, 0.8)';   /* red   */
    else                       return 'rgba(245, 158, 11, 0.8)';  /* amber */
  });

  barInstance = new Chart(ctx, {
    type: 'bar',

    data: {
      labels: labels,
      datasets: [{
        label: 'Sentiment score (%)',
        data: scores,
        backgroundColor: bgColors,
        borderRadius: 8,       /* Rounded bar corners */
        borderSkipped: false   /* Round all corners, not just top */
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,   /* Respects our CSS height */

      plugins: {
        legend: {
          display: false            /* Hide default legend */
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ' Score: ' + context.parsed.y + '%';
            }
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) { return value + '%'; },
            color: '#9ca3af'
          },
          grid: {
            color: '#f3f4f6'       /* Very light grid lines */
          }
        },
        x: {
          ticks: {
            color: '#6b7280'
          },
          grid: {
            display: false         /* No vertical grid lines */
          }
        }
      }
    }
  });
}
