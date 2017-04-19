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
  this.autorun(() => {
    this.subscribe('projects');
    this.subscribe('favorites', Meteor.userId());
  });
});

Template.projectList.helpers({
  listAllProjects() {
    return Projects.find({});
  },
});


// projectCard
Template.projectCard.onCreated(function() {
  console.log(this);
});

Template.projectCard.events({
  'click div .extra .settings'() {
    console.log('clicked settings icon');
  },
  'click div .extra .heart'() {
    console.log('clicked favorite icon');
    Favorites.insert(this._id);
    console.log(this);
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

    let result = 'heart icon';
    if (count(this._id) === 0) {
      result = 'empty heart icon';
    }

    return {
      class: result,
    };
  },
});
