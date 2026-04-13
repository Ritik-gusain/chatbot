import streamlit as st
from bytez import Bytez
import os
import json
import time
from datetime import datetime

# Configure page
st.set_page_config(
    page_title="The Luminescent Scholar",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Persistence Helpers
HISTORY_FILE = "chat_history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

# Custom CSS for premium design
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

* {
    font-family: 'Inter', sans-serif;
}

html, body, [data-testid="stAppViewContainer"] {
    background-color: #13131b;
    color: #e4e1ed;
}

[data-testid="stMainBlockContainer"] {
    background-color: #13131b;
    padding-top: 0;
}

[data-testid="stSidebar"] {
    background-color: #1b1b23;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #464554;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #5a5968;
}

/* Typography */
h1 {
    font-family: 'Manrope', sans-serif !important;
    font-weight: 800 !important;
    color: #bdc2ff !important;
    letter-spacing: -0.5px;
}

h2, h3 {
    font-family: 'Manrope', sans-serif !important;
    font-weight: 700 !important;
    color: #c7c4d7 !important;
}

/* Chat messages container */
.chat-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    background: #13131b;
    border-radius: 0.75rem;
    max-height: 600px;
    overflow-y: auto;
}

/* User message */
.user-message {
    display: flex;
    justify-content: flex-end;
    animation: slideInRight 0.4s ease-out;
}

.user-message-content {
    background: #34343d;
    color: #e4e1ed;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    max-width: 70%;
    word-wrap: break-word;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Assistant message */
.assistant-message {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    animation: slideInLeft 0.4s ease-out;
}

.assistant-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c87f3 0%, #bdc2ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    flex-shrink: 0;
}

.assistant-message-content {
    background: #1f1f27;
    color: #e4e1ed;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    max-width: 70%;
    word-wrap: break-word;
}

/* Animations */
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Input styling */
[data-testid="stChatInputContainer"] {
    background: transparent !important;
    border: none !important;
}

.stChatInput {
    background: rgba(52, 52, 61, 0.7) !important;
    backdrop-filter: blur(24px) !important;
    border: 1px solid rgba(70, 69, 84, 0.3) !important;
    border-radius: 1rem !important;
    color: #e4e1ed !important;
}

/* Buttons */
.stButton > button {
    background: linear-gradient(135deg, #7c87f3 0%, #bdc2ff 100%) !important;
    color: #131e8c !important;
    border: none !important;
    border-radius: 0.75rem !important;
    font-weight: 600 !important;
    padding: 0.75rem 1.5rem !important;
    transition: all 0.3s ease !important;
}

.stButton > button:hover {
    box-shadow: 0 8px 32px rgba(125, 135, 243, 0.4) !important;
    transform: translateY(-2px) !important;
}

/* Sidebar styling */
.stSidebar {
    background: #1b1b23;
}

/* Info/Error boxes */
[data-testid="stAlert"] {
    background: rgba(125, 135, 243, 0.1) !important;
    border-left: 4px solid #bdc2ff !important;
    border-radius: 0.5rem !important;
    color: #e4e1ed !important;
}

</style>
""", unsafe_allow_html=True)

# Initialize Session State
if "history" not in st.session_state:
    st.session_state.history = load_history()

if "current_chat_id" not in st.session_state:
    if st.session_state.history:
        st.session_state.current_chat_id = st.session_state.history[0]["id"]
    else:
        st.session_state.current_chat_id = None

# Helper to get current messages
def get_current_chat():
    for chat in st.session_state.history:
        if chat["id"] == st.session_state.current_chat_id:
            return chat
    return None

current_chat = get_current_chat()
messages = current_chat["messages"] if current_chat else []

# Header section
col1, col2, col3 = st.columns([1, 3, 1])
with col1:
    st.markdown("### ✨ The Luminescent Scholar")
    st.caption("POWERED BY BYTEZ AI")

# Load Bytez API key
KEY_FILE = os.path.join("keys", "bytez_api_key.txt")
bytez_api_key = "" # Please retrieve key from keys/bytez_api_key.txt

if os.path.exists(KEY_FILE):
    with open(KEY_FILE, "r") as f:
        file_key = f.read().strip()
        if file_key and not file_key.startswith("#"):
            bytez_api_key = file_key

sdk = Bytez(bytez_api_key)
model = sdk.model("google/gemma-4-26B-A4B-it")

# Sidebar - Settings & Management
with st.sidebar:
    st.markdown("### ⚙️ Chatbot Settings")
    
    with st.expander("📝 System Prompt", expanded=False):
        system_prompt = st.text_area(
            "Customize AI behavior:",
            value="You are Scholar, an advanced and highly capable AI assistant. You are thoughtful, knowledgeable, clear, and friendly. Always give complete, well-structured answers using Markdown. Be conversational but precise.",
            height=100,
            key="system_prompt"
        )
    
    st.markdown("---")
    st.markdown("### 📚 Conversations")
    
    if st.button("➕ New Chat", use_container_width=True):
        new_id = str(int(time.time()))
        st.session_state.history.insert(0, {
            "id": new_id,
            "title": f"New Conversation {datetime.now().strftime('%H:%M')}",
            "messages": [],
            "timestamp": datetime.now().isoformat()
        })
        st.session_state.current_chat_id = new_id
        save_history(st.session_state.history)
        st.rerun()

    for i, chat in enumerate(st.session_state.history):
        col1, col2 = st.columns([4, 1])
        with col1:
            active = " (Active)" if chat["id"] == st.session_state.current_chat_id else ""
            if st.button(f"💬 {chat['title']}{active}", key=f"chat_{chat['id']}", use_container_width=True):
                st.session_state.current_chat_id = chat["id"]
                st.rerun()
        with col2:
            if st.button("🗑️", key=f"del_{chat['id']}", help="Delete chat"):
                st.session_state.history.pop(i)
                if st.session_state.current_chat_id == chat["id"]:
                    st.session_state.current_chat_id = st.session_state.history[0]["id"] if st.session_state.history else None
                save_history(st.session_state.history)
                st.rerun()

    st.markdown("---")
    if st.button("📥 Export Current Chat", use_container_width=True):
        if messages:
            chat_text = "\n\n".join([f"**{m['role'].upper()}**\n{m['content']}" for m in messages])
            st.download_button(
                label="Confirm Download",
                data=chat_text,
                file_name="chat_history.txt",
                mime="text/plain"
            )

# Main chat area
st.markdown("<br>", unsafe_allow_html=True)

if not st.session_state.current_chat_id:
    # Welcome state
    st.markdown("""
    <div style="text-align: center; padding: 4rem 2rem; color: #c7c4d7;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
        <h2 style="font-family: 'Manrope', sans-serif; color: #bdc2ff; margin-bottom: 0.5rem;">
            Welcome to The Luminescent Scholar
        </h2>
        <p style="font-size: 1.1rem; color: #c7c4d7;">
            Your gateway to intelligent conversations powered by Bytez AI's Gemma 4 26B model.
        </p>
        <p style="color: #908fa0; margin-top: 2rem;">
            Click 'New Chat' in the sidebar to begin...
        </p>
    </div>
    """, unsafe_allow_html=True)
else:
    # Display chat messages
    for message in messages:
        if message["role"] == "user":
            col1, col2 = st.columns([1, 4])
            with col2:
                st.markdown(f'<div class="user-message"><div class="user-message-content">{message["content"]}</div></div>', unsafe_allow_html=True)
        else:
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown(f'''
                    <div class="assistant-message">
                        <div class="assistant-avatar">✨</div>
                        <div class="assistant-message-content">{message["content"]}</div>
                    </div>
                ''', unsafe_allow_html=True)

    # Chat input
    if prompt := st.chat_input("Type your message here..."):
        # Add user message
        messages.append({"role": "user", "content": prompt})
        
        # Update title if it's the first message
        if len(messages) == 1:
            current_chat["title"] = prompt[:30] + ("..." if len(prompt) > 30 else "")
        
        save_history(st.session_state.history)
        st.rerun()

    # Generate response if last message is from user
    if messages and messages[-1]["role"] == "user":
        with st.spinner("Scholar is thinking..."):
            try:
                # Prepare messages with system prompt
                api_messages = [{"role": "system", "content": system_prompt}] + messages
                
                # Run model
                results = model.run(api_messages)
                
                if results.error:
                    st.error(f"❌ Error: {results.error}")
                else:
                    # FIX: Handle dict output or string output
                    response_data = results.output
                    if isinstance(response_data, dict) and "content" in response_data:
                        response = response_data["content"]
                    elif isinstance(response_data, str):
                        response = response_data
                    else:
                        response = str(response_data)
                        
                    messages.append({"role": "assistant", "content": response})
                    save_history(st.session_state.history)
                    st.rerun()
                    
            except Exception as e:
                st.error(f"❌ An error occurred: {e}")
                messages.pop() # Remove user message on error
                save_history(st.session_state.history)
