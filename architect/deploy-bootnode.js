const spawn = require('child_process').spawn;
const path = require('path');

const cmd = spawn('../bin/darwin/bootnode', ['--verbosity', '9', '--nodekey', path.join(__dirname, 'config', 'nodekey')]);

cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
