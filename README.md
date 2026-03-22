# SentimentScope 📊
### Real-Time Multi-Platform Social Media Sentiment Analyzer
**MCA Final Year Project**

---

## 📁 Project Structure

```
SentimentScope/
│
├── index.html                 ← Open this in browser to run the app
│
├── css/
│   ├── base.css               ← CSS variables, colors, reset, animations
│   ├── layout.css             ← Header, container, grid layout
│   ├── components.css         ← Cards, buttons, posts, pills, spinner
│   ├── charts.css             ← Chart wrappers and platform bars
│   └── responsive.css         ← Mobile & tablet breakpoints
│
├── js/
│   ├── data.js                ← Post templates, platforms, colors
│   ├── sentiment.js           ← Offline scoring + insight generation
│   ├── charts.js              ← Chart.js drawing functions
│   ├── posts.js               ← Post generation and rendering
│   └── app.js                 ← Main controller — calls Flask API
│
└── backend/
    ├── app.py                 ← Flask REST API (Python backend)
    └── requirements.txt       ← Python dependencies
```

---

## 🚀 Quick Start

### Step 1 — Get Free API Keys

#### YouTube Data API v3 (Free)
1. Go to https://console.cloud.google.com
2. Create a new project
3. Search "YouTube Data API v3" → Enable it
4. Go to Credentials → Create Credentials → API Key
5. Copy the key

#### Reddit API (Free)
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" at the bottom
3. Name: SentimentScope | Type: **script** | redirect uri: http://localhost
4. Copy the `client_id` (under app name) and `client_secret`

---

### Step 2 — Set Up the Backend

```bash
# Go into the backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Open app.py in VS Code and paste your API keys:
#   YOUTUBE_API_KEY      = "your key here"
#   REDDIT_CLIENT_ID     = "your id here"
#   REDDIT_CLIENT_SECRET = "your secret here"

# Run the backend
python app.py
```

You should see:
```
✅  SentimentScope backend running at http://localhost:5000
```

---

### Step 3 — Open the Frontend

- Open `index.html` in your browser (or use VS Code Live Server)
- Type any topic → Click **Analyze**
- The app fetches **real posts** from YouTube & Reddit
- VADER NLP classifies each post as positive / negative / neutral
- Results appear on the dashboard in real time!

---

## ⚡ Offline Mode (No Backend)

If the Flask backend is **not running**, the app automatically falls back to **offline simulation mode** — it still works and shows charts, just with generated data instead of real posts.

The status badge in results will tell you which mode is active:
- 🟢 **"Live data — YouTube & Reddit"** → Backend is running, real data
- 🟡 **"Offline mode"** → Backend not running, simulated data

---

## 🧠 How the Real-Time Analysis Works

```
User enters topic "Tesla"
         ↓
Frontend (app.js) calls:
  GET http://localhost:5000/analyze?topic=Tesla&platform=all
         ↓
Flask backend (app.py):
  1. Calls YouTube Data API → fetches video comments about "Tesla"
  2. Calls Reddit API (PRAW) → fetches posts & comments about "Tesla"
  3. Runs each text through VADER NLP
     → compound score: -1.0 (very negative) to +1.0 (very positive)
     → >= 0.05  = Positive
     → <= -0.05 = Negative
     → else     = Neutral
  4. Aggregates scores into percentages
  5. Returns JSON with metrics + posts
         ↓
Frontend renders:
  - Metric cards (total, pos%, neg%, score/10)
  - Donut chart + bar charts
  - AI insight paragraph
  - Real post feed with sentiment pills
```

---

## 🛠️ How to Customize

### Change brand color
In `css/base.css`:
```css
:root {
  --primary: #6366f1;   /* Change this to any hex color */
}
```

### Add more topics (chips)
In `index.html`:
```html
<button class="chip" onclick="q('Your Topic')">Your Topic</button>
```

### Fetch more posts
In `backend/app.py`:
```python
# YouTube: change maxResults (max 50 per video)
comments_resp = youtube.commentThreads().list(maxResults=20, ...)

# Reddit: change limit (max 100)
reddit.subreddit("all").search(topic, limit=25, ...)
```

### Deploy backend to a server
1. Deploy `backend/app.py` to Render.com or Railway.app (free)
2. In `js/app.js`, change:
```javascript
var API_URL = "https://your-deployed-backend.com";
```

---

## 📚 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, JavaScript | UI and charts |
| Charts | Chart.js 4.4 | Donut & bar charts |
| Backend | Python, Flask | REST API server |
| NLP | VADER Sentiment | Sentiment scoring |
| Data | YouTube Data API v3 | Real video comments |
| Data | Reddit API (PRAW) | Real posts & comments |
| CORS | Flask-CORS | Allows frontend to call backend |

---

## 🎓 Viva Q&A

**Q: What is VADER?**
> VADER (Valence Aware Dictionary and sEntiment Reasoner) is a lexicon and rule-based sentiment analysis tool specifically designed for social media text. It returns a compound score from -1 to +1. We classify >= 0.05 as positive, <= -0.05 as negative, and the rest as neutral.

**Q: Why did you choose VADER over BERT or other ML models?**
> VADER is specifically optimized for short social media text — it handles slang, emojis, capitalization, and punctuation rules. It requires no training data, no GPU, and runs instantly. For a real-time dashboard, VADER's speed (thousands of texts per second) outweighs the marginal accuracy gain of transformer-based models.

**Q: How does the app handle API failures?**
> The frontend uses a try/catch with async/await. If the Flask backend is unreachable (timeout after 15 seconds), it automatically falls back to offline simulation mode using a deterministic hash-based scoring algorithm. The user sees a status badge indicating which mode is active.

**Q: What is the system architecture?**
> Three-tier architecture: Presentation layer (HTML/CSS/JS), Application layer (Flask REST API), and Data layer (YouTube and Reddit APIs). The frontend and backend are decoupled — they communicate via HTTP JSON.

**Q: How would you scale this for production?**
> I would add a caching layer (Redis) to store results for popular topics, use a message queue (Celery) for async fetching, deploy the backend on a cloud platform (AWS/GCP), and upgrade to Twitter API with proper credentials for more platforms.
