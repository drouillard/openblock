const commandLineArgs = require('command-line-args');
const Client = require('scp2').Client;
const client = require('scp2');
const path = require('path');

const gethFilePath = path.join(__dirname, 'bin', '386', 'geth');
// const genesisFilePath = '';
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

client.scp(gethFilePath, {
  port: 22,
  host,
  username,
  password: '12345678',
  path: `${remoteWorkingDir}/geth`,
}, (err) => {});

// const client = new Client({
// });
//
// console.log('client is ', client);
//
// client.mkdir(remoteWorkingDir, () => {
//   client.scp(gethFilePath, {
//     path: remoteWorkingDir,
//   }, (err) => {});
// });
// Copy over geth


// Copy over genesis block
