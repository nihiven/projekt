import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


// import templates
import '../../ui/mainLayout.html';
import '../../ui/nav.js';
import '../../ui/projectList.js';
import '../../ui/userSettings.js';


// F L O W R O U T A
FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('mainLayout', { nav: 'nav', content: 'dashboard' });
  },
});

// P R O J E C T S
FlowRouter.route('/projects', {
  name: 'Project.dashboard',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectList',
      });
  },
});

FlowRouter.route('/projects/:_id', {
  name: 'Project.list',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectList',
      });
  },
});


// U S E R
FlowRouter.route('/user/settings', {
  name: 'User.settings',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'userSettings',
      });
  },
});


// not found
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', {
      nav: 'nav',
      content: 'pageNotFound',
    });
  },
};
