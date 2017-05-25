import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';

import { Profiles } from '/imports/api/collections/profiles.js';

// templates
import './userRoles.html';

// ////////// USERS /////////// //
Template.userTable.onCreated(function() { // can't use => here
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.public');
    this.subscribe('profiles.public');
  });
});

Template.userTable.helpers({
  userList() {
    return Meteor.users.find({ });
  },
});

Template.userRow.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('profiles.public');
  });
});

Template.userRow.helpers({
  profile() {
    return Profiles.findOne({ userId: this._id });
  },
});

Template.userRow.events({
  'click .userTable'(event) {
    console.log(Template.profileTable.instance());
  },
});

// ////////// PROFILES /////////// //
Template.profileTable.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.justin = new ReactiveVar();
    this.justin.set('jb');
  });
});

Template.profileTable.helpers({
  justin() {
    const instance = Template.instance();
    return instance.justin.get();
  },
});

// ////////// ROLES /////////// //
Template.roleTable.onCreated(function() { // can't use => here
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.public');
    this.subscribe('roles.all');
  });
});

Template.roleTable.helpers({
  'userList'() {
    return Meteor.users.find({}, { _id: 1, roles: 1, emails: 1 });
  },
  'getAllRoles'() {
    return Roles.getAllRoles();
  },
  'isUserInRole'(userId, role) {
    return Roles.userIsInRole(userId, role);
  },
  'isUserInRoleIcon'(userId, role, icon) {
    if (Roles.userIsInRole(userId, role)) {
      return icon;
    } else {
      return false;
    }
  },
});

Template.roleTable.events({
  'click [class~="checkbox"]'(event) {
    const userId = $(event.target).attr('id');
    const role = [this.name]; // always needs to be an array

    // BUG: sometimes this.name is undefined
    if (!role) {
      console.log('userRoles.js: caught null bug');
      event.preventDefault();
      return;
    }

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
