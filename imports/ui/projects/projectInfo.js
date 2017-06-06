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
import './projectInfo.html';

_x.projectId = new ReactiveVar(false);

// projectList
Template.projectInfo.onCreated(function() {
  // keeps track of subscription readiness
  this.autorun(() => {
    this.projectInfo = new ReactiveVar();

    // TODO: does this get replaced with _x? i think so
    this.projectId = new ReactiveVar();
    this.projectId.set(FlowRouter.getParam('projectId'));
    _x.projectId.set(this.projectId.get());


    this.subscribe('projects.public');
    this.subscribe('comments.public', this.projectId.get());
    this.subscribe('favorites.user');
  });
});

Template.projectInfo.helpers({
  details() {
    const instance = Template.instance();
    // TODO: not sure if this goes here or in the onCreated
    // i say do it as early as possible, right?
    instance.projectInfo.set(Projects.findOne({ _id: instance.projectId.get() }));
    return instance.projectInfo.get();
  },
});

Template.taskDetailCompact.onCreated(function() {
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
Template.projectDetails.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('tasks.public');

    // use a reactive var for... reactivity
    this.projectId = new ReactiveVar();
    this.projectId.set(FlowRouter.getParam('projectId'));
  });
});

Template.projectDetails.helpers({
  regulatory() {
    return (this.is_regulatory ? 'Yes' : 'No');
  },
  tasks() {
    // get this template instance because thats where we store the project id
    const instance = Template.instance();

    // use .get() because projectId is a ReactiveVar
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
  'click [class~="task-add-button"]'() {
    _log('add dummy task');
    Meteor.call('tasks.testData', _x.projectId.get());
  },
});

Template.projectComments.helpers({
  comments() {
    return Comments.find({ projectId: _x.projectId.get(), parentId: 'root' }, { sort: { createdTime: -1}});
  },
});

Template.projectComments.events({
  'click [class~="root-comment-button"]'(event) {
    // prevent form submission behavior
    event.preventDefault();

    // store comment for style points
    const comment = $('[class~="root-comment-text"]').val();
    if (comment !== '') {
      Meteor.call('comments.new', _x.projectId.get(), 'root', comment);
      $('[class~="root-comment-text"]').val('');
    }
  },
});


// project details
Template.projectCommentsRow.onCreated(function() {
  // keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('profiles.public');
    this.subscribe('users.public');
  });
});

Template.projectCommentsRow.helpers({
  isUserComment() {
    // does this comment belong to the current user?
    return (this.userId === Meteor.userId() ? true : false);
  },
  showRemove() {
    // make sure this comment belongs to the user or the user is an admin
    // and the comment hasn't already been removed
    if (this.userId === Meteor.userId() || Roles.adminCheckPasses(Meteor.userId())) {
      return !this.isRemoved;
    }
    return false;
  },
});

Template.projectCommentsRow.events({
  'click [class~="comment-remove"]'() {

    // TODO:  modal?
    Meteor.call('comments.remove', this._id);

    // don't send the click event up the DOM
    event.stopPropagation();
  },
  'click [class~="comment-delete"]'() {

    // TODO:  modal?
    Meteor.call('comments.delete', this._id);

    // don't send the click event up the DOM
    event.stopPropagation();
  },
  'click [class~="comment-reply"]'(event) {
    // stop the form submission and don't send the click event up the DOM
    event.preventDefault();
    event.stopPropagation();

    // I don't know if this is best...
    $(event.target.parentNode.nextElementSibling).toggle();

    // set focus to textbox
  },
  'click [class~="comment-button"]'(event) {
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
