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

Template.projectDetails.helpers({
  'regulatory'() {
    if (this.is_regulatory) {
      return 'Yes';
    } else {
      return 'No';
    }
  },
});

Template.projectDetails.events({
  'click [class~="pm-name"]'(event) {
    console.log('open link to pm message?');
  },
  'click [class~="bo-name"]'(event) {
    console.log('open link to bo message?');
  },
  'click [class~="dev-name"]'(event) {
    console.log(`open link to dev message ${this._id}?`);
  },
});
