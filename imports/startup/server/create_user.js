import { Meteor } from 'meteor/meteor';

// modify the user object when a user registers
Accounts.onCreateUser((options, user) => {
  // TODO: use this for any default profile info
  // like a default picture or something
  Meteor.call('profiles.newUser', user);

  // Roles
  user.roles = ['view', 'admin', 'resource'];
  Roles.addUsersToRoles(user._id, user.roles);

  // return the modified user object
  return user;
});
