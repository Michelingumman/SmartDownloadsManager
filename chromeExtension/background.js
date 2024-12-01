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

                chrome.storage.local.set({ files: files }, () => {
                    console.log("File stored with filename:", fileName);
                });
            });
        }
    });
});

// Update the filename once it's available
chrome.downloads.onChanged.addListener((delta) => {
    if (delta.filename) { // Check if the filename has changed
        chrome.storage.local.get("files", (data) => {
            const files = data.files || [];
            const fileIndex = files.findIndex((file) => file.id === delta.id);

            if (fileIndex !== -1) {
                files[fileIndex].fileName = delta.filename.current.split(/[/\\]/).pop(); // Extract file name
                chrome.storage.local.set({ files: files }, () => {
                    console.log("Filename updated:", files[fileIndex]);
                });
            }
        });
    }
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
        default: return Infinity; // "inf"
    }
}
