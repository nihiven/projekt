// TODO: There are some things we need to do with this
// 1: items in this package are meant to control the app and
// this package contains the values. These should all be const.
// 2: when running the app, check to see that all values
//  defined in this config are exist within the database.
//  if they dont, load them from this package in to the db.

// package name
export const name = 'projekt';

// main projekt data container
export const projekt = {
  // settings
  debug: false, // show console
  logLevel: 0, // 0 = info/warn/error, 1 = warn, error, 2 = error, 3 = off

  // settings for default message transition
  messageTransition: {
    animation: 'fade down',
    duration: 100,
  },
};

export const log = (message, level = 1) => {
    // level: 1 = info, 2 = warning, 3 = error

};

// this is imported where needed
export const errors = {
  notLoggedIn: {
    error: 'not-logged-in',
    message: 'User must be logged in to make this change.',
  },
  notAuthorized: {
    error: 'not-authorized',
    message: 'User does not have the authority to make that change.',
  },
};

export const defaults = {
  displayName: 'Everyday Worker',
  publicEmail: 'email@internet.com',
  officeLocation: 'Heinz 57 Tower, Pittsburgh, PA',
  officePhone: '444-555-000',
};
