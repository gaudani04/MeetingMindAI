const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,       // Narrow width for a side-panel widget
    height: 700,      // Tall height for reading insights
    x: 0,             // Optional: Position it on the edge of the screen
    y: 100,
    transparent: true, // Enables alpha channel for the window
    frame: false,      // Removes the OS close/minimize buttons and borders
    alwaysOnTop: true, // Forces it to float above Zoom, Chrome, etc.
    hasShadow: false,  // Cleaner look for transparent overlays
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // 🚨 THE MAGIC FLAG 🚨
  // Windows: WDA_EXCLUDEFROMCAPTURE | macOS: NSWindowSharingTypeNone
  // This tells the OS compositing engine to hide this window from screen captures.
  mainWindow.setContentProtection(true);

  // In development, load the Next.js localhost server
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});