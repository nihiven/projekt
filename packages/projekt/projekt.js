import { Template } from 'meteor/templating';
import { check } from 'meteor/check';
import { ReactiveVar } from 'meteor/reactive-var';

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
  debugColors: new ReactiveVar(true), // show debug properties
  logLevel: 0, // 0 = info/warn/error, 1 = warn, error, 2 = error, 3 = off
  dateFormat: 'MMM Mo, YYYY',
  // settings for default message transition
  messageTransition: {
    animation: 'fade down',
    duration: 100,
  },
  err(errorType, param1='', param2='') { // TODO: add params
    check(errorType, String);

    // TODO: checking for bad errorTypes
    throw new Meteor.Error(errors[errorType].code, errors[errorType].message);
  },
};

export const log = (message, level = 1) => {
    // level: 1 = info, 2 = warning, 3 = error

};

// this is imported where needed
export const errors = {
  notLoggedIn: {
    code: 'not-logged-in',
    message: 'User must be logged in to make this change.',
  },
  notAuthorized: {
    code: 'not-authorized',
    message: 'User does not have the authority to make this change.',
  },
  notAdmin: {
    code: 'not-admin',
    message: 'User must be an admin to make this change.',
  },
  notAdminView: {
    code: 'not-admin-view',
    message: 'User must be an admin to view this page.',
  },
  cantDemoteSelf: {
    code: 'cant-demote-self',
    message: 'You cannot remove elevated privileges from yourself.',
  },
  badParameter: {
    code: 'bad-parameter',
    message: 'Invalid parameter passed: {$1}',
  },
};

export const defaults = {
  displayName: 'Everyday Worker',
  publicEmail: 'email@internet.com',
  officeLocation: 'Heinz 57 Tower, Pittsburgh, PA',
  officePhone: '444-555-000',
  roles: ['view', 'resource'],
};

export const _log = (param) => {
  console.log(param);
};

export const _err = (errorType, param1='', param2='') => {
  projekt.err(errorType, param1, param2);
};
