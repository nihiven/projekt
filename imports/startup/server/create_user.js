import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

// modify the user object when a user registers
Accounts.onCreateUser((options, user) => {
  console.log(options);

  // TODO: use this for any default profile info
  // like a default picture or something
  Meteor.call('profiles.newUser', user._id);

  // Roles
  user.roles = ['admin'];
  Roles.addUsersToRoles(user._id, user.roles);

  // return the modified user object
  return user;
});
