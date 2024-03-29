import { Template } from 'meteor/templating';
import { projekt, _log } from 'meteor/nihiven:projekt';

// local profile data
import { Profiles } from '/imports/api/collections/profiles.js';
import './userProfile.html';

Template.formBody.onCreated(function onCreatedFormBodyAutoRun() {
  this.autorun(() => { // automatically tracks subscription readiness
    this.subscribe('profiles.user');
  });
});

Template.userProfile.helpers({
  userProfile() {
    return Profiles.findOne({ userId: Meteor.userId() });
  },
});

// use below to save the timeoutId for closing our message box
let timeoutId;

Template.formBody.events({
  // hide the account updated message
  'click .message': function clickFormBodyMessage() {
    const msg = $('.success.message');
    if (msg.is(':visible') === true) {
      Meteor.clearTimeout(timeoutId);
      msg.transition(projekt.messageTransition);
    }
  },
});

Template.formBody.onRendered(() => {
  $('.ui.form').form({
    // callbacks
    onSuccess(event) {
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
      Meteor.call('profiles.upsert', profileData, (err) => {
        // there was an error updating the database
        if (err) {
          // handle displaying an error message
          _log(err.message);
          _log(err.details);
          $('.error.message').text(err.message);
          $('.error.message').show();
          return false;
        }
          // the database was successfully updated
        $('.error.message').hide();

        const msg = $('.success.message');
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
         // else
      }); // call
    },
    // form validation profile
    fields: {
      displayName: {
        rules: [{
          type: 'empty',
          prompt: 'Please enter your name.',
        }],
      },
      publicEmail: {
        optional: true,
        rules: [{
          type: 'minLength[5]',
          prompt: 'Your email address must be at least {ruleValue} characters.',
        }],
      },
      officePhone: {
        optional: true,
        rules: [{
          type: 'minLength[10]',
          prompt: 'Your telephone number must be at least {ruleValue} characters.',
        }],
      },
      officeLocation: {
        optional: true,
        rules: [{
          type: 'empty',
          prompt: 'Please enter your office location.',
        }],
      },
    }, // fields
  }); // $('.ui.form')
});
