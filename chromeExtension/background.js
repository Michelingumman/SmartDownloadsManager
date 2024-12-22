// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ files: [] }, () => {
        console.log("Initialized local storage for files.");
    });
});

// Listen for download creation and add files to storage
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
                });

                // Save back to storage and notify popup
                chrome.storage.local.set({ files: files }, () => {
                    console.log(`Added file to storage: ${fileName}`);
                    notifyPopupUpdate();
                });
            });
        }
    });
});

// Helper function to convert lifespan to milliseconds
function getLifespanInMs(lifespan) {
    switch (lifespan) {
        // case "1h":
        //     return 60 * 60 * 1000; // 1 Hour
        // case "1d":
        //     return 24 * 60 * 60 * 1000; // 1 Day
        case "1w":
            return 20000; // test with 20 seconds
            // return 7 * 24 * 60 * 60 * 1000; // 1 Week
        case "1m":
            return 30 * 24 * 60 * 60 * 1000; // 1 Month (approx.)
        case "1y":
            return 365 * 24 * 60 * 60 * 1000; // 1 Year (approx.)
        default:
            return Infinity; // "inf"
    }
}


// Notify popup to refresh its view
function notifyPopupUpdate() {
    chrome.runtime.sendMessage({ type: "updateFiles" }, () => {
        console.log("Popup notified to update file list.");
    });
}

// Update last deleted file in storage
function updateLastDeletedFile(fileName) {
    chrome.storage.local.set({ lastDeletedFile: fileName }, () => {
        console.log(`Updated last deleted file: ${fileName}`);
        notifyPopupUpdate(); // Notify popup to refresh
    });
}


// Function to delete a file via native messaging and update storage
function deleteFile(fileName) {
    console.log(`Attempting to delete file: ${fileName}`);
    chrome.runtime.sendNativeMessage(
        "smartdownloadsmanager",
        { command: "delete_file", message: fileName },
        (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError.message);
            } else {
                console.log("Response from native host:", response);

                chrome.storage.local.get("files", (data) => {
                    const files = data.files || [];
                    const updatedFiles = files.filter((file) => file.fileName !== fileName);

                    if (response.status === "success" || response.message.includes("not found")) {
                        // Remove file from storage
                        chrome.storage.local.set({ files: updatedFiles }, () => {
                            console.log(`Removed ${fileName} from storage.`);
                            updateLastDeletedFile(fileName); // Update last deleted file
                        });
                    } else {
                        console.warn(`File ${fileName} could not be deleted: ${response.message}`);
                    }
                });
            }
        }
    );
}

// Periodically check for expired files
setInterval(() => {
    const currentTime = new Date().getTime();
    console.log("Starting periodic expiration check...");

    chrome.storage.local.get("files", (data) => {
        const files = data.files || [];
        const remainingFiles = [];

        files.forEach((file) => {
            console.log(`Checking file: ${file.fileName} with lifespan: ${file.lifespan}`);
            if (file.lifespan !== "inf") {
                const lifespanInMs = getLifespanInMs(file.lifespan);
                const expirationTime = file.downloadTime + lifespanInMs;

                if (expirationTime < currentTime) {
                    console.log(`File expired: ${file.fileName}`);
                    deleteFile(file.fileName); // Trigger the deletion
                } else {
                    remainingFiles.push(file); // Keep non-expired files
                }
            } else {
                remainingFiles.push(file); // Keep files with infinite lifespan
            }
        });

        // Update storage with remaining files
        chrome.storage.local.set({ files: remainingFiles }, () => {
            console.log("Updated file list after expiration check.");
        });
    });
// }, 24 * 60 * 60 * 1000); // Check every 24 hours
}, 10000); // Check every 10 seconds
