// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// collections
import { Projects } from '/imports/api/collections/projects.js';
import { Profiles } from '/imports/api/collections/profiles.js';
import { Tasks } from '/imports/api/collections/tasks.js';

// templates
import './projects.less';
import './projectInfo.html';

// projectList
Template.projectInfo.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('projects.public');
    this.subscribe('favorites.user');
    this.projectInfo = new ReactiveVar();
  });
});

Template.projectInfo.helpers({
  'details'() {
    const instance = Template.instance();
    const projectId = FlowRouter.getParam('projectId');
    instance.projectInfo.set(Projects.findOne({ _id: projectId }));
    return instance.projectInfo.get();
  },
});

Template.taskDetailCompact.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('profiles.public');
  });
});

Template.taskDetailCompact.helpers({
  creatorProfile() {
    return Profiles.findOne({ userId: this.createdId });
  },
  updaterProfile() {
    return Profiles.findOne({ userId: this.updatedId });
  },
  project() {
    return this.project();
  },
  assignedTo() {
    return this.assignedTo();
  },
});

// project details
Template.projectDetails.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('tasks.public');
    this.projectId = new ReactiveVar();
    this.projectId.set(FlowRouter.getParam('projectId'));
  });
});

Template.projectDetails.helpers({
  'regulatory'() {
    return (this.is_regulatory ? 'Yes' : 'No');
  },
  tasks() {
    const instance = Template.instance();
    const projectId = instance.projectId.get();
    return Tasks.find({ projectId });
  },
  projectFeed() {

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
