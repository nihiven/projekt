// TODO: ? mxab:simple-schema-jsdoc Generate jsdoc from your schemas.
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { projekt, defaults } from 'meteor/nihiven:projekt';

// imports from npm package
import SimpleSchema from 'simpl-schema';

// exports
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function() { // data for self consumption
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
    type: Date,
    optional: true,
    label() { return 'Office Location'; },
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

Meteor.methods({
  'tasks.upsert': function(data) {
    check(data, Match.Any);

    // user must be logged in
    if (!Meteor.userId()) {
      projekt.err('notLoggedIn');
    }

    // TODO: make sure this user owns the profile
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
      createdTime: Date.Now(),
      updatedId: this.userId,
      updatedTime: Date.Now(),
      title: 'Just a Task',
      description: 'This is how we keep track of things.',
      dueDate: Date.Now(),
      assignments: ['S2fA4yHdD4PGdoHFcl'],
    });

    return true;
  },
  'tasks.reset'() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Tasks.remove({});
    } else {
      projekt.err('notAuthorized');
    }
  },
});
