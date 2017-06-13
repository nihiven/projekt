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
import '/imports/ui/projekt.less'; // global styles
import './projects.less';
import './projectInfo_Tabs.html';
import './projectInfo.html';

// i use these to share info between templates
_x.projectId = new ReactiveVar(false);
_x.projectInfo = new ReactiveVar();

// projectList
Template.projectInfo.onCreated(function onCreatedProjectInfo() {
  // keeps track of subscription readiness
  this.autorun(() => {
    // set the global variables
    _x.projectId.set(FlowRouter.getParam('projectId'));
    _x.projectInfo.set(Projects.findOne({ _id: _x.projectId.get() }));

    // subscriptions
    this.subscribe('projects.public');
    this.subscribe('comments.public', _x.projectId.get());
    this.subscribe('comments.user', _x.projectId.get()); // this gives us access to our ghost comments
    this.subscribe('favorites.user');
  });
});

Template.projectInfo.helpers({
  details() {
    return _x.projectInfo.get();
  },
});

Template.taskDetailCompact.onCreated(function onCreatedTaskDetailCompact() {
  // keeps track of subscription readiness
  this.autorun(() => {
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
Template.projectDetails.onCreated(function onCreatedProjectDetails() {
  this.autorun(() => { // keeps track of subscription readiness
    // TODO: validate data contenxt
    this.subscribe('tasks.public');
  });
});

Template.projectDetails.onRendered(() => {
  $('.menu .item').tab();
});

Template.projectDetails.helpers({
  regulatory() {
    return (this.is_regulatory ? 'Yes' : 'No');
  },
  tasks() {
    return Tasks.find({ projectId: _x.projectId.get() });
  },
});

Template.projectDetails.events({
  'click [class~="pm-name"]': function clickPmName() {
    _log('open link to pm message?');
  },
  'click [class~="bo-name"]': function clickBoName() {
    _log('open link to bo message?');
  },
  'click [class~="dev-name"]': function clickDevName() {
    _log(`open link to dev message ${this._id}?`);
  },
  'click [class~="task-add-button"]': function clickTaskAddButton() {
    _log('add dummy task');
    Meteor.call('test.tasks.load', _x.projectId.get());
  },
});

Template.projectComments.helpers({
  comments() {
    return Comments.find({
      projectId: _x.projectId.get(),
      parentId: 'root',
    }, { sort: { createdTime: -1 }});
  },
});

Template.projectComments.events({
  'click [class~="root-comment-toggle"]': function clickRootCommentToggle() {
    $('[class~="root-comment-form"]').toggle();
  },
  'click [class~="root-comment-button"]': function clickRootCommentButton(event) {
    // prevent form submission behavior
    event.preventDefault();

    // store comment for style points
    const comment = $('[class~="root-comment-text"]').val();
    if (comment !== '') {
      Meteor.call('comments.new', _x.projectId.get(), 'root', comment);
      $('[class~="root-comment-text"]').val('');
      $('[class~="root-comment-form"]').hide();
    }
  },
  'keypress [class~="root-comment-text"]': function keypressRootCommentText(event) {
    // TODO: refactor
    if (event.keyCode === 13) {
      // prevent form submission behavior
      event.preventDefault();

      // store comment for style points
      const comment = $('[class~="root-comment-text"]').val();
      if (comment !== '') {
        Meteor.call('comments.new', _x.projectId.get(), 'root', comment);
        $('[class~="root-comment-text"]').val('');
      }
    }
  },
});

// project details
Template.projectCommentsRow.onCreated(function onCreatedprojectCommentsRow() {
  // keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('profiles.public');
    this.subscribe('users.public');
  });
});

Template.projectCommentsRow.helpers({
  isUserComment() {
    // does this comment belong to the current user?
    return (this.userId === Meteor.userId());
  },
  showRemove() {
    // make sure this comment belongs to the user or the user is an admin
    // and the comment hasn't already been removed
    if (this.userId === Meteor.userId() || Roles.adminCheckPasses(Meteor.userId())) {
      return !this.isRemoved;
    }
    return false;
  },
  ghostComment() {
    if (this.userId === Meteor.userId() || Roles.adminCheckPasses(Meteor.userId())) {
      return this.isRemoved;
    }
    return false;
  },
});

Template.projectCommentsRow.events({
  'click [class~="comment-remove"]': function clickCommentRemove() {
    // don't send the click event up the DOM
    event.stopPropagation();

    // TODO:  modal?
    Meteor.call('comments.remove', this._id);
  },
  'click [class~="comment-delete"]': function clickCommentDelete() {
    // don't send the click event up the DOM
    event.stopPropagation();

    // TODO:  modal?
    Meteor.call('comments.delete', this._id);
  },
  'click [class~="comment-reply"]': function clickCommentReply(event) {
    // stop the form submission and don't send the click event up the DOM
    event.preventDefault();
    event.stopPropagation();

    // this can't be right, it relies on the structure of the html
    // we want some kind of class search for comment-container
    // BUG: after posting a comment you can no longer toggle the parent textbox
    $(event.target.parentNode.nextElementSibling).toggle();

    // set focus to textbox
    _log($(event.target.parentNode.nextElementSibling.childNodes));
  },
  'click [class~="comment-button"]': function clickCommentButton(event) {
    // stop the form submission and don't send the click event up the DOM
    event.preventDefault();
    event.stopPropagation();

    const comment = $(event.target.parentNode.firstElementChild).val();

    // add a new comment if there's anything in the textbox
    if (comment !== '') {
      Meteor.call('comments.new', _x.projectId.get(), this._id, comment);
      $(event.target.parentNode.firstElementChild).val('');
      $(event.target.parentNode).toggle();
    }
  },
});
