const fs = require("fs");

function handleMessage(message) {
    const { command, filePath } = message;

    if (command === "delete" && filePath) {
        try {
            fs.unlinkSync(filePath); // Delete the file
            return { status: "success", message: `Deleted ${filePath}` };
        } catch (error) {
            return { status: "error", message: error.message };
        }
    }

    return { status: "error", message: "Invalid command" };
}

// Native messaging: read from stdin and write to stdout
process.stdin.on("data", (data) => {
    const message = JSON.parse(data.toString());
    const response = handleMessage(message);
    process.stdout.write(JSON.stringify(response));
});
