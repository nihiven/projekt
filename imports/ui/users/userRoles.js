import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';

import { Profiles } from '/imports/api/collections/profiles.js';

// templates
import './userRoles.html';

// for sharing user id between templates
_x.profileUserId = new ReactiveVar();

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
  isSelected() {
    return (_x.profileUserId.get() === this._id) ? 'active' : false;
  },
});

Template.userRow.events({
  'click .userTable'() {
    _x.profileUserId.set(this._id);
  },
});

// ////////// PROFILES /////////// //
Template.profileTable.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('profiles.public');
    _x.profileUserId.set(undefined);
  });
});

Template.profileTable.helpers({
  profile() {
    return Profiles.findOne({ userId: _x.profileUserId.get() });
  },
  profileUserId() {
    return _x.profileUserId.get();
  },
});

// ////////// ROLES /////////// //
Template.roleTable.onCreated(function() { // can't use => here
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.public');
    this.subscribe('roles.public');
  });
});

Template.roleTable.helpers({
  'userList'() {
    return Meteor.users.find({}, { _id: 1, roles: 1 });
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
  profileUserId() {
    return _x.profileUserId.get();
  },
});

Template.roleTable.events({
  'click [class~="checkbox"]'(event) {
    const userId = _x.profileUserId.get();
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
