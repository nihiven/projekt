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

// projectList
Template.projectList.onCreated(function() {
  // using autorun automatically keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('projects.public');
    this.subscribe('favorites.user');
    this.projectList = new ReactiveVar();
  });
});

Template.projectList.helpers({
  'listAllProjects'() {
    const instance = Template.instance();
    instance.projectList.set(Projects.find({ }));
    return instance.projectList.get();
  },
});

Template.projectCard.onCreated(function() {
  this.autorun(() => {
    this.subscribe('tasks.public');
  });
});


Template.projectCard.events({
  'click [class~="empty heart"]'(event) {
    $(event.target).transition('jiggle');
  },
  'click [class~="favorite-icon"]'() {
    Meteor.call('favorites.toggle', this._id);
  },
  'click [class~="project-body"]'() {
    FlowRouter.go(`/projects/${this._id}`);
  },
});

Template.projectCard.helpers({
  isRegulatory() {
    return this.is_regulatory;
  },
  isFavorite() {
    if (Favorites.find({ projectId: this._id }).count() === 0) {
      return false;
    } else {
      return true;
    }
  },
});
