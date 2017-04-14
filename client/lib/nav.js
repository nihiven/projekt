import { Template } from 'meteor/templating';

Template.nav.events({
	'click .nav'(event) {
		console.log(event.target);
	},
});