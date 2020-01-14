// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from 'meteor/tinytest';

// Import and rename a variable exported by projekt.js.
import { name as packageName } from 'meteor/nihiven:projekt';

// Write your tests here!
// Here is an example.
Tinytest.add('projekt - example', (test) => {
  test.equal(packageName, 'projekt');
});
