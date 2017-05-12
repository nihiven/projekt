Package.describe({
  name: 'projekt',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'The central package for Projekt development.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/nihiven/projekt/',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.4.1');
  api.use('ecmascript');
  api.mainModule('projekt.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('projekt');
  api.mainModule('projekt-tests.js');
});
