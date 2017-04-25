const inquirer = require('inquirer');

// Commands
const ethStats = 'deployEthStats';
const exit = 'exit';
const bootnode = 'bootnode';

const COMMANDS = {
  ethStats,
  bootnode,
  exit,
};

// Configs

function deployBootnode() {
    // get config

    // fire it up

}

const commands = [
  {
    type: 'list',
    name: 'command',
    message: '\n\nWhat do you want to do?',
    choices: [
      new inquirer.Separator(),
      {
        name: 'Deploy Eth stats',
        value: COMMANDS.ethStats,
      },
      {
        name: 'Deploy Bootnode',
        value: { key: COMMANDS.bootnode, help: 'Deploy bootnode locally' },
      },
      'Setup Edison',
      'List local processes',
      {
        name: 'Contact support',
        value: 'support',
      },
      {
        name: 'Exit',
        value: COMMANDS.exit,
      },
    ],
  },
];

function ask() {
  inquirer.prompt(commands).then((responses) => {
    const command = responses.command;

    console.log('Proceessing command: ', command);

    if (!command || command === COMMANDS.exit) {
      return;
    }

    ask();
  });
}

ask();
