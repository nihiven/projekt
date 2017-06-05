import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { defaults, _err } from 'meteor/nihiven:projekt';

// collections
import { Projects } from './projects.js';
import { Profiles } from './profiles.js';

// imports from npm package
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import faker from 'faker';

// exports
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks.public', function() { // data for self consumption
    return Tasks.find({ });
  });
}

// Deny all client-side updates
Tasks.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Tasks.schema = new SimpleSchema({
  // for type, use [String] to indicate an array
  projectId: {
    type: String,
    optional: false,
    label() { return 'Linked Project ID'; },
  },
  createdId: {
    type: String,
    optional: true,
    label() { return 'User that created the task.'; },
  },
  createdTime: {
    type: Date,
    optional: true,
    label() { return 'Time the task was created.'; },
  },
  updatedId: {
    type: String,
    optional: true,
    label() { return 'Last user to update the task.'; },
  },
  updatedTime: {
    type: Date,
    optional: true,
    label() { return 'Last time the task was updated.'; },
  },
  title: {
    type: String,
    optional: true,
    label() { return 'Task Title'; },
  },
  description: {
    type: String,
    optional: true,
    label() { return 'Task Description'; },
  },
  dueDate: {
    type: String,
    optional: true,
    label() { return 'Date the project is due.'; },
  },
  assignments: { // define this as an array
    type: Array,
    optional: true,
    label() { return 'Users assigned to the task.'; },
  },
  'assignments.$': { type: String },
});

// all calls to Profiles.insert(), update(), upsert(),
// will be automatically be checked against the schema
Tasks.attachSchema(Tasks.schema);

Tasks.helpers({
  project() {
    return Projects.findOne({ _id: this.projectId });
  },
  createdBy() {
    return Profiles.findOne({ userId: this.createdId });
  },
  updatedBy() {
    return Profiles.findOne({ userId: this.updatedId });
  },
  assignedTo() {
    var users = [];
    users.push('test');
    return users;
  },
  dueDateString() {
    if (this.dueDate !== undefined) {
      return moment(this.dueDate).format(defaults.dateFormat);
    } else {
      return '';
    }
  },
  aLongLongTimeAgo() {
    if (this.createdTime !== undefined) {
      return moment(this.createdTime).fromNow();
    } else {
      return '';
    }
  },
});

Meteor.methods({
  'tasks.upsert': function(data) {
    check(data, Match.Any);

    // user must be logged in
    if (!Meteor.userId()) {
      _err('notLoggedIn');
    }

    // TODO: make sure this user owns the task
    // OR is assigned to the task
    // OR has elevated priviliges

    Tasks.update(
      { _id: data._id },
      {
        $set: {
          updatedBy: this.userId,
          name: data.displayName,
          email: data.publicEmail,
          officeLocation: data.officeLocation,
          officePhone: data.officePhone,
        },
      },
      { upsert: true, multi: false });

    return true;
  },
  'tasks.newTask'(user) {
    check(user, Object);

    // insert default values
    Tasks.insert({
      projectId: 'project19',
      createdId: this.userId,
      createdTime: Date.now(),
      updatedId: this.userId,
      updatedTime: Date.now(),
      title: 'Just a Task',
      description: 'This is how we keep track of things.',
      dueDate: '20151231',
      assignments: [this.userId],
    });

    return true;
  },
  'tasks.reset'() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Tasks.remove({});
    } else {
      _err('notAuthorized');
    }
  },
  'tasks.testData'(projectId = 'fake') {
    check(projectId, String);

    Tasks.insert({
      projectId: projectId,
      createdId: this.userId,
      createdTime: Date.now(),
      updatedId: this.userId,
      updatedTime: Date.now(),
      title: faker.fake('{{company.bs}}'),
      description: faker.fake('{{hacker.phrase}}'),
      dueDate: '20170518',
      assignments: [this.userId],
    });
  },
});
