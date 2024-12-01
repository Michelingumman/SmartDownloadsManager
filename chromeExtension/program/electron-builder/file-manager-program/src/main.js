const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true, // Allow Node.js in renderer
            contextIsolation: false, // Disable isolation for easier communication
        },
    });

    mainWindow.loadFile('src/index.html');
});

ipcMain.on('delete-file', (event, filePath) => {
    try {
        fs.unlinkSync(filePath);
        event.reply('delete-file-reply', { status: 'success', message: `Deleted ${filePath}` });
    } catch (error) {
        event.reply('delete-file-reply', { status: 'error', message: error.message });
    }
});



const path = require('path');


app.on('ready', () => {
    // Path to the app's executable
    const exePath = app.getPath('exe');

    // Add app to startup
    app.setLoginItemSettings({
        openAtLogin: true,
        path: exePath,
        args: []
    });

    console.log("App set to start on boot.");
});

