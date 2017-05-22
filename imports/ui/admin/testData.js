import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt } from 'meteor/nihiven:projekt';

// templates
import './testData.html';

Template.testData.events({
  'click [class~="projectData"]'() {
    testData('projects');
  },
  'click [class~="reset"]'() {
    testData('reset');
  },
  'click [class~="taskData"]'() {
    testData('tasks');
  },
  'click [class~="userData"]'() {
    testData('users');
  },
});

const testData = function(mode = 'load') {
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
    projekt.err('notAdmin');
  };
};
