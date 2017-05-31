// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _log } from 'meteor/nihiven:projekt';

// collections
import { Projects } from '/imports/api/collections/projects.js';
import { Profiles } from '/imports/api/collections/profiles.js';
import { Comments } from '/imports/api/collections/comments.js';
import { Tasks } from '/imports/api/collections/tasks.js';

// templates
import './projects.less';
import './projectInfo.html';

// projectList
Template.projectInfo.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.projectInfo = new ReactiveVar();
    this.projectId = new ReactiveVar();
    this.projectId.set(FlowRouter.getParam('projectId'));

    this.subscribe('projects.public');
    this.subscribe('comments.public', this.projectId.get());
    this.subscribe('favorites.user');
  });
});

Template.projectInfo.helpers({
  details() {
    const instance = Template.instance();
    // TODO: not sure if this goes here or in the onCreated
    instance.projectInfo.set(Projects.findOne({ _id: instance.projectId.get() }));
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
  regulatory() {
    return (this.is_regulatory ? 'Yes' : 'No');
  },
  tasks() {
    const instance = Template.instance();
    const projectId = instance.projectId.get();
    return Tasks.find({ projectId });
  },
});

Template.projectDetails.events({
  'click [class~="pm-name"]'(event) {
    _log('open link to pm message?');
  },
  'click [class~="bo-name"]'(event) {
    _log('open link to bo message?');
  },
  'click [class~="dev-name"]'(event) {
    _log(`open link to dev message ${this._id}?`);
  },
});

Template.projectComments.helpers({
  comments() {
    return Comments.find({});
  },
});

Template.projectComments.events({
  'click [class~="button"]'() {
    const comment = $('[class~="comment-text"]').val();
    Meteor.call('comments.new', this._id, comment);
  },
});


// project details
Template.projectCommentsRow.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('profiles.public');
  });
});
