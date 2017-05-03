

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

```
./geth --datadir ./chain console
```

geth --datadir ./data --networkid 55661 --port 2002 --unlock 5cc640ae524f70c39081d65bc699b3b61a67bd3f console



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


## command addresses


0xedefac7152f8cb57f6f4d609598027fcc1f62fcc

> personal.newAccount('1')
"0xedefac7152f8cb57f6f4d609598027fcc1f62fcc"

Address: {421d0f55b9c8d26b328684c0daf793e6e1f66639}

 enode: "enode://741a38d084ff2306f00c9b726c6c989e9f76c0f7445f27f74641eae75aa557a0ec2a931ff928846e770b9d51fd4a40969c8e0113c572d4f7e436a843590236cb@69.14.184.4:30303",



 ## Puppeth commands


 ```
 '/geth init /genesis.json' > geth.sh && \{{if .Unlock}}
	echo 'mkdir -p /root/.ethereum/keystore/ && cp /signer.json /root/.ethereum/keystore/' >> geth.sh && \{{end}}

 	echo $'/geth --networkid {{.NetworkID}} --cache 512 --port {{.Port}} --maxpeers {{.Peers}} {{.LightFlag}} --ethstats \'{{.Ethstats}}\' {{if .Bootnodes}}--bootnodes {{.Bootnodes}}{{end}} {{if .Etherbase}}--etherbase {{.Etherbase}} --mine{{end}}{{if .Unlock}}--unlock 0 --password /signer.pass --mine{{end}}' >> geth.sh
  ````
