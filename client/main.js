import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; // this is the default BS theme

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './main.html';

import {World} from '../classes/world.js';

const world = new World();

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

Template.titleEditor.onRendered(function() {});

Template.titleEditor.helpers({
  videos() {
    return Videos.find({}, {sort: {date: -1}});
  },

});

Template.titleEditor.events({

  'mouseover '(e, tpl){
    e.preventDefault();
    const form = tpl.$('#addCustomerForm').serializeJSON();
    if(!app.verifyMandatory(tpl, ['name'])) return;
    Meteor.call('customersInsert', form, function(err, rv) {
      if(err) return orbiter.core.showException(err);
      Meteor.call('analyticsEvent', {type: 'customerAdded', value: {title: form.name, user: Meteor.user().username}});
      orbiter.core.displayMessage(orbiter.languages.trad('added'), 'success');
      tpl.$('#addCustomerForm').trigger('reset');
      resetFilters();
      tpl.selected.set(rv);
    });
  }

});
