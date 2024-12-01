chrome.runtime.onInstalled.addListener(() => {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/240.png",
        title: "Smart Downloads Manager",
        message: "Install the companion file manager to enable local file deletion in the downloads folder"
    });

    chrome.tabs.create({ url: "https://yourwebsite.com/download" });
});

// Example: Delete a file via native messaging
function deleteFile(filePath) {
    chrome.runtime.sendNativeMessage(
        "com.smartdownloadsmanager.host",
        { command: "delete", filePath: filePath },
        (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError.message);
            } else {
                console.log("Response from native host:", response);
            }
        }
    );
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ files: [] }, () => {
        console.log("Initialized local storage.");
    });
});

// Store download metadata on creation
chrome.downloads.onCreated.addListener((downloadItem) => {
    const downloadTime = new Date().getTime();

    chrome.downloads.onChanged.addListener((delta) => {
        if (delta.id === downloadItem.id && delta.filename) {
            const fileName = delta.filename.current.split(/[/\\]/).pop();

            chrome.storage.local.get("files", (data) => {
                const files = data.files || [];
                files.push({
                    fileName: fileName,
                    lifespan: "inf",
                    downloadTime: downloadTime,
                    id: delta.id,
                });
            });
        }
    });
});

// Periodically check for expired files
setInterval(() => {
    const currentTime = new Date().getTime();

    chrome.storage.local.get("files", (data) => {
        const files = data.files || [];
        const updatedFiles = files.filter((file) => {
            if (file.lifespan !== "inf") {
                const lifespanInMs = getLifespanInMs(file.lifespan);
                const expirationTime = file.downloadTime + lifespanInMs;

                if (expirationTime < currentTime) {
                    // File expired; take action (e.g., notify or delete)
                    console.log(`File expired: ${file.fileName}`);
                    return false; // Remove expired file
                }
            }
            return true; // Keep non-expired files
        });

        // Update storage
        chrome.storage.local.set({ files: updatedFiles });
    });
}, 60 * 60 * 1000); // Check every hour

// Helper function to convert lifespan to milliseconds
function getLifespanInMs(lifespan) {
    switch (lifespan) {
        case "1h": return 60 * 60 * 1000;
        case "1d": return 24 * 60 * 60 * 1000;
        case "1w": return 7 * 24 * 60 * 60 * 1000;
        case "1m": return 7 * 24 * 60 * 60 * 4 * 1000;
        default: return Infinity; // "inf"
    }
}
