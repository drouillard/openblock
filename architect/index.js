const inquirer = require('inquirer');
const pm2 = require('pm2');
const deployMachine = require('./lib/deployments/machine');
const deployContract = require('./lib/deployments/contract');

const devUtils = require('./lib/devUtils');

const ip = require('ip');
const SSH = require('simple-ssh');
const utils = require('./lib/utils');
const password = require('../dashboard/config/globals').remoteMachineRootPassword;

// Commands
const ethStats = 'ethStats';
const exit = 'exit';
const bootnode = 'bootnode';
const deployNode = 'deployNode';
const contractDeployment = 'contractDeployment';

const startNode = 'startNode';
const dev = 'dev';

const commands = {
  ethStats,
  bootnode,
  exit,
  deployNode,
  startNode,
  contractDeployment,
  dev,
};

// Commands that require follow-up questions
const hierarchicalCommands = [deployNode, startNode, contractDeployment, dev];

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
        name: 'Grid (Central account)',
        value: 'grid',
      },
      {
        name: 'Sealer #1 (pre-allocated)',
        value: 'sealer-1',
      },
      {
        name: 'Sealer #2',
        value: 'sealer-2',
      },
      {
        name: 'Sealer #3',
        value: 'sealer-3',
      },
      {
        name: 'None (unable to seal)',
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

const genesis = 'gensis';
const geth = 'geth';
const dashboardIndex = 'dashboardIndex';
const dashboardMain = 'dashboardMain';
const sealingLed = 'sealingLed';

const devOptions = [
  {
    type: 'list',
    name: 'command',
    message: '\n\nWhat would you like to deploy?',
    choices: [
      new inquirer.Separator(),
      {
        name: 'Update genesis config',
        value: genesis,
      },
      {
        name: 'Update start geth script',
        value: geth,
      },
      {
        name: 'Update dashboard index.ejs',
        value: dashboardIndex,
      },
      {
        name: 'Update dashboard main javaScript (single file)',
        value: dashboardMain,
      },
    ],
  },
];

const developmentOptions = devOptions.slice(0).concat(ethNodeOptions);

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
    deployMachine(host, user, ask);
  });
}

function deploySmartContract() {
  console.log('Deploying smart contract');

  inquirer.prompt(smartContractOptions).then((response) => {
    const host = response.host;
    const user = response.user;
    const contractId = response.contractId;

    console.log('Setting up a new machine', host, user);
    deployContract(host, user, contractId, ask);
  });
}

function startEthNode() {
  const localIp = ip.address();

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
    }).exec('cd ~/workspace/dashboard; pm2 delete led-notifications; pm2 start --name led-notifications npm -- run sealing-led', {
      out: console.log.bind(console),
    })
    .exec('cd ~/workspace/dashboard; pm2 delete www; pm2 start ./bin/www', {
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

function deployDevOptions() {
  inquirer.prompt(developmentOptions).then((response) => {
    const command = response.command;
    const host = response.host;
    const user = response.user;

    if (command === genesis) {
      devUtils.updateGenesisConfig(host, user, ask);
    } else if (command === geth) {
      devUtils.updateStartGethScript(host, user, ask);
    } else if (command === dashboardIndex) {
      devUtils.updateDashboardIndex(host, user, ask);
    } else if (command === dashboardMain) {
      devUtils.updateDashboardMainJs(host, user, ask);
    } else if (command === sealingLed) {
      devUtils.updateSealingLedScript(host, user, ask);
    }
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
        name: 'Deploy Bootnode (OS X only. Others start manually)',
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
          help: 'Start geth and dashboard',
        },
      },
      {
        name: 'Deploy Smart Contract',
        value: {
          key: commands.contractDeployment,
          func: deploySmartContract,
          help: 'Deploy Smart Contract',
        },
      },
      {
        name: 'Dev Options',
        value: {
          key: commands.dev,
          func: deployDevOptions,
          help: 'Update remote machines with new code',
        },
      },
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
