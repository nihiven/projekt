/* eslint-env jquery */

import { Template } from 'meteor/templating';

import '../../imports/ui/userSettings.html';

Template.userSettings.events({
  'click form .submit'(event) {
    console.log(event);
  },
});

// form validation
Template.userSettings.onRendered(function() {
  $('.ui.form')
  .form({
    fields: {
      name: {
        identifier: 'display-name',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your name.',
          },
        ],
      },
      email: {
        identifier: 'public-email',
        rules: [
          {
            type: 'minLength[5]',
            prompt: 'Your email must be at least {ruleValue} characters.',
          },
        ],
      },

      phone: {
        identifier: 'office-phone',
        rules: [
          {
            type: 'minLength[10]',
            prompt: 'Your telephone number must be at least {ruleValue} characters.',
          },
        ],
      },

      location: {
        identifier: 'office-location',
        rules: [
          {
            type: 'empty',
            prompt: 'Please enter your office location.',
          },
        ],
      },
    },
  });
});
