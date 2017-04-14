import { Template } from 'meteor/templating';
import { Projects } from '../../imports/api/projects.js';

import './projectListCards.html';

Template.projectList.helpers({
  listAllProjects() {
    return Projects.find({});
  },
	isRegulatory() {
  	return (this.is_regulatory == 'Yes' ? 'Regulatory' : 'Discretionary');
  },
  projectId() {
  	return this._id.val();
  }
});
