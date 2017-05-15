const SolarUnit = artifacts.require('./SolarUnit.sol');

contract('SolarUnit', (accounts) => {
  it('should put 10000 SolarUnits in the first account', () => SolarUnit.deployed().then(instance => instance.getBalance.call(accounts[0])).then((balance) => {
    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  }));
  it('should call a function that depends on a linked library', () => {
    let solar;
    let solarUnitBalance;
    let solarUnitEthBalance;

    return SolarUnit.deployed().then((instance) => {
      solar = instance;
      return solar.getBalance.call(accounts[0]);
    }).then((outCoinBalance) => {
      solarUnitBalance = outCoinBalance.toNumber();
      return solar.getBalanceInEth.call(accounts[0]);
    }).then((outCoinBalanceEth) => {
      solarUnitEthBalance = outCoinBalanceEth.toNumber();
    }).then(() => {
      assert.equal(solarUnitEthBalance, 2 * solarUnitBalance, 'Library function returned unexpected function, linkage may be broken');
    });
  });
  it('should send coin correctly', () => {
    let solar;

    // Get initial balances of first and second account.
    const account_one = accounts[0];
    const account_two = accounts[1];

    let account_one_starting_balance;
    let account_two_starting_balance;
    let account_one_ending_balance;
    let account_two_ending_balance;

    const amount = 10;

    return SolarUnit.deployed().then((instance) => {
      solar = instance;
      return solar.getBalance.call(account_one);
    }).then((balance) => {
      account_one_starting_balance = balance.toNumber();
      return solar.getBalance.call(account_two);
    }).then((balance) => {
      account_two_starting_balance = balance.toNumber();
      return solar.sendCoin(account_two, amount, { from: account_one });
    }).then(() => solar.getBalance.call(account_one)).then((balance) => {
      account_one_ending_balance = balance.toNumber();
      return solar.getBalance.call(account_two);
    }).then((balance) => {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
});
