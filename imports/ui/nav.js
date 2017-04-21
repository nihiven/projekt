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
    $(".menu a.active").removeClass('active');
    $(event.target).addClass('active');
  },
});

Template.loggedInMenu.onRendered(function() {
  $('.ui.dropdown').dropdown();
});

Template.loggedInMenu.events({
  'click [name$="-icon"]'(event) {
    console.log(event.target);
    $(event.target).transition({
      animation: 'pulse',
      duration: '250ms',
    });
  },
});
