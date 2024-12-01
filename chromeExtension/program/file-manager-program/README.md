# File Manager Program

This is the companion program for the Smart Downloads Manager Chrome Extension. It handles file management tasks such as deleting files after their lifespan expires. Built with Electron, the program can be run as a standalone desktop app or integrated with the Chrome extension using native messaging.

---

## Features
- Electron-based desktop application.
- Seamless communication with the Smart Downloads Manager Chrome Extension.
- Auto-start on boot functionality.
- Cross-platform builds (Windows, macOS, Linux).

---

## Directory Structure
```plaintext
file-manager-program/
├── dist/                   # Output folder for built files (run files)
├── src/                    # Source files for the app
│   ├── main.js             # Main process for Electron
│   ├── index.html          # UI for the renderer process
├── package.json            # Project metadata and Electron Builder config
├── node_modules/           # Dependencies
```
---

## How to Build & Run

________
### Build the App 
When you download the project you will not recieve the node-modules add have to create that yourself

    npm install
To package the app in to an installer:

    npm run build

The resulting installer and build artifacts will be in the dist/ directory.
To enjoy the build you run the executable in the dist dir:

    dist/Smart Downloads Manager Setup 1.0.0.exe

----

### Run the App in Development in the file-manager-program directory
To run the app in development mode:

    npm start


# Cross-Platform Notes
### Windows
    The installer is built using NSIS.
Ensure the app has appropriate permissions for file management tasks.
### macOS
    Builds a .dmg installer.

Permissions for file management may require user approval.
### Linux
    Builds an AppImage.
Users must mark the AppImage as executable to run it.