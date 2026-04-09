import streamlit as st
from bytez import Bytez
import os

# Show title and description.
st.title("💬 Advanced AI Chatbot - Bytez AI")
st.write(
    "This is an advanced chatbot that uses Bytez AI's SDK to generate responses. "
    "The API key is loaded from the keys folder."
)

# Load Bytez API key from file
key_file = os.path.join("keys", "bytez_api_key.txt")
if os.path.exists(key_file):
    with open(key_file, "r") as f:
        bytez_api_key = f.read().strip()
    if not bytez_api_key or bytez_api_key.startswith("#") or bytez_api_key == "YOUR_BYTEZ_API_KEY_HERE":
        st.error("Please set your valid Bytez API key in keys/bytez_api_key.txt (remove the placeholder text).")
        st.stop()
else:
    st.error("API key file not found. Please create keys/bytez_api_key.txt with your Bytez API key.")
    st.stop()

# Create Bytez SDK instance
sdk = Bytez(bytez_api_key)

# Create a session state variable to store the chat messages. This ensures that the
# messages persist across reruns.
if "messages" not in st.session_state:
    st.session_state.messages = []

# Sidebar for settings
with st.sidebar:
    st.header("🤖 Chatbot Settings")
    
    system_prompt = st.text_area("System Prompt", value="You are a helpful and advanced AI assistant.", height=100)
    
    # Note: Bytez SDK may not support temperature/max_tokens in this version
    # temperature = st.slider("Temperature", 0.0, 2.0, 0.7, help="Controls randomness: lower for more focused, higher for more creative.")
    # max_tokens = st.slider("Max Tokens", 100, 4096, 1024, help="Maximum length of the response.")
    
    model_options = ["google/gemma-4-26B-A4B-it"]  # Using the specified model
    model_id = st.selectbox("Model", model_options, index=0, help="Select the AI model to use.")
    
    st.header("💬 Chat Management")
    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.success("Chat history cleared!")
        st.rerun()
    
    if st.session_state.messages:
        chat_text = "\n\n".join([f"**{m['role'].title()}**: {m['content']}" for m in st.session_state.messages])
        st.download_button(
            label="📥 Export Chat",
            data=chat_text,
            file_name="chat_history.txt",
            mime="text/plain",
            help="Download the current chat history as a text file."
        )

# Get the model
model = sdk.model(model_id)

# Display the existing chat messages via `st.chat_message`.
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Create a chat input field to allow the user to enter a message. This will display
# automatically at the bottom of the page.
if prompt := st.chat_input("Type your message here..."):

    # Store and display the current prompt.
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Generate a response using the Bytez SDK.
    try:
        # Prepare messages with system prompt
        messages = [{"role": "system", "content": system_prompt}] + [
            {"role": m["role"], "content": m["content"]}
            for m in st.session_state.messages
        ]
        
        # Run the model
        results = model.run(messages)
        
        if results.error:
            st.error(f"An error occurred: {results.error}")
        else:
            response = results.output
            # Display the response
            with st.chat_message("assistant"):
                st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})
    except Exception as e:
        st.error(f"An error occurred: {e}")
        st.info("Check your API key, model ID, or network connection.")
