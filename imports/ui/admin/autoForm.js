import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

// templates
import './autoForm.html';

Schemas = {};

Template.registerHelper('Schemas', Schemas);

Schemas.Person = new SimpleSchema({
  firstName: {
    type: String,
    index: 1,
    unique: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  age: {
    type: Number,
    optional: true,
  },
}, { tracker: Tracker });

const Collections = {};

Template.registerHelper('Collections', Collections);

People = Collections.People = new Mongo.Collection('People');
People.attachSchema(Schemas.Person);

Meteor.publish(null, () => {
  return People.find();
});

People.allow({
  insert() {
    return true;
  },
  remove() {
    return true;
  },
});

Template.updateaf.helpers({
  autoSaveMode() {
    return !!Session.get('autoSaveMode');
  },
  selectedPersonDoc() {
    return People.findOne(Session.get('selectedPersonId'));
  },
  isSelectedPerson() {
    return Session.equals('selectedPersonId', this._id);
  },
  formType() {
    if (Session.get('selectedPersonId')) return 'update';
    return 'disabled';
  },
  disableButtons() {
    return !Session.get('selectedPersonId');
  },
});

Template.updateaf.events({
  'click .person-row': function () {
    Session.set('selectedPersonId', this._id);
  },
  'change .autosave-toggle': function () {
    Session.set('autoSaveMode', !Session.get('autoSaveMode'));
  },
});
