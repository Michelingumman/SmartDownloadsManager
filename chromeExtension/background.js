// background.js

chrome.downloads.onCreated.addListener((downloadItem) => {
    if (!downloadItem.url) return; // Skip if there's no URL (rare but possible)
    
    // Open the popup or notify the user
    chrome.action.openPopup();
    
    // Store the download ID temporarily
    chrome.storage.local.set({ currentDownloadId: downloadItem.id });
});


// Periodically check for expired files
setInterval(() => {
    const currentTime = new Date().getTime();

    chrome.storage.local.get(null, (items) => {
        for (const key in items) {
            if (key.startsWith("download_")) {
                const expirationTime = items[key];

                if (expirationTime && expirationTime < currentTime) {
                    // The file has expired; remove it from the system
                    const downloadId = key.replace("download_", "");
                    chrome.downloads.remove(parseInt(downloadId));

                    // Remove the expired entry from storage
                    chrome.storage.local.remove(key);
                }
            }
        }
    });
}, 60 * 60 * 1000); // Check every hour
