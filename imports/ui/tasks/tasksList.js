// core
import { Template } from 'meteor/templating';

// collections
import { Profiles } from '/imports/api/collections/profiles.js';
import { Tasks } from '/imports/api/collections/tasks.js';

// templates
import './tasksList.html';

Template.tasksList.onCreated(function onCreatedTasksList() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('tasks.public');
  });
});

Template.tasksList.helpers({
  tasks() {
    return Tasks.find({});
  },
});

Template.taskDetail.onCreated(function onCreatedTaskDetail() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('profiles.public');
    this.subscribe('projects.public');
  });
});

Template.taskDetail.helpers({
  creatorProfile() {
    return Profiles.findOne({ userId: this.createdId });
  },
  updaterProfile() {
    return Profiles.findOne({ userId: this.updatedId });
  },
  project() {
    return this.project();
  },
});

Template.taskDetail.events({
  'click [class~="tasks-clickable"]': function clickTaskDetail() {
    FlowRouter.go(`/tasks/${this._id}`);
  },
});
