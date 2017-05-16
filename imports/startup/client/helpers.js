import { Template } from 'meteor/templating';
import { errors } from 'meteor/projekt';

// global helper for template errors
Template.registerHelper('errMessage', (errorType) => {
  return errors[errorType].message;
});
