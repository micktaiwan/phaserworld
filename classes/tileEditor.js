import {Files} from "../imports/api/tiles/collections.js";
import {Meteor} from "meteor/meteor";

export class TileEditor {

  constructor(canvasId) {

  }

  setCanvasId(canvasId, resultCanvasId) {
    this.canvas = document.getElementById(canvasId);
    this.resultCanvas = document.getElementById(resultCanvasId);
    this.ctx = this.canvas.getContext("2d");
    this.resultCtx = this.resultCanvas.getContext("2d");

    this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this));

    this.color = "#f00";
  }

  mousedown(e) {
    const rect = e.target.getBoundingClientRect();
    this.putPixel(e.clientX - rect.left, e.clientY - rect.top);
    this.mouseState = 'down';
  }

  mouseup(e) {
    this.mouseState = 'up';
    this.resultCtx.drawImage(this.canvas, 0, 0);
  }

  mousemove(e) {
    if(this.mouseState !== 'down') return;
    const rect = e.target.getBoundingClientRect();
    this.putPixel(e.clientX - rect.left, e.clientY - rect.top);
  }

  putPixel(x, y) {
    x = Math.floor(x / 20) * 20;
    y = Math.floor(y / 20) * 20;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x, y, 19, 19);
  }

  toFile() {
    const name = $('#tileName').val();
    const userId = Meteor.userId();
    console.log(userId);
    if(!name) return alert('missing file name');
    this.canvas.toBlob(blob => {
      const file = new File([blob], name + '.png');
      const upload = Files.insert({
        file: file,
        chunkSize: 'dynamic',
        // streams: 'dynamic',
        meta: {sourceId: 'tiles', userId: userId, date: new Date()},
      }, false);

      upload.on('end', function(error, fileObj) {
        if(error) return console.log(`Error during upload: ${error}`);
        console.log(`File "${fileObj.name}" successfully uploaded`);
      });

      upload.start();

    }, 'image/png', 1);
  }

}

