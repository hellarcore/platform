[Back to the main page](/README.md)

# HAPI configuration

HAPI is configured via environment variables. So, for example, in order to change rpc server port, you need to run `RPC_SERVER_PORT=3010 npm start`.

## Full list of available options

* `LIVENET` - boolean. Set to true if you are going to run HAPI on the livenet. Defaults to `false`.
* `RPC_SERVER_PORT` - integer. Port on which HAPI server will listen. Defaults to `3000`
* `HELLARCORE_RPC_PROTOCOL` string. Protocol for connecting to hellarcore RPC. Defaults to `http`
* `HELLARCORE_RPC_USER`. Defaults to `hellarrpc`
* `HELLARCORE_RPC_PASS`. Defaults to `password`
* `HELLARCORE_RPC_HOST`. Defaults to `127.0.0.1`
* `HELLARCORE_RPC_PORT`. Defaults to `30002`
* `HELLARCORE_ZMQ_HOST`. Defaults to `127.0.0.1`
* `HELLARCORE_ZMQ_PORT`. Defaults to `30003`
* `HELLARCORE_P2P_HOST`. Defaults to `127.0.0.1`
* `HELLARCORE_P2P_PORT`. Defaults to `30001`
* `DRIVE_RPC_HOST`. Defaults to `127.0.0.1`
* `DRIVE_RPC_PORT`. Defaults to `6000`
* `HELLARCORE_P2P_NETWORK`. Can be `testnet`, `regtest` and `livenet`. Defaults to `testnet`
* `NETWORK` Can be `testnet`, `regtest` and `livenet` Defaults to `testnet`
* `BLOOM_FILTER_PERSISTENCE_TIMEOUT` - integer. Bloom filter persistence timeout in milliseconds. Defaults to 1 minute.

[Back to the main page](/README.md)
