## About HAPI

HAPI (Decentralized API) is a distributed and decentralized endpoints provided by the Masternode Network.  
You can learn more about HAPI on the [HAPI-Client documentation](https://hellarpay.github.io/platform/HAPI-Client/).

## Get the HAPI-Client instance

When the Wallet-lib is initialized without any transporter, Wallet-lib will by default use HAPI-Client as a transporter. 
You can fetch the current instance of HAPI directly from the wallet : 

```js
  const wallet = new Wallet();
  const client = wallet.transport;
```

## Modify the seeds

By using your own HAPI-Client instance and passing it to the Wallet constructor (using `transport` argument). You can specify your own seeds to connect to.  

```js 
const HAPIClient = require('@hellarpro/hapi-client');
const { Wallet } = require('./src');
const HAPIClientTransport = require('./src/transport/HAPIClientTransport/HAPIClientTransport.js');

const client = new HAPIClient({
  seeds: [{ service: '18.236.131.253:3000' }],
  timeout: 20000,
  retries: 5,
});
const transport = new HAPIClientTransport(client);
const wallet = new Wallet({ transport });
```
