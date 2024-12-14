

process.stdin.on("data", () => {
    process.stdout.write(JSON.stringify({ status: "success", message: "Native host is running!" }));
});


process.stdin.on("data", (data) => {
    try {
        const input = JSON.parse(data.toString());
        console.log("Received input:", input);
        // Send a success response
        process.stdout.write(JSON.stringify({ status: "success", message: "Native host is working!" }));
    } catch (error) {
        console.error("Error parsing input:", error.message);
        process.stdout.write(JSON.stringify({ status: "error", message: error.message }));
    }
});



const fs = require("fs").promises;

// Function to handle incoming messages
async function handleMessage(message) {
    if (!message || typeof message !== "object") {
        return { status: "error", message: "Invalid message format" };
    }

    const { command, message: msg } = message;

    if (command === "test") {
        console.log("Test command received:", msg);
        return { status: "success", message: "Native host is working!" };
    }

    return { status: "error", message: "Unknown command" };
}


console.log("Reading input from stdin");

// Read input from stdin
process.stdin.on("data", async (data) => {
    try {
        const input = JSON.parse(data.toString());
        const response = await handleMessage(input);

        // Write the response to stdout
        process.stdout.write(JSON.stringify(response));
        process.exit(0); // Terminate the script after responding
    } catch (error) {
        console.error("Error processing input:", error.message);
        process.stdout.write(JSON.stringify({ status: "error", message: error.message }));
        process.exit(1); // Exit with an error status
    }
});




// test the script by running the following, ensuring an input.json file exists iwth the following:
// {"command": "test", "message": "Hello, native host!"}

// Get-Content input.json | node fileManager.js