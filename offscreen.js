chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'stitch') {
      const stitchImages = async (images) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Load all images
        const loadedImages = await Promise.all(images.map(url => 
          new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
          })
        ));
  
        // Calculate total height
        canvas.width = loadedImages[0].width;
        canvas.height = loadedImages.reduce((sum, img) => sum + img.height, 0);
  
        // Draw images
        let yPos = 0;
        loadedImages.forEach(img => {
          ctx.drawImage(img, 0, yPos);
          yPos += img.height;
        });
  
        return canvas.toDataURL('image/png');
      };
  
      stitchImages(msg.images).then(dataUrl => {
        sendResponse({ imageDataUrl: dataUrl });
      });
  
      return true; // Keep message channel open
    }
  });