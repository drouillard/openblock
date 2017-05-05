const inquirer = require('inquirer');
const pm2 = require('pm2');
const deploy = require('./lib/deployment');
const ip = require('ip');

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
  },
];

const gethOptions = [
  {
    type: 'list',
    name: 'command',
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
];

const startOptions = ethNodeOptions.slice(0).concat(gethOptions);

function deployBootnode() {
  pm2.connect((err) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    console.log('Deploying bootnode');

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
  console.log('Deploying Edison');

  inquirer.prompt(ethNodeOptions).then((response) => {
    const host = response.host;
    const user = response.user;

    console.log('User provided', host, user);
    deploy(host, user, ask);
  });
}

function startEthNode() {
  console.log('Starting geth and dashboard');
  console.log('Current ip is', ip.address());

  inquirer.prompt(startOptions).then((response) => {
    const host = response.host;
    const user = response.user;
    const platform = response.platform;

    console.log('Starting node with options', host, user, platform);

    const ssh = new SSH({
      host,
      user,
      pass: password,
    });

    ssh.exec('cd ~/workspace/dashboard; pm2 run node start-geth', {
      out: console.log.bind(console),
    }).exec('npm -g i pm2', {
      out: console.log.bind(console),
      exit(err) {
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
    if (command.key !== deployNode || command.key !== startNode) {
      console.log('Asking again');
      ask();
    }
  });
}

// Start initial prompt
ask();
