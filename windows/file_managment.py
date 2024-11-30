import json
import os
import sys

def handle_message(message):
    command = message.get("command")
    file_path = message.get("filePath")
    if command == "delete" and file_path:
        try:
            os.remove(file_path)
            return {"status": "success", "message": f"Deleted {file_path}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    return {"status": "error", "message": "Invalid command"}




setInterval(() => {
    const currentTime = new Date().getTime();

    chrome.storage.local.get("files", (data) => {
        const files = data.files || [];
        const updatedFiles = files.filter((file) => {
            if (file.lifespan !== "forever") {
                const lifespanInMs = getLifespanInMs(file.lifespan);
                const expirationTime = file.downloadTime + lifespanInMs;

                if (expirationTime < currentTime) {
                    // File expired; take action (e.g., notify or delete)
                    console.log(`File expired: ${file.fileName}`);
                    return false; // Remove expired file from storage
                }
            }
            return true;
        });

        // Update storage with only non-expired files
        chrome.storage.local.set({ files: updatedFiles });
    });
}, 3600000); // Run every hour

// Convert lifespan strings to milliseconds
function getLifespanInMs(lifespan) {
    switch (lifespan) {
        case "1h": return 60 * 60 * 1000;
        case "1d": return 24 * 60 * 60 * 1000;
        case "1w": return 7 * 24 * 60 * 60 * 1000;
        default: return Infinity; // "forever"
    }
}


def main():
    while True:
        try:
            raw_length = sys.stdin.read(4)
            if not raw_length:
                break
            message_length = int.from_bytes(raw_length.encode('utf-8'), byteorder='little')
            message = sys.stdin.read(message_length)
            response = handle_message(json.loads(message))
            sys.stdout.write(json.dumps(response))
            sys.stdout.flush()
        except Exception as e:
            break

if __name__ == "__main__":
    main()
