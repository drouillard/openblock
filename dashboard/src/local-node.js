import Web3Configurer from './web3-configurer';

const contract = require('truffle-contract');

const json = require('../solarunit/build/contracts/SolarUnit.json');

const SolarUnit = contract(json);

export default class LocalNode {
  constructor() {
    this.web3 = Web3Configurer.getInstance();
    SolarUnit.setProvider(this.web3.currentProvider);
    SolarUnit.deployed().then((instance) => { this.solarCoinContract = instance; });
  }

  getPrimaryAccount() {
    const accounts = this.web3.personal.listAccounts;
    return accounts && accounts[0];
  }

  getBalance() {
    const primaryAccount = this.getPrimaryAccount();

    if (!primaryAccount) {
      console.warn('Unable to get balance. No primary account exists');
      return null;
    }

    const balanceWei = this.web3.eth.getBalance(primaryAccount).toNumber();
    const balance = this.web3.fromWei(balanceWei, 'ether');

    return balance;
  }

  getFormattedBalance() {
    const balance = this.getBalance();
    return balance ? Number(balance).toLocaleString() : 0;
  }

  getSolarUnitBalance() {
    const account = this.getPrimaryAccount();
    if (!this.solarCoinContract) {
      console.warn('No solar coin contract found');
      return 0;
    }

    console.info('This is the solar coin contract', this.solarCoinContract);

    return this.solarCoinContract.getBalance.call(account);
  }
}
