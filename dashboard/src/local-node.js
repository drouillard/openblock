import Web3Enabled from './web3-enabled';

const contract = require('truffle-contract');

const json = require('../solarcoin/build/contracts/MetaCoin.json');

const SolarCoin = contract(json);

export default class LocalNode extends Web3Enabled {
  constructor() {
    super();

        // Step 3: Provision the contract with a web3 provider
    console.log('setting provider', this.web3.currentProvider);

    SolarCoin.setProvider(this.web3.currentProvider);

    SolarCoin.deployed().then((instance) => { this.solarCoinContract = instance; });
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

  getSolarCoinBalance() {
    const account = this.getPrimaryAccount();
    if (!this.solarCoinContract) {
      console.warn('No solar coin contract found');
      return 0;
    }

    console.info('This is the solar coin contract', this.solarCoinContract);

    return this.solarCoinContract.getBalance.call(account);
  }
}
