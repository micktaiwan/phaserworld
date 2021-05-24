import {Files} from './collections';

Meteor.publish('filesQuery', function(query, options) {
  return Files.find(query, options).cursor;
});
