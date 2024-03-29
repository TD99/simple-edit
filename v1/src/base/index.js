const { app, BrowserWindow, ipcMain, dialog, ipcRenderer, globalShortcut } = require('electron');
const ipc = ipcMain;
const path = require('path');

const componentDir = __dirname + "/../components";
const extensionDir = __dirname + "/../extensions";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const windows = new Set();
const windowTemplates = {
  main: {
    minWidth: 800, 
    minHeight: 600, 
    width: 800, 
    height: 600, 
    frame: false,
    transparent: false, 
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false, 
      devTools: true, 
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }, 
    file: "main/index.html",
    type: "main"
  }
};

const createWindow = async ({minWidth, minHeight, width, height, frame, transparent, webPreferences, file, type}) => {
  if (!type) type='none';

  if ( // Dev Environment
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow){
    var [currentWindowX, currentWindowY] = currentWindow.getPosition();
  }

  let newWindow = new BrowserWindow({
    minWidth,
    minHeight,
    width,
    height,
    frame,
    transparent,
    webPreferences,
    x: (currentWindow)?(currentWindowX + 24):(undefined),
    y: (currentWindow)?(currentWindowY + 24):(undefined)
  });
  windows.add(newWindow);

  var isCloseDlg = false;
  newWindow.on('close', e => {
    if (isCloseDlg) {
      e.preventDefault();
      return;
    }
    isCloseDlg = true;
    const choice = require('electron').dialog.showMessageBoxSync(
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to close this window?'
      });
    isCloseDlg = false;
    if (choice === 1) {
      e.preventDefault();
    }
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });

  if (windows.size <= 1) { // First window
    newWindow.webContents.once('did-finish-load', () => { // Check if path in args
      const openFilePath = process.argv[1];
      if (openFilePath && openFilePath != ".") { // '.' is default, no file selected
        newWindow.webContents.send('openFile', openFilePath);
      }
    })
  }
  
  newWindow.loadFile(path.join(componentDir, file));
  newWindow.setBackgroundColor('#1f232a')
  
  return newWindow;
}

ipc.on('minimizeApp', (event)=>{
  event.sender.focus();
  BrowserWindow.getFocusedWindow().minimize();
});

ipc.on('maximizeApp', (event)=>{
  event.sender.focus();
  if (BrowserWindow.getFocusedWindow().isMaximized()){
    BrowserWindow.getFocusedWindow().unmaximize();
  } else{
    BrowserWindow.getFocusedWindow().maximize();
  }
});

ipc.on('closeApp', (event)=>{
  event.sender.focus();
  BrowserWindow.getFocusedWindow().close();
});

ipc.on('devTools', (event)=>{ //dep
  event.sender.focus();
  BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
});

ipc.on('toggleDevTools', (event)=>{
  event.sender.focus();
  BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
});

ipc.on('openFileDlg', (event)=>{
  dialog.showOpenDialog({properties: ['openFile'] }).then(function (response) {
    if (!response.canceled) {
      // handle fully qualified file name
      event.sender.send('openFile', response.filePaths[0]);
    }
  });
});

ipc.on('saveFileDlg', (event)=>{
  dialog.showSaveDialog().then(function (response) {
    if (!response.canceled) {
      // handle fully qualified file name
      event.sender.send('saveFileAd', response.filePath);
    }
  });
});

ipc.on('openExtURL', (event, data) => {
  console.log("Trying to open external URL: " + data);
  require('electron').shell.openExternal(data);
});

ipc.on('newFile', () => { //dep
  createWindow(windowTemplates["main"]);
});

ipc.on('newMainWindow', () => {
  createWindow(windowTemplates["main"]);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow(windowTemplates["main"]);
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
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(windowTemplates["main"]);
  }
});

app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R", () => {}); // Disable Reload
  globalShortcut.register("F5", () => {}); // Disable Reload
});

app.on('browser-window-blur', function () { // unfocus
  globalShortcut.unregister('CommandOrControl+R'); // Enable Reload (DevTools bugfix)
  globalShortcut.unregister('F5'); // Enable Reload (DevTools bugfix)
});