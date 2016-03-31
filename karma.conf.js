module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: ['src/__tests__/*-test.js'],

    preprocessors: {
      'src/__tests__/*-test.js': ['webpack'],
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: true,

    webpackMiddleware: {
      noInfo: true
    },

    webpack: {
      module: {
        loaders: [
          { test: /\.js/, loader: 'babel-loader' }
        ]
      }
    },

    webpackPort: 1234
  });
};
