// TODO: make admin glow a less variable for reactivity

import { Template } from 'meteor/templating';
import { projekt, settings } from 'meteor/projekt';

// local profile data
import { Profiles } from '/imports/api/collections/profiles.js';
import './userProfile.html';

Template.formBody.onCreated(function() {
  this.autorun(() => { // automatically tracks subscription readiness
    this.subscribe('profiles.user');
  });
});

Template.userProfile.helpers({
  userProfile: function() {
    return Profiles.findOne({ userId: Meteor.userId() });
  },
});

Template.formBody.events({
  // hide the account updated message
  'click .message'() {
    let msg = $('.success.message');
    if (msg.is(':visible') === true) {
      Meteor.clearTimeout(timeoutId);
      msg.transition(projekt.messageTransition);
    }
  },
});

// set parameters for the colorpicker
Template.adminFields.onRendered(function() {
  // don't pass user id
  const admin = Profiles.findOne({ userId: Meteor.userId() });

  $('#colorpicker').spectrum({
    className: 'full-spectrum',
    color: admin.adminGlowColor,
    maxSelectionSize: 10,
    preferredFormat: 'hex',
    showInitial: true,
    showInput: true,
    showButtons: true,
    showPalette: false,
    showSelectionPalette: true,
    change(color) { updateAdminGlow(color.toHexString()); },
  });
});

const updateAdminGlow = (colorHex) => {
  Meteor.call('profiles.save.adminGlowColor', colorHex);
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    $('.global-menu').css({ background: colorHex });
  }
};

// use below to save the timeoutId for closing our message box
let timeoutId = undefined;

Template.formBody.onRendered(function() {
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
