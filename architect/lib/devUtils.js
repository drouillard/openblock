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

function localPath(asset) {
  console.info('updating asset: ', asset);
  return path.join(__dirname, '../../dashboard', asset);
}

function remotePath(asset) {
  return `workspace/dashboard/${asset}`;
}

function updateDashboardAsset(host, username, asset, callback) {
  execScp(host, username, localPath(asset), remotePath(asset), callback);
}

function updateGenesisConfig(host, username, callback) {
  const asset = 'config/genesis.json';
  execScp(host, username, localPath(asset), remotePath(asset), callback);
}

function updateStartGethScript(host, username, callback) {
  const asset = 'start-geth.js';
  execScp(host, username, localPath(asset), remotePath(asset), callback);
}

function updateDashboardMainJs(host, username, callback) {
  const asset = 'public/javascripts/main.js';
  execScp(host, username, localPath(asset), remotePath(asset), callback);
}

function updateDashboardIndex(host, username, callback) {
  const asset = 'views/index.ejs';
  execScp(host, username, localPath(asset), remotePath(asset), callback);
}

function updateSealingLedScript(host, username, callback) {
  const asset = 'sealing-led.js';
  execScp(host, username, localPath(asset), remotePath(asset), callback);
}

module.exports = {
  updateDashboardMainJs,
  updateDashboardIndex,
  updateGenesisConfig,
  updateSealingLedScript,
  updateStartGethScript,
  updateDashboardAsset,
};
