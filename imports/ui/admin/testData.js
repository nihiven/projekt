import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// templates
import './testData.html';

// subscriptions for collection analysis
// this should include every available publication

Template.testDataFunctions.events({
  // users
  'click [class~="users-load"]': function clickUsersLoad() {
    // profiles are loaded as part of a callback in test users
    Meteor.call('test.users.load');
  },
  'click [class~="users-reset"]': function clickUsersReset() {
    Meteor.call('test.users.reset');
    Meteor.call('test.profiles.reset');
  },
  // tasks
  'click [class~="tasks-load"]': function clickTasksLoad() {
    Meteor.call('test.tasks.load');
  },
  'click [class~="tasks-reset"]': function clickTasksReset() {
    Meteor.call('test.tasks.reset');
  },
  // projects
  'click [class~="projects-load"]': function clickProjectsLoad() {
    Meteor.call('test.projects.load');
  },
  'click [class~="projects-resets"]': function clickProjectsReset() {
    Meteor.call('test.projects.resets');
  },
});
