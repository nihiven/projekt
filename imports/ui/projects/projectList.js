import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

// collections
import { Projects } from '/imports/api/collections/projects.js';
import { Favorites } from '/imports/api/collections/favorites.js';

// templates
import './projects.less';
import './projectList.html';

_x.projectList = new ReactiveVar();

// projectList
Template.projectList.onCreated(function onCreatedProjectList() {
  // using autorun automatically keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('projects.public');
    this.subscribe('favorites.user');

    _x.projectList.set(Projects.find({}));
  });
});

Template.projectList.helpers({
  listAllProjects() {
    return _x.projectList.get();
  },
});

Template.projectCard.onCreated(function onCreatedProjectCard() {
  this.autorun(() => {
    this.subscribe('tasks.public');
  });
});

Template.projectCard.events({
  'click [class~="empty heart"]': function clickEmptyHeart(event) {
    $(event.target).transition('jiggle');
  },
  'click [class~="favorite-icon"]': function clickFavoriteIcon() {
    Meteor.call('favorites.toggle', this._id);
  },
  'click [class~="project-clickable"]': function clickProjectClickable() {
    FlowRouter.go(`/projects/${this._id}`);
  },
});

Template.projectCard.helpers({
  isRegulatory() {
    return this.is_regulatory;
  },
  isFavorite() {
    const count = Favorites.find({ projectId: this._id, userId: Meteor.userId() }).count();
    return (count !== 0);
  },
});
