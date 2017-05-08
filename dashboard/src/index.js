import $ from 'jquery';
import Web3Enabled from './web3-enabled';
import LocalNode from './local-node';
import SolarCoinService from './solar-coin-service';

require('jquery-ui-bundle');

// import SolidityCoder from 'web3/lib/solidity/coder';

const web3 = Web3Enabled.getInstance();

// export on dev console
window.web3 = web3;

// Setup filter to watch transactions

const filter = web3.eth.filter('latest');

filter.watch((error, result) => {
  if (error) return;

  const block = web3.eth.getBlock(result, true);
  console.log(`block #${block.number}`, block);

  console.dir(block.transactions);

  // for (let index = 0; index < block.transactions.length; index++) {
  //   const t = block.transactions[index];
  //
  //   // Decode from
  //   const from = t.from == account ? 'me' : t.from;
  //
  //   // Decode function
  //   const func = findFunctionByHash(functionHashes, t.input);
  //
  //   if (func == 'sellEnergy') {
  //     // This is the sellEnergy() method
  //     var inputData = SolidityCoder.decodeParams(['uint256'], t.input.substring(10));
  //     console.dir(inputData);
  //     $('#transactions').append(`<tr><td>${t.blockNumber
  //       }</td><td>${from
  //       }</td><td>` + 'ApolloTrade' +
  //       `</td><td>sellEnergy(${inputData[0].toString()})</td></tr>`);
  //   } else if (func == 'buyEnergy') {
  //     // This is the buyEnergy() method
  //     var inputData = SolidityCoder.decodeParams(['uint256'], t.input.substring(10));
  //     console.dir(inputData);
  //     $('#transactions').append(`<tr><td>${t.blockNumber
  //       }</td><td>${from
  //       }</td><td>` + 'ApolloTrade' +
  //       `</td><td>buyEnergy(${inputData[0].toString()})</td></tr>`);
  //   } else {
  //     // Default log
  //     $('#transactions').append(`<tr><td>${t.blockNumber}</td><td>${from}</td><td>${t.to}</td><td>${t.input}</td></tr>`);
  //   }
  // }
});

// Update labels
$(() => {
  console.log('Document ready');
  const localNode = new LocalNode();
  const solarCoinService = new SolarCoinService();

  $('#send_coins_form').submit((e) => {
    e.preventDefault();

    const amountText = $('#send_coins_amount').val();
    const amount = parseInt(amountText, 10);
    const address = $('#send_coins_address').val();


    solarCoinService.sendCoins(address, amount, localNode.getPrimaryAccount()).then((res) => {
      console.log('the result of sending coins', res);
      $('#message').addClass('alert alert-info').text(`Coins sent to ${address}`);
    });
  });

  setInterval(() => {
    // Account balance in Ether
    $('#label1').text(localNode.getBalance());

    // Block number
    const number = web3.eth.blockNumber;
    if ($('#label2').text() != number) { $('#label2').text(number).effect('highlight'); }

    // Solar coin balance
    solarCoinService.getBalance(localNode.getPrimaryAccount()).then((solarCoinBalance) => {
      console.info('Retreived from rpc api. Solar coin balance', solarCoinBalance);

      if ($('#label3').text() != solarCoinBalance) {
        $('#label3').text(solarCoinBalance).effect('highlight');
      }
    });
  }, 3000);
});
