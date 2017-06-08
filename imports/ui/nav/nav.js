import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// templates
import './nav.less';
import './nav.html';

// TODO: user pathfor in the links below
Template.loggedInMenu.events({
  'click [class$="-icon"]': function (event) {
    $(event.target).transition({
      animation: 'pulse',
      duration: '200ms',
    });
  },
  'click .inbox-icon': function () {
    FlowRouter.go('/messages/inbox');
  },
  'click .favorite-icon': function () {
    FlowRouter.go('/project/favorites');
  },
  'click .profile-icon': function () {
    FlowRouter.go('/user/profile');
  },
  'click .admin-icon': function () {
    FlowRouter.go('/admin/settings');
  },
  'click .signout-icon': function () {
    $('.user-logout-modal').modal('show');
  },
});
Template.userLogoutModal.onRendered(() => {
  $('.user-logout-modal').modal({
    transition: 'fade',
    duration: '100',
    onApprove() {
      Accounts.logout(() => {
        FlowRouter.redirect('/');
      });
    },
  });
});
