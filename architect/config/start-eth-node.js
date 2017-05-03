const execSync = require('child_process').execSync;

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'bootnodes', type: String },
  { name: 'ethstats', type: String },
  { name: 'name', type: String },
  { name: 'profile', type: String },
];

const options = commandLineArgs(optionDefinitions);
const bootnodes = options.bootnodes;
const ethstats = options.ethstats;
const profile = options.profile;
let name = options.name;

const ethStatsPassword = 'd'; // AKA WS_SECRET

if (!name) {
  console.warn('No name was provided. This name is used to unqeuly identify this node on the Ethstats service');
  name = 'No name';
}

// foo:d@192.168.1.133:3000
const ethStatsArg = `${name}:${ethStatsPassword}@${ethstats}`;

// initialze it
execSync('./geth --datadir chain init config/genesis.json');

// prepare to copy over known profile
// this is required as only known profiles can seal blocks in POA
execSync('mkdir -p chain/keystore');

if (profile) {
  // e.g. cp config/signer-2.json chain/keystore
  execSync(`cp config/${profile}.json chain/keystore`);
} else {
  console.warn('No profile name provided. A fresh profile will be created but it will be unable to seal blocks.');
}

const gethOptions = [
  '--datadir ./chain',
  '--networkid 9999',
  '--verbosity 3',
  '--unlock 0',
  '--password config/signer.pass',
  '--mine',
  `--ethstats=${ethStatsArg}`,
  `--bootnodes=${bootnodes}`,
  "--rpc --rpccorsdomain '*'",
  "--rpcaddr '0.0.0.0'",
];

// e.g. if you wanted to run the console
// ./geth --datadir ./chain --networkid 9999 --verbosity 3 --unlock 0 --password config/signer.pass --mine --ethstats='foo:d@192.168.1.133:3000' --bootnodes "enode://34023dbf5fbe45b8a0986bd3a831580f490b09a044ea26fb7e570e772c5a7188ffe00c961aba2a256f9ab594cecc626be90d447737186e8911df3b4ac7a6f6f5@192.168.1.133:30301"  console
execSync(`./geth ${gethOptions.join(' ')}`);
