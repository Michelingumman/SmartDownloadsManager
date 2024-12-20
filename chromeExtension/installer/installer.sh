#!/bin/bash
# RUN FOR MACOS USERS
# Define variables
EXTENSION_NAME="smartdownloadsmanager"
NATIVE_HOST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
JSON_FILE_PATH="$NATIVE_HOST_DIR/${EXTENSION_NAME}.json"
LOG_FILE="install.log"
RUN_SCRIPT_PATH="./NativeMessaging/run.sh"
PYTHON_FILE="./python.py"

# Start logging
echo "Installing Smart Downloads Manager..." > "$LOG_FILE"

# Ensure Native Messaging directory exists
echo "Creating Native Messaging Host directory..." >> "$LOG_FILE"
mkdir -p "$NATIVE_HOST_DIR"

# Locate Python
echo "Locating Python installation..." >> "$LOG_FILE"
PYTHON_PATH=$(which python3)
if [[ -z "$PYTHON_PATH" ]]; then
    echo "ERROR: Python3 not found. Ensure Python3 is installed and added to PATH." >> "$LOG_FILE"
    echo "Installation failed. Check $LOG_FILE for details."
    exit 1
fi
echo "Python3 found at: $PYTHON_PATH" >> "$LOG_FILE"

# Resolve absolute paths
ABS_RUN_SCRIPT_PATH=$(cd "$(dirname "$RUN_SCRIPT_PATH")"; pwd)/$(basename "$RUN_SCRIPT_PATH")
ABS_PYTHON_FILE=$(cd "$(dirname "$PYTHON_FILE")"; pwd)/$(basename "$PYTHON_FILE")

# Update run.sh script
echo "Configuring run.sh..." >> "$LOG_FILE"
echo "#!/bin/bash" > "$RUN_SCRIPT_PATH"
echo "\"$PYTHON_PATH\" -u \"$ABS_PYTHON_FILE\"" >> "$RUN_SCRIPT_PATH"
chmod +x "$RUN_SCRIPT_PATH"
echo "run.sh updated successfully." >> "$LOG_FILE"

# Create or update the JSON manifest file
echo "Configuring Native Messaging Host JSON..." >> "$LOG_FILE"
cat > "$JSON_FILE_PATH" <<EOL
{
    "name": "$EXTENSION_NAME",
    "description": "Native host for Smart Downloads Manager",
    "path": "$ABS_RUN_SCRIPT_PATH",
    "type": "stdio",
    "allowed_origins": [
        "chrome-extension://<your-extension-id>/"
    ]
}
EOL
echo "Native Messaging Host JSON created at $JSON_FILE_PATH" >> "$LOG_FILE"

# Installation complete
echo "Installation complete. Smart Downloads Manager is now configured." >> "$LOG_FILE"
echo "Installation complete. Check $LOG_FILE for details."
