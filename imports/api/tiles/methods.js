import {Files} from "./collections.js";

Meteor.methods({

  saveTile(data) {

    console.log(data.length);

    Files.write(data, {
      fileName: 'tile.png',
      fileId: Random.id(),
      type: "image/png",
      meta: {date: new Date()},
    }, function(writeError, fileRef) {
      if(writeError) return console.error(writeError);
      // console.log(fileRef.name + ' is successfully saved to FS. _id: ' + fileRef._id);
      // if(options.callback) options.callback(writeError, fileRef)

      // console.log(fileRef);

      var gm = require('gm');
      gm(fileRef.versions.original.path).identify((err, rv) => {
        if(!err) console.log('not corrupt image');
        console.log('err', err);
        console.log('rv', rv);
      });

    });

  },

});
