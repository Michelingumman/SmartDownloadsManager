// background.js

let pendingDownloadId = null;

// When a download is created, store its ID temporarily
chrome.downloads.onCreated.addListener((downloadItem) => {
    if (!downloadItem.url) return;

    pendingDownloadId = downloadItem.id; // Store the download ID
});

// When the download state changes, check if it's fully started
chrome.downloads.onChanged.addListener((delta) => {
    if (pendingDownloadId && delta.id === pendingDownloadId && delta.state?.current === "in_progress") {
        // Open a dedicated page for setting the expiration time
        chrome.tabs.create({ url: "popup.html" });

        // Save the download ID to local storage for the popup page
        chrome.storage.local.set({ currentDownloadId: pendingDownloadId });
        pendingDownloadId = null; // Reset
    }
});






chrome.downloads.onCreated.addListener((downloadItem) => {
    if (!downloadItem.url) return;

    // Save the download ID and file name to local storage
    chrome.storage.local.set({
        currentDownloadId: downloadItem.id,
        currentFileName: downloadItem.filename.split(/[/\\]/).pop() // Extract file name from path
    });

    // Open the popup
    chrome.action.openPopup();
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
