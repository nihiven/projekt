// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _log } from 'meteor/nihiven:projekt';

import './tasksInfo.html';

// projectList
Template.projectInfo.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('projects.public');
    this.subscribe('tasks.public');

    this.taskInfo = new ReactiveVar();
    this.taskId = new ReactiveVar();
    this.taskId.set(FlowRouter.getParam('taskId'));
  });
});
