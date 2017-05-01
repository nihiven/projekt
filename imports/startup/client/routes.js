import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// import templates
import '../../ui/mainLayout.html';
import '../../ui/nav.js';
import '../../ui/projectList.js';
import '../../ui/userSettings.js';
import '../../ui/userLogin.js';
import '../../ui/testData.js';

// F L O W R O U T A
FlowRouter.route('/', {
  name: 'Root',
  action() {
    BlazeLayout.render('mainLayout', { nav: 'nav', content: 'dashboard' });
  },
});

// P R O J E C T S
FlowRouter.route('/projects', {
  name: 'Project.root',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectList',
      });
  },
});

FlowRouter.route('/projects/favorites', {
  name: 'Project.favorites',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectFavorites',
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

FlowRouter.route('/user/login', {
  name: 'User.login',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'userLogin',
      });
  },
});

// test
FlowRouter.route('/test/data', {
  name: 'Test.data',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'testData',
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

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
