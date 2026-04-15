# ✨ Luminescent.io

**The AI That Thinks With You** — a team-based AI chatbot SaaS.

Live: [https://chatbot-nine-psi-46.vercel.app/](https://chatbot-nine-psi-46.vercel.app/)

---

## What it is

Luminescent.io is a shared AI workspace for small teams. Every team member
gets access to the same AI brain under one flat monthly subscription — no
per-seat pricing nonsense.

| Plan     | Team size | Price/month |
|----------|-----------|-------------|
| Starter  | 3 members | $12         |
| Growth   | 7 members | $21.50      |
| Business | 12 members| $30         |

---

## Tech stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | HTML + CSS + Vanilla JS           |
| Auth         | Supabase (email/password + OTP)   |
| AI           | Anthropic Claude (Haiku / Sonnet) |
| AI proxy     | Vercel Serverless Function        |
| Deployment   | Vercel (static + edge functions)  |

---

## Project structure

```
/
├── index.html          # Landing page (pricing, hero)
├── login.html          # Login + Register + OTP verification
├── chat.html           # Main chat workspace
├── api/
│   └── chat.js         # Vercel serverless function — AI proxy
├── assets/
│   ├── css/styles.css  # All styles (dark space aesthetic)
│   └── js/
│       ├── auth.js     # Supabase auth helpers
│       └── chat.js     # Chat UI + conversation history
├── vercel.json         # Deployment config + security headers
└── README.md
```

---

## Local development

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone and install

```bash
git clone https://github.com/Ritik-gusain/chatbot
cd chatbot
npm install @anthropic-ai/sdk
```

### 2. Set up Supabase keys

Create `keys/supabase_anon_key.txt` with your Supabase anon key.
This file is gitignored — never commit it.

```bash
echo "your-supabase-anon-key" > keys/supabase_anon_key.txt
```

### 3. Create a `.env` file for local dev

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Run locally with Vercel CLI (recommended)

The AI endpoint (`/api/chat`) requires a server. Use Vercel CLI to run both the
static site and the serverless function locally:

```bash
npm install -g vercel
vercel dev
# → http://localhost:3000
```

**Do NOT open HTML files directly** (`file://`) — the Supabase key fetch and
the `/api/chat` endpoint both require an HTTP server.

---

## Deployment to Vercel

1. Push to GitHub
2. Connect the repo in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:

| Variable             | Value                          |
|----------------------|--------------------------------|
| `ANTHROPIC_API_KEY`  | `sk-ant-...`                   |
| `ALLOWED_ORIGIN`     | `https://your-domain.vercel.app` |

4. Deploy — Vercel auto-detects `api/chat.js` as a serverless function.

---

## Supabase setup

Enable **Email Auth** in Supabase → Authentication → Providers.

To enable Google OAuth (already wired in login.html):
1. Supabase → Authentication → Providers → Google
2. Add your Google OAuth credentials
3. Set redirect URL to `https://your-domain.vercel.app/chat.html`

---

## Environment variables reference

| Variable            | Required | Description                              |
|---------------------|----------|------------------------------------------|
| `ANTHROPIC_API_KEY` | Yes      | Anthropic Claude API key                 |
| `ALLOWED_ORIGIN`    | No       | CORS allowed origin (defaults to `*`)    |

---

## Roadmap

- [ ] Stripe billing + webhook handler
- [ ] Supabase `organizations` + `members` tables
- [ ] Team invitation system (email → OTP → join org)
- [ ] Message quota enforcement (Redis counter)
- [ ] Image generation (Flux / Stability AI)
- [ ] Annual billing (2 months free)
