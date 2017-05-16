import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { errors } from 'meteor/projekt';

// global helper for template errors
Template.registerHelper('errMessage', (errorType) => {
  return errors[errorType].message;
});

Template.registerHelper('isAdmin', (trueProperty = '', falseProperty = '') => {
  if (Meteor.userId()) {
    return (Roles.adminCheckPasses(Meteor.userId()) ? trueProperty : falseProperty);
  } else {
    return '';
  }
});
