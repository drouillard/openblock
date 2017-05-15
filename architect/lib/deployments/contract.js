const path = require('path');
const contractDir = path.join(__dirname, '../../../dashboard/solarunit');

function deployContract(host, username, contractId, callback) {
  // Todo switch on contract id. For now only 1 contract

  callback();
}


module.exports = deployContract;
