'use strict'
const {
  electron,
  ipcMain,
  app,
  dialog,
  Tray,
  Menu,
  BrowserWindow,
  nativeImage,
  clipboard
}                 = require('electron');
const path        = require('path');

let mainWindow;

let createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 300,
    minHeight: 700,
    width: 400,
    height: 750,
    transparent: true,
    frame: false,
    icon: path.join(path.resolve(app.getAppPath(), './assets/lo-icon@2x.png'))
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

  mainWindow.on('closed', () => {

    mainWindow = null
  });

  // System tray.
  //Tray with native image also this one fix the "index 0" error but still not shown image

  let image = nativeImage.createFromPath('./app/assets/lo-icon@2x.png')
  let tray = new Tray(image)
  console.log(tray)

  // it resolve index 0 error
  // const image = clipboard.readImage()
  // var tray = new Tray(image);
  // console.log(tray);

  //it work also with error after package
  //let tray = new Tray('./app/assets/icon@2x.png')

  //other things
  //var tray = new Tray('./app/assets/icon@2x.png');
  //var tray = new Tray(path.resolve(app.getAppPath(), './assets/icon.png'));

  var contextMenu = Menu.buildFromTemplate([
    { label: 'open', click: () => {mainWindow.restore(); mainWindow.show();} },
    { label: 'minimize', click: () => {mainWindow.minimize();} },
    { label: 'close', click: 
      function handleClicked () {
        app.quit();
      }
    }
  ]);

  tray.on('click', function handleClicked () {
    mainWindow.restore();
    mainWindow.show();
  });
  tray.setToolTip('Material Account App');
  tray.setContextMenu(contextMenu);
}

ipcMain.on('close-main-window', function () {
    app.quit();
});

ipcMain.on('minimize', function () {
    mainWindow.minimize();
});

ipcMain.on('export-to-pdf', function () {

  let pdfSavePath = dialog.showSaveDialog({ 
    title: 'Save as PDF File',
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  });

});

ipcMain.on('go-to-github', function () {
  electron.shell.openExternal('https://github.com/ue/electra');
});

app.on('ready', createWindow)

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (mainWindow === null) {
    createWindow()
  }
})