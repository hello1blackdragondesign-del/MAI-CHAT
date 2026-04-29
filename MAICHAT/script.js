const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat');
const chatHistoryEl = document.getElementById('chat-history');
const suggestedPromptsEl = document.getElementById('suggested-prompts');
const modelSelect = document.getElementById('model-select');
const themeToggle = document.getElementById('theme-toggle');

let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('maichat_chats')) || {};
let isDark = true;

// Suggested prompts
const suggestions = [
  "Explain quantum computing like I'm 15",
  "Write a motivational speech for entrepreneurs",
  "Help me debug this Python code",
  "What are the latest AI breakthroughs in 2026?"
];

function renderSuggestions() {
  suggestedPromptsEl.innerHTML = suggestions.map(s => 
    `<div class="prompt-chip" onclick="useSuggestion('\( {s}')"> \){s}</div>`
  ).join('');
}

function useSuggestion(text) {
  userInput.value = text;
  sendMessage();
}

// Render message with markdown + math + highlight
function renderContent(content) {
  let html = marked.parse(content || "");
  // KaTeX support
  html = html.replace(/\$\$(.+?)\$\$/gs, (_, eq) => {
    try { return katex.renderToString(eq, {throwOnError: false}); }
    catch { return _; }
  });
  html = html.replace(/\$(.+?)\$/g, (_, eq) => {
    try { return katex.renderToString(eq, {throwOnError: false, displayMode: false}); }
    catch { return _; }
  });
  return html;
}

function addMessage(text, isUser, save = true) {
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'ai'}`;
  
  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  
  div.innerHTML = `
    <div class="avatar \( {isUser ? 'user' : 'ai'}"> \){isUser ? '👤' : '🧠'}</div>
    <div class="bubble">
      ${isUser ? text : renderContent(text)}
      <div class="message-actions">
        <button class="action-btn" onclick="copyMessage(this)">📋</button>
        ${!isUser ? `<button class="action-btn" onclick="regenerate(this)">↻</button>` : ''}
      </div>
      ${!isUser ? `
      <div class="reactions">
        <button class="reaction-btn" onclick="react(this, '👍')">👍</button>
        <button class="reaction-btn" onclick="react(this, '👎')">👎</button>
      </div>` : ''}
    </div>
    <small style="margin-top:6px; color:#666; font-size:12px;">${time}</small>
  `;

  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (save && currentChatId) {
    chats[currentChatId].messages.push({text, isUser, time});
    saveChats();
  }
}

function showTyping() {
  const typing = document.createElement('div');
  typing.id = 'typing-indicator';
  typing.className = 'message ai typing-indicator';
  typing.innerHTML = `
    <div class="avatar ai">🧠</div>
    <div style="padding:15px 20px; background:var(--surface); border-radius:20px;">
      <span>MAICHAT is thinking</span>
      <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
    </div>
  `;
  chatContainer.appendChild(typing);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return typing;
}

// Simulated streaming
async function streamResponse(userMessage) {
  const typing = showTyping();
  const responseDiv = document.createElement('div');
  responseDiv.className = 'message ai';
  chatContainer.appendChild(responseDiv);
  
  let fullText = `Thank you for asking about **${userMessage}**. `;
  const words = ["Here's my detailed analysis.\n\n", "This is a complex topic with many layers.\n", "- First key point\n", "- Second insight\n", "Finally, the mathematical representation:\n\n\[ \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2} \]\n\nWhat else would you like to explore?"];
  
  typing.remove();

  for (let word of words) {
    fullText += word;
    responseDiv.innerHTML = `
      <div class="avatar ai">🧠</div>
      <div class="bubble">${renderContent(fullText)}<div class="message-actions">...</div></div>
    `;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    await new Promise(r => setTimeout(r, 40 + Math.random() * 60));
  }

  if (currentChatId) {
    chats[currentChatId].messages.push({text: fullText, isUser: false});
    saveChats();
  }
}

async function sendMessage() {
  let text = userInput.value.trim();
  if (!text) return;

  if (!currentChatId) {
    currentChatId = Date.now().toString();
    chats[currentChatId] = { title: text.substring(0, 35) + "...", messages: [] };
  }

  addMessage(text, true);
  userInput.value = "";

  await streamResponse(text);
  updateHistory();
}

function copyMessage(btn) {
  const bubble = btn.closest('.bubble');
  const text = bubble.innerText;
  navigator.clipboard.writeText(text);
  btn.textContent = '✓';
  setTimeout(() => btn.textContent = '📋', 1200);
}

function regenerate(btn) {
  const msg = btn.closest('.message');
  msg.remove();
  // Simulate regenerate
  streamResponse("Follow-up question");
}

function react(btn, emoji) {
  btn.style.transform = 'scale(1.4)';
  setTimeout(() => btn.style.transform = '', 300);
}

// Voice Input
const voiceBtn = document.getElementById('voice-btn');
voiceBtn.addEventListener('click', () => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    alert("Voice input not supported in your browser.");
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = (e) => {
    userInput.value = e.results[0][0].transcript;
    sendMessage();
  };
  recognition.start();
});

// File attach simulation
document.getElementById('attach-btn').addEventListener('click', () => {
  alert("File upload simulated. In a real app, this would open file picker and send to backend.");
});

// Image generation mock
document.getElementById('image-gen-btn').addEventListener('click', () => {
  const prompt = prompt("Describe the image you want MAICHAT to generate:");
  if (prompt) {
    addMessage(`🖼️ **Generated Image:**\n\n*${prompt}*\n\n(Image would appear here in a full app)`, false);
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle.innerHTML = isDark ? `<i class="fa-solid fa-moon"></i>` : `<i class="fa-solid fa-sun"></i>`;
});

// Chat history functions (same as before + export)
function saveChats() { localStorage.setItem('maichat_chats', JSON.stringify(chats)); }

function updateHistory() {
  chatHistoryEl.innerHTML = '';
  Object.keys(chats).sort().reverse().forEach(id => {
    const item = document.createElement('div');
    item.className = `history-item ${id === currentChatId ? 'active' : ''}`;
    item.textContent = chats[id].title;
    item.onclick = () => loadChat(id);
    chatHistoryEl.appendChild(item);
  });
}

function loadChat(id) {
  currentChatId = id;
  chatContainer.innerHTML = '';
  chats[id].messages.forEach(m => addMessage(m.text, m.isUser, false));
}

function newChat() {
  currentChatId = null;
  chatContainer.innerHTML = '';
  addMessage("Hello! I'm **MAICHAT**, your advanced AI companion.\n\nWhat would you like to explore today?", false);
}

document.getElementById('export-chat').addEventListener('click', () => {
  if (!currentChatId) return;
  const content = chats[currentChatId].messages.map(m => 
    `${m.isUser ? 'You' : 'MAICHAT'}: ${m.text}`
  ).join('\n\n');
  const blob = new Blob([content], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maichat-${currentChatId}.txt`;
  a.click();
});

document.getElementById('clear-all').addEventListener('click', () => {
  if (confirm("Delete all conversations?")) {
    chats = {};
    saveChats();
    newChat();
    updateHistory();
  }
});

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

newChatBtn.addEventListener('click', () => {
  newChat();
  updateHistory();
});

// Auto resize input
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 220) + 'px';
});

// Initialize
window.onload = () => {
  renderSuggestions();
  updateHistory();
  
  if (Object.keys(chats).length === 0) {
    newChat();
  } else {
    const latest = Object.keys(chats).sort().reverse()[0];
    loadChat(latest);
  }
};
// ============== HAMBURGER MENU ==============
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

hamburger.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Close sidebar when selecting a chat on mobile
document.getElementById('chat-history').addEventListener('click', (e) => {
  if (window.innerWidth <= 992 && e.target.closest('.history-item')) {
    setTimeout(closeSidebar, 250);
  }
});

// Optional: Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape" && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});
