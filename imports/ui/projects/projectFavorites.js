// core components
import { Template } from 'meteor/templating';

// collections
import { Projects } from '/imports/api/collections/projects.js';
import { Favorites } from '/imports/api/collections/favorites.js';

// templates
import './projects.less';
import './projectList.html';


// projectList
Template.projectFavorites.onCreated(function onCreated() {
  this.autorun(() => {
    this.state = new ReactiveDict();

    this.subscribe('projects.public');
    this.subscribe('favorites.user');
  });
});

Template.projectFavorites.helpers({
  listFavoriteProjects() {
    const favs = Favorites.find({ });
    const projIds = favs.map((doc) => { return doc.projectId; });
    const projs = Projects.find({ _id: { $in: projIds } });
    return projs;
  },
});


// projectCard
Template.projectFavorites.onCreated(() => {
  // init semantic objects here
});

Template.projectFavorites.events({ });

Template.projectFavoriteCard.helpers({
  isRegulatory() {
    return (this.is_regulatory === 'Yes');
  },
  attributes() {
    const count = (projectId) => {
      return Favorites.find({ projectId }).count();
    };

    let result = 'red heart icon';
    if (count(this._id) === 0) {
      result = 'empty heart icon';
    }

    return { class: result };
  },
});
