const five = require('johnny-five');
const Galileo = require('galileo-io');

const board = new five.Board({
  io: new Galileo(),
});

board.on('ready', () => {
  // Get latest block sealer

  // Get first personal account

  // If they are same then activate led.
  // Other turn it off

  const led = new five.Led(13);
  led.blink(500);
});
