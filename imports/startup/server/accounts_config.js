// TODO: maybe rename this file to user config
import { projekt, defaults } from 'meteor/projekt';
import { Profiles } from '/imports/api/collections/profiles.js';

// modify the user object when a user registers
Accounts.onCreateUser((options, user) => {
  console.log(options);

  // default projekt settings

  user.displayName = defaults.displayName;
  user.publicEmail = defaults.publicEmail;
  user.officeLocation = defaults.officeLocation;
  user.officePhone = defaults.officePhone;

  // a get helper
  user.getProp = function() { return 'jb was here'; };

  // log this to the console
  console.log(user);

  // return the modified user object
  return user;
});
