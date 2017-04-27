const inquirer = require('inquirer');
const pm2 = require('pm2');

// Commands
const ethStats = 'ethStats';
const exit = 'exit';
const bootnode = 'bootnode';
const ethNode = 'ethNode';

const commands = {
  ethStats,
  bootnode,
  exit,
  ethNode,
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
    const ipAddress = response;

    console.log('Ip address ', ipAddress);

    // Ask until user quits
    ask();
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
          key: commands.ethNode,
          func: deployEthNode,
          help: 'Deploy Edison',
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
    if (command.key !== commands.ethNode) {
      console.log('Asking again');
      ask();
    }
  });
}


ask();
