import {Files} from "../imports/api/tiles/collections.js";

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
    this.ctx.strokeStyle = this.color;
    this.ctx.fillRect(x, y, 19, 19);
  }

  toFile() {
    this.canvas.toBlob(blob => {
      console.log(blob);
      blob.text().then(data => {
        // console.log(data);

        // const img = document.getElementById('img');
        // const test = document.getElementById('test');
        // const ctx = test.getContext('2d');
        // ctx.drawImage(data, 0, 0);

        // img.src = data;

        Meteor.call('saveTile', data);

      });
    }, 'image/png', 1);
  }

}

