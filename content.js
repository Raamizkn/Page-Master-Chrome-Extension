chrome.runtime.sendMessage({
  type: 'pageUpdate',
  url: window.location.href
});