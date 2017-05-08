import Web3Enabled from './web3-enabled';

const contract = require('truffle-contract');

const json = require('../solarcoin/build/contracts/MetaCoin.json');

const SolarCoinContract = contract(json);

export default class SolarCoinService extends Web3Enabled {

  constructor() {
    super();
    SolarCoinContract.setProvider(this.web3.currentProvider);
    SolarCoinContract.deployed().then((instance) => { this.solarCoinContract = instance; });
  }

  getBalance(account) {
    if (!this.solarCoinContract) {
      console.warn('No solar coin contract found');
      return 0;
    }

    console.info('This is the solar coin contract', this.solarCoinContract);

    return this.solarCoinContract.getBalance.call(account);
  }

  sendCoins(receiver, amount, from) {
    if (!this.solarCoinContract) {
      console.error('No solar coin contract found');
      return;
    }

    if (!receiver) {
      console.error('must provide receiver of coins');
      return;
    }

    if (!amount) {
      console.error('must provide number of coins to send');
      return;
    }

    console.log('calling send coins with', this.solarCoinContract.sendCoin, arguments);
    return this.solarCoinContract.sendCoin(receiver, amount, { from });
  }
}
