# 💬 Advanced AI Chatbot - Bytez AI

An advanced Streamlit app that demonstrates building a sophisticated chatbot using Bytez AI's SDK with customizable settings, model selection, and chat management features.

Try now [https://chatbot-nine-psi-46.vercel.app/]

### Features

- 🤖 Powered by Bytez AI SDK with Gemma 4 26B model
- ⚙️ Customizable system prompts
- 💬 Real-time responses
- 📁 Chat history management (clear and export)
- 🔐 Secure API key storage in separate folder
- 📱 Responsive Streamlit interface

### How to run it on your own machine

1. Install the requirements

   ```
   $ pip install -r requirements.txt
   ```

2. Set up your Bytez API key

   - The API key is already configured in `keys/bytez_api_key.txt`
   - If you need to change it, edit this file with your Bytez API key

3. Run the app

   ```
   $ streamlit run streamlit_app.py
   ```

### API Key Setup

For security, the API key is stored in a separate `keys/` folder. The key is pre-configured, but you can update it in `keys/bytez_api_key.txt` if needed. The `keys/` folder is gitignored to prevent accidental commits.

### Customization

Use the sidebar to:
- Set custom system prompts
- Manage chat history
- Export conversations

### Model

Currently uses Google's Gemma 4 26B model via Bytez SDK for high-quality responses.
