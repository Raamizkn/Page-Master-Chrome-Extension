// popup.js
document.addEventListener('DOMContentLoaded', initPopup);

function initPopup() {
  // Validate UI elements exist first
  const UI = {
    messages: document.getElementById('messages'),
    userInput: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    status: document.getElementById('status')
  };

  // Critical element validation
  if (!UI.sendBtn || !UI.userInput || !UI.messages || !UI.status) {
    const errorHtml = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>UI Initialization Failed</h3>
        <p>Missing elements: ${[
          !UI.sendBtn && 'Send Button',
          !UI.userInput && 'Input Field',
          !UI.messages && 'Messages Container',
          !UI.status && 'Status Bar'
        ].filter(Boolean).join(', ')}</p>
      </div>
    `;
    
    document.body.innerHTML = errorHtml;
    console.error('UI elements missing:', UI);
    return;
  }

  let isProcessing = false;

  function addMessage(text, isUser = false, isError = false) {
    try {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'} ${isError ? 'error' : ''}`;
      
      if (isError) {
        messageDiv.innerHTML = `
          <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            ${text}
          </div>
        `;
      } else if (isUser) {
        messageDiv.textContent = text;
      } else {
        messageDiv.innerHTML = `
          <div class="ai-response">
            ${formatResponse(text)}
            <button class="copy-btn" aria-label="Copy response">
              <i class="far fa-copy"></i>
            </button>
          </div>
        `;
      }

      UI.messages.appendChild(messageDiv);
      UI.messages.scrollTop = UI.messages.scrollHeight;

      // Handle copy functionality safely
      if (!isUser && !isError) {
        const copyBtn = messageDiv.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => handleCopy(copyBtn, messageDiv));
        }
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

  function handleCopy(copyBtn, messageDiv) {
    const textToCopy = messageDiv?.textContent?.replace('Copy', '')?.trim() || '';
    if (!textToCopy) return;

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
  }

  function formatResponse(text) {
    try {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/`{3}([\s\S]*?)`{3}/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    } catch (error) {
      console.error('Error formatting response:', error);
      return text;
    }
  }

  async function sendToGemini(question) {
    if (isProcessing || !question) return;
    
    try {
      isProcessing = true;
      UI.status.style.display = 'flex';
      UI.status.textContent = 'Analyzing...';

      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!activeTab?.id) {
        throw new Error('No active tab found');
      }

      const response = await chrome.runtime.sendMessage({
        type: 'ask',
        question,
        tabId: activeTab.id
      });

      if (response?.isError) {
        addMessage(response.text, false, true);
      } else {
        addMessage(response?.text || "No response received");
      }
    } catch (error) {
      addMessage(`System Error: ${safeErrorMessage(error)}`, false, true);
    } finally {
      isProcessing = false;
      UI.status.textContent = 'Ready';
      setTimeout(() => {
        UI.status.style.display = 'none';
      }, 2000);
    }
  }

  function safeErrorMessage(error) {
    try {
      return error.message.replace('400 Bad Request', 'Invalid request format');
    } catch {
      return 'Unknown error occurred';
    }
  }

  // Event listeners with validation
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

  // Initial state setup
  UI.status.style.display = 'none';
  UI.userInput.focus();
}