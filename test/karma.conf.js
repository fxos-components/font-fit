'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../',
    browsers: [
      'Firefox',
      'Chrome_test'
    ],
    client: {
      captureConsole: true,
      mocha: { 'ui': 'tdd' }
    },

    frameworks: [
      'mocha',
      'chai-sinon'
    ],

    customLaunchers: {
      Chrome_test: {
          base: 'Chrome',
          flags: ['--no-sandbox']
      }
    },

    files: [
      'font-fit.js',
      'test/test.js'
    ]
  });
};
