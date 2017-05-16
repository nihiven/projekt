import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt } from 'meteor/projekt';

// templates
import './testData.html';

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
  if (Roles.adminCheckPasses(Meteor.userId())) {
    if (mode === 'load') {
      Meteor.call('projects.testData');
    }
    if (mode === 'reset') {
      Meteor.call('projects.reset');
      Meteor.call('favorites.reset');
    }
    if (mode === 'usersData') {
      Meteor.call('users.testData');
    }
  } else {
    projekt.err('notAdmin');
  };
};
