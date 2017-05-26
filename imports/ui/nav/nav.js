import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';

// templates
import './nav.less';
import './nav.html';

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
  'click .admin-icon'() {
    FlowRouter.go('/admin/settings');
  },
  'click .signout-icon'() {
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
