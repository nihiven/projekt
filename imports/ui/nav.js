import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../../imports/ui/nav.html';

Template.nav.onRendered(function() {
	// make the current menu item active
	const path = FlowRouter.current().path;
	$('a[href="'+ path + '"]').addClass('active');
});

Template.nav.events({
	'click .menu a.item'(event) {
		// highlight menu item when clicked
		$('.menu a.active').removeClass('active');
		$(event.target).addClass('active');
	},
});


Template.loggedInMenu.onRendered(function() {
	$('.ui.dropdown').dropdown();
});
