const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const path = require('path');
const wsSecret = require('../dashboard/config/globals.json').ethStatsPassword;

const destinationFolder = path.join(__dirname, 'tmp', 'eth-stats');

function installDependencies() {
  // download eth stats
  console.log('Downloading eth stats to ', destinationFolder);

  exec(`git clone --depth=1 https://github.com/karalabe/eth-netstats ${destinationFolder}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    console.log('Installing dependencies');
    execSync('npm install && npm install -g grunt-cli && grunt', { cwd: destinationFolder });
    run();
  });
}

function run() {
  console.log('Starting eth stats dashboard...');
  execSync(`WS_SECRET=${wsSecret} npm start`, { cwd: destinationFolder });
}


if (fs.existsSync(destinationFolder)) {
  console.warn('eth stats has already been downloaded');
  run();
  process.exit();
} else {
  fs.ensureDirSync(destinationFolder);
  installDependencies();
  run();
}
