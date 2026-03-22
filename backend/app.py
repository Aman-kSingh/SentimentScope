# ============================================================
# app.py — Flask Backend for SentimentScope
# ============================================================
# INSTALL DEPENDENCIES:
#   pip install flask flask-cors vaderSentiment praw google-api-python-client
#
# RUN:
#   python app.py
#   API runs at: http://localhost:5000
# ============================================================

from flask import Flask, jsonify, request
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from googleapiclient.discovery import build
import time


app = Flask(__name__)
CORS(app)   # Allows your HTML frontend to call this API

# ── VADER NLP Analyzer (runs locally, no API key needed) ──
analyzer = SentimentIntensityAnalyzer()

# ════════════════════════════════════════════════════════════
#   PASTE YOUR API KEYS BELOW
#   See README.md for how to get free keys
# ════════════════════════════════════════════════════════════
YOUTUBE_API_KEY      = "AIzaSyDkSx5F4K3HujpPUL7sQ5WqIoCi6Fkbuyw"
#REDDIT_CLIENT_ID     = "PASTE_YOUR_REDDIT_CLIENT_ID_HERE"
#REDDIT_CLIENT_SECRET = "PASTE_YOUR_REDDIT_CLIENT_SECRET_HERE"
# ════════════════════════════════════════════════════════════

# Initialize API clients
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)


#  reddit = praw.Reddit(
#     client_id     = REDDIT_CLIENT_ID,
#     client_secret = REDDIT_CLIENT_SECRET,
#     user_agent    = "SentimentScope/1.0 MCA Project"
# )

# ── Helper: Classify VADER compound score into sentiment label ──
# VADER compound score ranges from -1.0 (most negative) to +1.0 (most positive)
# Standard thresholds: >= 0.05 positive, <= -0.05 negative, else neutral
def classify(score):
    if score >= 0.05:  return "positive"
    if score <= -0.05: return "negative"
    return "neutral"


# ── Helper: Convert Unix timestamp to readable "time ago" ──
def time_ago(created_utc):
    diff = int(time.time()) - int(created_utc)
    if diff < 60:    return "just now"
    if diff < 3600:  return f"{diff // 60}m ago"
    if diff < 86400: return f"{diff // 3600}h ago"
    return f"{diff // 86400}d ago"


# ════════════════════════════════════════════════════════════
#   MAIN ROUTE: GET /analyze?topic=Tesla&platform=all
# ════════════════════════════════════════════════════════════
@app.route("/analyze")
def analyze():
    topic    = request.args.get("topic", "").strip()
    platform = request.args.get("platform", "all").lower()

    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    all_posts = []

    # ────────────────────────────────
    #  FETCH FROM YOUTUBE
    # ────────────────────────────────
    if platform in ("all", "youtube"):
        try:
            # Search for videos matching the topic
            search_resp = youtube.search().list(
                q          = topic,
                part       = "id",
                maxResults = 5,
                type       = "video"
            ).execute()

            video_ids = [item["id"]["videoId"] for item in search_resp.get("items", [])]

            # Get comments from the top 3 videos
            for vid_id in video_ids[:3]:
                try:
                    comments_resp = youtube.commentThreads().list(
                        part       = "snippet",
                        videoId    = vid_id,
                        maxResults = 10,
                        textFormat = "plainText",
                        order      = "relevance"
                    ).execute()

                    for item in comments_resp.get("items", []):
                        snip   = item["snippet"]["topLevelComment"]["snippet"]
                        text   = snip["textDisplay"]
                        author = snip["authorDisplayName"]
                        date   = snip["publishedAt"][:10]   # Just the date part

                        # Run VADER sentiment analysis on the comment text
                        scores = analyzer.polarity_scores(text)

                        all_posts.append({
                            "user":      author,
                            "platform":  "YouTube",
                            "text":      text[:220],           # Truncate very long comments
                            "sentiment": classify(scores["compound"]),
                            "score":     round(scores["compound"], 4),
                            "time":      date
                        })
                except Exception:
                    pass   # Some videos have comments disabled — skip them

        except Exception as e:
            print(f"[YouTube Error] {e}")

    # ────────────────────────────────
    #  FETCH FROM REDDIT
    # ────────────────────────────────
    # if platform in ("all", "reddit"):
    #     try:
    #         # Search across all subreddits
    #         for submission in reddit.subreddit("all").search(topic, limit=10, sort="new"):

    #             # Analyze the post title
    #             scores = analyzer.polarity_scores(submission.title)
    #             all_posts.append({
    #                 "user":      str(submission.author) if submission.author else "[deleted]",
    #                 "platform":  "Reddit",
    #                 "text":      submission.title,
    #                 "sentiment": classify(scores["compound"]),
    #                 "score":     round(scores["compound"], 4),
    #                 "time":      time_ago(submission.created_utc)
    #             })

        #         # Also analyze top 3 comments from each post
        #         submission.comments.replace_more(limit=0)
        #         for comment in list(submission.comments)[:3]:
        #             if hasattr(comment, "body") and len(comment.body) > 10:
        #                 s = analyzer.polarity_scores(comment.body)
        #                 all_posts.append({
        #                     "user":      str(comment.author) if comment.author else "[deleted]",
        #                     "platform":  "Reddit",
        #                     "text":      comment.body[:220],
        #                     "sentiment": classify(s["compound"]),
        #                     "score":     round(s["compound"], 4),
        #                     "time":      time_ago(comment.created_utc)
        #                 })

        # except Exception as e:
        #     print(f"[Reddit Error] {e}")

    # ── No posts found ──
    if not all_posts:
        return jsonify({"error": "No posts found. Try a different topic."}), 404

    # ────────────────────────────────
    #  CALCULATE OVERALL METRICS
    # ────────────────────────────────
    total     = len(all_posts)
    pos_count = sum(1 for p in all_posts if p["sentiment"] == "positive")
    neg_count = sum(1 for p in all_posts if p["sentiment"] == "negative")

    pos_pct = round((pos_count / total) * 100)
    neg_pct = round((neg_count / total) * 100)
    neu_pct = 100 - pos_pct - neg_pct

    # Scale VADER compound average (-1..+1) to a 0..10 score
    avg_compound    = sum(p["score"] for p in all_posts) / total
    sentiment_score = round(5 + avg_compound * 5, 1)

    if   sentiment_score >= 7.5: label = "Very Positive"
    elif sentiment_score >= 6.0: label = "Mostly Positive"
    elif sentiment_score >= 4.5: label = "Balanced"
    elif sentiment_score >= 3.0: label = "Mixed"
    else:                         label = "Mostly Negative"

    # ── Per-platform breakdown ──
    platforms_found = list(set(p["platform"] for p in all_posts))
    platform_data   = []
    for plat in platforms_found:
        plat_posts = [p for p in all_posts if p["platform"] == plat]
        plat_pos   = sum(1 for p in plat_posts if p["sentiment"] == "positive")
        plat_score = round((plat_pos / len(plat_posts)) * 100)
        dom        = "pos" if plat_score > 58 else "neg" if plat_score < 40 else "neu"
        platform_data.append({"platform": plat, "score": plat_score, "dom": dom})

    # ── Return final JSON ──
    return jsonify({
        "topic":    topic,
        "total":    total,
        "pos":      pos_pct,
        "neg":      neg_pct,
        "neu":      neu_pct,
        "score":    sentiment_score,
        "label":    label,
        "platData": platform_data,
        "posts":    all_posts[:20]     # Return top 20 posts to frontend
    })


# ── Health Check Route ──
@app.route("/health")
def health():
    return jsonify({"status": "ok", "message": "SentimentScope API is running"})


if __name__ == "__main__":
    print("\n✅  SentimentScope backend running at http://localhost:5000")
    print("📡  Open index.html in your browser to use the app\n")
    app.run(debug=True, port=5000)
