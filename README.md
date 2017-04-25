

## Bootnode

```
./bootnode --verbosity 9 -nodekey openblock_bootnode.key
```

## Initializing a node

```
geth --dev --datadir ./chain init ./config/genesis.json
```

## Running
```
./geth --dev --networkid 9090 --port 9999 --bootnodes "enode://34023dbf5fbe45b8a0986bd3a831580f490b09a044ea26fb7e570e772c5a7188ffe00c961aba2a256f9ab594cecc626be90d447737186e8911df3b4ac7a6f6f5@192.168.1.133:30301" --datadir ./chain console
```

### Bootnodes

Connecting using a bootnode

```
./geth --dev --networkid 9090 --port 9999 --bootnodes "enode://34023dbf5fbe45b8a0986bd3a831580f490b09a044ea26fb7e570e772c5a7188ffe00c961aba2a256f9ab594cecc626be90d447737186e8911df3b4ac7a6f6f5@192.168.1.133:30301" --datadir ./chain console
```

## Finding nodes on the network

We recommend (fing)[https://www.fing.io/].

** project authors have no affiliation with fing and receive no compensation for this recommendation. Fing is not open-source. For licensing and use questions please contact fing.

# Manually adding peers

admin.addPeer('enode://5c4a0303e27e50a0c75bfcaa6234e902144f5d7f16177a66d0dffb03bdb5ca8b8446dbe13aa9b956eeefaa7695f08a5130bb63e2c1a68c8f7906ddea08c62539@192.168.1.141:46482?discport=0')

## Developing

When testing on local hardware the easiest way is to copy over your files directly using SSH.

scp or rsync can be used to accomplish this.

In project root run the following command. You will be prompted to enter the password of the user you are logging into the remote machine as in order to copy the files over.

```
scp -r ./ <username>@<ip>:<destination>

```

For Raspberry Pi 3 we could use the following command assuming we are using the default users home directory as the parent directory.

```
scp -r ./ pi@<Raspberry PI 3 ip>:~/openblock
```




### Puppeth

To begin, ensure you have setup SSH keys on all nodes.

#### Configure genesis block

Run

```
./puppeth
```

Then enter prompts

Network name: openblock
Consensus: Clique
Block times: 15
Valid addresses

Accounts to seal

0000000000000000000000000000000000000001
0000000000000000000000000000000000000002
<hit enter to proceed>

Accounts to pre-fund

0000000000000000000000000000000000000001
0000000000000000000000000000000000000002
<hit enter to proceed>

network id: 9999

Anything fun: [None]


#### Setup ethstats

Allows you to see your network


#### Modify Geth

```
mkdir -p ./tmp
cd ./tmp
git clone git@github.com:ethereum/go-ethereum.git
cd go-ethereum
```

Makes changes

### Compiling custom geth

(Link)[https://github.com/ethereum/go-ethereum/wiki/Cross-compiling-Ethereum]

Requires Docker

To build for Rapsberry PI and Edison (Takes around 5 minutes)
```
   go get -u github.com/karalabe/xgo
   make geth-linux-386 geth-linux-arm-7
```

Edison : geth-linux-386

Rapsberry-pi 3: geth-linux-arm-7
