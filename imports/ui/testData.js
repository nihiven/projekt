// test data
// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

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
    Meteor.call('projects.test');
  },
  'click .reset'() {
    Meteor.call('projects.reset');
    Meteor.call('favorites.reset');
  },
});
