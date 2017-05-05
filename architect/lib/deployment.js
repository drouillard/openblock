const client = require('scp2');
const path = require('path');
const SSH = require('simple-ssh');
const fs = require('fs');
const async = require('async');
const os = require('os');

const homeDir = os.homedir();
const dashboardDir = 'workspace/dashboard';

const password = '12345678';

function copySshKey(host, user, callback) {
  const ssh = new SSH({
    host,
    user,
    pass: password,
  });

  ssh
  .exec('mkdir -p ~/.ssh', {
    out: console.log.bind(console),
  })
  .exec('cat >> ~/.ssh/authorized_keys', {
    in: fs.readFileSync(path.join(homeDir, '.ssh', 'id_rsa.pub')),
  })
  .exec('echo "ssh set up."', {
    out: console.log.bind(console),
    exit() {
      callback();
    },
  })
  .start();
}

function copyApp(host, username, callback) {
  const filePath = path.join(__dirname, '..', '..', 'dashboard');

  console.log('Copying over app from', filePath);

  client.scp(filePath, {
    port: 22,
    host,
    username,
    password,
    path: dashboardDir,
  }, callback);
}

function installDeps(host, user, callback) {
  console.log('Installing pm2. (May take a few minutes)');

  const ssh = new SSH({
    host,
    user,
    pass: password,
  });

  ssh.exec(`cd ${dashboardDir}; npm install`, {
    out: console.log.bind(console),
  }).exec('npm -g i pm2', {
    out: console.log.bind(console),
    exit(err) {
      console.log('finished setting up pm2');
      callback();
    },
  })
  .start();
}

const defaultCallback = () => {};

function deploy(host, username, callback) {
  async.series([
    copySshKey.bind(null, host, username),
    copyApp.bind(null, host, username),
    installDeps.bind(null, host, username),
    callback || defaultCallback, // Prevent error if no callback provided
  ]);
}

module.exports = deploy;
