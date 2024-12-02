document.addEventListener("DOMContentLoaded", () => {
    const fileNameElement = document.getElementById("fileName");
    const lifespanSelector = document.getElementById("expiry");
    const setLifespanButton = document.getElementById("setLifespan");
    const viewFilesToggle = document.getElementById("viewFilesToggle");
    const fileListContainer = document.getElementById("fileListContainer");
    const fileListElement = document.getElementById("fileList");



    const advancedModeToggle = document.getElementById("advancedModeToggle");
    const advancedModeContainer = document.getElementById("advancedModeContainer");
    const testDeleteFileButton = document.getElementById("testDeleteFile");
    const testFilePathInput = document.getElementById("testFilePath");
    const testResponse = document.getElementById("testResponse");


    // Toggle Advanced Mode
    advancedModeToggle.addEventListener("click", () => {
        if (advancedModeContainer.style.display === "none") {
            advancedModeContainer.style.display = "block";
            advancedModeToggle.textContent = "Close Advanced Mode";
        } else {
            advancedModeContainer.style.display = "none";
            advancedModeToggle.textContent = "Advanced Mode";
        }
    });

    // Test Delete File
    testDeleteFileButton.addEventListener("click", () => {
        const filePath = testFilePathInput.value.trim();
        if (!filePath) {
            testResponse.textContent = "Please enter a valid file path.";
            return;
        }

        chrome.runtime.sendMessage({ command: "testDelete", filePath }, (response) => {
            if (chrome.runtime.lastError) {
                testResponse.textContent = `Error: ${chrome.runtime.lastError.message}`;
            } else {
                testResponse.textContent = response.message || "No response from native host.";
            }
        });
    });
    

    // Fetch the latest downloaded file
    chrome.downloads.search({ orderBy: ['-startTime'], limit: 1 }, (results) => {
        if (results && results.length > 0) {
            const latestFile = results[0];
            const fileName = latestFile.filename.split(/[/\\]/).pop();
            fileNameElement.textContent = fileName;

            // Set lifespan for the latest file
            setLifespanButton.addEventListener("click", () => {
                const selectedLifespan = lifespanSelector.value;

                chrome.storage.local.get("files", (data) => {
                    const files = data.files || [];
                    const fileIndex = files.findIndex((file) => file.fileName === fileName);

                    if (fileIndex !== -1) {
                        files[fileIndex].lifespan = selectedLifespan;
                        chrome.storage.local.set({ files: files }, () => {
                            alert("Lifespan updated!");
                        });
                    } else {
                        alert("File not found in storage.");
                    }
                });
            });
        } else {
            fileNameElement.textContent = "No recent downloads.";
        }
    });

    // Toggle the view files section
    viewFilesToggle.addEventListener("click", () => {
        if (fileListContainer.style.display === "none") {
            chrome.storage.local.get("files", (data) => {
                const files = data.files || [];
                fileListElement.innerHTML = ""; // Clear previous list

                if (files.length === 0) {
                    const listItem = document.createElement("li");
                    listItem.textContent = "No files stored.";
                    fileListElement.appendChild(listItem);
                } else {
                    files.reverse().forEach((file, index) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = ` [${index + 1}] - <span>${file.fileName}  </span> <span class="lifespan">( ${file.lifespan} )</span>`;
                        fileListElement.appendChild(listItem);
                    });
                }

                fileListContainer.style.display = "block"; // Show the list
                viewFilesToggle.textContent = "Hide files <";
            });
        } else {
            fileListContainer.style.display = "none"; // Hide the list
            viewFilesToggle.textContent = "View files >";
        }
    });
});
