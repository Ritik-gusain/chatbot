# Luminescent.io

**Team AI chatbot powered by Gemma 4.**

Live: [chatbot-nine-psi-46.vercel.app](https://chatbot-nine-psi-46.vercel.app/)

---

## What it is

Luminescent.io is a shared AI workspace for small teams. Every team member gets access to the same AI brain under one flat monthly subscription — no per-seat pricing.

| Plan     | Team size | Price/month |
|----------|-----------|-------------|
| Starter  | 3 members | $12         |
| Growth   | 7 members | $21.50      |
| Business | 12 members| $30         |

---

## Tech stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML + CSS + Vanilla JS           |
| AI        | Bytez API · Google Gemma 4 E4B    |
| Backend   | Python Streamlit (optional)       |
| Deployment| Vercel (static)                   |

---

## Project structure

```
/
├── index.html           # Chat workspace (main app)
├── assets/
│   ├── css/styles.css   # Global styles
│   └── js/
│       ├── auth.js      # Auth helpers
│       └── chat.js      # Chat placeholder
├── api/
│   └── chat.js          # Vercel serverless function (unused — Bytez called directly)
├── backend/
│   ├── streamlit_app.py # Streamlit chat UI
│   ├── chat_history.json
│   └── requirements.txt
├── keys/
│   └── bytez_api_key.txt  # Bytez API key (gitignored)
├── vercel.json
└── README.md
```

---

## Running locally

### Web app (index.html)

Just open `index.html` in a browser — it calls the Bytez API directly, no server needed.

### Streamlit app

```bash
cd backend
python -m streamlit run streamlit_app.py
```

Opens at `http://localhost:8501`

---

## Deployment

Push to GitHub → Vercel auto-deploys. No environment variables needed (Bytez key is client-side).

```bash
git push origin main
```

---

## Roadmap

- [x] Chat interface with Gemma 4 via Bytez
- [x] Chat history (localStorage)
- [x] Streamlit backend UI
- [x] Responsive mobile design
- [ ] Stripe billing
- [ ] Team accounts + invitations
- [ ] Message quota enforcement
- [ ] Export conversations

---

**Made with ❤️ by Ritik**
