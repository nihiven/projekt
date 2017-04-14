import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


// import templates
import '../../ui/mainLayout.html';
import '../../ui/nav.js';
import '../../ui/projectListing.js';
import '../../ui/projectRow.js';
import '../../ui/projectListCards.js';


// F L O W R O U T A
FlowRouter.route('/', {
  action: function() {
  	name: "dashboard",
    BlazeLayout.render(
    	"mainLayout", { 
    		nav: "nav",
    		content: "dashboard"
    	});
  }
});

FlowRouter.route('/projects', {
  action: function() {
  	name: "projects",
    BlazeLayout.render(
    	"mainLayout", { 
    		nav: "nav",
    		content: "projectListing"
    	});
  }
});

FlowRouter.route('/projects/:_id', {
  action: function() {
    name: "Projects.list",
    BlazeLayout.render(
      "mainLayout", { 
        nav: "nav",
        content: "projectList"
      });
  }
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('mainLayout', {
      nav: "nav",
      content: "pageNotFound"
    });
  }
};