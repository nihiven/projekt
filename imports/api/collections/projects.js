import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { _err } from 'meteor/nihiven:projekt';

// imports from npm package
import SimpleSchema from 'simpl-schema';
import faker from 'faker';

// collections
import { Tasks } from './tasks.js';

// exports
export const Projects = new Mongo.Collection('projects');
export { Projects as default };

if (Meteor.isServer) {
  Meteor.publish('projects.public', () => {
    return Projects.find();
  });
}

// Deny all client-side updates
Projects.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// define schema for user project
Projects.schema = new SimpleSchema({
  name: {
    type: String,
    optional: false,
    label() { return 'Project Name'; },
  },
  description: {
    type: String,
    optional: true,
    label() { return 'Project Description'; },
  },
  phase: {
    type: String,
    optional: false,
    label() { return 'The phase that this Project is currently in.'; },
  },
  business_owner: {
    type: String,
    optional: true,
    label() { return 'Business owner of the project.'; },
  },
  developers: { // define this as an array
    type: Array,
    optional: true,
    label() { return 'Developers assigned to the project.'; },
  },
  'developers.$': { type: String }, // define the type of the array elements
  project_manager: {
    type: String,
    optional: true,
    label() { return 'Project Manager assigned to the project.'; },
  },
  is_regulatory: {
    type: Boolean,
    optional: false,
    label() { return 'Indicates the regulatory status of the project.'; },
  },
});

// all calls to .insert(), update(), upsert(),
// will automatically be checked against the schema
Projects.attachSchema(Projects.schema);

Projects.helpers({
  tasks() {
    return Tasks.find({ projectId: this._id });
  },
  taskCount() {
    return Tasks.find({ projectId: this._id }).count();
  },
});

const loadTestData = () => {
  Projects.insert({
    name: faker.fake('{{company.bs}}'),
    description: faker.fake('{{lorem.paragraph}}'),
    business_owner: faker.fake('{{name.findName}}'),
    developers: [
      faker.fake('{{name.findName}}'),
      faker.fake('{{name.findName}}'),
      faker.fake('{{name.findName}}'),
      faker.fake('{{name.findName}}'),
    ],
    project_manager: faker.fake('{{name.findName}}'),
    is_regulatory: false,
  });
};

Meteor.methods({
  'projects.all': function projectsAll(userId) {
    check(userId, String); // TODO: eventually restrict based on role
    return Projects.find({ });
  },
  'projects.info': function projectsInfo(projectId) {
    check(projectId, String);
    return Projects.findOne({ _id: projectId });
  },
  projectsCount() {
    return Projects.find({}).count();
  },
  'projects.insert': function projectsInsert(name) {
    check(name, String);

    // TODO: do something with hard coded roles
    if (Roles.roleCheckPasses(this.userId, ['admin', 'project-mgr'])) {
      Projects.insert({
        name,
        creator: Meteor.userId(),
        createdAt: new Date(),
      });
    } else {
      _err('notAuthorized');
    }
  },
  'test.projects.reset': function testProjectsReset() {
    if (Roles.adminCheckPasses(this.userId)) {
      Projects.remove({});
    } else {
      _err('notAdmin');
    }
  },
  'test.projects.load': function testProjectsLoad() {
    if (Roles.adminCheckPasses(this.userId)) {
      loadTestData();
    } else {
      _err('notAdmin');
    }
  },
});
