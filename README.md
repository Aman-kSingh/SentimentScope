# SentimentScope 📊

> **Real-Time Multi-Platform Social Media Sentiment Analyzer**  
> MCA Final Year Project · Built with Python, Flask, VADER NLP & JavaScript

[![JavaScript](https://img.shields.io/badge/JavaScript-52%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com/Aman-kSingh/SentimentScope)
[![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=flat-square&logo=python&logoColor=white)](https://github.com/Aman-kSingh/SentimentScope)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ What It Does

SentimentScope pulls **live comments and posts** from YouTube and Reddit, analyzes them using **VADER NLP**, and displays the results on a real-time dashboard — complete with sentiment charts, a live post feed, and AI-generated insights.

Type any topic → click **Analyze** → see what the internet thinks about it right now.

---

## 🖼️ Screenshots

> *(Add a screenshot here — drag an image into the GitHub editor and paste the link)*

---

## 🧰 Tech Stack

| Layer    | Technology              | Purpose                         |
| -------- | ----------------------- | ------------------------------- |
| Frontend | HTML5, CSS3, JavaScript | UI and charts                   |
| Charts   | Chart.js 4.4            | Donut & bar charts              |
| Backend  | Python, Flask           | REST API server                 |
| NLP      | VADER Sentiment         | Sentiment scoring               |
| Data     | YouTube Data API v3     | Real video comments             |
| Data     | Reddit API (PRAW)       | Real posts & comments           |
| CORS     | Flask-CORS              | Allows frontend to call backend |

---

## 🚀 Quick Start

### 1. Get Free API Keys

**YouTube Data API v3**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → search "YouTube Data API v3" → Enable
3. Credentials → Create API Key → copy it

**Reddit API**
1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Create App → type: **script** → redirect: `http://localhost`
3. Copy the `client_id` and `client_secret`

---

### 2. Set Up the Backend

```bash
cd backend
pip install -r requirements.txt
```

Open `app.py` and paste your keys:
```python
YOUTUBE_API_KEY      = "your-key-here"
REDDIT_CLIENT_ID     = "your-id-here"
REDDIT_CLIENT_SECRET = "your-secret-here"
```

Run it:
```bash
python app.py
# ✅ SentimentScope backend running at http://localhost:5000
```

### 3. Open the Frontend

Open `index.html` in your browser (or use VS Code Live Server).

---

## ⚡ Offline Mode

If the Flask backend is not running, the app **automatically falls back to offline simulation mode** — it still shows charts and analysis with generated data.

- 🟢 **"Live data — YouTube & Reddit"** → backend running, real data  
- 🟡 **"Offline mode"** → backend not running, simulated data

---

## 🏗️ Architecture

```
User enters topic
      ↓
Frontend (app.js) → GET /analyze?topic=Tesla&platform=all
      ↓
Flask backend:
  1. YouTube Data API → video comments
  2. Reddit API (PRAW) → posts & comments
  3. VADER NLP scoring:
       ≥  0.05 = Positive
       ≤ -0.05 = Negative
       else    = Neutral
  4. Return aggregated JSON
      ↓
Frontend renders:
  - Metric cards
  - Donut & bar charts
  - AI insight paragraph
  - Live post feed with sentiment pills
```

---

## 📁 Project Structure

```
SentimentScope/
├── index.html
├── css/
│   ├── base.css          ← CSS variables, colors, animations
│   ├── layout.css        ← Header, container, grid
│   ├── components.css    ← Cards, buttons, posts, pills
│   ├── charts.css        ← Chart wrappers
│   └── responsive.css    ← Mobile & tablet breakpoints
├── js/
│   ├── data.js           ← Post templates, platforms, colors
│   ├── sentiment.js      ← Offline scoring + insight generation
│   ├── charts.js         ← Chart.js drawing functions
│   ├── posts.js          ← Post generation and rendering
│   └── app.js            ← Main controller — calls Flask API
└── backend/
    ├── app.py            ← Flask REST API
    └── requirements.txt
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">Made with ❤️ by <a href="https://github.com/Aman-kSingh">Aman Singh</a></p>
