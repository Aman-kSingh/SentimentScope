/* ============================================================
   posts.js — Post Generation & Rendering
   SentimentScope | MCA Final Year Project
   ============================================================ */


/* ── Generate Sample Posts ──
   Creates 10 realistic-looking social media posts
   for the given topic and platform filter.

   Parameters:
   - topic      (string): e.g. "Tesla"
   - platFilter (string): "All", "Twitter/X", "Reddit", etc.

   Returns: array of post objects
   [
     { user, platform, text, sentiment, time }
   ]
*/
function generatePosts(topic, platFilter) {
  var posts    = [];
  var platList = (platFilter === 'All') ? PLATFORMS : [platFilter];

  for (var i = 0; i < 10; i++) {
    /* Determine sentiment type for this post (4 pos, 3 neg, 3 neu) */
    var sentimentType = POST_TYPES[i];

    /* Pick the template for this position */
    var template = POSTS[sentimentType][i];

    /* Replace {T} placeholder with the actual topic */
    var postText = template.replace(/\{T\}/g, topic);

    /* Pick platform, user, time using hash so it's consistent */
    var platform = platList[ hash(topic + i)     % platList.length ];
    var user     = USERS   [ hash(topic + i + 5) % USERS.length    ];
    var time     = TIMES   [ hash(topic + i + 9) % TIMES.length    ];

    posts.push({
      user:      user,
      platform:  platform,
      text:      postText,
      sentiment: sentimentType,   /* 'pos', 'neg', or 'neu' */
      time:      time
    });
  }

  return posts;
}


/* ── Render Posts to DOM ──
   Takes an array of post objects and builds the HTML
   to display them in the #plist container.

   Parameter:
   - posts (array): from generatePosts() or filtered subset
*/
function renderPosts(posts) {
  var container = document.getElementById('plist');

  /* Handle empty state */
  if (!posts.length) {
    container.innerHTML =
      '<div style="text-align:center;padding:24px;color:#9ca3af;font-size:13px">'
      + 'No posts found for this filter.'
      + '</div>';
    return;
  }

  /* Build HTML for each post */
  container.innerHTML = posts
    .map(function(post, index) {
      /* Pick avatar colors cyclically */
      var avatar = AVATARS[index % AVATARS.length];

      /* CSS class for the sentiment pill */
      var pillClass = (post.sentiment === 'pos') ? 'pill-pos'
                    : (post.sentiment === 'neg') ? 'pill-neg'
                    :                              'pill-neu';

      /* Label text for the pill */
      var pillLabel = (post.sentiment === 'pos') ? 'Positive'
                    : (post.sentiment === 'neg') ? 'Negative'
                    :                              'Neutral';

      /* Arrow icon for the pill */
      var arrow = (post.sentiment === 'pos') ? '↑'
                : (post.sentiment === 'neg') ? '↓'
                :                              '→';

      /* Platform icon (X, R, IG, YT) */
      var platformIcon = PLATFORM_ICONS[post.platform] || post.platform;

      /* First letter of username for the avatar circle */
      var avatarInitial = post.user[0].toUpperCase();

      return (
        '<div class="post-item">'

        /* Avatar Circle */
        + '<div class="avatar" style="background:' + avatar.bg + ';color:' + avatar.c + '">'
        +   avatarInitial
        + '</div>'

        /* Post Content */
        + '<div style="flex:1">'

        +   '<div class="post-meta">'
        +     '<span class="post-user">@' + post.user + '</span>'
        +     '<span class="post-plat">' + platformIcon + ' ' + post.platform + '</span>'
        +     '<span class="pill ' + pillClass + '">' + arrow + ' ' + pillLabel + '</span>'
        +     '<span class="post-time">' + post.time + '</span>'
        +   '</div>'

        +   '<div class="post-text">' + post.text + '</div>'

        + '</div>'
        + '</div>'
      );
    })
    .join('');
}


/* ── Filter Posts ──
   Called when the user clicks All / Positive / Negative / Neutral tabs.
   Filters allPosts (global) and re-renders.

   Parameters:
   - type (string): 'all', 'pos', 'neg', or 'neu'
   - el   (element): the tab button that was clicked
*/
function flt(type, el) {
  /* Update active tab styling */
  document.querySelectorAll('.ftab').forEach(function(tab) {
    tab.classList.remove('on');
  });
  el.classList.add('on');

  /* Filter the global allPosts array */
  var filtered = (type === 'all')
    ? allPosts
    : allPosts.filter(function(post) { return post.sentiment === type; });

  renderPosts(filtered);
}
