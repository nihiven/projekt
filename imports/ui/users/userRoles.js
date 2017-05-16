import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';

// templates
import './userRoles.html';

Template.userRoleMgmt.onCreated(function() { // can't use => here
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.public');
    this.subscribe('roles.all');
  });
});

Template.userRoleTable.helpers({
  'userList'() {
    return Meteor.users.find({}, { _id: 1, roles: 1, emails: 1, roles: 1 });
  },
  'getAllRoles'() {
    return Roles.getAllRoles();
  },
});

Template.userRoleRow.onCreated(function() {
  this.display = new ReactiveDict();
  this.display['name'] = new ReactiveVar();
  this.display['email'] = new ReactiveVar();

  this.autorun(() => {
    this.subscribe('profiles.public');
  });
});

Template.userRoleRow.helpers({
  'getAllRoles'() {
    return Roles.getAllRoles();
  },
});
Template.userRoleRow.helpers({
  'profileField'(field) {
    const instance = Template.instance();
    Meteor.call('profiles.public', this._id, (error, result) => {
      instance.display[field].set(result[field]);
    });
    return instance.display[field].get();
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

Template.userRoleRow.events({
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
