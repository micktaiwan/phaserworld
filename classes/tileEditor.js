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
    // this.resultCtx.drawImage(this.canvas, 0, 0);
    this.resample_single();
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
    console.log(userId); // TODO
    if(!name) return alert('missing file name');

    this.resultCanvas.toBlob(blob => {
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

  /**
   * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
   */
  resample_single() {
    const canvas = this.canvas;
    const width = 32;
    const height = 32;

    var width_source = canvas.width * 2;
    var height_source = canvas.height * 2;

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var img = this.ctx.getImageData(0, 0, width_source, height_source);
    var img2 = this.resultCtx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for(var j = 0; j < height; j++) {
      for(var i = 0; i < width; i++) {
        var x2 = (i + j * width) * 4;
        var weight = 0;
        var weights = 0;
        var weights_alpha = 0;
        var gx_r = 0;
        var gx_g = 0;
        var gx_b = 0;
        var gx_a = 0;
        var center_y = (j + 0.5) * ratio_h;
        var yy_start = Math.floor(j * ratio_h);
        var yy_stop = Math.ceil((j + 1) * ratio_h);
        for(var yy = yy_start; yy < yy_stop; yy++) {
          var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
          var center_x = (i + 0.5) * ratio_w;
          var w0 = dy * dy; //pre-calc part of w
          var xx_start = Math.floor(i * ratio_w);
          var xx_stop = Math.ceil((i + 1) * ratio_w);
          for(var xx = xx_start; xx < xx_stop; xx++) {
            var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
            var w = Math.sqrt(w0 + dx * dx);
            if(w >= 1) {
              //pixel too far
              continue;
            }
            //hermite filter
            weight = 2 * w * w * w - 3 * w * w + 1;
            var pos_x = 4 * (xx + yy * width_source);
            //alpha
            gx_a += weight * data[pos_x + 3];
            weights_alpha += weight;
            //colors
            if(data[pos_x + 3] < 255)
              weight = weight * data[pos_x + 3] / 250;
            gx_r += weight * data[pos_x];
            gx_g += weight * data[pos_x + 1];
            gx_b += weight * data[pos_x + 2];
            weights += weight;
          }
        }
        data2[x2] = gx_r / weights;
        data2[x2 + 1] = gx_g / weights;
        data2[x2 + 2] = gx_b / weights;
        data2[x2 + 3] = gx_a / weights_alpha;
      }
    }

    //draw
    this.resultCtx.putImageData(img2, 0, 0);
  }

}
