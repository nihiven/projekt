import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { projekt } from 'meteor/nihiven:projekt';

// templates
import './adminSettings.html';

Template.adminSettings.onRendered(() => {
  $('.debugColors').checkbox({
    onChecked() {
      projekt.debugColors.set(true);
    },
    onUnchecked() {
      projekt.debugColors.set(false);
    },
  });

  $('.quickMessage').checkbox({
    onChecked() {
      projekt.quickMessage.set(true);
    },
    onUnchecked() {
      projekt.quickMessage.set(false);
    },
  });
});
