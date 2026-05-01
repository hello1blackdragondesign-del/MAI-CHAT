// ================== MAICHAT - Safe Groq API Version ==================

let GROQ_API_KEY = localStorage.getItem('groq_api_key');

if (!GROQ_API_KEY) {
  GROQ_API_KEY = prompt("Enter your Groq API key to use MAICHAT:");
  if (GROQ_API_KEY) {
    localStorage.setItem('groq_api_key', GROQ_API_KEY);
    alert("API key saved successfully! You won't be asked again.");
  } else {
    alert("API key is required. Please refresh and try again.");
  }
}

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

// New Chat
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

// Send Message using Groq API
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';

  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai';
  typingDiv.innerHTML = `
    <div class="avatar ai">🧠</div>
    <div class="bubble">MAICHAT is thinking...</div>
  `;
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { 
            role: "system", 
            content: "You are MAICHAT, a friendly, warm and intelligent AI companion from Lagos, Nigeria. Be helpful and engaging." 
          },
          { role: "user", content: text }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    typingDiv.remove();

    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond. Please try again.";
    addMessage(aiReply, false);

  } catch (error) {
    typingDiv.remove();
    addMessage("⚠️ Cannot connect right now. Please check your internet.", false);
  }
}

// Tool Buttons
attachBtn.addEventListener('click', () => alert("📎 File attachment coming soon!"));
voiceBtn.addEventListener('click', () => alert("🎙️ Voice Chat - Speak now"));
imageBtn.addEventListener('click', () => {
  const prompt = prompt("Describe the image you want:");
  if (prompt) addMessage(`🖼️ Image: ${prompt}`, false);
});
videoBtn.addEventListener('click', () => {
  addMessage("📹 Video Chat Started with MAICHAT", false);
  alert("📹 Video Chat Activated!");
});

// Send Events
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

// Welcome Message
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your advanced AI companion from Lagos.<br>What would you like to explore today?", false);
};
