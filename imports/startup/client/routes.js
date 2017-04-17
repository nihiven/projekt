import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


// import templates
import '../../ui/mainLayout.html';
import '../../ui/nav.js';
import '../../ui/projectList.js';
import '../../ui/userSettings.js';


// F L O W R O U T A
FlowRouter.route('/', {
  action: function() {
  	name: "Home",
    BlazeLayout.render(
    	"mainLayout", { 
    		nav: "nav",
    		content: "dashboard"
    	});
  }
});

// P R O J E C T S
FlowRouter.route('/projects', {
  action: function() {
  	name: "Project.dashboard",
    BlazeLayout.render(
    	"mainLayout", { 
    		nav: "nav",
    		content: "projectList"
    	});
  }
});

FlowRouter.route('/projects/:_id', {
  action: function() {
    name: "Project.list",
    BlazeLayout.render(
      "mainLayout", { 
        nav: "nav",
        content: "projectList"
      });
  }
});


// U S E R 
FlowRouter.route('/user/settings', {
  action: function() {
    name: "User.settings",
    BlazeLayout.render(
      "mainLayout", { 
        nav: "nav",
        content: "userSettings"
      });
  }
});



// not found
FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('mainLayout', {
      nav: "nav",
      content: "pageNotFound"
    });
  }
};