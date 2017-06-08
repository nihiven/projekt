import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { _err } from 'meteor/nihiven:projekt';

// templates
import './testData.html';

// subscriptions for collection analysis
// this should include every available publication

const testData = (mode = 'load') => {
  if (Roles.adminCheckPasses(Meteor.userId())) {
    if (mode === 'projects') {
      Meteor.call('projects.testData');
    }
    if (mode === 'reset') {
      Meteor.call('projects.reset');
      Meteor.call('favorites.reset');
      Meteor.call('tasks.reset');
    }
    if (mode === 'users') {
      Meteor.call('users.testData');
    }
    if (mode === 'tasks') {
      Meteor.call('tasks.testData');
    }
  } else {
    _err('notAdmin');
  }
};

Template.testDataFunctions.events({
  'click [class~="project-data"]': function testDataProjects() {
    testData('projects');
  },
  'click [class~="reset"]': function testDataReset() {
    testData('reset');
  },
  'click [class~="task-data"]': function testDataTasks() {
    testData('tasks');
  },
  'click [class~="user-data"]': function testDataUsers() {
    testData('users');
  },
});
