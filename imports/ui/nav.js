/* eslint-env jquery */

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// templates
import '../../imports/ui/stylesheets/nav.less';
import '../../imports/ui/nav.html';

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

Template.loggedInMenu.onRendered(function() {
  $('.ui.dropdown').dropdown();
});

Template.loggedInMenu.events({
  'click [class$="-icon"]'(event) {
    $(event.target).transition({
      animation: 'pulse',
      duration: '250ms',
    });
  },
  'click .inbox-icon'() {
    FlowRouter.go('/messages/inbox');
  },
  'click .settings-icon'() {
    FlowRouter.go('/project/favorites');
  },
  'click .settings-icon'() {
    FlowRouter.go('/user/settings');
  },
  'click .signout-icon'() {
    $('.ui.basic.modal').modal('show');
  },
});
Template.logoutModal.onRendered(function() {
  $('.ui.modal').modal({
    onApprove : function() {
      Meteor.logout(function() {
        console.log('logged out');
      });
    },
  });
});
