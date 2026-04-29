// Core Elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

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

// Send Text
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';

  setTimeout(() => {
    addMessage("Thank you! I'm MAICHAT from Lagos. How else can I help you?", false);
  }, 700);
}

// Tool Buttons

attachBtn.addEventListener('click', () => {
  alert("📎 File attachment coming soon!");
});

voiceBtn.addEventListener('click', () => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    alert("Voice Chat not supported in this browser. Use Chrome.");
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    addMessage(`🎤 You said: "${text}"`, true);
    setTimeout(() => {
      addMessage(`🔊 MAICHAT: Interesting! Tell me more about "${text}".`, false);
    }, 600);
  };

  recognition.start();
  alert("🎙️ Voice Chat Active - Speak now");
});

imageBtn.addEventListener('click', () => {
  const prompt = prompt("Describe the image you want:");
  if (prompt) addMessage(`🖼️ Image: ${prompt}`, false);
});

videoBtn.addEventListener('click', () => {
  addMessage(`📹 <strong>Video Chat Started</strong><br>Live video call with MAICHAT is now active.`, false);
  alert("📹 Video Chat Started!\n\nCamera would turn on here in the full version.");
});

// Send with button or Enter
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto resize input
userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Welcome
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your AI companion from Lagos.<br>What would you like to explore today?", false);
};
