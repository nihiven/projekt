import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

// collections
import { Profiles } from '/imports/api/collections/profiles.js';

// templates
import './nav.less';
import './nav.html';

// subscribe to published user list
Template.nav.onCreated(function() {
  // using autorun automatically keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('profiles.user');
  });
});

Template.nav.onRendered(function() {
  // make the current menu item active
  const path = FlowRouter.current().path;
  $(`a[href="${path}"]`).addClass('active');
});

Template.nav.events({
  'click .menu a.item'(event) {
    // highlight menu item when clicked
    $('.menu a.active').removeClass('active');
    $(event.target).addClass('active');
  },
});

Template.nav.helpers({
  'isAdmin'() {
    return (Roles.adminCheckPasses(Meteor.userId()) ? 'admin-glow' : '');
  },
});


Template.loggedInMenu.onRendered(function() {
  $('.ui.dropdown').dropdown();
});

// TODO: user pathfor in the links below
Template.loggedInMenu.events({
  'click [class$="-icon"]'(event) {
    $(event.target).transition({
      animation: 'pulse',
      duration: '200ms',
    });
  },
  'click .inbox-icon'() {
    FlowRouter.go('/messages/inbox');
  },
  'click .favorite-icon'() {
    FlowRouter.go('/project/favorites');
  },
  'click .profile-icon'() {
    FlowRouter.go('/user/profile');
  },
  'click .signout-icon'() {
    $('.ui.small.modal').modal('show');
  },
});
Template.logoutModal.onRendered(function() {
  $('.modal').modal({
    transition: 'fade',
    duration: '100',
    onApprove: function() {
      Accounts.logout(function() {
        FlowRouter.go('/');
      });
    },
  });
});
