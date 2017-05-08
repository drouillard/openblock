const path = require('path');
const client = require('scp2');

const password = require('../../dashboard/config/globals.json').remoteMachineRootPassword;

function execScp(host, username, source, dest, callback) {
  client.scp(source, {
    port: 22,
    host,
    username,
    password,
    path: dest,
  }, callback);
}
// update gensis block

function updateGenesisConfig(host, username, callback) {
  const localPath = path.join(__dirname, '../../dashboard', 'config', 'genesis.json');
  const remotePath = 'workspace/dashboard/config/genesis.json';

  execScp(host, username, localPath, remotePath, callback);
}

// update start geth script
function updateStartGethScript(host, username, callback) {
  const localPath = path.join(__dirname, '../../dashboard', 'start-geth.js');
  const remotePath = 'workspace/dashboard/start-geth.js';

  execScp(host, username, localPath, remotePath, callback);
}

// update dashboard js. Extremely heavy as node_modules involved
function updateDashboard(host, username, callback) {
  const localPath = path.join(__dirname, '../../dashboard');
  const remotePath = 'workspace/dashboard';

  execScp(host, username, localPath, remotePath, callback);
}

function updateDashboardMainJs(host, username, callback) {
  const localPath = path.join(__dirname, '../../dashboard', 'public', 'javascripts', 'main.js');
  const remotePath = 'workspace/dashboard/public/javascripts/main.js';

  execScp(host, username, localPath, remotePath, callback);
}

function updateDashboardIndex(host, username, callback) {
  const localPath = path.join(__dirname, '../../dashboard', 'views', 'index.ejs');
  const remotePath = 'workspace/dashboard/views/index.ejs';

  execScp(host, username, localPath, remotePath, callback);
}

module.exports = {
  updateGenesisConfig,
  updateStartGethScript,
  updateDashboard,
  updateDashboardMainJs,
  updateDashboardIndex,
};
