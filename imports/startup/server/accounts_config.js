// TODO: maybe rename this file to user config
import { Meteor } from 'meteor/meteor';

// modify the user object when a user registers
Accounts.onCreateUser((options, user) => {
  console.log(options);

  // TODO: don't need this as is
  Meteor.call('profiles.newUser', user._id);

  // return the modified user object
  return user;
});
