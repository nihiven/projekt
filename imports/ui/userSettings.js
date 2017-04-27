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
    onSuccess(event) {
      // stop form from submitting
      event.preventDefault();
      console.log(this);
      console.log(event);
      console.log(this.displayName.data);
      // update user info, data validation is done in the method
      profileData = {
        userId: Meteor.userId(),
        displayName: this.displayName,
        publicEmail: this.publicEmail,
        officePhone: this.officePhone,
        officeLocation: this.officeLocation,
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
        identifier: 'display-name',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your name.',
        }],
      },
      email: {
        identifier: 'public-email',
        rules: [{
          type: 'minLength[5]',
          prompt: 'Your email address must be at least {ruleValue} characters.',
        }],
      },
      phone: {
        identifier: 'office-phone',
        rules: [{
          type: 'minLength[10]',
          prompt: 'Your telephone number must be at least {ruleValue} characters.',
        }],
      },
      location: {
        identifier: 'office-location',
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
