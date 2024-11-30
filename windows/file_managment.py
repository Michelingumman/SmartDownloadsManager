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
