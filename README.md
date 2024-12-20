# Smart Downloads Manager

## Overview
Smart Downloads Manager is a Chrome extension that allows users to manage their downloads efficiently by assigning file lifespans and interacting with native scripts to automate tasks such as deleting specific files. The extension uses Chrome's Native Messaging API to communicate with a Python script running locally.

---

## Features
- Set file lifespans for downloaded files.
- Delete specific files from the Downloads folder directly through the extension.
- Cross-platform support for Windows and macOS.
- Easy setup with an installer for both platforms.

---

## Installation

### Windows Users

1. **Download the Repository**
   - Clone or download this repository.

2. **Run the Installer**
   - Navigate to the `installer` folder in the project.
   - Double-click `installer.bat` to execute the installer.

3. **What the Installer Does**
   - Locates your Python installation.
   - Configures the `run.bat` file with the correct paths.
   - Updates the `smartdownloadsmanager.json` file with the correct paths.
   - Adds a registry key for Chrome's Native Messaging Host.

4. **Upload the Extension**
   - Navigate to `chrome://extensions` in Chrome.
   - Enable Developer Mode and select "Load Unpacked Extension."
   - Upload the `chromeExtension` folder.
   - Note the **Extension ID** and manually add it to the `smartdownloadsmanager.json` file under the `allowed_origins` key.

5. **Verify Installation**
   - Check the installation log at `installer/install.log` for any errors.
   - Confirm that the extension can communicate with the native Python script by pressing the "Test Communication" button in the extension popup.

---

### macOS Users

1. **Download the Repository**
   - Clone or download this repository.

2. **Run the Installer**
   - Open a terminal and navigate to the `installer` folder in the project.
   - Run the following commands:
     ```bash
     chmod +x installer.sh
     ./installer.sh
     ```

3. **What the Installer Does**
   - Locates your Python installation.
   - Configures the `run.sh` file with the correct paths.
   - Updates the `smartdownloadsmanager.json` file with the correct paths.
   - Places the JSON file in `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/`.

4. **Upload the Extension**
   - Navigate to `chrome://extensions` in Chrome.
   - Enable Developer Mode and select "Load Unpacked Extension."
   - Upload the `chromeExtension` folder.
   - Note the **Extension ID** and manually add it to the `smartdownloadsmanager.json` file under the `allowed_origins` key.

5. **Verify Installation**
   - Check the installation log at `installer/install.log` for any errors.
   - Confirm that the extension can communicate with the native Python script by pressing the "Test Communication" button in the extension popup.

---

## File Structure

### Key Files and Folders
- **chromeExtension/**
  - Contains the Chrome extension files, such as `manifest.json`, `popup.html`, `popup.js`, and supporting files.
- **NativeMessaging/**
  - `run.bat` (Windows) or `run.sh` (macOS): Used to execute the Python script.
  - `smartdownloadsmanager.json`: Configures the Native Messaging Host.
- **installer/**
  - `installer.bat`: Sets up the project on Windows.
  - `installer.sh`: Sets up the project on macOS.
  - `install.log`: Logs the installation progress and errors.
- **python.py**
  - The Python script that handles commands from the extension.

---

## Usage

1. **Install the Chrome Extension**
   - Load the extension manually by enabling Developer Mode in Chrome and selecting "Load Unpacked Extension."
   - Point to the `chromeExtension` folder.
   - Navigate to `installer/installer.bat` or `.sh` and run the file.

2. **Test Communication**
   - Open the extension popup and press the "Test Communication" button.
   - If the setup is successful, you should see a success response in the popup.

3. **Delete a File**
   - Enter the filename (from the Downloads folder) in the "Test Delete File" field in the popup.
   - Press the "Test Delete File" button to delete the file.

---

## Troubleshooting

1. **Native Messaging Host Not Found**
   - Verify that the JSON file is correctly placed:
     - Windows: `HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\smartdownloadsmanager`
     - macOS: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/smartdownloadsmanager.json`

2. **Python Script Not Running**
   - Ensure that Python 3 is installed and added to the PATH.
   - Check the paths in `run.bat` (Windows) or `run.sh` (macOS).

3. **Logs**
   - Check `install.log` in the `installer` folder for errors.
   - Check `log.txt` in the project root for runtime logs.

---

## License
This project is licensed under the MIT License.

