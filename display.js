const electron = require('electron');
const ipc = require('electron').ipcRenderer;

const hud = document.getElementById('hud');

ipc.on('maximize-image', function (event, src) {
  hud.innerHTML = `<img src="${src}"/>`;
});
