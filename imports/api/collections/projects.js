import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { projekt } from 'meteor/nihiven:projekt';

// imports from npm package
import SimpleSchema from 'simpl-schema';

// exports
export const Projects = new Mongo.Collection('projects');
export { Projects as default };

if (Meteor.isServer) {
  Meteor.publish('projects', function() {
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
    _id: 'project19',
    name: 'Fall of Troy',
    description: 'The Trojan War was waged against the city of Troy by the Achaeans after Paris of Troy took Helen from her husband Menelaus, king of Sparta.',
    business_owner: 'Menelaus',
    developers: ['Paris'],
    project_manager: 'Achilles',
    is_regulatory: true,
  });

  Projects.insert({
    name: 'Grid',
    description: 'Automate portions of the PsychConsult grid table update process.',
    business_owner: 'Tony Curtis',
    developers: ['Zack Stepko'],
    project_manager: 'Justin Behanna',
    is_regulatory: false,
  });

  Projects.insert({
    name: 'York Adams Merger',
    description: 'Merge the York and Adams contracts.',
    developers: ['Dave Kunkel','Brad Trew'],
    business_owner: 'Finance',
    project_manager: 'Justin Behanna',
    is_regulatory: true,
  });

  Projects.insert({
    name: 'SharePoint Migration',
    description: 'Migrate SharePoint 2007 to 2013.',
    developers: ['Greg Harteis'],
    business_owner: 'Multiple',
    project_manager: 'Justin Behanna',
    is_regulatory: false,
  });

  Projects.insert({
    name: 'TFS Conversion',
    description: 'Migrate TFS 2010 to 2013.',
    business_owner: 'Barb Kolski',
    developers: ['Zack Stepko'],
    project_manager: 'Justin Behanna',
    is_regulatory: false,
  });

  Projects.insert({
    name: 'Stomping Grounds',
    description: 'Construct a home for the Stompers.',
    business_owner: 'Stompers',
    developers: ['Lando Construction'],
    project_manager: 'Lokesh Parneia',
    is_regulatory: false,
  });

  Projects.insert({
    name: 'Tableau',
    description: 'Migrate Tableau reporting to Tableau server.',
    business_owner: 'DS',
    developers: ['Rod Person'],
    project_manager: 'DS',
    is_regulatory: false,
  });

  Projects.insert({
    name: 'Rebuilding Tron',
    description: 'A great project that will bring great value to our company. There are many people sponsoring this project and it has a lot of funding.',
    business_owner: 'Mrs. Business',
    developers: ['Rod Person'],
    project_manager: 'Justin Behanna',
    is_regulatory: true,
  });

  Projects.insert({
    name: 'IT Request Portal v2',
    description: 'This project is to rebuild our main app, which will allow us to deploy updates more quickly and will give users a better overall experience',
    business_owner: 'Mr. Business',
    developers: ['Bradley Trew'],
    project_manager: 'Justin Behanna',
    is_regulatory: false,
  });
};
