const { app, Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 760,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.setMenuBarVisibility(false)
  mainWindow.openDevTools()
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  mainWindow.on('close', (ev) => {
    if (mainWindow?.isVisible()) {
      ev.preventDefault();
      mainWindow.hide();
      createTray()
    }
  });
};

function createTray() {
  const tray = new Tray('electron/tray.png');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Открыть',
      click: () => {
        BrowserWindow.getAllWindows().forEach((w) => w.show());
        tray.destroy()
    }},
    { type: 'separator' },
    {
      label: 'Выход',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        BrowserWindow.getAllWindows().forEach((w) => w.destroy());
        app.quit();
      }
    }
  ]);

  tray.setToolTip('ГеоПозиция');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    BrowserWindow.getAllWindows().shift().show();
  });

  return tray
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  const window = BrowserWindow.getAllWindows().shift();
  if (window) {
    window.show();
  } else {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
