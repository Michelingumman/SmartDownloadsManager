chrome.runtime.onInstalled.addListener(() => {
    chrome.notifications.create("install-notification", {
        type: "basic",
        iconUrl: "icons/240.png",
        title: "Smart Downloads Manager",
        message: "Install the companion file manager to enable local file deletion in the downloads folder"
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Notification Error:", chrome.runtime.lastError.message);
        }
    });
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


// Listen for download creation
chrome.downloads.onCreated.addListener((downloadItem) => {
    const downloadTime = new Date().getTime();
    chrome.downloads.onChanged.addListener((delta) => {
        if (delta.id === downloadItem.id && delta.filename) {
            const fileName = delta.filename.current.split(/[/\\]/).pop();

            // Fetch current files from storage
            chrome.storage.local.get("files", (data) => {
                const files = data.files || [];

                // Add the new file with its metadata
                files.push({
                    fileName: fileName,
                    lifespan: "inf", // Default lifespan
                    downloadTime: downloadTime,
                    id: downloadItem.id,
                });

                // Save back to storage
                chrome.storage.local.set({ files: files }, () => {
                    console.log("Updated files in storage:", files);
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




chrome.runtime.sendNativeMessage(
    "com.smartdownloadsmanager.host",
    { command: "test", message: "Hello, native host!" },
    (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
        } else {
            console.log("Response from native host:", response);
        }
    }
);



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from popup:", message);

    if (message.command === "testDelete") {
        const { filePath } = message;

        chrome.runtime.sendNativeMessage(
            "com.smartdownloadsmanager.host",
            { command: "delete", filePath },
            (response) => {
                console.log("Response from native host:", response);

                if (chrome.runtime.lastError) {
                    sendResponse({ status: "error", message: `Error: ${chrome.runtime.lastError.message}` });
                } else if (!response || response.status === "error") {
                    sendResponse({ status: "error", message: response ? response.message : "No response" });
                } else {
                    sendResponse({ status: "success", message: response.message });
                }
            }
        );

        return true; // Keep the message port open for async response
    }
});


