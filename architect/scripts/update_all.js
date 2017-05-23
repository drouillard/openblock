const async = require('async');
const SSH = require('simple-ssh');

const devUtils = require('../lib/devUtils');
const password = require('../../dashboard/config/globals.json').remoteMachineRootPassword;

// customize to your setup
const hosts = ['10.3.245.107', '10.3.245.117', '10.3.245.125', '10.3.245.165', '10.3.245.178', '10.3.245.186', '10.3.245.197'];

const user = 'root';
const cmds = [];

function done() {
  console.log('Update complete');
}

// function cb(err, result) {
//   console.log('err and result', err, result);
// }

function restartLedProcess(host, username, callback) {
  console.log(`Starting Led process on host: ${host}`);
  const ssh = new SSH({
    host,
    user: username,
    pass: password,
  });

  ssh
  .exec('cd ~/workspace/dashboard; pm2 delete led-notifications; pm2 start --name led-notifications npm -- run sealing-led', {
    out: console.log.bind(console),
    exit() {
      console.log('finished starting geth and dashboard');
      callback();
    },
  })
  .start();
}

function updateLedScript(host, username, callback) {
  console.log(`Updating ${host}`);
  devUtils.updateSealingLedScript(host, username, callback);
}

function updateIndexEjs(host, username, callback) {
  console.log(`Updating ${host}`);
  devUtils.updateDashboardIndex(host, username, callback);
}

function updateContracts(host, username, callback) {
  console.log(`Updating contracts via main js at: ${host}`);
  devUtils.updateDashboardMainJs(host, username, callback);
}
// hosts.forEach((host) => { cmds.push(updateLedScript.bind(null, host, user)); });
// hosts.forEach((host) => { cmds.push(restartLedProcess.bind(null, host, user)); });

hosts.forEach((host) => { cmds.push(updateIndexEjs.bind(null, host, user)); });

hosts.forEach((host) => { cmds.push(updateContracts.bind(null, host, user)); });


cmds.push(done);

async.series(cmds);
