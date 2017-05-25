import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveVar } from 'meteor/reactive-var';
import { projekt } from 'meteor/nihiven:projekt';

// templates
import './adminSettings.html';

Template.adminSettings.onRendered(() => {
  $('.checkbox').checkbox({
    onChecked() {
      projekt.debugColors.set(true);
    },
    onUnchecked() {
      projekt.debugColors.set(false);
    },
  });
});
