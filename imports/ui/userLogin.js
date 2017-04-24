import { Template } from 'meteor/templating';
// import { AccountsTemplates } from 'meteor/';

import '../../imports/ui/userLogin.html';

Template.loginForm.events({
  'submit .loginForm'(event, templateInstance) {
    console.log(templateInstance);
  },
});
