const electron = require('electron');
const ipc = require('electron').ipcRenderer;
const probe = require('probe-image-size');

const hud = document.getElementById('hud');

ipc.on('maximize-image', function (event, src) {
  hud.innerHTML = '';
  const link = document.createElement('a');
  link.href = src;
  const input = require('fs').createReadStream(decodeURI(link.pathname));
  probe(input).then(dimensions => {
    console.log(dimensions);
    const image = new Image();
    image.src = src;
    image.id = 'rendered-image';
    if (dimensions.width >= dimensions.height) {
      image.className = 'horizontal';
    } else {
      image.className = 'vertical';
    }
    hud.appendChild(image);
  });
});
