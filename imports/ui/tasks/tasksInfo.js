// core
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// templates
import './tasksInfo.html';

// projectList
Template.projectInfo.onCreated(function onCreatedProjectInfo() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('projects.public');
    this.subscribe('tasks.public');

    this.taskInfo = new ReactiveVar();
    this.taskId = new ReactiveVar();
    this.taskId.set(FlowRouter.getParam('taskId'));
  });
});
