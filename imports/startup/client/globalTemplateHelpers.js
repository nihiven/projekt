import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt, errors } from 'meteor/nihiven:projekt';

// global helper for template errors
Template.registerHelper('errMessage', (errorType) => {
  return errors[errorType].message;
});

// a bunch of isSomething to use in any template
Template.registerHelper('isBanned', (userId, trueValue = '', falseValue = '') => {
  return (Roles.userIsInRole(userId, 'banned') ? trueValue : falseValue);
});

// settings specific
Template.registerHelper('isAdmin', (trueValue = '', falseValue = '') => {
  if (Meteor.userId()) {
    return (Roles.adminCheckPasses(Meteor.userId()) ? trueValue : falseValue);
  } else {
    return falseValue;
  }
});

Template.registerHelper('isDebugColors', (trueValue = '', falseValue = '') => {
  return (projekt.debugColors.get() && Roles.adminCheckPasses(Meteor.userId()) ? trueValue : falseValue);
});

Template.registerHelper('isQuickMessage', (trueValue = '', falseValue = '') => {
  return (projekt.quickMessage.get()) ?  trueValue : falseValue;
});
