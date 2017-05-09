import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';

// collections
import { Profiles } from '/imports/api/collections/projects.js';
import { Favorites } from '/imports/api/collections/favorites.js';

// templates
import './userRoles.html';

Template.userRoleMgmt.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('Users.all');
  });
});

Template.userRoleMgmt.helpers({
  'userList'() {
    console.log(Meteor.users.find({}));
    return Meteor.users.find({});
  },
});

Template.userRoleMgmt.events({
  'click .ui'() {
    console.log(Meteor.users.count());
  },
});
