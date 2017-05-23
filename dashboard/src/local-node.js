import Web3Configurer from './web3-configurer';

export default class LocalNode {
  constructor() {
    this.web3 = Web3Configurer.getInstance();
  }

  getPrimaryAccount(next) {
    console.info('Fetching primary account');

    this.web3.personal.getListAccounts((err, accounts) => {
      console.info('Fetching personal account. Received results', err, accounts);
      next((accounts && accounts[0]) || '0x0');
    });
  }

  getBalance(account, callback) {
    if (!account) {
      console.warn('Unable to get balance. No primary account exists');
      callback();
    }

    this.web3.eth.getBalance(account, (err, balance) => {
      if (err) { console.error(err); callback(); }

      console.info('Fetching balance. Received results', err, balance);
      const balanceWei = balance.toNumber();

    // fromWei causing safari to crash
    //  const etherBalance = this.web3.fromWei(balanceWei, 'ether');
      const etherBalance = balanceWei / 1e18;
      callback(err, etherBalance);
    });
  }

  getFormattedBalance(account, callback) {
    this.getBalance(account, (err, balance) => {
      callback(balance ? Number(balance).toLocaleString() : 0);
    });
  }

  getBlockNumber(callback) {
    this.web3.eth.getBlockNumber((err, result) => {
      callback(result || '0');
    });
  }
}
