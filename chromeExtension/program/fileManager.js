const fs = require("fs").promises; // Use promises API for async operations

async function handleMessage(message) {
    const { command, filePath } = message;

    if (command === "delete" && filePath) {
        try {
            await fs.unlink(filePath); // Delete the file asynchronously
            return { status: "success", message: `Deleted ${filePath}` };
        } catch (error) {
            return { status: "error", message: error.message };
        }
    }

    return { status: "error", message: "Invalid command" };
}

// Native messaging: read from stdin and write to stdout
process.stdin.on("data", async (data) => {
    try {
        const message = JSON.parse(data.toString());
        const response = await handleMessage(message);
        process.stdout.write(JSON.stringify(response));
    } catch (error) {
        process.stdout.write(JSON.stringify({ status: "error", message: error.message }));
    }
});
