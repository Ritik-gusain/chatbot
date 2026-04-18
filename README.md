# Luminescent.io

**Team AI chatbot powered by Google Gemma 4.**

Live: [chatbot-nine-psi-46.vercel.app](https://chatbot-nine-psi-46.vercel.app/)


## Tech stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | HTML + CSS + Vanilla JS        |
| AI Model   | Google Gemma 4 E4B             |
| AI API     | Bytez (`google/gemma-4-E4B-it`)|
| Backend    | Python + Streamlit             |
| Deployment | Vercel (static)                |

---

## How it works

The frontend (`index.html`) calls the **Bytez API directly from the browser** — no backend server required. The Bytez API key is embedded client-side.

The Streamlit app (`backend/streamlit_app.py`) is an optional Python-based UI that does the same thing using the Bytez Python SDK.

---

## Project structure

```
/
├── index.html              # Main chat UI (calls Bytez API directly)
├── assets/
│   ├── css/styles.css      # Global styles
│   └── js/
│       ├── auth.js         # Supabase auth helpers (unused)
│       └── chat.js         # Placeholder
├── api/
│   └── chat.js             # Vercel serverless function (unused)
├── backend/
│   ├── streamlit_app.py    # Streamlit chat UI (Python alternative)
│   ├── chat_history.json   # Persisted chat history for Streamlit
│   └── requirements.txt    # Python deps: streamlit, bytez
└── README.md
```

---

## Running locally

### Web app

Just open `index.html` in a browser — no server needed.

### Streamlit app

```bash
cd backend
python -m streamlit run streamlit_app.py
```

Opens at `http://localhost:8501`

---

## Deployment

Push to GitHub → Vercel auto-deploys the static frontend.

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
