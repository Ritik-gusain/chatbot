/* ================================================
   The Luminescent Scholar — JavaScript Engine
   Chat + Image Generation (Bytez AI)
   ================================================ */

// ===== API Key =====
const BYTEZ_API_KEY = '\keys\bytez_api_key.txt';

// ===== Free-tier Chat Models (Bytez) =====
const FREE_CHAT_MODELS = [
    // ── Meta Llama ──────────────────────────────
    {
        id: 'meta-llama/Llama-3.1-8B-Instruct',
        name: 'Llama 3.1 8B',
        provider: 'Meta',
        tag: '⚡ Fast',
        desc: 'Great all-rounder. Fast & free.',
    },
    {
        id: 'meta-llama/Llama-3.2-3B-Instruct',
        name: 'Llama 3.2 3B',
        provider: 'Meta',
        tag: '🚀 Fastest',
        desc: 'Ultra-fast lightweight model.',
    },
    // ── Google Gemma ────────────────────────────
    {
        id: 'google/gemma-3-4b-it',
        name: 'Gemma 3 4B',
        provider: 'Google',
        tag: '🆓 Free',
        desc: 'Google Gemma 3, 4B instruction-tuned.',
    },
    {
        id: 'google/gemma-4-E2B-it',
        name: 'Gemma 4 2B',
        provider: 'Google',
        tag: '🆓 Free',
        desc: 'Compact Gemma 4 efficiency model.',
    },
    {
        id: 'google/gemma-4-26B-A4B-it',
        name: 'Gemma 4 26B',
        provider: 'Google',
        tag: '🧠 Smart',
        desc: 'Larger Gemma 4, more capable.',
    },
    // ── Mistral ─────────────────────────────────
    {
        id: 'mistralai/Mistral-7B-Instruct-v0.3',
        name: 'Mistral 7B',
        provider: 'Mistral',
        tag: '⚡ Fast',
        desc: 'Mistral 7B instruction-tuned v0.3.',
    },
    {
        id: 'mistralai/Mistral-Nemo-Instruct-2407',
        name: 'Mistral Nemo',
        provider: 'Mistral',
        tag: '📖 Long ctx',
        desc: 'Mistral Nemo with long context support.',
    },
    // ── Microsoft Phi ───────────────────────────
    {
        id: 'microsoft/phi-4-mini',
        name: 'Phi-4 Mini',
        provider: 'Microsoft',
        tag: '🧮 Reasoning',
        desc: 'Compact reasoning & math specialist.',
    },
    {
        id: 'microsoft/phi-4',
        name: 'Phi-4',
        provider: 'Microsoft',
        tag: '🧮 Reasoning',
        desc: 'Powerful reasoning & math model.',
    },
    // ── Qwen ────────────────────────────────────
    {
        id: 'Qwen/Qwen3-0.6B',
        name: 'Qwen3 0.6B',
        provider: 'Alibaba',
        tag: '🚀 Fastest',
        desc: 'Tiny but surprisingly capable.',
    },
    {
        id: 'Qwen/Qwen3-8B',
        name: 'Qwen3 8B',
        provider: 'Alibaba',
        tag: '⚡ Fast',
        desc: 'Qwen3 8B — solid multilingual model.',
    },
    // ── DeepSeek ────────────────────────────────
    {
        id: 'deepseek-ai/DeepSeek-R1',
        name: 'DeepSeek R1',
        provider: 'DeepSeek',
        tag: '🧠 Reasoning',
        desc: 'Strong reasoning & coding model.',
    },
    // ── ZhipuAI ─────────────────────────────────
    {
        id: 'zai-org/GLM-4.7-Flash',
        name: 'GLM 4.7 Flash',
        provider: 'ZhipuAI',
        tag: '⚡ Fast',
        desc: 'Flash-optimised 31B GLM model.',
    },
];

// Active chat model (persisted)
let activeChatModel = localStorage.getItem('ls_activeModel') || FREE_CHAT_MODELS[0].id;

// Derived URL (always computed from activeChatModel)
function getChatApiUrl() {
    return `https://api.bytez.com/models/v2/${activeChatModel}`;
}

// Image model (fixed)
const IMAGE_MODEL = 'playgroundai/playground-v2.5-1024px-aesthetic';
const IMAGE_API_URL = `https://api.bytez.com/models/v2/${IMAGE_MODEL}`;

// ===== State =====
const state = {
    conversations: loadConversationsFromStorage(),
    activeConversationId: null,
    isGenerating: false,
};

// ===== Persistence =====
function loadConversationsFromStorage() {
    try { return JSON.parse(localStorage.getItem('ls_conversations') || '[]'); }
    catch { return []; }
}
function saveState() {
    localStorage.setItem('ls_conversations', JSON.stringify(state.conversations));
}

// ===== DOM helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const elements = {
    sidebar: $('#sidebar'),
    sidebarToggle: $('#sidebarToggle'),
    mobileMenuBtn: $('#mobileMenuBtn'),
    newChatBtn: $('#newChatBtn'),
    chatHistory: $('#chatHistory'),
    chatArea: $('#chatArea'),
    welcomeScreen: $('#welcomeScreen'),
    messagesContainer: $('#messagesContainer'),
    typingIndicator: $('#typingIndicator'),
    typingLabel: $('#typingLabel'),
    typingHint: $('#typingHint'),
    messageInput: $('#messageInput'),
    sendBtn: $('#sendBtn'),
    charCount: $('#charCount'),
    clearBtn: $('#clearBtn'),
    exportBtn: $('#exportBtn'),
    conversationTitle: $('#conversationTitle'),
    toast: $('#toast'),
    toastMessage: $('#toastMessage'),
    inputWrapper: $('#inputWrapper'),
    systemPrompt: $('#systemPrompt'),
    modelBadgeText: $('#modelBadgeText'),
    // Mode
    chatPanel: $('#chatPanel'),
    imagePanel: $('#imagePanel'),
    modePillChat: $('#modePillChat'),
    modePillImage: $('#modePillImage'),
    navChat: $('#navChat'),
    navImage: $('#navImage'),
    // Image gen
    imagePromptInput: $('#imagePromptInput'),
    generateImageBtn: $('#generateImageBtn'),
    imgCharCount: $('#imgCharCount'),
    imgGenerating: $('#imgGenerating'),
    genProgressLabel: $('#genProgressLabel'),
    imgGallery: $('#imgGallery'),
    galleryEmpty: $('#galleryEmpty'),
    galleryClearBtn: $('#galleryClearBtn'),
    // Lightbox
    lightbox: $('#lightbox'),
    lightboxImg: $('#lightboxImg'),
    lightboxPrompt: $('#lightboxPrompt'),
    lightboxDownload: $('#lightboxDownload'),
    lightboxClose: $('#lightboxClose'),
    lightboxBackdrop: $('#lightboxBackdrop'),
    // Model selector
    modelSelectorBtn: $('#modelSelectorBtn'),
    modelDropdown: $('#modelDropdown'),
    modelBadgeText: $('#modelBadgeText'),
    modelBadgeDot: $('#modelBadgeDot'),
};

// ===== App mode ('chat' | 'image') =====
let currentMode = 'chat';

// ===== Initialization =====
function init() {
    buildModelSelector();

    bindEvents();
    renderChatHistory();
    loadImageGalleryFromStorage();

    const lastId = localStorage.getItem('ls_activeConversation');
    if (lastId && state.conversations.find(c => c.id === lastId)) {
        loadConversation(lastId);
    } else if (state.conversations.length > 0) {
        loadConversation(state.conversations[0].id);
    } else {
        showWelcomeScreen();
    }

    elements.messageInput.addEventListener('input', autoResize);
    elements.messageInput.focus();
}

// ===== Build Model Selector =====
function buildModelSelector() {
    const dropdown = elements.modelDropdown;
    if (!dropdown) return;
    dropdown.innerHTML = '';

    // Group by provider
    const groups = {};
    FREE_CHAT_MODELS.forEach(m => {
        if (!groups[m.provider]) groups[m.provider] = [];
        groups[m.provider].push(m);
    });

    Object.entries(groups).forEach(([provider, models]) => {
        const grpLabel = document.createElement('div');
        grpLabel.className = 'model-group-label';
        grpLabel.textContent = provider;
        dropdown.appendChild(grpLabel);

        models.forEach(m => {
            const item = document.createElement('button');
            item.className = 'model-option' + (m.id === activeChatModel ? ' active' : '');
            item.dataset.modelId = m.id;
            item.innerHTML = `
                <div class="model-option-top">
                    <span class="model-option-name">${m.name}</span>
                    <span class="model-option-tag">${m.tag}</span>
                </div>
                <div class="model-option-desc">${m.desc}</div>
            `;
            item.addEventListener('click', () => setActiveModel(m.id));
            dropdown.appendChild(item);
        });
    });

    updateModelBadge();
}

function setActiveModel(modelId) {
    activeChatModel = modelId;
    localStorage.setItem('ls_activeModel', modelId);

    // Update all option highlights
    $$('.model-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.modelId === modelId);
    });

    updateModelBadge();
    closeModelDropdown();
    showToast(`Model: ${FREE_CHAT_MODELS.find(m => m.id === modelId)?.name}`);
}

function updateModelBadge() {
    const model = FREE_CHAT_MODELS.find(m => m.id === activeChatModel);
    if (!model) return;
    if (elements.modelBadgeText) elements.modelBadgeText.textContent = model.name;
}

function closeModelDropdown() {
    if (elements.modelDropdown) elements.modelDropdown.classList.remove('open');
}

// ===== Event Binding =====
function bindEvents() {
    elements.sidebarToggle.addEventListener('click', toggleSidebar);
    elements.mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
    elements.newChatBtn.addEventListener('click', startNewConversation);

    // Chat
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    elements.messageInput.addEventListener('input', () => {
        const len = elements.messageInput.value.length;
        elements.charCount.textContent = len;
        elements.sendBtn.disabled = len === 0 || state.isGenerating;
    });
    elements.clearBtn.addEventListener('click', clearCurrentChat);
    elements.exportBtn.addEventListener('click', exportChat);

    $$('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.dataset.prompt;
            elements.messageInput.value = prompt;
            elements.messageInput.dispatchEvent(new Event('input'));
            sendMessage();
        });
    });

    // Mode toggle — topbar pills
    elements.modePillChat.addEventListener('click', () => switchMode('chat'));
    elements.modePillImage.addEventListener('click', () => switchMode('image'));

    // Mode toggle — sidebar nav
    elements.navChat.addEventListener('click', () => switchMode('chat'));
    elements.navImage.addEventListener('click', () => switchMode('image'));

    // Image prompt input
    elements.imagePromptInput.addEventListener('input', () => {
        const len = elements.imagePromptInput.value.trim().length;
        elements.imgCharCount.textContent = `${len} / 500`;
        elements.generateImageBtn.disabled = len === 0;
    });
    elements.imagePromptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateImage(); }
    });

    // Generate button
    elements.generateImageBtn.addEventListener('click', generateImage);

    // Style tags
    $$('.style-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.dataset.tag;
            const cur = elements.imagePromptInput.value.trim();
            const already = tag.classList.contains('active');

            // Remove all active tags first
            $$('.style-tag').forEach(t => t.classList.remove('active'));

            if (!already) {
                // Append tag to prompt
                const base = cur.replace(/,\s*(cinematic lighting.*|digital art.*|anime style.*|oil painting.*|cyberpunk.*|watercolor.*)$/i, '').trim();
                elements.imagePromptInput.value = base ? `${base}, ${tagText}` : tagText;
                tag.classList.add('active');
            } else {
                // Remove tag text from prompt
                elements.imagePromptInput.value = cur.replace(`, ${tagText}`, '').replace(tagText, '').trim();
            }
            elements.imagePromptInput.dispatchEvent(new Event('input'));
        });
    });

    // Gallery clear
    elements.galleryClearBtn.addEventListener('click', clearGallery);

    // Lightbox
    elements.lightboxClose.addEventListener('click', closeLightbox);
    elements.lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeLightbox(); closeModelDropdown(); }
    });

    // Model selector dropdown toggle
    if (elements.modelSelectorBtn) {
        elements.modelSelectorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.modelDropdown.classList.toggle('open');
        });
    }
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (elements.modelDropdown && !e.target.closest('.model-selector-wrap')) {
            closeModelDropdown();
        }
    });
}

// ===== Sidebar =====
function toggleSidebar() { elements.sidebar.classList.toggle('collapsed'); }

function toggleMobileSidebar() {
    const isOpen = elements.sidebar.classList.contains('mobile-open');
    if (isOpen) { closeMobileSidebar(); return; }
    elements.sidebar.classList.add('mobile-open');
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
    overlay.addEventListener('click', closeMobileSidebar);
}
function closeMobileSidebar() {
    elements.sidebar.classList.remove('mobile-open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ===== Conversations =====
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }

function startNewConversation() {
    const active = getActiveConversation();
    if (active && active.messages.length === 0) { elements.messageInput.focus(); return; }
    const conv = { id: generateId(), title: 'New Conversation', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    state.conversations.unshift(conv);
    saveState();
    loadConversation(conv.id);
    renderChatHistory();
    closeMobileSidebar();
    elements.messageInput.focus();
}

function loadConversation(id) {
    state.activeConversationId = id;
    localStorage.setItem('ls_activeConversation', id);
    const conv = getActiveConversation();
    if (!conv) return;
    elements.conversationTitle.textContent = conv.title;
    elements.welcomeScreen.style.display = 'none';
    elements.messagesContainer.classList.add('active');
    elements.messagesContainer.innerHTML = '';
    if (conv.messages.length === 0) {
        elements.welcomeScreen.style.display = '';
        elements.messagesContainer.classList.remove('active');
    } else {
        conv.messages.forEach(msg => appendMessageToDOM(msg, false));
        scrollToBottom();
    }
    renderChatHistory();
}

function getActiveConversation() {
    return state.conversations.find(c => c.id === state.activeConversationId);
}

function deleteConversation(id) {
    state.conversations = state.conversations.filter(c => c.id !== id);
    saveState();
    if (state.activeConversationId === id) {
        state.activeConversationId = null;
        state.conversations.length > 0 ? loadConversation(state.conversations[0].id) : showWelcomeScreen();
    }
    renderChatHistory();
    showToast('Conversation deleted');
}

function showWelcomeScreen() {
    state.activeConversationId = null;
    elements.welcomeScreen.style.display = '';
    elements.messagesContainer.classList.remove('active');
    elements.messagesContainer.innerHTML = '';
    elements.conversationTitle.textContent = 'New Conversation';
    localStorage.removeItem('ls_activeConversation');
}

// ===== Chat History =====
function renderChatHistory() {
    elements.chatHistory.innerHTML = '';
    if (state.conversations.length === 0) {
        elements.chatHistory.innerHTML = `<div style="padding:12px 8px;text-align:center;color:var(--text-3);font-size:12px;">No conversations yet</div>`;
        return;
    }
    state.conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = `chat-history-item ${conv.id === state.activeConversationId ? 'active' : ''}`;
        item.innerHTML = `
            <svg class="chat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <span class="chat-title">${escapeHtml(conv.title)}</span>
            <button class="chat-delete" title="Delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        item.addEventListener('click', (e) => {
            if (e.target.closest('.chat-delete')) return;
            loadConversation(conv.id);
            closeMobileSidebar();
        });
        item.querySelector('.chat-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConversation(conv.id);
        });
        elements.chatHistory.appendChild(item);
    });
}

// ===== Message Sending =====
function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text || state.isGenerating) return;

    if (!state.activeConversationId) {
        const conv = { id: generateId(), title: 'New Conversation', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        state.conversations.unshift(conv);
        saveState();
        state.activeConversationId = conv.id;
        localStorage.setItem('ls_activeConversation', conv.id);
    }

    const conv = getActiveConversation();
    if (!conv) return;

    elements.welcomeScreen.style.display = 'none';
    elements.messagesContainer.classList.add('active');

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    conv.messages.push(userMsg);

    if (conv.messages.length === 1) {
        conv.title = text.substring(0, 46) + (text.length > 46 ? '…' : '');
        elements.conversationTitle.textContent = conv.title;
        renderChatHistory();
    }

    conv.updatedAt = new Date().toISOString();
    saveState();
    appendMessageToDOM(userMsg, true);

    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    elements.charCount.textContent = '0';
    elements.sendBtn.disabled = true;

    getAIResponse(conv);
}

// ===== Bytez AI API (with streaming-style reveal) =====
async function getAIResponse(conv) {
    state.isGenerating = true;
    if (elements.sendBtn) elements.sendBtn.disabled = true;
    elements.typingIndicator.style.display = 'flex';

    // Reset typing label
    if (elements.typingLabel) elements.typingLabel.textContent = 'Scholar is thinking';
    if (elements.typingHint) elements.typingHint.textContent = '';

    // Cold-start hints — shown if the model takes too long (free tier spins up)
    const coldStartTimer1 = setTimeout(() => {
        if (elements.typingHint) {
            elements.typingHint.textContent = '⏳ Model warming up on free tier, 10-30s…';
        }
    }, 8000);
    const coldStartTimer2 = setTimeout(() => {
        if (elements.typingLabel) elements.typingLabel.textContent = 'Still loading…';
        if (elements.typingHint) {
            elements.typingHint.textContent = '🧊 Cold start — switch to Llama 3.2 3B for faster responses';
        }
    }, 22000);

    scrollToBottom();

    const systemPromptText = (elements.systemPrompt && elements.systemPrompt.value.trim())
        ? elements.systemPrompt.value.trim()
        : `You are Scholar, an advanced AI assistant. Be helpful, concise, and direct.
Use markdown formatting (headers, bullet lists, bold, code blocks) when it improves clarity.
Keep responses focused and avoid unnecessary padding. Never truncate your responses.`;

    const messages = [
        { role: 'system', content: systemPromptText },
        ...conv.messages.map(m => ({ role: m.role, content: m.content })),
    ];

    try {
        const response = await fetch(getChatApiUrl(), {
            method: 'POST',
            headers: {
                'Authorization': `Key ${BYTEZ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: messages }),
        });

        if (!response.ok) {
            let errBody = '';
            try { errBody = await response.text(); } catch { }
            throw new Error(`HTTP ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        let assistantContent = '';
        if (data.output) {
            if (typeof data.output === 'string') {
                assistantContent = data.output;
            } else if (data.output.content) {
                assistantContent = data.output.content;
            } else if (Array.isArray(data.output) && data.output[0]?.generated_text) {
                assistantContent = data.output[0].generated_text;
            } else {
                assistantContent = JSON.stringify(data.output);
            }
        }

        elements.typingIndicator.style.display = 'none';

        const assistantMsg = {
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date().toISOString(),
        };

        conv.messages.push(assistantMsg);
        conv.updatedAt = new Date().toISOString();
        saveState();

        // Stream-reveal the message word by word
        await streamRevealMessage(assistantMsg, assistantContent);
        scrollToBottom();

    } catch (err) {
        console.error('[Scholar] API error:', err);
        clearTimeout(coldStartTimer1);
        clearTimeout(coldStartTimer2);
        elements.typingIndicator.style.display = 'none';
        if (elements.typingLabel) elements.typingLabel.textContent = 'Scholar is thinking';
        if (elements.typingHint) elements.typingHint.textContent = '';

        const errMsg = {
            role: 'assistant',
            content: `⚠️ **Could not reach Scholar**\n\n\`\`\`\n${err.message}\n\`\`\`\n\n**Tips:** The free-tier model may have timed out. Try switching to a faster model like **Llama 3.2 3B** from the sidebar.`,
            timestamp: new Date().toISOString(),
        };
        conv.messages.push(errMsg);
        conv.updatedAt = new Date().toISOString();
        saveState();
        appendMessageToDOM(errMsg, true);
    } finally {
        clearTimeout(coldStartTimer1);
        clearTimeout(coldStartTimer2);
        if (elements.typingLabel) elements.typingLabel.textContent = 'Scholar is thinking';
        if (elements.typingHint) elements.typingHint.textContent = '';
        state.isGenerating = false;
        if (elements.sendBtn) elements.sendBtn.disabled = elements.messageInput.value.trim().length === 0;
    }
}

// ===== Stream-reveal effect (word by word) =====
async function streamRevealMessage(msg, fullContent) {
    // Create the row immediately but with empty body
    const row = document.createElement('div');
    row.className = 'message-row assistant-row';
    row.style.animation = 'msgIn 0.35s cubic-bezier(0.4,0,0.2,1) both';

    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const gradId = 'g' + Math.random().toString(36).substr(2, 8);

    row.innerHTML = `
        <div class="message-avatar assistant-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#${gradId})"/>
                <defs>
                  <linearGradient id="${gradId}" x1="2" y1="2" x2="22" y2="22">
                    <stop offset="0%" stop-color="#7c6cfc"/>
                    <stop offset="100%" stop-color="#60a5fa"/>
                  </linearGradient>
                </defs>
            </svg>
        </div>
        <div class="message-content">
            <div class="message-role assistant-role">
                Scholar <span class="message-timestamp">${time}</span>
            </div>
            <div class="message-body" id="streaming-body"></div>
            <div class="message-actions">
                <button class="msg-action-btn copy-msg-btn" title="Copy message">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    elements.messagesContainer.appendChild(row);
    scrollToBottom();

    const bodyEl = row.querySelector('#streaming-body');
    bodyEl.removeAttribute('id');

    // Split by word tokens for smooth reveal
    const words = fullContent.split(/(\s+)/);
    let accumulated = '';
    const cursor = document.createElement('span');
    cursor.className = 'streaming-cursor';

    // Render incrementally — every N words
    const CHUNK = 3; // reveal 3 words at a time
    const DELAY = 22; // ms between chunks (fast!)

    for (let i = 0; i < words.length; i += CHUNK) {
        accumulated += words.slice(i, i + CHUNK).join('');
        bodyEl.innerHTML = renderMarkdown(accumulated);
        bodyEl.appendChild(cursor);
        scrollToBottom();
        await sleep(DELAY);
    }

    // Final render without cursor
    bodyEl.innerHTML = renderMarkdown(fullContent);

    row.querySelector('.copy-msg-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(fullContent).then(() => showToast('Copied!'));
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===== DOM Message Renderer (for history / user messages) =====
function appendMessageToDOM(msg, animate = true) {
    const row = document.createElement('div');
    row.className = `message-row ${msg.role === 'user' ? 'user-row' : 'assistant-row'}`;
    if (animate) row.style.animation = 'msgIn 0.35s cubic-bezier(0.4,0,0.2,1) both';

    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isUser = msg.role === 'user';
    const gradId = 'g' + Math.random().toString(36).substr(2, 8);

    const avatarHTML = isUser
        ? `<div class="message-avatar user-avatar">U</div>`
        : `<div class="message-avatar assistant-avatar">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
               <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#${gradId})"/>
               <defs>
                 <linearGradient id="${gradId}" x1="2" y1="2" x2="22" y2="22">
                   <stop offset="0%" stop-color="#7c6cfc"/>
                   <stop offset="100%" stop-color="#60a5fa"/>
                 </linearGradient>
               </defs>
             </svg>
           </div>`;

    const roleLabel = isUser ? 'You' : 'Scholar';
    const roleClass = isUser ? 'user-role' : 'assistant-role';
    const rendered = isUser ? `<p>${escapeHtml(msg.content)}</p>` : renderMarkdown(msg.content);

    row.innerHTML = `
        ${avatarHTML}
        <div class="message-content">
            <div class="message-role ${roleClass}">
                ${roleLabel} <span class="message-timestamp">${time}</span>
            </div>
            <div class="message-body">${rendered}</div>
            <div class="message-actions">
                <button class="msg-action-btn copy-msg-btn" title="Copy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    row.querySelector('.copy-msg-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(msg.content).then(() => showToast('Copied!'));
    });

    elements.messagesContainer.appendChild(row);
    scrollToBottom();
}

// ===== Markdown Renderer =====
function renderMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // Fenced code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
        const l = lang || 'plaintext';
        return `<pre><code class="language-${l}">${code.trim()}</code><button class="code-copy-btn" onclick="copyCode(this)">Copy</button></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // Bold+italic, bold, italic, strikethrough
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // HR
    html = html.replace(/^---$/gm, '<hr>');

    // Tables
    html = renderTables(html);

    // Unordered lists
    html = html.replace(/^[-*+] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(?<!<\/ul>)(<li>[\s\S]*?<\/li>\n?)+(?!<\/ul>)/g, m => {
        if (m.includes('<ul>')) return m;
        return `<ol>${m}</ol>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs
    html = html.split('\n\n').map(block => {
        block = block.trim();
        if (!block) return '';
        if (/^<(h[1-6]|pre|ul|ol|blockquote|hr|table)/.test(block)) return block;
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

function renderTables(html) {
    const lines = html.split('\n');
    const result = [];
    let tableLines = [];
    let inTable = false;
    for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('|') && t.endsWith('|')) { inTable = true; tableLines.push(t); }
        else {
            if (inTable) { result.push(buildTable(tableLines)); tableLines = []; inTable = false; }
            result.push(line);
        }
    }
    if (inTable) result.push(buildTable(tableLines));
    return result.join('\n');
}

function buildTable(lines) {
    if (lines.length < 2) return lines.join('\n');
    let html = '<table>'; let inBody = false;
    lines.forEach((line, i) => {
        if (/^\|[\s\-|:]+\|$/.test(line)) { html += '<tbody>'; inBody = true; return; }
        const tag = (i === 0 && !inBody) ? 'th' : 'td';
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (i === 0) html += '<thead>';
        html += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
        if (i === 0) html += '</thead>';
    });
    html += inBody ? '</tbody>' : '';
    html += '</table>';
    return html;
}

// ===== Utilities =====
function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}
function autoResize() {
    elements.messageInput.style.height = 'auto';
    elements.messageInput.style.height = Math.min(elements.messageInput.scrollHeight, 220) + 'px';
}
function scrollToBottom() {
    requestAnimationFrame(() => { elements.chatArea.scrollTop = elements.chatArea.scrollHeight; });
}
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => elements.toast.classList.remove('show'), 2500);
}

// ===== Clear / Export =====
function clearCurrentChat() {
    const conv = getActiveConversation();
    if (!conv || conv.messages.length === 0) { showToast('No messages to clear'); return; }
    conv.messages = [];
    conv.title = 'New Conversation';
    conv.updatedAt = new Date().toISOString();
    saveState();
    elements.messagesContainer.innerHTML = '';
    elements.welcomeScreen.style.display = '';
    elements.messagesContainer.classList.remove('active');
    elements.conversationTitle.textContent = conv.title;
    renderChatHistory();
    showToast('Chat cleared');
}

function exportChat() {
    const conv = getActiveConversation();
    if (!conv || conv.messages.length === 0) { showToast('No messages to export'); return; }
    let text = `# ${conv.title}\nExported: ${new Date().toLocaleString()}\n\n---\n\n`;
    conv.messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 You' : '✨ Scholar';
        const time = new Date(msg.timestamp).toLocaleString();
        text += `**${role}** _(${time})_\n\n${msg.content}\n\n---\n\n`;
    });
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title.replace(/[^a-z0-9]/gi, '_')}_export.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Chat exported');
}

// ===== Code Copy (global) =====
window.copyCode = function (btn) {
    const code = btn.parentElement.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
};

// ============================================================
// IMAGE GENERATION ENGINE
// ============================================================

// In-memory gallery (also persisted to localStorage)
let imageGallery = [];

function loadImageGalleryFromStorage() {
    try {
        imageGallery = JSON.parse(localStorage.getItem('ls_imageGallery') || '[]');
        imageGallery.forEach(item => renderGalleryCard(item, false));
        updateGalleryEmpty();
    } catch { imageGallery = []; }
}

function saveGallery() {
    // Only save last 20 (base64 can get large)
    const toSave = imageGallery.slice(0, 20);
    try { localStorage.setItem('ls_imageGallery', JSON.stringify(toSave)); } catch { }
}

async function generateImage() {
    const prompt = elements.imagePromptInput.value.trim();
    if (!prompt) return;

    // UI: loading state
    elements.generateImageBtn.disabled = true;
    elements.imgGenerating.style.display = 'flex';
    elements.genProgressLabel.textContent = 'Preparing your image…';
    elements.imagePromptInput.disabled = true;

    // Animate progress msgs
    const msgs = [
        'Generating your image…',
        'Rendering details…',
        'Applying aesthetics…',
        'Almost done…',
    ];
    let msgIdx = 0;
    const msgTimer = setInterval(() => {
        msgIdx = (msgIdx + 1) % msgs.length;
        elements.genProgressLabel.textContent = msgs[msgIdx];
    }, 2200);

    try {
        const response = await fetch(IMAGE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${BYTEZ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: prompt }),
        });

        if (!response.ok) {
            let errBody = '';
            try { errBody = await response.text(); } catch { }
            throw new Error(`HTTP ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // Extract image — may be base64 string or array
        let imageData = null;
        if (data.output) {
            if (typeof data.output === 'string') {
                imageData = data.output;
            } else if (Array.isArray(data.output) && data.output[0]) {
                const first = data.output[0];
                if (typeof first === 'string') imageData = first;
                else if (first.image) imageData = first.image;
                else if (first.b64_json) imageData = first.b64_json;
            } else if (data.output.b64_json) {
                imageData = data.output.b64_json;
            } else if (data.output.image) {
                imageData = data.output.image;
            }
        }

        if (!imageData) throw new Error('No image data in response. Raw: ' + JSON.stringify(data).slice(0, 300));

        // Build src — handle base64 or URL
        const src = imageData.startsWith('http') ? imageData
            : imageData.startsWith('data:') ? imageData
                : `data:image/png;base64,${imageData}`;

        const item = {
            id: Date.now().toString(36),
            src,
            prompt,
            createdAt: new Date().toISOString(),
        };

        imageGallery.unshift(item);
        saveGallery();
        renderGalleryCard(item, true);
        updateGalleryEmpty();
        showToast('Image generated!');

    } catch (err) {
        console.error('[Image Gen] Error:', err);
        showToast('❌ Generation failed — ' + err.message.slice(0, 60));
    } finally {
        clearInterval(msgTimer);
        elements.imgGenerating.style.display = 'none';
        elements.generateImageBtn.disabled = elements.imagePromptInput.value.trim().length === 0;
        elements.imagePromptInput.disabled = false;
    }
}

function renderGalleryCard(item, prepend = true) {
    const empty = elements.galleryEmpty;

    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('data-id', item.id);
    card.innerHTML = `
        <img src="${item.src}" alt="Generated: ${escapeHtml(item.prompt)}" loading="lazy">
        <div class="gallery-card-overlay">
            <div class="gallery-card-actions">
                <button class="gallery-card-btn view-btn">View</button>
                <button class="gallery-card-btn download-btn">Download</button>
            </div>
        </div>
        <div class="gallery-card-footer">
            <div class="gallery-card-prompt">${escapeHtml(item.prompt)}</div>
            <div class="gallery-card-meta">${new Date(item.createdAt).toLocaleString()}</div>
        </div>
    `;

    // View → lightbox
    card.querySelector('.view-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(item);
    });
    card.addEventListener('click', () => openLightbox(item));

    // Download
    card.querySelector('.download-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        downloadImage(item);
    });

    if (prepend && empty && empty.parentNode === elements.imgGallery) {
        elements.imgGallery.insertBefore(card, elements.imgGallery.firstChild);
    } else {
        elements.imgGallery.appendChild(card);
    }
}

function updateGalleryEmpty() {
    const hasImages = elements.imgGallery.querySelectorAll('.gallery-card').length > 0;
    if (elements.galleryEmpty) {
        elements.galleryEmpty.style.display = hasImages ? 'none' : '';
    }
}

function clearGallery() {
    imageGallery = [];
    saveGallery();
    const cards = elements.imgGallery.querySelectorAll('.gallery-card');
    cards.forEach(c => c.remove());
    updateGalleryEmpty();
    showToast('Gallery cleared');
}

// ===== Lightbox =====
function openLightbox(item) {
    elements.lightboxImg.src = item.src;
    elements.lightboxPrompt.textContent = item.prompt;
    elements.lightboxDownload.href = item.src;
    elements.lightboxDownload.download = `scholar-${item.id}.png`;
    elements.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    elements.lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { elements.lightboxImg.src = ''; }, 300);
}

function downloadImage(item) {
    const a = document.createElement('a');
    a.href = item.src;
    a.download = `scholar-${item.id}.png`;
    a.click();
    showToast('Downloading…');
}

// ============================================================
// MODE SWITCHING
// ============================================================
function switchMode(mode) {
    currentMode = mode;
    const isChat = mode === 'chat';

    // Panels
    elements.chatPanel.classList.toggle('hidden', !isChat);
    elements.imagePanel.classList.toggle('hidden', isChat);

    // Topbar pills
    elements.modePillChat.classList.toggle('active', isChat);
    elements.modePillImage.classList.toggle('active', !isChat);

    // Sidebar nav
    elements.navChat.classList.toggle('active', isChat);
    elements.navImage.classList.toggle('active', !isChat);

    // New chat btn only relevant for chat mode
    elements.newChatBtn.style.opacity = isChat ? '1' : '0.4';
    elements.newChatBtn.style.pointerEvents = isChat ? 'auto' : 'none';

    // Title
    elements.conversationTitle.textContent = isChat
        ? (getActiveConversation()?.title || 'New Conversation')
        : 'AI Image Studio';

    if (isChat) elements.messageInput.focus();
    else elements.imagePromptInput.focus();
}

// ===== Boot =====
document.addEventListener('DOMContentLoaded', init);
