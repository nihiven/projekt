import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// templates
import './nav.less';
import './nav.html';

// TODO: user pathfor in the links below
Template.loggedInMenu.events({
  'click [class$="-icon"]': function loggedInMenuclickIcon(event) {
    $(event.target).transition({
      animation: 'pulse',
      duration: '200ms',
    });
  },
  'click .inbox-icon': function loggedInMenuClickInbox() {
    FlowRouter.go('/messages/inbox');
  },
  'click .favorite-icon': function loggedInMenuClickFavorite() {
    FlowRouter.go('/project/favorites');
  },
  'click .profile-icon': function loggedInMenuClickProfile() {
    FlowRouter.go('/user/profile');
  },
  'click .admin-icon': function loggedInMenuClickAdmin() {
    FlowRouter.go('/admin/settings');
  },
  'click .signout-icon': function loggedInMenuClickSignout() {
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
