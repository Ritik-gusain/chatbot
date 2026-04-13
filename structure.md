# Project Structure

## Directory Tree

```
chatbot-main/
├── .agents/                          # Agent configurations and skills
│   ├── skills/
│   │   ├── supabase/                # Supabase-related skills
│   │   └── supabase-postgres-best-practices/  # Postgres best practices
│   └── ...
├── .claude/                          # Claude configuration files
├── .devcontainer/                    # Dev container configuration
├── .git/                             # Git version control
├── .github/                          # GitHub workflows and configs
├── .gitignore                        # Git ignore rules
├── .junie/                           # Junie configuration
├── .sixth/                           # Sixth configuration
├── .vscode/                          # VS Code settings and extensions
├── __pycache__/                      # Python cache directory
├── assets/                           # Static assets
│   ├── css/
│   │   └── styles.css               # Main stylesheet
│   └── js/
│       ├── auth.js                  # Authentication JavaScript
│       └── chat.js                  # Chat functionality JavaScript
├── backend/                          # Backend application
│   ├── chat_history.json            # Chat history data
│   ├── requirements.txt             # Python dependencies
│   └── streamlit_app.py             # Streamlit application
├── keys/                             # API keys and credentials
│   ├── bytez_api_key.txt
│   └── supabase_anon_key.txt
├── luminescent/                      # Luminescent related files/config
├── old_ui/                           # Legacy UI files
│   ├── index.html
│   ├── login.html
│   ├── script.js
│   └── styles.css
├── chat.html                         # Chat page
├── index.html                        # Main index page
├── login.html                        # Login page
├── LICENSE                           # License file
├── README.md                         # Project README
├── skills-lock.json                  # Skills lock configuration
├── vercel.json                       # Vercel deployment config
└── structure.md                      # This file - project structure documentation
```

## Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `.agents/` | Contains agent configurations and reusable skills for automation |
| `assets/` | Static files (CSS, JavaScript) for the frontend |
| `backend/` | Python-based backend using Streamlit |
| `keys/` | API keys and authentication credentials |
| `old_ui/` | Legacy/deprecated user interface files |
| `.devcontainer/` | Docker configuration for development environment |
| `.github/` | GitHub Actions workflows and CI/CD configurations |
| `.vscode/` | VS Code workspace settings and extensions |

## Main Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing/home page |
| `login.html` | User login page |
| `chat.html` | Chat interface page |
| `streamlit_app.py` | Backend Streamlit application |
| `requirements.txt` | Python package dependencies |
| `vercel.json` | Deployment configuration for Vercel hosting |
| `README.md` | Project documentation |
| `LICENSE` | Project license information |

## Tech Stack Overview

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Streamlit)
- **Authentication**: Handled via auth.js and Supabase
- **Deployment**: Vercel
- **Version Control**: Git/GitHub
- **Development Container**: Docker
