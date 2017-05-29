import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _err } from 'meteor/nihiven:projekt';

// collections
import { Projects } from './projects.js';
import { Profiles } from './profiles.js';
import { Tasks } from './tasks.js';

// imports from npm package
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

// exports
export const Feed = new Mongo.Collection('feed');

if (Meteor.isServer) {
  Meteor.publish('feed.public', function() { // data for self consumption
    return Feed.find({ });
  });
}

// Deny all client-side updates
Feed.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Feed.schema = new SimpleSchema({
  // for type, use [String] to indicate an array
  projectId: {
    type: String,
    optional: false,
    label() { return 'Linked Project ID'; },
  },
  createdId: {
    type: String,
    optional: true,
    label() { return 'User that created the event.'; },
  },
  createdTime: {
    blackbox: true,
    type: Object,
    optional: true,
    label() { return 'Time the event was created.'; },
  },
  eventType: {
    type: String,
    optional: true,
    label() { return 'The type of project event.'; },
  },
  eventVerb: {
    type: String,
    optional: true,
    label() { return 'The general verb that describes the event.'; },
  },
  targetId: {
    type: String,
    optional: true,
    label() { return 'Object _id of the target of the event, based on type.'; },
  },
  description: {
    type: String,
    optional: true,
    label() { return 'Description of the event.'; },
  },
});

Feed.attachSchema(Feed.schema);

Feed.helpers({
  project() {
    return Projects.findOne({ _id: this.projectId });
  },
  createdBy() {
    return Profiles.findOne({ userId: this.createdId });
  },
  target() { // returns collection object for specified type

    if (this.eventType == 'task') {
      return Tasks.findOne({ _id: this.targetId });
    }

    if (this.eventType == 'user') {
      return Profiles.findOne({ userId: this.targetId });
    }

    if (this.eventType == 'role') {
      return Profiles.findOne({ userId: this.targetId });
    }

  },
  aLongLongTimeAgo() {
    return moment(this.createdTime).fromNow();
  },
});

Meteor.methods({
  'feed.new'() {
    // i wasnt going to hardcode this, but this module will never be reused

    check(user, Object);

    // insert default values
    Feed.insert({
      projectId: 'project19',
      createdId: this.userId,
      createdTime: moment(),
      eventType: 'newTask',
      targetId: '2',
      action: '??',
    });

    return true;
  },
  'feed.reset'() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Feed.remove({});
    } else {
      _err('notAuthorized');
    }
  },
  'feed.testData'() {
    Feed.insert({
      projectId: 'project19',
      createdId: this.userId,
      createdTime: moment(),
      updatedId: this.userId,
      updatedTime: moment(),
      title: 'Just a Task',
      description: 'This is how we keep track of things.',
      dueDate: moment('20170518'),
      assignments: [this.userId],
    });
    Feed.insert({
      projectId: 'project19',
      createdId: this.userId,
      createdTime: moment(),
      updatedId: this.userId,
      updatedTime: moment(),
      title: 'THIS IS Just a Task',
      description: 'This is how we keep track of things.',
      dueDate: moment(),
      assignments: [this.userId],
    });
    Feed.insert({
      projectId: 'project22',
      createdId: this.userId,
      createdTime: moment(),
      updatedId: this.userId,
      updatedTime: moment(),
      title: 'Against the LAW',
      description: 'This is how we keep track of things.',
      dueDate: moment(),
      assignments: [this.userId],
    });
  },
});
