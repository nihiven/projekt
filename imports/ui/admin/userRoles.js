import { Meteor } from 'meteor/meteor';
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
    if (event.altKey) {
      console.log($(event.target).attr('id'));
      console.log(this);
    }
  },
});

const toggleRole = (userId, role) => {

};
