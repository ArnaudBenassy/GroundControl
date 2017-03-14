const electron = require('electron');
const ipc = require('electron').ipcRenderer;

const selectDirBtn = document.getElementById('directory');
const hud = document.getElementById('hud');
const gallery = document.getElementById('gallery');


let baseDir = './';

selectDirBtn.addEventListener('click', () => {
  ipc.send('open-file-dialog');
});

ipc.on('selected-directory', (event, dir) => {
  baseDir = dir;
});

ipc.on('found-images', (event, list) => {
  let i=0;
  list.forEach((elt) => {
    gallery.innerHTML += `<img class="thumb" id="thumb-${i++}" src="${baseDir}/${elt}"/>`;
  });

  let thumbs = document.getElementsByClassName('thumb');
  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].addEventListener('click', (event) => {
      ipc.send('maximize-image', event.target.currentSrc);
    })
  }
});
