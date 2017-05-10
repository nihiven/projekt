import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles'; // ?

// collections
import { Profiles } from '/imports/api/collections/profiles.js';
import { Favorites } from '/imports/api/collections/favorites.js';

// templates
import './userRoles.html';

// don't need this, but keep it to track .users usage
Template.userRoleMgmt.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.roles');
    this.subscribe('profiles.roles');
  });
});

Template.userRoleTable.helpers({
  'userList'() {
    return Meteor.users.find({}, { _id: 1, roles: 1 });
  },
});

Template.userRoleRow.helpers({
  'displayName'() {
    const data = Profiles.findOne({ userId: this._id });
    return data.name;
  },
  ''() {

  },
});
Template.userRoleRow.events({
  'click [class~="viewOnly"]'(event) {
    console.log(event.target);
  },
});
