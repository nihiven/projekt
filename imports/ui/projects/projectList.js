// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
    this.subscribe('projects');
    this.subscribe('favorites.user');
  });
});

Template.projectList.helpers({
  listAllProjects() {
    return Projects.find({});
  },
  favoriteProjects() {
    const favs = Favorites.find({ userId: Meteor.userId() });
    const projIds = favs.map(function(doc) { return doc.projectId; });
    const projs = Projects.find({ _id: { $in: projIds } });
    return projs;
  },
});

Template.projectCard.events({
  'click [class~="empty heart"]'(event) {
    $(event.target).transition('jiggle');
  },
  'click [class~="favorite-icon"]'() {
    Meteor.call('favorites.toggle', this._id);
  },
  'click [class~="project-body"]'() {
    console.log('clicked project card');
    FlowRouter.go(`/projects/${this._id}`);
  },
});

Template.projectCard.helpers({
  isRegulatory() {
    return this.is_regulatory;
  },
  attributes() {
    let result = 'red heart icon';
    if (Favorites.find({ projectId: this._id }).count() === 0) {
      result = 'empty heart icon';
    }
    return { class: result };
  },
});
