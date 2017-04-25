#!/bin/bash
# if you are actively developing this script use scp
# scp ./setup.sh root@<device>:~/

NODE_VERSION=v7.8.0

echo "Node version ${NODE_VERSION}"

if [ -z "${NODE_VERSION}" ]; then
  echo "Must specify a version of node.js to install"
  exit 1
fi


# Need to ensure a .bashrc exists so nvm
# can setup system to use version of node.js it installs
if [ ! -f ~/.bashrc ]; then
    echo ".bashrc not found. Creating..."
    touch ~/.bashrc
fi

# Install nvm
# nvm will help us install the correct version of Node.js
echo "Installing nvm..."
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash

# So we can use nvm
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install supported version of node.js
echo "Using nvm to install node version [$NODE_VERSION]..."
nvm install $NODE_VERSION

# Make installed version the default for any new terminal shell
nvm alias default $NODE_VERSION

# Display installed version to confirm instal was successful
echo "Using node.js version is $(node -v) found at $(which node)"

echo -e '\n'
echo Done.
