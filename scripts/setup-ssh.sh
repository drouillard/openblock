#!/bin/bash
SSH_KEY=`cat ~/.ssh/id_rsa.pub`
#SETUP_SCRIPT="`cat ./setup-machine.sh $SSH_KEY`"

#echo "Using SSH Key \n$SSH_KEY"

#echo "Setup script text \n $SETUP_SCRIPT"

# Run setup script on remote machine
#cat  | ssh root@192.168.1.115 /bin/bash

# Copy over SSH Keys
ssh -tt pi@192.168.1.141 << ENDSSH
  # ensure directory exists
  mkdir -p ~/.ssh

  # ensure file exists
  touch ~/.ssh/authorized_keys

  echo $SSH_KEY > ~/.ssh/authorized_keys
  exit
ENDSSH
