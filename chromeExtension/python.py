import sys
import struct
import json
import os
import time

# Define the allowed directory (Downloads folder)
ALLOWED_DIRECTORY = os.path.expanduser("~/Downloads")
log_file_path = "C:/_Projects/SmartDownloadsManager/chromeExtension/log.txt"

def log_message(message):
    """Helper function to log messages to a file."""
    with open(log_file_path, "a") as log:
        log.write(f"{message}\n")
        log.write("-------------\n")

def read_message():
    """Reads a message from Chrome."""
    # Read the message length (first 4 bytes)
    raw_length = sys.stdin.read(4)
    if not raw_length:
        return None

    # Convert the message length from bytes to an integer
    message_length = struct.unpack("I", raw_length.encode("latin1"))[0]
    
    # Read the JSON message
    message = sys.stdin.read(message_length)
    return json.loads(message)

def send_message(response):
    """Sends a message back to Chrome."""
    # Convert the response to JSON and encode it
    response_json = json.dumps(response)
    encoded_length = struct.pack("I", len(response_json))
    sys.stdout.write(encoded_length.decode("latin1"))
    sys.stdout.write(response_json)
    sys.stdout.flush()

def find_file_in_downloads(filename):
    """Searches for a file in the Downloads folder."""
    target_path = os.path.join(ALLOWED_DIRECTORY, filename)
    if os.path.exists(target_path):
        return target_path
    return None

try:
    # Read the message from Chrome
    message = read_message()
    if message:
        # Log the received message
        timestamp = time.strftime("%H:%M:%S")
        log_message(f"Communication received at {timestamp}:\nCommand: {message['command']}\nMessage: {message['message']}\nCommunication working!")

        if message['command'] == 'delete_file':
            filename = message['message']  # Assume the message contains only the filename

            # Search for the file in the Downloads folder
            file_path = find_file_in_downloads(filename)

            if file_path:
                try:
                    os.remove(file_path)
                    response = {
                        "status": "success",
                        "message": f"File '{filename}' deleted successfully from Downloads folder."
                    }
                    log_message(f"File '{filename}' deleted successfully from Downloads folder.")
                except Exception as e:
                    response = {
                        "status": "error",
                        "message": f"Failed to delete file '{filename}': {e}"
                    }
                    log_message(f"Failed to delete file '{filename}': {e}")
            else:
                response = {
                    "status": "error",
                    "message": f"File '{filename}' not found in Downloads folder."
                }
                log_message(f"File '{filename}' not found in Downloads folder.")
        else:
            response = {
                "status": "success",
                "message": f"Received command: {message['command']}, message: {message['message']}"
            }

        send_message(response)
    else:
        log_message("No message received!")

except Exception as e:
    # Log any errors
    error_message = f"Error: {str(e)}"
    log_message(error_message)
    send_message({"status": "error", "message": error_message})
