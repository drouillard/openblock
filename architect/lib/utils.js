const globals = require('../../dashboard/config/globals.json');

function ethStatsUrl(ip, name) {
  const ethStatsPassword = globals.ethStatsPassword;
  const ethStatsPort = globals.ethStatsPort;
  if (!name) {
    console.warn('No machine name provided for eth stats url. This name helps identify machine on the Eth Stats Dashboard.');
  }
  const machineName = name || 'anonymous';

  return `${machineName}:${ethStatsPassword}@${ip}:${ethStatsPort}`;
}

function bootnodeUrl(ip) {
  const bootnodeAddress = globals.bootnodeAddress;

  // By default the bootnode address references the local machine.
  // In our case we are deploying accross different machines so we need
  // to subsitute in our local IP
  const configuredBootnodeAddress = bootnodeAddress.replace('[::]', ip);
  // console.info('Configured bootnode address', configuredBootnodeAddress);

  return configuredBootnodeAddress;
}

module.exports = {
  ethStatsUrl,
  bootnodeUrl,
};
