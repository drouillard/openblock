const inquirer = require('inquirer');
const pm2 = require('pm2');
const deploy = require('./lib/deployment');
const ip = require('ip');
const SSH = require('simple-ssh');
const utils = require('./lib/utils');

const password = '12345678';

// Commands
const ethStats = 'ethStats';
const exit = 'exit';
const bootnode = 'bootnode';
const deployNode = 'deployNode';
const startNode = 'startNode';

const commands = {
  ethStats,
  bootnode,
  exit,
  deployNode,
  startNode,
};

// Commands that require follow-up questions
const hierarchicalCommands = [deployNode, startNode];

// Configs
const ethNodeOptions = [
  {
    type: 'input',
    name: 'host',
    message: 'Please enter host/IP info (xxx.xxx.xxx.xxx)',
  },
  {
    type: 'input',
    name: 'user',
    message: 'Please enter user',
    default: 'root',
  },
];

const gethOptions = [
  {
    type: 'list',
    name: 'platform',
    message: '\n\nSelect platform',
    choices: [
      new inquirer.Separator(),
      {
        name: 'Intel Edison',
        value: '386',
      },
      {
        name: 'Raspberry Pi',
        value: 'arm7',
      },
      {
        name: 'Linux (Generic)',
        value: 'linux',
      },
    ],
  },
  {
    type: 'list',
    name: 'profile',
    message: '\n\nSelect profile ',
    choices: [
      new inquirer.Separator(),
      {
        name: 'Miner #1',
        value: 'signer-1',
      },
      {
        name: 'Miner #2',
        value: 'signer-2',
      },
      {
        name: 'None (unable to mine)',
        value: null,
      },
    ],
  },
  {
    type: 'input',
    name: 'name',
    message: 'Please enter name to appear on Eth Stats dashboard',
  },
  {
    type: 'confirm',
    name: 'reset',
    message: 'Do you want to reset the blockchain data if it exists?',
    default: false,
  },
];

const startOptions = ethNodeOptions.slice(0).concat(gethOptions);

function deployBootnode() {
  pm2.connect((err) => {
    if (err) {
      console.error('Unable to start bootnode', err);
      process.exit(2);
    }

    console.log('\n\nDeploying bootnode...');

    pm2.start({
      script: './deploy-bootnode.js',         // Script to be run
    }, (e) => {
      pm2.disconnect();   // Disconnects from PM2
      if (e) throw err;
    });
  });
}

function deployEthStats() {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    console.log('Deploying eth stats');

    pm2.start({
      script: './deploy-eth-stats.js',         // Script to be run
    }, (e) => {
      pm2.disconnect();   // Disconnects from PM2
      if (e) throw err;
    });
  });
}

function deployEthNode() {
  console.log('Deploying Ethereum Node');

  inquirer.prompt(ethNodeOptions).then((response) => {
    const host = response.host;
    const user = response.user;

    console.log('Setting up a new machine', host, user);
    deploy(host, user, ask);
  });
}

function startEthNode() {
  const localIp = ip.address();

  console.log('Starting geth and dashboard');
  console.log('Current ip is', localIp);

  inquirer.prompt(startOptions).then((response) => {
    const host = response.host;
    const user = response.user;
    const platform = response.platform;
    const profile = response.profile;
    const name = response.name;
    const reset = response.reset;

    const bootnodeUrl = utils.bootnodeUrl(localIp);
    const ethStatsUrl = utils.ethStatsUrl(localIp, name);

    const ssh = new SSH({
      host,
      user,
      pass: password,
    });

    const args = [
      `--ethstats ${ethStatsUrl}`,
      `--platform ${platform}`,
      `--profile ${profile}`,
      `--reset ${reset}`,
      `--bootnodes ${bootnodeUrl}`,
    ];

    const argsStr = args.join(' ');

    console.log('Starting geth with options:', argsStr);

    ssh.exec(`cd ~/workspace/dashboard; pm2 delete start-geth; pm2 start start-geth.js -- ${argsStr}`, {
      out: console.log.bind(console),
    }).exec('cd ~/workspace/dashboard; pm2 delete www; pm2 start ./bin/www', {
      out: console.log.bind(console),
      exit() {
        console.log('finished starting geth and dashboard');
        ask();
      },
    })
    .start();

    // Ask until user quits
  });
}


const options = [
  {
    type: 'list',
    name: 'command',
    message: '\n\nWhat do you want to do?',
    choices: [
      new inquirer.Separator(),
      {
        name: 'Deploy Eth stats',
        value: {
          key: commands.ethStats,
          func: deployEthStats,
          help: 'Deploy eth stats locally',
        },
      },
      {
        name: 'Deploy Bootnode',
        value: {
          key: commands.bootnode,
          func: deployBootnode,
          help: 'Deploy bootnode locally',
        },
      },
      {
        name: 'Deploy Ethereum Node',
        value: {
          key: commands.deployNode,
          func: deployEthNode,
          help: 'Deploy Edison',
        },
      },
      {
        name: 'Start Geth and Dashboard',
        value: {
          key: commands.startNode,
          func: startEthNode,
          help: 'Start Geth and Dashboard',
        },
      },
      'List local processes',
      {
        name: 'Exit',
        value: {
          key: commands.exit,
          help: 'Exit Program',
        },
      },
    ],
  },
];


function ask() {
  inquirer.prompt(options).then((responses) => {
    const command = responses.command;

    console.log('Proceessing command: ', command);

    if (!command || command.key === commands.exit) {
      return;
    }

    if (command.func) {
      command.func();
    }

    // Ask until user quits
    // Do not ask yet if follow-up questions have to be asked
    if (hierarchicalCommands.indexOf(command.key) === -1) {
      console.log('Asking again');
      ask();
    }
  });
}

// Start initial prompt
ask();
