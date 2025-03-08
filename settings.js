document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const saveBtn = document.getElementById('save');
  
    // Load saved key
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      apiKeyInput.value = result.geminiApiKey || '';
    });
  
    // Save key
    saveBtn.addEventListener('click', () => {
      chrome.storage.sync.set({ geminiApiKey: apiKeyInput.value.trim() }, () => {
        alert('API key saved successfully!');
        window.close();
      });
    });
  });