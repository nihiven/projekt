// core components
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

// templates
import './projects.less';
import './projectInfo.html';

// projectList
Template.projectInfo.onCreated(function() {
  this.autorun(() => { // keeps track of subscription readiness
    this.subscribe('projects');
    this.subscribe('favorites.user');

    this.projectInfo = new ReactiveVar();
    Meteor.call('projects.info', FlowRouter.getParam('projectId'), (error, result) => {
      this.projectInfo.set(result);
    });
  });
});

Template.projectInfo.helpers({
  'details'() {
    const instance = Template.instance();
    return instance.projectInfo.get();
  },
});

Template.projectDetails.helpers({
  'regulatory'() {
    return (this.is_regulatory ? 'Yes' : 'No');
  },
});

Template.projectDetails.events({
  'click [class~="pm-name"]'(event) {
    console.log('open link to pm message?');
  },
  'click [class~="bo-name"]'(event) {
    console.log('open link to bo message?');
  },
  'click [class~="dev-name"]'(event) {
    console.log(`open link to dev message ${this._id}?`);
  },
});
