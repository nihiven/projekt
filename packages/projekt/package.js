Package.describe({
  name: 'nihiven:projekt',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'The core Projekt package.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/nihiven/projekt/',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.4.2');
  api.use('ecmascript');
  api.mainModule('projekt.js');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('nihiven:projekt');
  api.mainModule('projekt-tests.js');
});
