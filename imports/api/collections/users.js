import { Meteor } from 'meteor/meteor';
import { defaults } from 'meteor/nihiven:projekt';

// collections
import { Profiles } from './profiles.js';

// node modules
import faker from 'faker';

Meteor.publish('users.public', function () { // not required
  return Meteor.users.find({}, { _id: 1, roles: 1, emails: 1 });
});

Meteor.methods({
  'users.testData'() {
    Meteor.users.insert({
      emails: [{ address: faker.fake('{{internet.email}}'), verified: false }],
      createdAt: Date.now(),
    },
    (error, docInserted) => {
      Profiles.insert({
        userId: docInserted,
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.fake('{{internet.email}}'),
        officeLocation: faker.fake('{{address.streetAddress}} '),
        officePhone: faker.fake('{{phone.phoneNumberFormat}}'),
      });

      Roles.addUsersToRoles(docInserted, defaults.roles);
    }); // callback
  },
});
