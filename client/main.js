import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; // this is the default BS theme

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './main.html';

import {World} from '../classes/world.js';
import {TileEditor} from "../classes/tileEditor.js";
import {Files} from "../imports/api/tiles/collections.js";

let world;
const tileEditor = new TileEditor();

//import {ReactiveVar} from "meteor/reactive-var";
// import dayjs from 'dayjs';

//const myVar = new ReactiveVar(null);

Template.titleEditor.onCreated(function() {

  // const self = this;
  // this.autorun(function() {
  //   const data = Template.currentData();
  //   if(!data) return;
  //   self.subscribe('xxx', {serviceId: data._id});
  // });

});

Template.titleEditor.onRendered(function() {

  const config = {
    type: Phaser.AUTO,
    parent: 'world',
    width: $('#world').innerWidth(),
    height: $('#world').innerHeight(),
    pixelArt: true,
  };

  world = new World(config);
  this.subscribe('filesQuery', {}, function() {
    world.startScene();
  });

  tileEditor.setCanvasId("canvas", "result");

});

// Template.titleEditor.helpers({});

Template.titleEditor.events({

  'click .js-open-tile-editor'() {
    $('#editor').toggle();
  },

  'click .saveToFile'() {
    tileEditor.toFile();
  },

});

Template.tiles.onCreated(function() {

});

Template.tiles.helpers({

  files() {
    return Files.find({}, {sort: {"meta.date": -1}}).each();
  },

});

Template.tiles.events({

  'dragstart'(e) {
    e.originalEvent.dataTransfer.setData("text", e.target.id);
  },

});

Template.world.events({

  'dragover #world': function(e) {
    e.preventDefault();
    $(e.currentTarget).addClass('dragover');
  },

  'dragleave #world': function(e) {
    e.preventDefault();
    $(e.currentTarget).removeClass('dragover');
  },

  'drop #world': function(e) {
    $(e.currentTarget).removeClass('dragover');
    const fileId = e.originalEvent.dataTransfer.getData("text");
    world.scene.scenes[0].putTile(fileId);
    console.log(world);
    console.log(e);
    const canvasPos = $('#world canvas').position();
    const tileSize = 16;
    const x = Math.floor(((e.clientX - canvasPos.left) / world.scene.scenes[0].zoom) / tileSize) * tileSize;
    const y = Math.floor(((e.clientY - canvasPos.top) / world.scene.scenes[0].zoom) / tileSize) * tileSize;
    console.log(canvasPos);
    // console.log(world.scene.scenes[0].mouse.manager.activePointer.position.x, world.scene.scenes[0].mouse.manager.activePointer.position.y);
    //
    // const diffX = world.scene.scenes[0].mouse.manager.activePointer.position.x / world.scene.scenes[0].zoom - world.scene.scenes[0].player.body.position.x;
    // const diffY = world.scene.scenes[0].mouse.manager.activePointer.position.y / world.scene.scenes[0].zoom - world.scene.scenes[0].player.body.position.y;
    //
    // console.log(diffX, diffY);
    // const x = Math.floor(world.scene.scenes[0].mouse.manager.activePointer.position.x / 32) * 32;
    // const y = Math.floor(world.scene.scenes[0].mouse.manager.activePointer.position.y / 32) * 32;
    // const x = world.scene.scenes[0].mouse.manager.activePointer.position.x;
    // const y = world.scene.scenes[0].mouse.manager.activePointer.position.y;
    console.log(x, y);
    world.scene.scenes[0].putTile(x, y, fileId);
  },

});

Template.registerHelper('log', function(txt) {
  console.log(txt);
});

Template.registerHelper('count', function(find) {
  if(!find) return 0;
  if(find.count) return find.count();
  if(typeof (find.length) !== "undefined") return find.length;
  return find;
});
