# Hellar SDK

[![NPM Version](https://img.shields.io/npm/v/hellar)](https://www.npmjs.org/package/hellar)
[![Release Packages](https://github.com/hellarpay/platform/actions/workflows/release.yml/badge.svg)](https://github.com/hellarpay/platform/actions/workflows/release.yml)
[![Release Date](https://img.shields.io/github/release-date/hellarpay/platform)](https://github.com/hellarpay/platform/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

Hellar library for JavaScript/TypeScript ecosystem (Wallet, HAPI, Primitives, BLS, ...)

Hellar library provides access via [HAPI](https://hellarplatform.readme.io/docs/explanation-hapi) to use both the Hellar Core network and Hellar Platform on [supported networks](https://github.com/hellarpay/platform/#supported-networks). The Hellar Core network can be used to broadcast and receive payments. Hellar Platform can be used to manage identities, register data contracts for applications, and submit or retrieve application data via documents.

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Install

### ES5/ES6 via NPM

In order to use this library, you will need to add it to your project as a dependency.

Having [NodeJS](https://nodejs.org/) installed, just type : `npm install hellar` in your terminal.

```sh
npm install hellar
```


### CDN Standalone

For browser usage, you can also directly rely on unpkg : 

```
<script src="https://unpkg.com/hellar"></script>
```

## Usage

```js
const Hellar = require("hellar"); // or import Hellar from "hellar"

const client = new Hellar.Client({
  wallet: {
    mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
  },
  apps: {
    tutorialContract: {
      // Learn more on how to register Data Contract
      // https://hellarplatform.readme.io/docs/tutorial-register-a-data-contract#registering-the-data-contract
      contractId: "<tutorial-contract-id>" 
    }
  }
});

// Accessing an account allow you to transact with the Hellar Network
client.wallet.getAccount().then(async (account) => {
  console.log('Funding address', account.getUnusedAddress().address);

  const balance = account.getConfirmedBalance();
  console.log('Confirmed Balance', balance);

  if (balance > 0) {
    // Obtain identity - the base of all platform interactions
    // Read more on how to create an identity here: https://hellarplatform.readme.io/docs/tutorial-register-an-identity
    const identityIds = account.identities.getIdentityIds();
    const identity = await client.platform.identities.get(identityIds[0]);

    // Prepare a new document containing a simple hello world sent to a hypothetical tutorial contract
    const document = await client.platform.documents.create(
      'tutorialContract.note',
      identity,
      { message: 'Hello World' },
    );

    // Broadcast the document into a new state transition
    await client.platform.documents.broadcast({ create: [document] }, identity);

    // Retrieve documents
    const documents = await client.platform.documents.get('tutorialContract.note', {
      limit: 2,
    });

    console.log(documents);
  }
});
```

### Primitives and essentials
Hellar SDK bundled into a standalone package, 
so that the end user never have to worry about mananaging polyfills or related dependencies 

```javascript
const Hellar = require('hellar')

const {
  Essentials: {
    Buffer  // Node.JS Buffer polyfill.
  },
  Core: { // @hellarpro/hellarcore-lib essentials
    Transaction, 
    PrivateKey,
    BlockHeader,
    // ...
  },
  PlatformProtocol: { // @hellarpro/wasm-hpp essentials
    Identity,
    Identifier,
  },
  WalletLib: { // @hellarpro/wallet-lib essentials
    EVENTS
  },
  HAPIClient, // @hellarpro/hapi-client
} = Hellar;
``` 

## Dependencies 

The Hellar SDK works using multiple dependencies that might interest you:
- [Wallet-Lib](https://github.com/hellarpay/platform/tree/master/packages/wallet-lib) - Wallet management for handling, signing and broadcasting transactions (BIP-44 HD).
- [hellarcore-Lib](https://github.com/hellarpay/hellarcore-lib) - Provides the main L1 blockchain primitives (Block, Transaction,...).
- [HAPI-Client](https://github.com/hellarpay/platform/tree/master/packages/js-hapi-client) - Client library for accessing HAPI endpoints.
- [Wasm-DPP](https://github.com/hellarpay/platform/tree/master/packages/wasm-hpp) - Implementation  of Hellar Platform Protocol.

Some features might be more extensive in those libs, as Hellar SDK only wraps around them to provide a single interface that is easy to use (and thus has less features).

## Documentation

More extensive documentation available at https://hellarpay.github.io/platform/SDK/.

## Contributing

Feel free to dive in! [Open an issue](https://github.com/hellarpay/platform/issues/new/choose) or submit PRs.

## License

[MIT](/LICENSE) © Hellar Core Group, Inc.
