const electron = require('electron')
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const fs = require('fs');

const app = electron.app
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;
let displayWindow;

function createWindows () {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  displayWindow = new BrowserWindow({width: 500, height: 500});
  displayWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'display.html'),
    protocol: 'file:',
    slashes: true
  }));

  //mainWindow.webContents.openDevTools();
  displayWindow.webContents.openDevTools();

  mainWindow.on('closed',  () => {
    mainWindow = null;
    displayWindow.close();
  });

  displayWindow.on('closed', () => {
    displayWindow = null;
    //mainWindow.close();
  });

}

ipc.on('maximize-image', (event, src) => {
  displayWindow.webContents.send('maximize-image', src)
});

ipc.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (dir) => {
    let list = [];
    event.sender.send('selected-directory', dir);
    fs.readdir(dir[0], (err, subdir) => {
      subdir.forEach((filepath) => {
        if (filepath.includes('.jpg') || filepath.includes('.png')) list.push(filepath);
      });
      event.sender.send('found-images', list);
    })
  })
});

app.on('ready', createWindows);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindows()
  }
});
