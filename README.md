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

## Features

✨ **Modern SaaS Experience**
- Premium dark theme with glassmorphism design
- Responsive mobile-first layout (hamburger menu at 768px)
- Smooth animations and interactive components

🔐 **Secure Authentication**
- Email/password signup and login
- OTP email verification
- Google OAuth support
- Session management via Supabase

🤖 **Intelligent AI**
- Powered by Anthropic Claude (Haiku/Sonnet)
- Real-time streaming responses
- Customizable system prompts
- Usage tracking and limits

💾 **Persistent Conversations**
- Chat history saved to localStorage
- View/restore past conversations
- Export chat sessions

📱 **Responsive Design**
- Works on desktop, tablet, mobile
- Sidebar toggles on small screens
- Touch-friendly inputs

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
├── index.html              # Landing page (hero, features, pricing, testimonials)
├── login.html              # Auth page (login, register, OTP verification)
├── chat.html               # Workspace (sidebar, chat area, model selector)
├── assets/
│   ├── css/
│   │   └── styles.css      # Old UI styles (used by login.html)
│   └── js/
│       ├── auth.js         # Supabase auth helpers + SDK init
│       └── chat.js         # Chat UI + conversation history
├── api/                    # (Create for Vercel deployment)
│   └── chat.js             # Serverless function — AI proxy to Anthropic
├── backend/                # (Python Streamlit app — optional)
│   ├── streamlit_app.py
│   ├── chat_history.json
│   └── requirements.txt
├── keys/                   # API keys (gitignored)
│   ├── supabase_anon_key.txt
│   └── bytez_api_key.txt
├── vercel.json             # Deployment config
├── structure.md            # Project documentation
└── README.md
```

---

## Local development

### Prerequisites

- A [Supabase](https://supabase.com) project (free tier OK)
- An [Anthropic](https://console.anthropic.com) API key (paid account required)
- Vercel CLI (for local serverless function testing)

### 1. Clone the repo

```bash
git clone https://github.com/Ritik-gusain/chatbot
cd chatbot
```

### 2. Store your Supabase anon key

The Supabase anon key is public and safe to store as a file (it's also visible in client-side auth.js).

```bash
echo "your-supabase-anon-key" > keys/supabase_anon_key.txt
```

This file is gitignored — never commit it.

### 3. Create serverless function for local dev

Since the AI endpoint (`/api/chat`) needs a backend, create the function locally:

```bash
mkdir -p api
# Create api/chat.js with your Anthropic integration
```

Or use Vercel CLI to test:

```bash
npm install -g vercel
vercel dev
# → http://localhost:3000
```

**Important:** Do NOT open HTML files directly (`file://`). The project requires an HTTP server for:
- Supabase authentication flows
- `/api/chat` endpoint for AI responses

### 4. Test locally

Open `http://localhost:3000` and test the flow:
1. **index.html** — Landing page
2. **login.html** → Sign up / Login with Supabase
3. **chat.html** → Send messages (needs `/api/chat` or will show friendly error)

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variable:

| Variable             | Value          |
|----------------------|----------------|
| `ANTHROPIC_API_KEY`  | `sk-ant-...`   |

### 3. Create the serverless function

Create `api/chat.js` in your repo:

```javascript
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { messages, systemPrompt, model } = req.body;

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const response = await client.messages.create({
      model: model === 'haiku' ? 'claude-3-5-haiku-20241022' : 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages
    });

    res.status(200).json({ 
      reply: response.content[0].type === 'text' ? response.content[0].text : 'No response'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
```

### 4. Deploy

Push your changes → Vercel auto-deploys → Live! 🚀

---

## Supabase Setup

### Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create a new project (free tier works fine)
3. Enable **Email Auth**:
   - Authentication → Providers → Email
   - Toggle **Email** on (enabled by default)
4. (Optional) Enable **Google OAuth**:
   - Providers → Google
   - Add your Google OAuth credentials from Google Cloud Console
   - Set redirect URL to: `https://your-domain.vercel.app/chat.html`

### Add your Supabase keys to the project

1. Copy your **Supabase URL** and **anon key** from Settings → API
2. Save anon key to `keys/supabase_anon_key.txt`:
   ```bash
   echo "your-anon-key" > keys/supabase_anon_key.txt
   ```
3. Update `assets/js/auth.js` with your Supabase URL:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

---

## Environment variables (Vercel only)

| Variable            | Required | Where | Description                    |
|---------------------|----------|-------|--------------------------------|
| `ANTHROPIC_API_KEY` | Yes      | Vercel | Anthropic Claude API key       |

**Local development:** Use `keys/supabase_anon_key.txt` and direct env vars.

---

## Roadmap / Future Features

### Core Features
- [x] Landing page with hero + features + pricing
- [x] Email/password authentication
- [x] OTP verification
- [x] Chat interface with streaming responses
- [x] Chat history persistence (localStorage)
- [x] Model selector (Haiku / Sonnet)
- [x] Usage tracking and display
- [x] Responsive mobile design

### Planned
- [ ] Real user accounts + org management (Supabase tables)
- [ ] Stripe billing integration + webhook handler
- [ ] Team invitations (email-based)
- [ ] Message quota enforcement
- [ ] Image generation (Stability AI / Flux)
- [ ] Export conversations (PDF / Markdown)
- [ ] Dark mode toggle
- [ ] Voice input / output
- [ ] Custom AI model fine-tuning

---

## Support

📧 Questions? Open an issue on [GitHub](https://github.com/Ritik-gusain/chatbot/issues)

💬 Try the live version: [chatbot-nine-psi-46.vercel.app](https://chatbot-nine-psi-46.vercel.app/)

---

**Made with ❤️ by Ritik**
