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

export const defaults = {
  dateFormat: 'MMM Mo, YYYY',
  displayName: 'Everyday Worker',
  officeLocation: 'Heinz 57 Tower, Pittsburgh, PA',
  officePhone: '444-555-000',
  publicEmail: 'email@internet.com',
  roles: ['view', 'resource'],
  removedComment: '[removed]',
};

export const _log = (param) => {
  // disable because this is the one place where we want to use console
  // eslint-disable-next-line no-console
  console.log(param);
};

// main projekt data container
export const projekt = {
  // NOTE: right, wrong place?
  name: 'projekt',
  nameStylized: 'projekt',
  version: '0.1.0',

  // settings
  quickMessage: new ReactiveVar(true), // on name click, popup message composer
  debugColors: new ReactiveVar(false), // show debug properties

  // settings for default message transition
  messageTransition: {
    animation: 'fade down',
    duration: 100,
  },
};

export const errors = {
  notLoggedIn: {
    code: 'not-logged-in',
    message: 'User must be logged in to make this change.',
  },
  notLoggedInView: {
    code: 'not-logged-in-view',
    message: 'User must be logged in to view this page.',
  },
  notAuthorized: {
    code: 'not-authorized',
    message: 'User does not have the authority to make this change.',
  },
  notAuthorizedView: {
    code: 'not-authorized-view',
    message: 'User does not have the authority to view this page.',
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
  cantBanSelf: {
    code: 'cant-ban-self',
    message: 'You cannot ban yourself.',
  },
  badParameter: {
    code: 'bad-parameter',
    message: 'Invalid parameter passed: {$1}',
  },
  cantRemoveComment: {
    code: 'cant-remove-comment',
    message: 'You cannot remove this comment.',
  },
  cantRemoveCommentAdmin: {
    code: 'cant-remove-admin',
    message: 'You must be an admin to remove this comment.',
  },
  notGonnaHappen: {
    code: 'not-gonna-happen',
    message: 'Yeah right! I\'m not sure what you think you\'re doing, but no.',
  },
};

export const _err = (errorType) => {
  check(errorType, String);
  // TODO: checking for bad errorTypes
  throw new Meteor.Error(errors[errorType].code, errors[errorType].message);
};
