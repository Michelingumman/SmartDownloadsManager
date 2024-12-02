const fs = require("fs").promises; // Use promises API for async operations
const path = require("path");
const os = require("os");
const fsSync = require("fs"); // For synchronous logging

// Logging utility
const logFilePath = path.join(os.tmpdir(), "fileManager.log");
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    try {
        fsSync.appendFileSync(logFilePath, logEntry);
    } catch (err) {
        console.error("Failed to write to log file:", err.message);
    }
}

// Validates file path to prevent dangerous operations
function isSafePath(filePath) {
    const absolutePath = path.resolve(filePath);
    const userHome = os.homedir();
    return absolutePath.startsWith(userHome); // Ensures file is within user's home directory
}

// Handles messages from Chrome
async function handleMessage(message) {
    const { command, filePath } = message;

    if (command === "delete" && filePath) {
        if (!isSafePath(filePath)) {
            logMessage(`Security Warning: Attempt to delete unsafe path: ${filePath}`);
            return { status: "error", message: "Unsafe file path. Operation aborted." };
        }

        try {
            await fs.unlink(filePath); // Delete the file asynchronously
            logMessage(`File deleted: ${filePath}`);
            return { status: "success", message: `Deleted ${filePath}` };
        } catch (error) {
            logMessage(`Error deleting file ${filePath}: ${error.message}`);
            return { status: "error", message: error.message };
        }
    }

    logMessage(`Invalid command or missing filePath: ${JSON.stringify(message)}`);
    return { status: "error", message: "Invalid command or missing filePath" };
}

// Main execution block for native messaging
process.stdin.on("data", async (data) => {
    try {
        const message = JSON.parse(data.toString());
        logMessage(`Received message: ${JSON.stringify(message)}`);
        const response = await handleMessage(message);
        process.stdout.write(JSON.stringify(response));
    } catch (error) {
        logMessage(`Error processing message: ${error.message}`);
        process.stdout.write(JSON.stringify({ status: "error", message: error.message }));
    }
});

// Log initialization
logMessage("fileManager.js initialized and ready for messages.");
