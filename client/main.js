import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; // this is the default BS theme

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './main.html';

import {World} from '../classes/world.js';
import {TileEditor} from "../classes/tileEditor.js";

const world = new World();
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

  tileEditor.setCanvasId("canvas", "result");

});

Template.titleEditor.helpers({
  videos() {
    return Videos.find({}, {sort: {date: -1}});
  },

});

Template.titleEditor.events({

  'click .saveToFile'() {
    tileEditor.toFile();
  },

});
