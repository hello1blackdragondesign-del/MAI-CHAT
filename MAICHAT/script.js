// Elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const newChatBtn = document.getElementById('new-chat');

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const attachBtn = document.getElementById('attach-btn');
const voiceBtn = document.getElementById('voice-btn');
const imageBtn = document.getElementById('image-btn');
const videoBtn = document.getElementById('video-btn');

// Hamburger
hamburger.addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('active');
});

closeSidebar.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

// New Chat - Now Fixed
newChatBtn.addEventListener('click', () => {
  chatContainer.innerHTML = '';
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your advanced AI companion from Lagos.<br>What would you like to explore today?", false);
});

// Add Message
function addMessage(text, isUser) {
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'ai'}`;
  div.innerHTML = `
    <div class="avatar ${isUser ? 'user' : 'ai'}">
      ${isUser ? '👤' : '🧠'}
    </div>
    <div class="bubble">${text}</div>
  `;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send Message
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';

  setTimeout(() => {
    addMessage("Thank you! I'm MAICHAT from Lagos. How else can I help you today?", false);
  }, 700);
}

// Tool Buttons
attachBtn.addEventListener('click', () => alert("📎 File attachment coming soon!"));

voiceBtn.addEventListener('click', () => {
  alert("🎙️ Voice Chat Started\nSpeak now...");
  // Real voice would go here
});

imageBtn.addEventListener('click', () => {
  const prompt = prompt("Describe the image:");
  if (prompt) addMessage(`🖼️ Image: ${prompt}`, false);
});

videoBtn.addEventListener('click', () => {
  addMessage(`📹 Video Chat Started with MAICHAT`, false);
  alert("📹 Video Chat Activated!");
});

// Send events
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto resize
userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Welcome
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your advanced AI companion from Lagos.<br>What would you like to explore today?", false);
};
