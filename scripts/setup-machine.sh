#!/bin/bash


REMOTE_IP=''
LOCAL_MACHINE_IP=`ifconfig $(netstat -rn | grep -E "^default|^0.0.0.0" | head -1 | awk '{print $NF}') | grep 'inet ' | awk '{print $2}' | grep -Eo '([0-9]*\.){3}[0-9]*'`
BOOTNODE_IP='this ip'
ETH_STATS='this ip'

echo "Setting up ssh keys..."
./setup-ssh.sh $REMOTE_IP

echo "Copying over geth with config"
./setup-node.sh $REMOTE_IP

echo "Starting geth node w/dashboard"
./start-geth.sh $REMOTE_IP $BOOTNODE_IP $ETH_STATS_IP

echo "Done."
