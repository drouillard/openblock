const deploy = require('./lib/deployment');

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'username', alias: 'u', type: String },
  { name: 'host', alias: 'h', type: String },
];

const options = commandLineArgs(optionDefinitions);

const host = options.host;
const username = options.username;

if (!host) {
  console.error('No host address provided. Exiting.');
  process.exit(2);
}

if (!username) {
  console.error('No username provided. Exiting.');
  process.exit(2);
}

console.log(`Deploying an Ethereum Node at ${username}@${host}`);

function done() {
  console.log('Finished deployment');
}

deploy(host, username, done);
