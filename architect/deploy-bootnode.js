const spawn = require('child_process').spawn;
const path = require('path');

const bootnodeBinPath = path.join(__dirname, '..', 'dashboard', 'bin', 'geth', 'darwin', 'bootnode');
const nodekeyPath = path.join(__dirname, '..', 'dashboard', 'config', 'nodekey');

const cmd = spawn(bootnodeBinPath, ['--verbosity', '9', '--nodekey', nodekeyPath]);

cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
