import SimpleSchema from 'simpl-schema';

// core components
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

// import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

// templatess
import './formTest.html';

Schemas = {};
_x.selectedPersonId = new ReactiveVar();
_x.autoSaveMode = new ReactiveVar(true);

Template.registerHelper('Schemas', Schemas);

Schemas.Person = new SimpleSchema({
  firstName: { type: String },
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

if (Meteor.isServer) {
  Meteor.publish(null, () => {
    return People.find();
  });
}

People.allow({
  insert() {
    return true;
  },
  remove() {
    return true;
  },
});

Template.testQuickForm.helpers({
  autoSaveMode() {
    return _x.autoSaveMode.get();
  },
  selectedPersonDoc() {
    return People.findOne(_x.selectedPersonId.get());
  },
  isSelectedPerson() {
    return (this._id === _x.selectedPersonId.get());
  },
  formType() {
    if (_x.selectedPersonId.get()) return 'update';
    return 'disabled';
  },
  disableButtons() {
    return !_x.selectedPersonId.get();
  },
});

Template.testQuickForm.events({
  'click .person-row': function clickPersonRow() {
    _x.selectedPersonId.set(this._id);
  },
  'change .autosave-toggle': function functionAutoSaveToggle() {
    _x.autoSaveMode.set(!_x.autoSaveMode.get());
  },
});
