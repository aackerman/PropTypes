var webpack = require('webpack');

module.exports = {
  entry: "./index",
  output: {
    path: __dirname + '/dist',
    filename: "index.js"
  },
  module: {
    loaders: [
      { test: /\.js/, loader: 'babel-loader' }
    ]
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()]
}
