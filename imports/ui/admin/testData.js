// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt } from 'meteor/projekt';

// collections
import { Projects } from '/imports/api/collections/projects.js';

// templates
import './testData.html';

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
  'click [class~="usersData"]'() {
    testData('usersData');
  },
});

const testData = function(mode = 'load') {
  if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    if (mode === 'load') {
      Meteor.call('projects.testData');
      // TODO: maybe add some users with different roles
    }
    if (mode === 'reset') {
      Meteor.call('projects.reset');
      Meteor.call('favorites.reset');
    }
    if (mode === 'usersData') {
      Meteor.call('users.testData');
    }
  } else {
    projekt.err('notAuthorized');
  };
};
