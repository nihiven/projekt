import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';

// collections
import { Profiles } from '/imports/api/collections/profiles.js';

// templates
import './userRoles.html';

Template.userRoleMgmt.onCreated(function() { // can't use => here
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.roles');
    this.subscribe('profiles.roles');
    this.subscribe('roles.all');
  });
});

// userRoleTable
Template.userRoleTable.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
  });
});

Template.userRoleTable.helpers({
  'userList'() {
    return Meteor.users.find({}, { _id: 1, roles: 1 });
  },
  'getAllRoles'() {
    return Roles.getAllRoles();
  },
});

Template.userRoleRow.helpers({
  'getAllRoles'() {
    return Roles.getAllRoles();
  },
});

// userRoleRow
Template.userRoleRow.helpers({
  'displayName'() {
    const data = Profiles.findOne({ userId: this._id });
    return data.name;
  },
  'isUserInRole'(userId, role) {
    return Roles.userIsInRole(userId, role);
  },
});

Template.userRoleRow.events({
  'click [class~="checkbox"]'(event) {
    const userId = $(event.target).attr('id');
    const role = [this.name]; // always needs to be an array

    // BUG: sometimes this.name is undefined
    check(userId, String);

    if (Roles.userIsInRole(userId, role)) {
      if (!Meteor.call('roles.revoke', userId, role)) {
        event.preventDefault();
      }
    } else {
      if (!Meteor.call('roles.grant', userId, role)) {
        event.preventDefault();
      }
    }
  },
});

const toggleRole = (userId, role) => {

};
