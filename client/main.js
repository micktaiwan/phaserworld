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

  this.subscribe('filesQuery', {});

});

Template.tiles.helpers({

  files() {
    return Files.find({}, {sort: {"meta.date": -1}}).each();
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
    world.putTile();
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
