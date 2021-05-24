import {FilesCollection} from 'meteor/ostrio:files';

let storagePath = '/opt/orbiterFiles'; // default path
const path = Meteor.settings?.files?.storagePath;
if(path) storagePath = path;

export const Files = new FilesCollection({
  storagePath: storagePath,
  collectionName: 'files',
  allowClientCode: false, // Disallow remove files from Client
});


