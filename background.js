// background.js
const GEMINI_API_KEY = 'AIzaSyC8uVYSUF6xusSMGWraA6S-E6FA3q8UrqY'; // 🔴 ROTATE BEFORE SHARING
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function captureFullPage(tabId) {
  try {
    const dimensions = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => ({
        width: document.documentElement.scrollWidth,
        totalHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight
      })
    });

    const { width, totalHeight, viewportHeight } = dimensions[0].result;
    const images = [];
    
    for (let y = 0; y < totalHeight; y += viewportHeight) {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (y) => window.scrollTo(0, y),
        args: [y]
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });
      images.push(dataUrl);
    }

    await createOffscreenDocument();
    const fullImage = await chrome.runtime.sendMessage({
      type: 'stitch',
      images
    });

    return fullImage.imageDataUrl.split(',')[1];
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    return null;
  }
}

async function createOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['CLIPBOARD'],
    justification: 'Stitching page screenshots'
  });
}

async function handleAsk(request, sender, sendResponse) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('YOUR_API_KEY')) {
      return { 
        text: "🔐 Configuration Error - Contact Support",
        isError: true
      };
    }

    const base64Image = await captureFullPage(request.tabId);
    if (!base64Image) throw new Error('Failed to capture page');

    const requestBody = {
      contents: [{
        parts: [
          { 
            text: `Analyze this webpage: ${request.question}\n` +
                  "Use visual content to inform your response. If irrelevant/empty, state: 'Not enough visual context'"
          },
          { inline_data: { mime_type: "image/png", data: base64Image } }
        ]
      }],
      generationConfig: { maxOutputTokens: 1000 }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorMessage = (await response.json())?.error?.message || 'API Error';
      throw new Error(errorMessage.includes('quota') ? 'API quota exhausted' : errorMessage);
    }

    const aiText = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text;
    return { 
      text: aiText || "Response could not be generated", 
      isError: !aiText 
    };
  } catch (error) {
    return { 
      text: `Error: ${error.message.replace('400 Bad Request', 'Invalid request format')}`, 
      isError: true 
    };
  }
}

// Main message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ask') {
    handleAsk(request, sender).then(sendResponse);
    return true;
  }
});