import { Template } from 'meteor/templating';
import { Projects } from '../../imports/api/projects.js';

import './projectListing.html';

Template.projectListing.helpers({
  listAllProjects() {
    return Projects.find({});
  },
});

Template.projectListing.events({
	'click th'() {
		console.log(this);
	
	    // Insert a task into the collection
	    Projects.insert({
	      name: 'test',
	      status: 'purple',
	      project_manager: 'jb',
	      dev_lead: 'JohnC',
	      business_owner: 'ccbh',
	      regulatory: 'No',
	      createdAt: new Date(),
	    });
	},
});