import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { projekt, errors } from 'meteor/nihiven:projekt';

// node modules
import randomColor from 'randomcolor';

// global helper for template errors
Template.registerHelper('errMessage', (errorType) => {
  return errors[errorType].message;
});

// settings specific
Template.registerHelper('isInRoleUserId', (userId, role) => {
  return Roles.userIsInRole(userId, role);
});

Template.registerHelper('isBanned', (userId, trueValue = '', falseValue = '') => {
  return (Roles.userIsInRole(userId, 'banned') ? trueValue : falseValue);
});

Template.registerHelper('isAdmin', (trueValue = '', falseValue = '') => {
  if (Meteor.userId()) {
    return (Roles.adminCheckPasses(Meteor.userId()) ? trueValue : falseValue);
  }
  return falseValue;
});
Template.registerHelper('isQuickMessage', () => {
  return projekt.quickMessage.get();
});

Template.registerHelper('isDebugColors', () => {
  return projekt.debugColors.get();
});

// project properties
Template.registerHelper('projectName', () => {
  return projekt.name;
});

Template.registerHelper('projectNameStylized', () => {
  return projekt.nameStylized;
});

Template.registerHelper('projectVersion', () => {
  return projekt.version;
});

// additional helpers
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
