// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// collections
import { Projects } from '/imports/api/collections/projects.js';
// import { Favorites } from '/imports/api/collections/favorites.js';

// templates
import './projects.less';
import './projectInfo.html';

// projectList
Template.projectInfo.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('projects');
    this.subscribe('favorites.user');
  });
});

Template.projectInfo.helpers({
  'details'() {
    return Projects.findOne({ _id: FlowRouter.getParam('projectId') });
  },
});
