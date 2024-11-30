
document.addEventListener("DOMContentLoaded", () => {
    const fileNameElement = document.getElementById("fileName");

    // Fetch the latest downloaded file
    chrome.downloads.search({ orderBy: ['-startTime'], limit: 1 }, (results) => {
        if (results && results.length > 0) {
            const latestFile = results[0];
            fileNameElement.textContent = latestFile.filename.split(/[/\\]/).pop(); // Extract and display the file name
        } else {
            fileNameElement.textContent = "No recent downloads.";
        }
    });
});

    // When the user clicks the "Set Lifespan" button
    setLifespanButton.addEventListener("click", () => {
        const selectedLifespan = lifespanSelector.value;

        // Get the current download ID from storage
        chrome.storage.local.get("currentDownloadId", (result) => {
            const downloadId = result.currentDownloadId;

            if (downloadId) {
                // Store the expiration time for this file
                const expirationTime = calculateExpirationTime(selectedLifespan);
                chrome.storage.local.set({
                    [`download_${downloadId}`]: expirationTime,
                });

                // Notify the user (optional)
                alert("Expiration time set!");

                // Close the popup
                window.close();
            } else {
                alert("No active download to set lifespan for.");
            }
        });
    });

    // Calculate expiration time based on user selection
    function calculateExpirationTime(lifespan) {
        const currentTime = new Date().getTime(); // Current time in milliseconds
        switch (lifespan) {
            case "1h":
                return currentTime + 1 * 60 * 60 * 1000; // 1 hour
            case "1d":
                return currentTime + 24 * 60 * 60 * 1000; // 1 day
            case "1w":
                return currentTime + 7 * 24 * 60 * 60 * 1000; // 1 week
            case "forever":
                return null; // No expiration
        }
    }
});
