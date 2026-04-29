// Hamburger & Sidebar
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

// Chat elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Tool buttons
const attachBtn = document.getElementById('attach-btn');
const voiceBtn = document.getElementById('voice-btn');
const imageBtn = document.getElementById('image-btn');

// Hamburger Menu
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

// Add Message Function
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

// Send Text Message
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';

  setTimeout(() => {
    addMessage("Thank you! I'm MAICHAT, your intelligent AI companion from Lagos. How else can I help you today?", false);
  }, 700);
}

// Tool Button Functions

// 1. Attach File (Paperclip)
attachBtn.addEventListener('click', () => {
  alert("📎 File attachment coming soon!\n\nYou can attach documents or images here.");
});

// 2. Voice Input (Microphone)
voiceBtn.addEventListener('click', () => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    alert("Voice input is not supported in your current browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage(); // Automatically send after voice input
  };

  recognition.onerror = () => {
    alert("Voice recognition failed. Please try typing instead.");
  };

  recognition.start();
  alert("🎤 Listening... Speak now");
});

// 3. Image Generation Button
imageBtn.addEventListener('click', () => {
  const prompt = prompt("Describe the image you want MAICHAT to generate:");
  if (prompt && prompt.trim() !== "") {
    addMessage(`🖼️ **Generated Image:**<br><em>${prompt}</em><br><br>(Image would appear here in full version)`, false);
  }
});

// Send on button click or Enter key
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto resize textarea
userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Welcome Message
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your advanced AI companion from Lagos.<br>What would you like to explore today?", false);
};
