const { app, BrowserWindow, ipcMain, dialog } = require('electron');
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
      preload: path.join(__dirname, 'preload.js')
    }, 
    file: "main/index.html"
  },
  preview: {
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
      preload: path.join(__dirname, 'preload.js')
    }, 
    file: "preview/index.html"
  },
};

const createWindow = async ({minWidth, minHeight, width, height, frame, transparent, webPreferences, file}) => {
  if (
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

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });
  
  newWindow.loadFile(path.join(componentDir, file));
  
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

ipc.on('devTools', (event)=>{
  event.sender.focus();
  BrowserWindow.getFocusedWindow().webContents.toggleDevTools();
});

ipc.on('openFileDlg', (opt)=>{
  dialog.showOpenDialog(opt);
});

ipc.on('openExtURL', (event, data) => {
  require('electron').shell.openExternal(data);
});

ipc.on('newFile', () => {
  createWindow(windowTemplates["main"]);
});

ipc.on('openPreview', () => {
  createWindow(windowTemplates["preview"]);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {createWindow(windowTemplates["main"]);});

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