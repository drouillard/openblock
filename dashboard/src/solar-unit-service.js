import Web3Configurer from './web3-configurer';

const contract = require('truffle-contract');

const json = require('../solarunit/build/contracts/SolarUnit.json');

const SolarUnitContract = contract(json);

export default class SolarUnitService {

  constructor() {
    this.web3 = Web3Configurer.getInstance();
    SolarUnitContract.setProvider(this.web3.currentProvider);
    SolarUnitContract.deployed().then((instance) => { this.solarCoinContract = instance; });
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
