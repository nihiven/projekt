import { Meteor } from 'meteor/meteor';
import { Profiles } from '/imports/api/collections/profiles.js';

Meteor.publish('users.public', function () { // not required
  return Meteor.users.find({}, { _id: 1, roles: 1, emails: 1, roles: 1 });
});

Meteor.methods({
  'users.testData'() {
    addUser = (element, index, array) => {
      Meteor.users.insert({
        email: element.email,
        officeLocation: element.officeLocation,
        officePhone: element.officePhone,
      },
      (error, docInserted) => {
        Profiles.insert({ userId: docInserted, name: 'Some Guy'});
        const roles = ['normal-user'];
        Roles.addUsersToRoles(docInserted, roles);
      });
    };

    const userData = [
      {
        email: 'chuck@test.com',
        officeLocation: 'Oakland',
        officePhone: '348-1343-431',
      },
      {
        email: 'jb@jb.com',
        officeLocation: 'D o w n t o w n',
        officePhone: '348-1343-4314',
      },
      {
        email: 'williamg@ms.com',
        officeLocation: 'Washington',
        officePhone: '348-1343-431',
      },
      {
        email: 'johnc@id.com',
        officeLocation: 'Austin',
        officePhone: '348-1343-431',
      },
    ];

    userData.forEach(addUser);

  }, // 'users.testData'
});
