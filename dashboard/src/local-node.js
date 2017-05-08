import Web3Provider from './web3-provider';

export default class LocalNode extends Web3Provider {
  // web3.eth.defaultAccount = account;

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
