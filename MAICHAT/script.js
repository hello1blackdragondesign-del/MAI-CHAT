// Elements
const hamburger = document.getElementById('hamburger');
const mobileHamburger = document.getElementById('mobile-hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Hamburger Controls
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
}

function closeSidebarFunc() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}

hamburger.addEventListener('click', openSidebar);
mobileHamburger.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarFunc);
overlay.addEventListener('click', closeSidebarFunc);

// Add Message Function
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

// Send Message
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  userInput.value = '';

  // Fake AI response
  setTimeout(() => {
    addMessage("Thank you! I'm MAICHAT, your intelligent AI companion from Lagos. How else can I help you today?", false);
  }, 700);
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
userInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Welcome Message
window.onload = () => {
  addMessage("Hello! I'm <strong>MAICHAT</strong>, your advanced AI companion.<br>What would you like to explore today?", false);
};
