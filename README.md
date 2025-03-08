
# Page Master

**Page Master** is a Chrome extension that uses AI (powered by the Gemini API) to analyze and summarize the current webpage. With just a click, it captures the full page, sends the screenshot for analysis, and provides insights or answers to user questions—all within a convenient chatbot interface.

---

## Features

- **AI-Powered Summaries**: Capture and analyze the active page, then get concise summaries or detailed Q&A.
- **Full-Page Screenshots**: Automatically scroll and stitch screenshots together for a comprehensive view.
- **User-Friendly Chat UI**: Quickly type questions and receive instant responses in a simple popup interface.
- **Copy Functionality**: Copy AI-generated responses with one click for easy sharing.

---

## Installation

1. **Download the Extension**  
   - [Download from the Chrome Web Store](#) (replace with your store link once published).
   - Or clone this repository and load the extension in Developer Mode.

2. **Load in Chrome**  
   - Go to `chrome://extensions` in your Chrome browser.
   - Enable **Developer mode** (top-right corner).
   - Click **Load unpacked** and select the folder containing this extension’s files.

3. **Pin the Extension**  
   - Once installed, pin “Page Master” to your toolbar for quick access.

---

## Usage

1. **Open the Extension**  
   - Click the **Page Master** icon in your toolbar to open the popup.

2. **Ask Questions**  
   - Type any question related to the current webpage, and press **Enter** or click the **Send** button.

3. **Receive AI Insights**  
   - The extension captures the page, sends it to the Gemini API for analysis, and displays the AI-generated answer.

4. **Copy Responses**  
   - Use the built-in copy button to save AI answers to your clipboard.

---

## Permissions

- **activeTab**: Required to capture screenshots and analyze page content upon user request.  
- **storage**: Stores minimal user settings (e.g., conversation history or preferences).  
- **scripting**: Injects scripts to capture page dimensions, scroll, and gather screenshots.  
- **offscreen**: Creates an offscreen document to stitch multiple screenshots together.

These permissions are used **only** when you explicitly interact with the extension. No data is collected or shared without user initiation.

---

## Privacy Policy

Below is an overview of how **Page Master** handles user data. For the full, detailed policy, please see our [Privacy Policy Page](#) (replace with your actual URL).

### 1. Introduction
We built **Page Master** to help users quickly analyze and summarize webpage content with AI assistance. This policy explains how we handle and protect the information we collect.

### 2. Data We Collect
- **Webpage Screenshots**: When you activate the extension and ask a question, we capture and stitch screenshots of the active page to provide visual context to the AI.
- **User Queries**: Any text you type into the chatbot is sent to our AI service for analysis.

### 3. How We Use the Data
- **AI Analysis**: We transmit screenshots and text queries to the Gemini API for generating relevant answers.  
- **Chat History**: Locally stores minimal conversation data so you can revisit or continue your session.

### 4. Data Storage & Security
- **Local Storage**: We store your chatbot settings and conversation snippets on your device only.  
- **Encrypted Transmission**: All requests to the Gemini API are sent over secure HTTPS connections to protect your data in transit.  
- **No Long-Term Retention**: Screenshots and query data are not retained on any external server once analysis is complete, unless required for temporary processing.

### 5. Third-Party Sharing
- **Gemini API**: We share your screenshot and query data exclusively with the Gemini API to generate responses.  
- **No Other Sharing**: We do not sell or share your information with any third parties beyond the AI service.

### 6. Contact
For any questions or concerns about this policy or the extension, please reach out to us at [your-email@example.com](mailto:your-email@example.com).

---

## Contributing

We welcome contributions! Feel free to submit issues, bug reports, or feature requests via GitHub. If you’d like to add new features or fix bugs, please fork the repo, make your changes, and submit a pull request.

---

## License

This project is licensed under a proprietary license

