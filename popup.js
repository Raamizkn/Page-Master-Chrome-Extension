document.addEventListener('DOMContentLoaded', initPopup);

function initPopup() {
  const UI = {
    messages: document.getElementById('messages'),
    userInput: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    status: document.getElementById('status')
  };

  let isProcessing = false;

  function addMessage(text, isUser = false, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'} ${isError ? 'error' : ''}`;
    
    if (isError) {
      messageDiv.innerHTML = text;
    } else if (isUser) {
      messageDiv.textContent = text;
    } else {
      // Add copy button to AI responses
      messageDiv.innerHTML = `
        ${formatResponse(text)}
        <button class="copy-btn">
          <i class="far fa-copy"></i>
        </button>
      `;
    }

    UI.messages.appendChild(messageDiv);
    UI.messages.scrollTop = UI.messages.scrollHeight;

    // Add copy functionality to new AI messages
    if (!isUser && !isError) {
      const copyBtn = messageDiv.querySelector('.copy-btn');
      copyBtn.addEventListener('click', () => {
        const textToCopy = messageDiv.textContent.replace('Copy', '').trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          copyBtn.innerHTML = '<i class="fas fa-times"></i>';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
          }, 2000);
        });
      });
    }
  }

  function formatResponse(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  async function sendToGemini(question) {
    if (isProcessing) return;
    isProcessing = true;
    UI.status.style.display = 'flex';
    UI.status.textContent = 'Analyzing...';

    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      const response = await chrome.runtime.sendMessage({
        type: 'ask',
        question,
        tabId: activeTab.id
      });

      if (response.isError) {
        addMessage(response.text, false, true);
      } else {
        addMessage(response.text);
      }
    } catch (error) {
      addMessage(`System Error: ${error.message}`, false, true);
    } finally {
      isProcessing = false;
      UI.status.textContent = 'Ready';
      setTimeout(() => UI.status.style.display = 'none', 2000);
    }
  }

  UI.sendBtn.addEventListener('click', async () => {
    const question = UI.userInput.value.trim();
    if (!question) return;

    addMessage(question, true);
    UI.userInput.value = '';
    await sendToGemini(question);
  });

  UI.userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      UI.sendBtn.click();
    }
  });
}