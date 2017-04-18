import { Template } from 'meteor/templating';
import { Projects } from '../../imports/api/collections/projects.js';

import '../../imports/ui/stylesheets/projectList.less';
import '../../imports/ui/projectList.html';

Template.projectList.events({
	'click div .extra .settings'(event) {
		console.log('clicked settings icon');
	},
	'click div .extra .heart'(event) {
		console.log('clicked favorite icon');
    
	},
	'click a.content'(event) {
		console.log('clicked project card');
	},
});

Template.projectList.helpers({
  listAllProjects() {
    return Projects.find({});
  },
	isRegulatory() {
  	return (this.is_regulatory == 'Yes' ? true : false);
  },
  isFavorite() {
  	// TODO: implement
  	return false;
  },
  projectId() {
  	// TODO: remove
  	return this._id;
  }
});
