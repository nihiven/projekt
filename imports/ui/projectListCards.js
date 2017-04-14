import { Template } from 'meteor/templating';
import { Projects } from '../../imports/api/projects.js';

import './projectListCards.html';

Template.projectListCards.helpers({
  listAllProjects() {
    return Projects.find({});
  },
});
