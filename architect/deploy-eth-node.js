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
  { name: 'platform', type: String, defaultValue: '386' },
];

const options = commandLineArgs(optionDefinitions);

const host = options.host;
const username = options.username;
const platform = options.platform;

console.log(`Deploying an Ethereum Node at ${username}@${host}`);

if (!host) {
  console.error('No host address provided. Exiting.');
  process.exit(2);
}

if (!username) {
  console.error('No username provided. Exiting.');
  process.exit(2);
}

if (!platform) {
  console.error('No platform provided. Exiting.');
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

function localGethPath(version) {
  return path.join(__dirname, 'bin', version, 'geth');
}

function copyGeth(callback) {
  const filePath = localGethPath(platform);

  console.log('Copying over geth binary from', filePath);

  client.scp(filePath, {
    port: 22,
    host,
    username,
    password: '12345678',
    path: `${remoteWorkingDir}/geth`,
  }, callback);
}

function copyConfigFolder(callback) {
  const filePath = path.join(__dirname, 'config/');

  console.log('Copying over genesis block from', filePath);

  client.scp(filePath, {
    port: 22,
    host,
    username,
    password: '12345678',
    path: `${remoteWorkingDir}/config/`,
  }, callback);
}


function installPm2(callback) {
  console.log('Installing pm2. (May take a few minutes)');

  const ssh = new SSH({
    host,
    user: username,
    pass: '12345678',
  });

  ssh.exec('npm -g i pm2', {
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
  copyGeth,
  copyConfigFolder,
  installPm2,
]);
