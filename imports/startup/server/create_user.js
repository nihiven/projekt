import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { defaults } from 'meteor/nihiven:projekt';

// modify the user object when a user registers
Accounts.onCreateUser((options, user) => {
  // use this for any default profile info
  // like a default picture or something
  Meteor.call('profiles.newUser', user);

  // Roles
  Roles.addUsersToRoles(user._id, defaults.roles);

  // return the modified user object
  return user;
});
