import streamlit as st
from bytez import Bytez
import os
import time

# Configure page
st.set_page_config(
    page_title="The Luminescent Scholar",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

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

@keyframes pulse-glow {
    0%, 100% {
        box-shadow: 0 0 20px rgba(189, 194, 255, 0.3);
    }
    50% {
        box-shadow: 0 0 40px rgba(189, 194, 255, 0.6);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(189, 194, 255, 0.3);
    border-radius: 50%;
    border-top-color: #bdc2ff;
    animation: spin 1s linear infinite;
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

.stChatInput:focus {
    background: rgba(52, 52, 61, 0.9) !important;
    box-shadow: 0 0 20px rgba(125, 135, 243, 0.2) !important;
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

.stSidebar [data-testid="stMarkdownContainer"] {
    padding: 0;
}

/* Tab styling */
[data-testid="stTabs"] {
    background: transparent;
}

.stTabs [data-testid="stTabBar"] {
    background: transparent;
    border-bottom: 1px solid rgba(70, 69, 84, 0.2);
}

.stTabs [aria-selected="true"] {
    border-bottom: 2px solid #bdc2ff !important;
}

/* Expander styling */
[data-testid="stExpander"] {
    background: #1f1f27;
    border: 1px solid rgba(70, 69, 84, 0.2);
    border-radius: 0.75rem;
}

/* Text input styling */
.stTextInput > div > div > input {
    background: #1f1f27 !important;
    color: #e4e1ed !important;
    border: 1px solid rgba(70, 69, 84, 0.2) !important;
    border-radius: 0.5rem !important;
}

.stTextArea > div > div > textarea {
    background: #1f1f27 !important;
    color: #e4e1ed !important;
    border: 1px solid rgba(70, 69, 84, 0.2) !important;
    border-radius: 0.5rem !important;
}

/* Selectbox styling */
.stSelectbox {
    background: transparent !important;
}

.stSelectbox select {
    background: #1f1f27 !important;
    color: #e4e1ed !important;
    border: 1px solid rgba(70, 69, 84, 0.2) !important;
    border-radius: 0.5rem !important;
}

/* Slider styling */
.stSlider {
    padding: 1rem 0;
}

.stSlider > div > div > div {
    color: #bdc2ff;
}

/* Info/Error boxes */
[data-testid="stAlert"] {
    background: rgba(125, 135, 243, 0.1) !important;
    border-left: 4px solid #bdc2ff !important;
    border-radius: 0.5rem !important;
    color: #e4e1ed !important;
}

/* Metric styling */
[data-testid="metric-container"] {
    background: #1f1f27;
    border-radius: 0.75rem;
    border: 1px solid rgba(70, 69, 84, 0.2);
    padding: 1.5rem;
}

</style>
""", unsafe_allow_html=True)

# Header section
col1, col2, col3 = st.columns([1, 3, 1])
with col1:
    st.markdown("### ✨ The Luminescent Scholar")
    st.caption("POWERED BY BYTEZ AI")
with col3:
    st.write("")  # Spacer


# Load Bytez API key from file
key_file = os.path.join("keys", "bytez_api_key.txt")
if os.path.exists(key_file):
    with open(key_file, "r") as f:
        bytez_api_key = f.read().strip()
    if not bytez_api_key or bytez_api_key.startswith("#") or bytez_api_key == "YOUR_BYTEZ_API_KEY_HERE":
        st.error("⚠️ Please set your valid Bytez API key in keys/bytez_api_key.txt")
        st.stop()
else:
    st.error("⚠️ API key file not found. Please create keys/bytez_api_key.txt with your Bytez API key.")
    st.stop()

# Initialize Bytez SDK
sdk = Bytez(bytez_api_key)
model = sdk.model("google/gemma-4-26B-A4B-it")

# Create session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "is_loading" not in st.session_state:
    st.session_state.is_loading = False

# Sidebar - Settings & Management
with st.sidebar:
    st.markdown("### ⚙️ Chatbot Settings")
    
    with st.expander("📝 System Prompt", expanded=True):
        system_prompt = st.text_area(
            "Customize AI behavior:",
            value="You are a helpful and advanced AI assistant powered by Gemma 4. Provide clear, concise, and intelligent responses.",
            height=100,
            key="system_prompt"
        )
    
    with st.expander("🎯 Model Configuration"):
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("**Model**")
            st.info("google/gemma-4-26B-A4B-it")
        with col2:
            st.markdown("**Status**")
            st.success("✅ Active")
    
    st.markdown("---")
    
    with st.expander("💬 Chat Management", expanded=True):
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🗑️ Clear Chat", use_container_width=True):
                st.session_state.messages = []
                st.success("Chat cleared!")
                st.rerun()
        with col2:
            if st.button("📥 Export Chat", use_container_width=True):
                if st.session_state.messages:
                    chat_text = "\n\n".join([f"**{m['role'].upper()}**\n{m['content']}" for m in st.session_state.messages])
                    st.download_button(
                        label="Download",
                        data=chat_text,
                        file_name="chat_history.txt",
                        mime="text/plain"
                    )
    
    st.markdown("---")
    
    # Chat history
    with st.expander("📚 Conversation History"):
        if st.session_state.messages:
            st.markdown(f"**Messages: {len(st.session_state.messages)}**")
            # Show last 5 messages summary
            for msg in st.session_state.messages[-5:]:
                if msg['role'] == 'user':
                    st.markdown(f"👤 {msg['content'][:50]}...")
                else:
                    st.markdown(f"🤖 {msg['content'][:50]}...")
        else:
            st.info("No conversations yet. Start chatting!")

# Main chat area
st.markdown("<br>", unsafe_allow_html=True)

# Display chat messages
if st.session_state.messages:
    st.markdown("### 💭 Conversation")
    
    for message in st.session_state.messages:
        if message["role"] == "user":
            # User message - right aligned
            col1, col2 = st.columns([2, 3])
            with col2:
                st.markdown(
                    f"""
                    <div style="background: #34343d; padding: 1rem 1.5rem; border-radius: 0.75rem; 
                                color: #e4e1ed; animation: slideInRight 0.4s ease-out; 
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                    {message['content']}
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        else:
            # Assistant message - left aligned
            col1, col2 = st.columns([3, 2])
            with col1:
                st.markdown(
                    f"""
                    <div style="display: flex; gap: 1rem;">
                        <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%;
                                    background: linear-gradient(135deg, #7c87f3 0%, #bdc2ff 100%);
                                    display: flex; align-items: center; justify-content: center;
                                    color: white; font-weight: 700; flex-shrink: 0;">
                            ✨
                        </div>
                        <div style="background: #1f1f27; padding: 1rem 1.5rem; border-radius: 0.75rem;
                                    color: #e4e1ed; animation: slideInLeft 0.4s ease-out;">
                            {message['content']}
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True
                )
else:
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
            Start typing your message below to begin...
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Chat input
if prompt := st.chat_input("Type your message here...", key="chat_input"):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Show loading state
    with st.spinner(""):
        loading_placeholder = st.empty()
        loading_placeholder.markdown(
            """
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem;">
                <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(189, 194, 255, 0.3);
                            border-radius: 50%; border-top-color: #bdc2ff; animation: spin 1s linear infinite;"></div>
                <span style="color: #c7c4d7;">Scholar is thinking...</span>
            </div>
            """,
            unsafe_allow_html=True
        )
        
        # Get response from Bytez SDK
        try:
            # Prepare messages with system prompt
            messages = [{"role": "system", "content": system_prompt}] + [
                {"role": m["role"], "content": m["content"]}
                for m in st.session_state.messages
            ]
            
            # Run model
            results = model.run(messages)
            
            loading_placeholder.empty()
            
            if results.error:
                st.error(f"❌ Error: {results.error}")
                st.session_state.messages.pop()  # Remove user message on error
            else:
                # Add assistant response
                response = results.output
                st.session_state.messages.append({"role": "assistant", "content": response})
                st.rerun()
                
        except Exception as e:
            loading_placeholder.empty()
            st.error(f"❌ An error occurred: {e}")
            st.info("💡 Check your API key, model ID, or network connection.")
            st.session_state.messages.pop()  # Remove user message on error
