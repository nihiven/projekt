// exposing roles for admin functions
Meteor.publish('roles.all', () => {
  return Meteor.roles.find({});
});
