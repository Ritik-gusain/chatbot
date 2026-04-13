/**
 * =========================================================
 *  Luminescent.io — Chat Module
 *  Handles message bubbles, AI replies, conversation history
 * =========================================================
 */

/* ===== DUMMY AI RESPONSES ===== */
const aiReplies = [
  "That's a fascinating question! Based on my analysis, there are several key factors to consider. Let me break it down for you in a structured way.",
  "Great thinking! I'd approach this problem by first identifying the core requirements, then building a solution layer by layer. Here's what I recommend...",
  "I appreciate you sharing that context. From my understanding, the most effective approach would involve combining multiple strategies. Let me elaborate.",
  "Interesting perspective! Research in this area suggests that the optimal solution depends heavily on your specific use case. Here are my thoughts...",
  "That's exactly the right question to ask. Let me walk you through a comprehensive answer that covers both the theoretical and practical aspects.",
  "I've processed your input and here's my analysis: there are three main pathways we could explore. Each has distinct advantages depending on your goals.",
  "Excellent point! This is an area where nuance really matters. Let me provide you with a detailed breakdown of the key considerations.",
  "You've raised an important topic. My recommendation would be to start with the fundamentals and then iterate. Here's a step-by-step approach...",
  "That's a complex but rewarding challenge! I can see several opportunities for optimization. Let me share some insights that might help guide your decision.",
  "I love that you're thinking about this proactively. Based on current best practices, here's what the most successful approaches have in common...",
];

/** @type {number} Index for cycling through AI replies */
let currentReplyIndex = 0;

/** @type {Array<Object>} Current conversation messages */
let currentMessages = [];

/** @type {string|null} ID of the current active conversation */
let activeConversationId = null;

/** @const {string} Key for storing conversations in localStorage */
const CONVERSATIONS_KEY = 'lum_conversations';

/** @const {number} Maximum number of conversations to store */
const MAX_CONVERSATIONS = 5;

/**
 * Returns the next AI reply from the cycling array.
 * Cycles through responses sequentially and loops back.
 * @returns {string} An AI response string
 */
function getAIReply() {
  const reply = aiReplies[currentReplyIndex];
  currentReplyIndex = (currentReplyIndex + 1) % aiReplies.length;
  return reply;
}

/**
 * Formats the current time as HH:MM am/pm.
 * @returns {string} Formatted time string, e.g. "2:30 PM"
 */
function getFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Creates a message bubble DOM element and appends it to the chat thread.
 * Auto-scrolls to the bottom after adding the message.
 * @param {'user'|'bot'} role - Who sent the message
 * @param {string} text - The message content
 * @returns {void}
 */
function addMessage(role, text) {
  const chatThread = document.getElementById('chatThread');
  if (!chatThread) return;

  const timestamp = getFormattedTime();

  /* Store in current messages array */
  currentMessages.push({ role, text, timestamp });

  /* Build the message DOM */
  const messageElement = document.createElement('div');
  messageElement.className = `message message--${role}`;

  const avatarLabel = role === 'bot' ? 'L' : getSession().name.charAt(0).toUpperCase();
  const authorName = role === 'bot' ? 'Luminescent AI' : getSession().name;

  messageElement.innerHTML = `
    <div class="message-avatar message-avatar--${role}">
      ${avatarLabel}
    </div>
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author">${authorName}</span>
        <span class="message-time">${timestamp}</span>
      </div>
      <div class="message-text">${escapeHtml(text)}</div>
      <div class="message-actions">
        <button class="msg-copy-btn" onclick="copyMessageText(this)" title="Copy message">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copy
        </button>
      </div>
    </div>
  `;

  chatThread.appendChild(messageElement);

  /* Auto-scroll to the latest message */
  chatThread.scrollTop = chatThread.scrollHeight;
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} unsafeText - Text that might contain HTML
 * @returns {string} Sanitized text safe for innerHTML
 */
function escapeHtml(unsafeText) {
  const tempDiv = document.createElement('div');
  tempDiv.textContent = unsafeText;
  return tempDiv.innerHTML;
}

/**
 * Copies the text of a message to the clipboard.
 * @param {HTMLElement} buttonElement - The copy button that was clicked
 * @returns {void}
 */
function copyMessageText(buttonElement) {
  const messageBody = buttonElement.closest('.message-body');
  const messageTextElement = messageBody.querySelector('.message-text');
  const textToCopy = messageTextElement.textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast('Message copied to clipboard!', 'success');
    buttonElement.textContent = '✓ Copied';
    setTimeout(() => {
      buttonElement.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
        Copy
      `;
    }, 2000);
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

/**
 * Shows the typing indicator with animation.
 * @returns {void}
 */
function showTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.classList.add('active');
    const chatThread = document.getElementById('chatThread');
    if (chatThread) chatThread.scrollTop = chatThread.scrollHeight;
  }
}

/**
 * Hides the typing indicator.
 * @returns {void}
 */
function hideTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.classList.remove('active');
  }
}

/**
 * Handles sending a user message and getting the AI reply.
 * Shows typing indicator with a simulated 800ms delay.
 * @param {string} userText - The user's message text
 * @returns {void}
 */
function handleSendMessage(userText) {
  if (!userText.trim()) return;

  /* Add user message */
  addMessage('user', userText.trim());

  /* Show typing indicator and get AI reply after delay */
  showTypingIndicator();
  const aiThinkingDelay = 800;

  setTimeout(() => {
    hideTypingIndicator();
    const aiResponse = getAIReply();
    addMessage('bot', aiResponse);
    saveConversation();
  }, aiThinkingDelay);
}

/**
 * Generates a unique conversation ID.
 * @returns {string} A unique string ID
 */
function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

/**
 * Saves the current conversation to localStorage.
 * Stores up to MAX_CONVERSATIONS conversations.
 * @returns {void}
 */
function saveConversation() {
  if (currentMessages.length === 0) return;

  const allConversations = getAllConversations();

  /* Derive a title from the first user message */
  const firstUserMsg = currentMessages.find(msg => msg.role === 'user');
  const conversationTitle = firstUserMsg
    ? firstUserMsg.text.substring(0, 40) + (firstUserMsg.text.length > 40 ? '...' : '')
    : 'New Conversation';

  if (!activeConversationId) {
    activeConversationId = generateConversationId();
  }

  /* Find existing or create new */
  const existingIndex = allConversations.findIndex(conv => conv.id === activeConversationId);
  const conversationData = {
    id: activeConversationId,
    title: conversationTitle,
    messages: [...currentMessages],
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    allConversations[existingIndex] = conversationData;
  } else {
    allConversations.unshift(conversationData);
  }

  /* Keep only the most recent conversations */
  const trimmedConversations = allConversations.slice(0, MAX_CONVERSATIONS);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(trimmedConversations));

  /* Update the sidebar */
  renderRecentChats();
}

/**
 * Retrieves all stored conversations from localStorage.
 * @returns {Array<Object>} Array of conversation objects
 */
function getAllConversations() {
  const rawData = localStorage.getItem(CONVERSATIONS_KEY);
  if (!rawData) return [];
  try {
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Failed to parse conversations:', error);
    return [];
  }
}

/**
 * Loads a specific conversation by its ID and restores it to the chat thread.
 * @param {string} conversationId - The ID of the conversation to load
 * @returns {void}
 */
function loadConversation(conversationId) {
  const allConversations = getAllConversations();
  const targetConversation = allConversations.find(conv => conv.id === conversationId);

  if (!targetConversation) {
    showToast('Conversation not found', 'error');
    return;
  }

  /* Clear the thread */
  const chatThread = document.getElementById('chatThread');
  if (chatThread) chatThread.innerHTML = '';

  /* Reset state */
  currentMessages = [];
  activeConversationId = conversationId;

  /* Re-render each message */
  for (const message of targetConversation.messages) {
    currentMessages.push(message);
    renderStoredMessage(message);
  }

  /* Update UI */
  updateChatTitle(targetConversation.title);
  renderRecentChats();

  /* Close mobile sidebar if open */
  closeMobileSidebar();
}

/**
 * Renders a stored message into the chat thread (without re-storing it).
 * @param {Object} messageData - The message object
 * @param {string} messageData.role - 'user' or 'bot'
 * @param {string} messageData.text - Message content
 * @param {string} messageData.timestamp - Time string
 * @returns {void}
 */
function renderStoredMessage(messageData) {
  const chatThread = document.getElementById('chatThread');
  if (!chatThread) return;

  const session = getSession();
  const avatarLabel = messageData.role === 'bot' ? 'L' : (session ? session.name.charAt(0).toUpperCase() : 'U');
  const authorName = messageData.role === 'bot' ? 'Luminescent AI' : (session ? session.name : 'You');

  const messageElement = document.createElement('div');
  messageElement.className = `message message--${messageData.role}`;
  messageElement.innerHTML = `
    <div class="message-avatar message-avatar--${messageData.role}">
      ${avatarLabel}
    </div>
    <div class="message-body">
      <div class="message-meta">
        <span class="message-author">${authorName}</span>
        <span class="message-time">${messageData.timestamp}</span>
      </div>
      <div class="message-text">${escapeHtml(messageData.text)}</div>
      <div class="message-actions">
        <button class="msg-copy-btn" onclick="copyMessageText(this)" title="Copy message">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copy
        </button>
      </div>
    </div>
  `;
  chatThread.appendChild(messageElement);
  chatThread.scrollTop = chatThread.scrollHeight;
}

/**
 * Starts a new conversation: clears the thread and shows a greeting.
 * @returns {void}
 */
function newConversation() {
  const chatThread = document.getElementById('chatThread');
  if (chatThread) chatThread.innerHTML = '';

  currentMessages = [];
  activeConversationId = null;

  /* Show greeting message */
  const session = getSession();
  const userName = session ? session.name.split(' ')[0] : 'there';
  addMessage('bot', `Welcome back, ${userName}! I'm Luminescent AI. How can I help you today?`);

  updateChatTitle('New Conversation');
  renderRecentChats();

  closeMobileSidebar();
}

/**
 * Renders the recent chats sidebar list from localStorage.
 * @returns {void}
 */
function renderRecentChats() {
  const listContainer = document.getElementById('recentChatsList');
  if (!listContainer) return;

  const allConversations = getAllConversations();
  listContainer.innerHTML = '';

  if (allConversations.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 16px 12px; font-size: 12px; color: var(--text-muted); text-align: center;">
        No recent chats yet
      </div>
    `;
    return;
  }

  for (const conversation of allConversations) {
    const isActive = conversation.id === activeConversationId;
    const itemElement = document.createElement('div');
    itemElement.className = `recent-chat-item${isActive ? ' active' : ''}`;
    itemElement.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
      <span class="recent-chat-title">${escapeHtml(conversation.title)}</span>
      <button class="recent-chat-delete" onclick="event.stopPropagation(); deleteConversation('${conversation.id}')" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    itemElement.addEventListener('click', () => loadConversation(conversation.id));
    listContainer.appendChild(itemElement);
  }
}

/**
 * Deletes a conversation by its ID from localStorage.
 * @param {string} conversationId - The ID of the conversation to delete
 * @returns {void}
 */
function deleteConversation(conversationId) {
  let allConversations = getAllConversations();
  allConversations = allConversations.filter(conv => conv.id !== conversationId);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(allConversations));

  /* If we deleted the active conversation, start fresh */
  if (conversationId === activeConversationId) {
    newConversation();
  } else {
    renderRecentChats();
  }

  showToast('Conversation deleted', 'info');
}

/**
 * Updates the chat title in the header.
 * @param {string} title - The new title to display
 * @returns {void}
 */
function updateChatTitle(title) {
  const titleElement = document.getElementById('chatTitle');
  if (titleElement) {
    titleElement.textContent = title;
  }
}

/**
 * Closes the mobile sidebar and overlay.
 * @returns {void}
 */
function closeMobileSidebar() {
  const sidebar = document.querySelector('.chat-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

/**
 * Handles user logout: clears session and redirects to index.
 * @returns {void}
 */
function handleLogout() {
  clearSession();
  window.location.href = 'index.html';
}
