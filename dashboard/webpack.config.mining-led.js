const path = require('path');

module.exports = {
  entry: ['./src/mining-led'], // .js after index is optional
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'mining-led.js',
  },
  target: 'node',
};
