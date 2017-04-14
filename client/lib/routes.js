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

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render('mainLayout', {
      nav: "nav",
      content: "pageNotFound"
    });
  }
};
