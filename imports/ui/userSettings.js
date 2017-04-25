/* eslint-env jquery */
import { projekt } from 'meteor/projekt';
import { Template } from 'meteor/templating';

import '../../imports/ui/userSettings.html';

Template.settingsForm.onRendered(function() {
  $('.ui.form').form({
    onSuccess(event) {
      // stop form from submitting
      event.preventDefault();

      // show account updated message
      $('.positive.message').transition(projekt.messageTransition);

      // update user info, data validation is done in the method
    },
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
    $('.positive.message').transition(projekt.messageTransition);
  },
});
