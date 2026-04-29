const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat');

function addMessage(text, isUser) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
  
  messageDiv.innerHTML = `
    <div class="avatar ${isUser ? 'user' : 'ai'}">
      ${isUser ? '👤' : '🧠'}
    </div>
    <div class="bubble">${text}</div>
  `;
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'message ai';
  typingDiv.innerHTML = `
    <div class="avatar ai">🧠</div>
    <div class="typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return typingDiv;
}

// Mock AI Response - Replace later with your backend API
async function getAIResponse(userMessage) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return `Hello! I'm <strong>MAICHAT</strong>. You said: "<em>${userMessage}</em>".<br><br>How else can I assist you today?`;
}

// Send Message
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';

  const typing = showTypingIndicator();

  const aiReply = await getAIResponse(text);
  
  typing.remove();
  addMessage(aiReply, false);
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize textarea
userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// New Chat
newChatBtn.addEventListener('click', () => {
  chatContainer.innerHTML = '';
  addMessage("Hello! I'm <strong>MAICHAT</strong>.<br>How can I help you today?", false);
});

// Welcome Message
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>.<br>How can I help you today?", false);
};
