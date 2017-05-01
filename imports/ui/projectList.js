/* eslint-env jquery */

// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// collections
import { Projects } from '../../imports/api/collections/projects.js';
import { Favorites } from '../../imports/api/collections/favorites.js';

// templates
import '../../imports/ui/stylesheets/projectList.less';
import '../../imports/ui/projectList.html';


// projectList
Template.projectList.onCreated(function() {
  // using autorun automatically keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('projects');
    this.subscribe('favorites', Meteor.userId());
  });
});

Template.projectList.helpers({
  listAllProjects() {
    return Projects.find({});
  },
  favoriteProjects() {
    const favs = Favorites.find({ });
    const projIds = favs.map(function(doc) { return doc.projectId; });
    const projs = Projects.find({ _id: { $in: projIds } });
    return projs;
  },
});


// projectCard
Template.projectCard.onCreated(function() {
  // init semantic objects here
});

Template.projectCard.events({
  'click div .extra .settings'() {
    $(event.target).transition('pulse');
  },
  'click div .extra .heart'(event) {
    const count = function(projectId) {
      return Favorites.find({ projectId }).count();
    };

    // TODO: does there need to be something more here?
    // only checking for empty, maybe it's enough
    if (count(this._id) === 0) {
      $(event.target).transition('jiggle');
      Meteor.call('favorites.insert', this._id);
    } else {
      Meteor.call('favorites.remove', this._id);
    }
  },
  'click a.content'() {
    console.log('clicked project card');
  },
});

Template.projectCard.helpers({
  isRegulatory() {
    return (this.is_regulatory === 'Yes');
  },
  attributes() {
    const count = function(projectId) {
      return Favorites.find({ projectId }).count();
    };

    let result = 'red heart icon';
    if (count(this._id) === 0) {
      result = 'empty heart icon';
    }

    return { class: result };
  },
});
