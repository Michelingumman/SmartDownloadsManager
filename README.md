# Smart Downloads Manager

**Smart Downloads Manager** is a Chrome extension designed to help users manage downloaded files efficiently. With this extension, you can set expiration times for downloaded files and track recent downloads. The project combines a Chrome extension with a native host program for local file operations.

---

## Features
1. **Set Expiration Times for Downloads**:
   - Automatically categorize downloads with lifespans like 1 hour, 1 day, 1 week, 1 month, or forever.
   
2. **View and Manage Downloads**:
   - List recent downloads and their assigned lifespans.
   - Delete expired files automatically based on predefined rules.

3. **Native Host Integration**:
   - Communicate with a local js script to enable operations like file deletion directly from the browser.

---

## Project Structure
```plaintext
SmartDownloadsManager/
├── chromeExtension/           # The main Chrome extension folder
│   ├── icons/                 # Icons used for the extension
│   │   ├── 48.png
│   │   ├── 128.png
│   │   └── 240.png
│   ├── program/               # Companion native file manager program
│   │   ├── native-host.json   # Native messaging host configuration
│   │   ├── fileManager.js     # Script for deleting files locally, talks via Native Messaging
│   ├── background.js          # Service worker handling downloads and storage
│   ├── manifest.json          # Chrome extension configuration
│   ├── popup.html             # Popup window for user interaction
│   ├── popup.js               # Logic for the popup window
│   ├── styles.css             # Styling for the popup window
├── .gitignore                 # Git ignored files
├── LICENSE                    # License information
└── README.md                  # This documentation
```

---

## How It Works

### 1. Chrome Extension
- The extension uses a **service worker (`background.js`)** to listen for Chrome download events.
- It stores metadata about each downloaded file in Chrome's local storage, such as:
  - File name
  - Download timestamp
  - Lifespan (e.g., 1 hour, 1 day, forever)
- Provides a **popup UI (`popup.html`)** for users to view and manage files.

### 2. Native Host Script
- A **native messaging host (`fileManager.js`)** enables local file deletion.
- Configured via `native-host.json` to allow communication between the browser and local system.
- The fileManager.js script deletes files locally via Node.js when requested by the extension.

---

## Installation

### Prerequisites
1. Google Chrome or any Chromium-based browser.
2. Node.js installed on the user's machine (required to run the fileManager.js script).

### Steps to Install the Extension
1. Clone or download the repository.
2. Navigate to `chrome://extensions/` in your browser.
3. Enable **Developer Mode** (toggle at the top-right).
4. Click **Load Unpacked** and select the `chromeExtension` directory.

### Setting Up the Local Script
Download the **fileManager.js** and **native-host.json**:
   1. Save the **fileManager.js** in a location accessible to your system e.g. 
   
            C:\SmartDownloadsManager\
            ├── fileManager.js        # The native messaging script

   2. Chrome requires **native_host.json** to be placed in specific directories depending on the operating system.
         - Windows:

               %LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts\
         - macOS:

               ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/

         - Linux:

               ~/.config/google-chrome/NativeMessagingHosts/


      - **!!! Update the path in native-host.json to point to the saved location of fileManager.js !!!**
      - Example native-host.json:

            {
               "name": "com.smartdownloadsmanager.host",
               "description": "Native host for Smart Downloads Manager",
               "path": "C:/SmartDownloadsManager/fileManager.js",
               "type": "stdio",
               "allowed_origins": [
                  "chrome-extension://<extension-id>/"
               ]
            }

   3. This can be done automatically by running the **smartdownloadsmanager_install.bat** on windows, remember to update the native-host.json first tho
## Development

### Key Scripts
1. **background.js**:
   - Manages download events and storage.
   - Communicates with the native host program for file deletion.
   
2. **popup.js**:
   - Handles user interactions in the popup UI.
   - Updates file metadata and interacts with `chrome.storage`.

3. **fileManager.js**:
   - Executes file operations such as deletion using Node.js.
   - Interfaces with the browser via native messaging.

---

## Troubleshooting
1. **"File Deletion Not Working"**:

   - Verify that Node.js is installed and accessible from the command line.
   - Ensure the native-host.json file is correctly registered and points to the location of fileManager.js.

2. **"Native Host Not Found"**:

   - Confirm the native-host.json file is in the correct directory.
   - Restart your browser after making changes to native-host.json.

---

## Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

For more details or troubleshooting, i wish u good luck! If you encounter issues, open an issue on the repository or contact the maintainer "me" :)