import Web3 from 'web3';

/**
 * Get local host without port number
 */
function getHost() {
  let host = window.location.host;
  const portPosition = host.indexOf(':');

  if (portPosition > -1) {
    host = host.substring(0, portPosition);
  }

  return host;
}

let instance;

export default class Web3Configurer {
  static getInstance() {
    instance = instance || new Web3(new Web3.providers.HttpProvider(`http://${getHost()}:8545`));
    return instance;
  }
}
