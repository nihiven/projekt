import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

// collections
import { Projects } from '/imports/api/collections/projects.js';

// templates
import './projects.less';
import './projectListNew.html';

// projectList
Template.projectListNew.onCreated(function onCreatedProjectList() {
  // using autorun automatically keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('projects.public');
    this.subscribe('favorites.user');
  });
});

Template.mainProjectListing.helpers({
  listAllProjects(phase = 'active') {
    return Projects.find({ phase });
  },
});
