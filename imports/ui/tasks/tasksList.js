import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// collections
import { Profiles } from '/imports/api/collections/profiles.js';
import { Projects } from '/imports/api/collections/projects.js';
import { Tasks } from '/imports/api/collections/tasks.js';


import './tasksList.html';

Template.tasksList.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('tasks.public');
  });
});

Template.tasksList.helpers({
  tasks() {
    return Tasks.find({});
  },
});

Template.taskDetail.onCreated(function() {
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
