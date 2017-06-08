import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// autoform
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// collections
import { Projects } from '/imports/api/collections/projects.js';

// templates
import './testData.html';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

// subscriptions for collection analysis
// this should include every available publication

Template.testDataFunctions.events({
  'click [class~="users-load"]': function clickUsersLoad() {
    Meteor.call('test.users.load');
  },
  'click [class~="users-reset"]': function clickUsersReset() {
    Meteor.call('test.users.reset');
  },
  'click [class~="tasks-load"]': function clickTasksLoad() {
    Meteor.call('test.tasks.load');
  },
  'click [class~="tasks-reset"]': function clickTasksReset() {
    Meteor.call('test.tasks.reset');
  },
  'click [class~="projects-load"]': function clickProjectsLoad() {
    Meteor.call('test.projects.load');
  },
  'click [class~="projects-resets"]': function clickProjectsReset() {
    Meteor.call('test.projects.resets');
  },
  'click [class~="profiles-load"]': function clickProfilesLoad() {
    Meteor.call('test.profiles.load');
  },
  'click [class~="profiles-reset"]': function clickProfilesReset() {
    Meteor.call('test.profiles.reset');
  },
});
