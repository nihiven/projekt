import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';

// templates
import './nav.less';
import './nav.html';

Template.nav.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.currentNav = new ReactiveVar();
  });
});


Template.nav.onRendered(function() {
  // make the current menu item active
  // const path = FlowRouter.current().path;
  // $(`a[href="${path}"]`).addClass('active');
});

Template.nav.events({
  'click .menu a.item'(event) {
    // highlight menu item when clicked
    // $('.menu a.active').removeClass('active');
    // $(event.target).addClass('active');
  },
});

Template.nav.helpers({
  'isActive'(path) {
    console.log(path);
    console.log(FlowRouter.current().path);
    const instance = Template.instance();
    if (FlowRouter.current().path === path) {
      return 'active';
    } else {
      return '';
    }
  },
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
