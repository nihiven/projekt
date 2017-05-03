// TODO: schema
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Projects = new Mongo.Collection('projects');
export { Projects as default };

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('projects', function() {
    return Projects.find();
  });
}

Meteor.methods({
  'projects.insert'(name) {
    check(name, String);

    // user must be logged in
    if (!Roles.userIsInRole(this.userId, ['admin','project-mgr'])) {
      throw new Meteor.Error(403, 'Not authorized to create projects.');
    }

    Projects.insert({
      name,
      creator: Meteor.userId(),
      createdAt: new Date(),
    });

    console.log('created new project');
  },
  'projects.reset'() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Projects.remove({});
    } else {
      throw new Meteor.Error(403, 'Not authorized to reset Project data.');
    }
  },
  'projects.test'() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      loadTestData();
    } else {
      throw new Meteor.Error(403, 'Not authorized to load test Project data.');
    }
  },
});

const roleCheck = function(user, roles, callback) {
  // TODO: end of day
};

const loadTestData = function() {
  Projects.insert({
    name: 'Fall of Troy',
    description: 'The Trojan War was waged against the city of Troy by the Achaeans (Greeks) after Paris of Troy took Helen from her husband Menelaus, king of Sparta.',
    business_owner: 'Menelaus',
    developers: 'Paris',
    project_manager: 'Achilles',
    is_reulatory: 'Yes',
  });

  Projects.insert({
    name: 'Grid',
    description: 'Automate portions of the PsychConsult grid table update process.',
    business_owner: 'Tony Curtis',
    developers: 'Zack Stepko',
    project_manager: 'Justin Behanna',
    is_reulatory: 'No',
  });

  Projects.insert({
    name: 'York Adams Merger',
    description: 'Merge the York and Adams contracts.',
    developers: '',
    business_owner: 'Finance',
    project_manager: 'Justin Behanna',
    is_reulatory: 'Yes',
  });

  Projects.insert({
    name: 'SharePoint Migration',
    description: 'Migrate SharePoint 2007 to 2013.',
    developers: 'Greg Harteis',
    business_owner: 'Multiple',
    project_manager: 'Justin Behanna',
    is_reulatory: 'No',
  });

  Projects.insert({
    name: 'TFS Conversion',
    description: 'Migrate TFS 2010 to 2013.',
    business_owner: 'Barb Kolski',
    developers: 'Zack Stepko',
    project_manager: 'Justin Behanna',
    is_reulatory: 'No',
  });

  Projects.insert({
    name: 'Stomping Grounds',
    description: 'Construct a home for the Stompers.',
    business_owner: 'Stompers',
    developers: 'Lando Construction',
    project_manager: 'Lokesh Parneia',
    is_reulatory: 'No',
  });

  Projects.insert({
    name: 'Tableau',
    description: 'Migrate Tableau reporting to Tableau server.',
    business_owner: 'DS',
    developers: 'Rod Person',
    project_manager: 'DS',
    is_reulatory: 'No',
  });

  Projects.insert({
    name: 'Rebuilding Tron',
    description: 'A great project that will bring great value to our company. There are many people sponsoring this project and it has a lot of funding.',
    business_owner: 'Mrs. Business',
    developers: 'Rod Person',
    project_manager: 'Justin Behanna',
    is_reulatory: 'Yes',
  });

  Projects.insert({
    name: 'IT Request Portal v2',
    description: 'This project is to rebuild our main app, which will allow us to deploy updates more quickly and will give users a better overall experience',
    business_owner: 'Mr. Business',
    developers: 'Bradley Trew',
    project_manager: 'Justin Behanna',
    is_reulatory: 'No',
  });
};
