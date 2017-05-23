import $ from 'jquery';
import Web3Configurer from './web3-configurer';
import LocalNode from './local-node';
import SolarUnitService from './solar-unit-service';

require('jquery-ui-bundle');

// import SolidityCoder from 'web3/lib/solidity/coder';

const web3 = Web3Configurer.getInstance();

// export on dev console
window.web3 = web3;

// Setup filter to watch transactions

// const filter = web3.eth.filter('latest');
//
// filter.watch((error, result) => {
//   if (error) return;
//
//   const block = web3.eth.getBlock(result, true);
//   console.log(`block #${block.number}`, block);
//
//   console.dir('transaction in block', block.transactions);
// });
//
// filter.stopWatching();

// Update labels
$(() => {
  console.log('Document ready');

  const solarUnitService = new SolarUnitService();
  const localNode = new LocalNode();

  function setSelector(selector, value) {
    if ($(selector).text() !== String(value)) { $(selector).text(value).effect('highlight'); }
  }

  function pollAccount(account) {
    const date = new Date().toLocaleString();
    $('#date').text(date);
    console.log(`${date}: Running poll ${account}`);


    // Account balance in Ether
    localNode.getFormattedBalance(account, (balance) => {
      setSelector('#balance', balance);
    });

    localNode.getBlockNumber((blockNumber) => {
      setSelector('#block_number', blockNumber);
    });

    // Solar unit balance
    solarUnitService.getBalance(account).then((solarUnitBalance) => {
      console.info('Retreived from rpc api. Solar unit balance', solarUnitBalance);
      setSelector('#solar_balance', solarUnitBalance);
    });
  }


  localNode.getPrimaryAccount((account) => {
    $('#address').text(account);

    $('#send_coins_form').submit((e) => {
      e.preventDefault();

      const amountText = $('#send_coins_amount').val();
      const amount = parseInt(amountText, 10);
      const address = $('#send_coins_address').val();

      $('#message').removeClass().addClass('alert alert-info').text(`Transfer pending to ${address}`);

      solarUnitService.sendCoins(address, amount, account).then((res) => {
        console.log('the result of sending units', res);
        $('#message').removeClass().addClass('alert alert-success').text(`Units sent to ${address}`);
      });
    });

    setInterval(pollAccount.bind(this, account), 1000);
  });
});
