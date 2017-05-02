import { projekt, settings } from 'meteor/projekt';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

// local profile data
import { Profiles } from '/imports/api/collections/profiles.js';
import '/imports/ui/userProfile.html';

// this lets us save a timeoutId for closing our message box
let timeoutId = undefined;

// subscribe to published user lists
Template.userProfile.onCreated(function() {
  // using autorun automatically keeps track of subscription readiness
  this.autorun(() => {
    this.subscribe('profiles.user');
  });
});

Template.userProfile.helpers({
  userProfile: function() {
    // TODO: need to pass userId here, but can't get any results when i do
    return Profiles.findOne({ });
  },
});

Template.profileForm.events({
  // hide the account updated message
  'click .message'() {
    let msg = $('.success.message');
    if (msg.is(':visible') === true) {
      Meteor.clearTimeout(timeoutId);
      msg.transition(projekt.messageTransition);
    }
  },
});

Template.profileForm.onRendered(function() {
  $('.ui.form').form({
    // callbacks
    onSuccess(event, instance) {
      // stop form's default submission action
      event.preventDefault();

      // update user info, data validation is done in the method
      // setting this here to keep .call from getting too ugly
      const profileData = {
        userId: Meteor.userId(),
        displayName: event.target.displayName.value,
        publicEmail: event.target.publicEmail.value,
        officePhone: event.target.officePhone.value,
        officeLocation: event.target.officeLocation.value,
      };

      // call the server side upsert method
      Meteor.call('profiles.upsert', profileData, (err, res) => {
        // there was an error updating the database
        if (err) {
          // handle displaying an error message
          console.log(err.message);
          console.log(err.details);
          $('.error.message').text(err.message);
          $('.error.message').show();
          return false;
        } else {
          // the database was successfully updated
          $('.error.message').hide();

          let msg = $('.success.message');
          if (msg.is(':visible') === false) {
            // show success message
            msg.transition(projekt.messageTransition);

            // if a timer is already set, stop it
            Meteor.clearTimeout(timeoutId);

            // save the timer id so we can stop it later if needed
            timeoutId = Meteor.setTimeout(() => {
              // set message to hide in two seconds
              if (msg.is(':visible') === true) { msg.transition(projekt.messageTransition); }
            }, 2000);
          }

          return true;
        }; // else
      }); // call
    },
    // form validation profile
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