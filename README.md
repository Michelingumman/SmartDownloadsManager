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
   - Communicate with a local program to enable operations like file deletion directly from the browser.

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
│   │   ├── dist/              # Build files for the program
│   │   ├── node_modules/      # Dependencies (if using npm for backend)
│   │   ├── src/               # Source code for the file manager
│   │   ├── fileManager.js     # Main file manager script
│   │   ├── native-host.txt    # Native messaging host configuration
│   │   ├── package.json       # Node.js configuration
│   │   └── README.md          # Documentation for the native program
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

### 2. Native Host Program
- A **native messaging host (`fileManager.js`)** enables local file deletion.
- Configured via `native-host.json` to allow communication between the browser and local system.
- Built using Node.js for cross-platform compatibility with electron-builder.

---

## Installation

### Prerequisites
1. Google Chrome or any Chromium-based browser.
2. Node.js (for the companion program).

### Steps to Install the Extension
1. Clone or download the repository.
2. Navigate to `chrome://extensions/` in your browser.
3. Enable **Developer Mode** (toggle at the top-right).
4. Click **Load Unpacked** and select the `chromeExtension` directory.

### Setting Up the Native Host
1. Navigate to the `program` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the program:
   ```bash
   npm run build, executable file in program/dist/
   ```
4. Register the native host:
   - Copy `native-host.txt` (remake to .json) to the appropriate directory for your operating system:
     - **Windows**: `%LOCALAPPDATA%/Google/Chrome/User Data/NativeMessagingHosts/`
     - **macOS**: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/`
     - **Linux**: `~/.config/google-chrome/NativeMessagingHosts/`

---

## Usage

1. Open the extension from the Chrome toolbar.
2. View recent downloads, set expiration times, or delete expired files.
3. The companion program handles local file deletion requests.

### UI Elements
- **Last Downloaded File**: Displays the most recent download.
- **Lifespan Dropdown**: Set how long a file should be kept.
- **View Files**: A list of tracked downloads with lifespans.

---

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

## Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

For more details or troubleshooting, refer to the individual README files in the `program` directory. If you encounter issues, open an issue on the repository or contact the maintainer "me" :)