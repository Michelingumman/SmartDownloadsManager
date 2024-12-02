const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises; // Use promises API for async operations
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    mainWindow.loadFile('src/index.html');
});

ipcMain.on('delete-file', async (event, filePath) => {
    try {
        await fs.unlink(filePath); // Async file deletion
        event.reply('delete-file-reply', { status: 'success', message: `Deleted ${filePath}` });
    } catch (error) {
        event.reply('delete-file-reply', { status: 'error', message: error.message });
    }
});

app.on('ready', () => {
    const exePath = app.getPath('exe');
    app.setLoginItemSettings({
        openAtLogin: true,
        path: exePath,
        args: [],
    });
    console.log("App set to start on boot.");
});
