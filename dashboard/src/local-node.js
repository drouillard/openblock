import Web3Configurer from './web3-configurer';

export default class LocalNode {
  constructor() {
    this.web3 = Web3Configurer.getInstance();
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

}
