var webpack = require('webpack');

module.exports = {
  entry: "./src/index",
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      { test: /\.js/, loader: 'babel-loader' }
    ]
  }
}
