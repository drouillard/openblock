const commandLineArgs = require('command-line-args');
const client = require('scp2');
const path = require('path');
const SSH = require('simple-ssh');
const fs = require('fs');
const async = require('async');
const os = require('os');

const homeDir = os.homedir();
const remoteWorkingDir = 'workspace';

const optionDefinitions = [
  { name: 'username', alias: 'u', type: String },
  { name: 'host', alias: 'h', type: String },
];

const options = commandLineArgs(optionDefinitions);

const host = options.host;
const username = options.username;

console.log(`Deploying an Ethereum Node at ${username}@${host}`);

if (!host) {
  console.error('No host address provided. Exiting.');
  process.exit(2);
}

if (!username) {
  console.error('No username provided. Exiting.');
  process.exit(2);
}


function copySshKey(callback) {
  const ssh = new SSH({
    host,
    user: username,
    pass: '12345678',
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

function copyApp(callback) {
  const filePath = path.join(__dirname, '..', 'app');

  console.log('Copying over app from', filePath);

  client.scp(filePath, {
    port: 22,
    host,
    username,
    password: '12345678',
    path: `${remoteWorkingDir}/app`,
  }, callback);
}

function installDeps(callback) {
  console.log('Installing pm2. (May take a few minutes)');

  const ssh = new SSH({
    host,
    user: username,
    pass: '12345678',
  });

  ssh.exec('cd ~/workspace/app; npm install', {
    out: console.log.bind(console),
  }).exec('npm -g i pm2', {
    out: console.log.bind(console),
    exit() {
      console.log('finished setting up pm2');
      callback();
    },
  })
  .start();
}

async.series([
  copySshKey,
  copyApp,
  installDeps,
]);
