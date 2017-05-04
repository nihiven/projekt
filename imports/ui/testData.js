// test data
// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';

// collections
import { Projects } from '/imports/api/collections/projects.js';

// templates
import '/imports/ui/testData.html';

// projectList
Template.testData.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});

Template.testData.helpers({
  projectCount() {
    return Projects.find({}).count();
  },
});

Template.testData.events({
  'click .project'() {
    testData('load');
  },
  'click .reset'() {
    testData('reset');
  },
});

const testData = function(mode = 'load') {
  if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    if (mode === 'load') {
      Meteor.call('projects.test');
      // TODO: maybe add some users with different roles
    }
    if (mode === 'reset') {
      Meteor.call('projects.reset');
      Meteor.call('favorites.reset');
      Meteor.call('profiles.reset');
    }
  } else {
    throw new Meteor.Error(403, 'Not authorized to change test data.');
  };
};
