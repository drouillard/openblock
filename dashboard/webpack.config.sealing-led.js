const path = require('path');

module.exports = {
  entry: ['./src/sealing-led'], // .js after index is optional
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'sealing-led-final.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  target: 'node',
  module: {
    noParse: /node_modules\/galileo-io\/lib\/pin.js/,
  },
};
