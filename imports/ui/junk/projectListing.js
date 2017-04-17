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
	      description: "A great project that will bring great value to our company. There are many people sponsoring this project and it has a lot of funding.",
	      status: 'purple',
	      project_manager: 'jb',
	      dev_lead: 'JohnC',
	      business_owner: 'ccbh',
	      is_regulatory: 'No',
	      createdAt: new Date(),
	    });
	},
});