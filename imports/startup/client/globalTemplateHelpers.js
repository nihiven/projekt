import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt, errors } from 'meteor/nihiven:projekt';
import randomColor from 'randomcolor';

// global helper for template errors
Template.registerHelper('errMessage', (errorType) => {
  return errors[errorType].message;
});

// a bunch of isSomething to use in any template
Template.registerHelper('isInRoleUserId', (userId, role) => {
  return Roles.userIsInRole(userId, role);
});

Template.registerHelper('isBanned', (userId, trueValue = '', falseValue = '') => {
  return (Roles.userIsInRole(userId, 'banned') ? trueValue : falseValue);
});

// settings specific
Template.registerHelper('isAdmin', (trueValue = '', falseValue = '') => {
  if (Meteor.userId()) {
    return (Roles.adminCheckPasses(Meteor.userId()) ? trueValue : falseValue);
  }
  return falseValue;
});

Template.registerHelper('isQuickMessage', (trueValue = '', falseValue = '') => {
  return (projekt.quickMessage.get()) ? trueValue : falseValue;
});

Template.registerHelper('debugColor', (seed = '', luminosity = '', hue = '', opacity = '') => {
  if (projekt.debugColors.get() && Roles.adminCheckPasses(Meteor.userId())) {
    return randomColor({
      seed,
      luminosity,
      hue,
      opacity,
    });
  }
  return false;
});

Template.registerHelper('isDebugColors', () => {
  return projekt.debugColors.get();
});
