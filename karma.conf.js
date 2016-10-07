module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      // Polyfills
      'node_modules/reflect-metadata/Reflect.js',

      // System.js
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',

      // Zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },


      {pattern: 'karma-test-shim.js', included: true, watched: true},

      // paths loaded via module imports
      // Angular itself
      {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

      // Our built application code
      {pattern: 'build/src/**/*.js', included: false, watched: false},
      {pattern: 'build/test/**/*.js', included: false, watched: false}
    ],

    customLaunchers: {
      'ChromeNoSandbox': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    reporters: ['dots'],
    port: 9876,
    colors: true,
    //logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false
  })
}
