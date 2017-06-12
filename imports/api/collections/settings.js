import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// imports from npm package
import SimpleSchema from 'simpl-schema';

// exports
export const Settings = new Mongo.Collection('settings');

if (Meteor.isServer) {
  Meteor.publish('settings.public', () => { // data for self consumption
    return Settings.find({ });
  });

  // check for global settings Object
  // if none exists, import settings from projekt
}

// Deny all client-side updates
Settings.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


Settings.schema = new SimpleSchema({
  name: {
    type: String,
    optional: false,
    label() { return 'Name of this settings group.'; },
  },
  debug: {
    type: Boolean,
    optional: false,
    label() { return 'This will display the site\'s development features.'; },
  },
});

Settings.attachSchema(Settings.schema);
