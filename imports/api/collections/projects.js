import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('projects');
export { Projects as default };

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('projects', function() {
    return Projects.find();
  });
}

Meteor.methods({
  'projects.insert'(name) {
    check(name, String);

    // user must be logged in
    // TODO: user must be project admin
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Projects.insert({
      name,
      creator: Meteor.userId(),
      createdAt: new Date(),
    });

    console.log('created new project');
  },
});
