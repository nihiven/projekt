import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';

// collections
import { Profiles } from '/imports/api/collections/profiles.js';

// templates
import './userRoles.html';

Template.userRoleMgmt.onCreated(function() { // can't use => here
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('users.roles');
    this.subscribe('profiles.public');
    this.subscribe('roles.all');
  });
});

Template.userRoleTable.helpers({
  'userList'() {
    return Meteor.users.find({}, { $orderby: { _id: -1 }}, { _id: 1, roles: 1 });
  },
  'getAllRoles'() {
    return Roles.getAllRoles();
  },
});

Template.userRoleRow.onCreated(function() {
  const instance = this;
  instance.displayName = new ReactiveVar();
  instance.displayEmail = new ReactiveVar();

  const data = Profiles.findOne({ userId: this.data._id });

  instance.displayName.set(data.name);
  instance.displayEmail.set(data.email);
});

Template.userRoleRow.helpers({
  'displayName'() {
    const instance = Template.instance();
    return instance.displayName.get();
  },
  'displayEmail'() {
    const instance = Template.instance();
    return instance.displayEmail.get();
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
