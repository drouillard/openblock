const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index'], // .js after index is optional
  output: {
    path: path.join(__dirname, 'public', 'javascripts'),
    filename: 'main.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css'],
    },
    ],
  },
};
