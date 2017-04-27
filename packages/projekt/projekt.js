// TODO: junk?

// projekt meteor package
import { check } from 'meteor/check';

// package name
export const name = 'projekt';

// main projekt data container
export const projekt = {
  // settings for default message transition
  messageTransition: {
    animation: 'fade down',
    duration: 100,
  },
};

export const defaults = {
  displayName: 'Everyday Worker',
  publicEmail: 'email@internet.com',
  officeLocation: 'Heinz 57 Tower, Pittsburgh, PA',
  officePhone: '444-555-000',
};

// user extended settings array
// place a copy of these in projekt.default
// TODO: I don't see the need for this any longer. why here?
// move it to the file where it goes into a collection
export let settings = {
  displayName: '',
  publicEmail: '',
  officeLocation: '',
  officePhone: '',
};
