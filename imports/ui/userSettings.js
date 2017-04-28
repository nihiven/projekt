import { projekt, settings } from 'meteor/projekt';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';


import '/imports/ui/userSettings.html';

// subscribe to published user lists
Template.settingsForm.onCreated(function() {
  this.autorun(() => {
    this.subscribe('user.settings');
  });
});

Template.settingsForm.onRendered(function() {
  $('.ui.form').form({
    // callbacks
    onSuccess(event, instance) {
      // stop form from submitting
      event.preventDefault();

      // update user info, data validation is done in the method
      // setting this here to keep .call from getting to ugly
      const profileData = {
        userId: Meteor.userId(),
        displayName: event.target.displayName.value,
        publicEmail: event.target.publicEmail.value,
        officePhone: event.target.officePhone.value,
        officeLocation: event.target.officeLocation.value,
      };

      // call the server side upsert method
      Meteor.call('profiles.upsert', profileData, (err, res) => {
        if (err) {
          console.log(err.message);
          console.log(err.details);
          $('.error.message').text(err.message);
          $('.error.message').show();

          return false;
        } else {
          $('.error.message').hide();
          $('.positive.message').transition(projekt.messageTransition);

          return true;
        };
      }); // call
    },
    // form validation settings
    fields: {
      name: {
        identifier: 'displayName',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your name.',
        }],
      },
      email: {
        identifier: 'publicEmail',
        rules: [{
          type: 'minLength[5]',
          prompt: 'Your email address must be at least {ruleValue} characters.',
        }],
      },
      phone: {
        identifier: 'officePhone',
        rules: [{
          type: 'minLength[10]',
          prompt: 'Your telephone number must be at least {ruleValue} characters.',
        }],
      },
      location: {
        identifier: 'officeLocation',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your office location.',
        }],
      },
    }, // fields
  }); // $('.ui.form')
});

// close the account updated message
Template.settingsForm.events({
  'click .positive.message'() {
    $('.positive.message').transition(projekt.messageTransition);
  },
});

Template.settingsForm.helpers({
  userSettings() {
    return Meteor.users.findOne({ _id: Meteor.userId });
  },
});
