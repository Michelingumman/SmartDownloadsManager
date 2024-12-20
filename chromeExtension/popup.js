document.addEventListener("DOMContentLoaded", () => {
    const fileNameElement = document.getElementById("fileName");
    const lifespanSelector = document.getElementById("expiry");
    const setLifespanButton = document.getElementById("setLifespan");
    const viewFilesToggle = document.getElementById("viewFilesToggle");
    const fileListContainer = document.getElementById("fileListContainer");
    const fileListElement = document.getElementById("fileList");

    const advancedModeToggle = document.getElementById("advancedModeToggle");
    const advancedModeContainer = document.getElementById("advancedModeContainer");
    const testCommunicationButton = document.getElementById("testCommunication");
    const testDeleteFileButton = document.getElementById("testDeleteFile");
    const testResponse = document.getElementById("testResponse");
    const deletingResponse = document.getElementById("deletingResponse");

    // Test communication with the native host
    testCommunicationButton.addEventListener("click", () => {
        chrome.runtime.sendNativeMessage(
            "smartdownloadsmanager",
            { command: "test", message: "Hello, native host!" }, // Send a test message
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError.message);
                    testResponse.textContent = `Error: ${chrome.runtime.lastError.message}`;
                    testResponse.style.color = "red"; // Set response color to red for errors
                } else {
                    console.log("Received response:", response);
                    testResponse.textContent = `Response: ${response.message}`;
                    testResponse.style.color = "green"; // Set response color to green for success
                }
            }
        );
    });

     // Test deleting a file
    testDeleteFileButton.addEventListener("click", () => {
        const filePathInput = document.getElementById("testFilePath").value.trim();

        if (!filePathInput) {
            deletingResponse.textContent = "Error: Please enter a valid file path.";
            deletingResponse.style.color = "red";
            return;
        }

        chrome.runtime.sendNativeMessage(
            "smartdownloadsmanager",
            { command: "delete_file", message: filePathInput }, // Send the file path to delete
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError.message);
                    deletingResponse.textContent = `Error: ${chrome.runtime.lastError.message}`;
                    deletingResponse.style.color = "red"; // Set response color to red for errors
                } else {
                    console.log("Response from native host:", response);
                    deletingResponse.textContent = `Response: ${response.message}`;
                    deletingResponse.style.color = response.status === "success" ? "green" : "red";
                }
            }
        );
    });


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
