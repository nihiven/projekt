/* eslint-env jquery */
import { projekt, settings } from 'meteor/projekt';
import { Template } from 'meteor/templating';

import '../../imports/ui/userSettings.html';

Template.settingsForm.onRendered(function() {
  $('.ui.form').form({
    // callbacks
    onSuccess(event) {
      // stop form from submitting
      event.preventDefault();

      // update user info, data validation is done in the method
    //  Meteor.users.update(userId, { $set: { mailingAddress: newMailingAddress } });

      // show account updated message
      // put this in a callback from the update method
      $('.positive.message').transition(projekt.messageTransition);
    },
    // form validation settings
    inline: true,
    on: 'blur',
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
          prompt: 'Your email must be at least {ruleValue} characters.',
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
    },
  });
});

// close the account updated message
Template.settingsForm.events({
  'click .positive.message'() {
    // TODO: figure this out
    console.log(projekt.getDefault(Meteor.user.settings.displayName,'displayName'));
    $('.positive.message').transition(projekt.messageTransition);
  },
});
