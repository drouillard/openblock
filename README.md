

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
