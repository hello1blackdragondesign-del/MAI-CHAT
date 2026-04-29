// ================== CORE ELEMENTS ==================
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

// New Video Chat Button (we'll add it in HTML too)
let videoBtn;

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

// ================== VOICE CHAT ==================
voiceBtn.addEventListener('click', () => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    alert("Voice Chat is not supported in your browser.\nPlease use Chrome or Edge for best experience.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage(`🎤 <strong>You said:</strong> "${transcript}"`, true);
    
    // Simulate AI voice response
    setTimeout(() => {
      addMessage(`🔊 MAICHAT Voice Response: That's an interesting point about "${transcript}". How can I assist you further?`, false);
    }, 800);
  };

  recognition.onerror = () => {
    alert("Voice chat ended. Try again.");
  };

  recognition.start();
  alert("🎙️ Voice Chat Started\nSpeak now... (Try saying 'Hello MAICHAT')");
});

// ================== VIDEO CHAT ==================
function startVideoChat() {
  const videoResponse = `
    📹 <strong>Video Chat Started</strong><br><br>
    🔴 Live Video Call with MAICHAT<br>
    (Camera would activate here in a full app)<br><br>
    👋 Hello! I can see you clearly.<br>
    What would you like to discuss today?
  `;
  addMessage(videoResponse, false);
  
  alert("📹 Video Chat Activated!\n\nIn a real app, this would open your camera and microphone for live conversation with MAICHAT.");
}

// ================== OTHER TOOLS ==================
attachBtn.addEventListener('click', () => {
  alert("📎 File attachment feature coming soon.");
});

imageBtn.addEventListener('click', () => {
  const prompt = prompt("Describe the image you want MAICHAT to generate:");
  if (prompt && prompt.trim() !== "") {
    addMessage(`🖼️ **Image Generated:**<br><em>${prompt}</em><br><br>(The actual image would appear here)`, false);
  }
});

// Send button & Enter key
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

// Welcome Message
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your advanced AI companion from Lagos.<br>What would you like to explore today?", false);
  
  // Add Video Chat button dynamically to input area for better UX
  const inputWrapper = document.querySelector('.input-wrapper');
  if (inputWrapper) {
    videoBtn = document.createElement('button');
    videoBtn.className = 'tool-btn';
    videoBtn.innerHTML = `<i class="fa-solid fa-video"></i>`;
    videoBtn.title = "Start Video Chat";
    videoBtn.style.color = "#ff4444";
    videoBtn.addEventListener('click', startVideoChat);
    inputWrapper.insertBefore(videoBtn, imageBtn);
  }
};
