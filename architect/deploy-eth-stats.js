const fs = require('fs-extra');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const path = require('path');

const destinationFolder = path.join(__dirname, 'tmp', 'eth-stats');

function run() {
  // const options = {
  //   name: 'Architect',
  // };
  console.log('Starting npm install process');

  execSync('npm install && npm install -g grunt-cli && grunt && npm start', { cwd: destinationFolder });
}

if (fs.existsSync(destinationFolder)) {
  console.warn('eth stats has already been downloaded');
  run();
  process.exit();
} else {
  fs.ensureDirSync(destinationFolder);
}

// download eth stats
console.log('Downloading eth stats to ', destinationFolder);

exec(`git clone --depth=1 https://github.com/karalabe/eth-netstats ${destinationFolder}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  run();
});


// , options, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });
// }
