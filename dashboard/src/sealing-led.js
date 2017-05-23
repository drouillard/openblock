import LocalNode from './local-node';
import Web3Configurer from './web3-configurer';

const five = require('johnny-five');
const Galileo = require('galileo-io');

const board = new five.Board({
  io: new Galileo(),
});
// npm run build-sealing-led && scp bin/sealing-led-final.js root@ip:workspace/dashboard/bin
// curl -X POST --data '{"jsonrpc":"2.0","method":"clique_getSnapshot","params":["0x1"],"id":1}' localhost:8545
board.on('ready', () => {
  // Get latest block sealer
  const led = new five.Led(13);
  const localNode = new LocalNode();
  const primaryAccount = localNode.getPrimaryAccount();
  const web3 = Web3Configurer.getInstance();
  const httpProvider = web3.currentProvider;

  console.log('Context:', primaryAccount);

  const payload = {
    jsonrpc: '2.0',
    method: 'clique_getSnapshot',
    params: [],
    id: 1,
  };

  const turnOnLed = () => { led.blink(500); };
  const turnOffLed = () => { led.stop(); led.off(); };
  const logError = (err) => { turnOffLed(); console.error(err); };

  const checkIfLastSigner = () => {
    httpProvider.sendAsync(payload, (err, res) => {
    //  console.log('Clique response: err result', err, res);
      const error = err || res.error;

      if (error) {
        console.error(Date.now(), 'Unable to retreive response to clique api call', error);
        return;
      }

      const result = res.result;

      // console.log('Result is ', result);

      const lastBlockNumber = result.number;
      const recents = result.recents;

      // console.log('last block number and recent blocks ', lastBlockNumber, recents);

      if (!lastBlockNumber) {
        logError('No blocks detected');
        return;
      }

      if (!recents) {
        logError('No recent blocks detected');
        return;
      }

      const lastSigner = recents[lastBlockNumber];

      // if this node is the last to seal then activate
      console.log(`The primary account is ${primaryAccount} and the last signer is ${lastSigner}`);
      if (lastSigner === primaryAccount) {
        console.log(Date.now(), 'Machine is last signer. Turning on LED');
        turnOnLed();
      } else {
        console.log(Date.now(), 'Machine is NOT last signer. Turning off LED');
        turnOffLed();
      }
    });
  };

  turnOffLed();
  setInterval(checkIfLastSigner, 2000);
});
