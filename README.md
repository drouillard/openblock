

## Bootnode

```
./bootnode --verbosity 9 -nodekey openblock_bootnode.key
```

Initializing

```
geth --dev --datadir ./chain init ./config/genesis.json
```

Connecting
```
./geth --dev --networkid 9090 --port 9999 --bootnodes "enode://34023dbf5fbe45b8a0986bd3a831580f490b09a044ea26fb7e570e772c5a7188ffe00c961aba2a256f9ab594cecc626be90d447737186e8911df3b4ac7a6f6f5@192.168.1.133:30301" --datadir ./chain console
```
