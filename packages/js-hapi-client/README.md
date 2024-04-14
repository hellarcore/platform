# HAPI Client

[![NPM Version](https://img.shields.io/npm/v/@hellarpro/hapi-client)](https://www.npmjs.com/package/@hellarpro/hapi-client)
[![Build Status](https://github.com/hellarpay/platform/actions/workflows/release.yml/badge.svg)](https://github.com/hellarpay/platform/actions/workflows/release.yml)
[![Release Date](https://img.shields.io/github/release-date/hellarpay/platform)](https://github.com/hellarpay/platform/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

Client library used to access Hellar HAPI endpoints

This library enables HTTP-based interaction with the Hellar blockchain and Hellar
Platform via the decentralized API ([HAPI](https://github.com/hellarpro/hapi))
hosted on Hellar masternodes.

 - `HAPI-Client` provides automatic server (masternode) discovery using either a default seed node or a user-supplied one
 - `HAPI-Client` maps to HAPI's [RPC](https://github.com/hellarpay/platform/tree/master/packages/hapi/lib/rpcServer/commands) and [gRPC](https://github.com/hellarpay/platform/tree/master/packages/hapi/lib/grpcServer/handlers) endpoints

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
npm install @hellarpro/hapi-client
```

## Usage

### Basic

```javascript
const HAPIClient = require('@hellarpro/hapi-client');
const client = new HAPIClient();

client.core.getStatus().then((coreStatus) => {
  console.dir(coreStatus);
});
```

### Custom seed node

Custom seed nodes are necessary for connecting the client to devnets since the client library is unaware of them otherwise.

```javascript
const HAPIClient = require('@hellarpro/hapi-client');

var client = new HAPIClient({
  seeds: [{
     host: 'seed-1.evonet.networks.hellar.io',
     port: 443,
  }],
});

client.core.getBestBlockHash().then((r) => {
  console.log(r);
});
```

**Note**: The seed node shown above (`seed-1.evonet.networks.hellar.io`) is for the Hellar Evonet testing network.

### Custom addresses

Custom addresses may be directly specified in cases where it is beneficial to know exactly what node(s) are being accessed (e.g. debugging, local development, etc.).

```javascript
const HAPIClient = require('@hellarpro/hapi-client');

var client = new HAPIClient({
  hapiAddresses: [
    '127.0.0.1:443',
    '127.0.0.2:443',
  ],
});

client.core.getBestBlockHash().then((r) => {
  console.log(r);
});
```

### Command specific options

HAPI Client options can be passed directly to any command to override any predefined client options and modify the client's behavior for that specific call.

```javascript
const HAPIClient = require('@hellarpro/hapi-client');

// Set options to direct the request to a specific address and disable retries
const options = {
  hapiAddresses: ['127.0.0.1'],
  retries: 0,
};

client.core.getBestBlockHash(options).then((r) => {
  console.log(r);
});
```

## Documentation

More extensive documentation available at https://hellarpay.github.io/platform/HAPI-Client/.


## Contributing

Feel free to dive in! [Open an issue](https://github.com/hellarpay/platform/issues/new/choose) or submit PRs.

## License

[MIT](LICENSE) &copy; Hellar Core Group, Inc.
