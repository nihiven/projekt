// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See projekt-tests.js for an example of importing.
export const name = 'projekt';

// settings for this message fade
export const projekt = {
  messageTransition: {
    animation: 'fade down',
    duration: 100,
  },
  default: {
    // user extended settings
    displayName: 'Everyday Worker',
    publicEmail: 'email@internet.com',
    officeLocation: 'Heinz 57 Tower, Pittsburgh, PA',
    officePhone: '444-555-000',
  },

  // functions
  getDefault(value, field) {
    // return value if not undefined
    // else return the default value of the given field
    if (value !== undefined) {
      return value;
    } else {
      return projekt.default[field];
    }
  },
};

// user extended settings array
// place a copy of these in projekt.default
export let settings = {
  displayName: '',
  publicEmail: '',
  officeLocation: '',
  officePhone: '',
};
