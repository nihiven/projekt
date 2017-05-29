import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// site wide templates
import '/imports/ui/mainLayout.html';
import '/imports/ui/nav/nav.js';

// sub components
import '/imports/ui/dashboard/dashboard.js';
import '/imports/ui/projects/projectList.js';
import '/imports/ui/projects/projectInfo.js';
import '/imports/ui/users/userProfile.js';
import '/imports/ui/users/userLogin.js';
import '/imports/ui/users/userRoles.js';
import '/imports/ui/reports/reportsList.js';
import '/imports/ui/tasks/tasksList.js';
import '/imports/ui/admin/adminSettings.js';
import '/imports/ui/tasks/tasksInfo.js';

// dev only
import '/imports/ui/admin/testData.js';

// F L O W R O U T A
FlowRouter.route('/', {
  name: 'root',
  action() {
    BlazeLayout.render('mainLayout', {
      nav: 'nav',
      content: 'dashboard',
    });
  },
});

FlowRouter.route('/projects', {
  name: 'projects',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectList',
      });
  },
});

FlowRouter.route('/projects/:projectId', {
  name: 'projects',
  action(params) {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectInfo',
      });
  },
});

FlowRouter.route('/projects/favorites', {
  name: 'favorites',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'projectFavorites',
      });
  },
});

// U S E R
FlowRouter.route('/user/profile', {
  name: 'user',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'userProfile',
      });
  },
});

FlowRouter.route('/user/login', {
  name: 'user',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'userLogin',
      });
  },
});

FlowRouter.route('/users', {
  name: 'users',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'userRoleMgmt',
      });
  },
});

// reports
FlowRouter.route('/reports', {
  name: 'reports',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'reportsList',
      });
  },
});

// tasks
FlowRouter.route('/tasks', {
  name: 'tasks',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'tasksList',
      });
  },
});

// tasks
FlowRouter.route('/tasks/:taskId', {
  name: 'tasks',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'taskInfo',
      });
  },
});

// test
FlowRouter.route('/test/data', {
  name: 'test',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'testData',
      });
  },
});

FlowRouter.route('/admin/settings', {
  name: 'admin',
  action() {
    BlazeLayout.render(
      'mainLayout', {
        nav: 'nav',
        content: 'adminSettings',
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
