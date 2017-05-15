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

const filter = web3.eth.filter('latest');

filter.watch((error, result) => {
  if (error) return;

  const block = web3.eth.getBlock(result, true);
  console.log(`block #${block.number}`, block);

  console.dir('transaction in block', block.transactions);
});

// Update labels
$(() => {
  console.log('Document ready');
  const localNode = new LocalNode();
  const solarUnitService = new SolarUnitService();

  $('#send_coins_form').submit((e) => {
    e.preventDefault();

    const amountText = $('#send_coins_amount').val();
    const amount = parseInt(amountText, 10);
    const address = $('#send_coins_address').val();


    solarUnitService.sendCoins(address, amount, localNode.getPrimaryAccount()).then((res) => {
      console.log('the result of sending units', res);
      $('#message').addClass('alert alert-info').text(`Coins sent to ${address}`);
    });
  });

  setInterval(() => {
    // Account balance in Ether
    $('#label1').text(localNode.getFormattedBalance());

    // Block number
    const number = web3.eth.blockNumber;
    if ($('#label2').text() != number) { $('#label2').text(number).effect('highlight'); }

    // Solar unit balance
    SolarUnitService.getBalance(localNode.getPrimaryAccount()).then((solarUnitBalance) => {
      console.info('Retreived from rpc api. Solar unit balance', solarUnitBalance);

      if ($('#label3').text() != solarUnitBalance) {
        $('#label3').text(solarUnitBalance).effect('highlight');
      }
    });
  }, 3000);
});
