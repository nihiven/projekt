import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { projekt } from 'meteor/nihiven:projekt';

// collections
import { Tasks } from './tasks.js';

// imports from npm package
import SimpleSchema from 'simpl-schema';
import faker from 'faker';

// exports
export const Projects = new Mongo.Collection('projects');
export { Projects as default };

if (Meteor.isServer) {
  Meteor.publish('projects.public', function() {
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

Meteor.methods({
  'projects.all'(userId) {
    check(userId, String); // TODO: eventually restrict based on role
    return Projects.find({ });
  },
  'projects.info'(projectId) {
    check(projectId, String);
    return Projects.findOne({ _id: projectId });
  },
  projectsCount() {
    return Projects.find({}).count();
  },
  'projects.insert'(name) {
    check(name, String);

    // TODO: do something with hard coded roles
    if (Roles.roleCheckPasses(this.userId, ['admin','project-mgr'])) {
      Projects.insert({
        name,
        creator: Meteor.userId(),
        createdAt: new Date(),
      });
    } else {
      projekt.err('notAuthorized');
    }
  },
  'projects.reset'() {
    if (Roles.adminCheckPasses(this.userId)) {
      Projects.remove({});
    } else {
      projekt.err('notAdmin');
    }
  },
  'projects.testData'() {
    if (Roles.adminCheckPasses(this.userId)) {
      loadTestData();
    } else {
      projekt.err('notAdmin');
    }
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
