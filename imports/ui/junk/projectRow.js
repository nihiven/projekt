import { Template } from 'meteor/templating';

import './projectRow.html';

Template.projectRow.helpers({
  status_color() {
  	return this.status.toLowerCase();
  },
});
