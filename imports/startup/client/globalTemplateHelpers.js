import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt, errors } from 'meteor/nihiven:projekt';

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

Template.registerHelper('isDebugColors', (trueProperty = '', falseProperty = '') => {
  if (projekt.debugColors.get() && Roles.adminCheckPasses(Meteor.userId())) {
    return trueProperty;
  } else {
    return '';
  }
});

// TODO: this isn't right, fix and use later
Template.registerHelper('userProfileField', (userId, field) => {
  Meteor.call('profiles.public', userId, (error, result) => {
    instance.display[field].set(result[field]);
  });
  return instance.display[field].get();
});

Template.registerHelper('isBanned', (userId, trueValue = '', falseValue = '') => {
  return (Roles.userIsInRole(userId, 'banned') ? trueValue : falseValue);
});
