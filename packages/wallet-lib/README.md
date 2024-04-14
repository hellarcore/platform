# Wallet Library

[![NPM Version](https://img.shields.io/npm/v/@hellarpro/wallet-lib)](https://www.npmjs.com/package/@hellarpro/wallet-lib)
[![Build Status](https://github.com/hellarpay/platform/actions/workflows/release.yml/badge.svg)](https://github.com/hellarpay/platform/actions/workflows/release.yml)
[![Release Date](https://img.shields.io/github/release-date/hellarpay/platform)](https://github.com/hellarpay/platform/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

A pure and extensible JavaScript Wallet Library for Hellar

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Documentation](#documentation)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)


## Background

[Hellar](https://www.hellar.io) is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the Hellar network allows for highly resilient Hellar infrastructure, and the developer community needs reliable, open-source tools to implement Hellar apps and services.

## Install

### Node

In order to use this library, you will need to add it to your project as a dependency.

Having [NodeJS](https://nodejs.org/) installed, just type in your terminal :

```sh
npm install @hellarpro/wallet-lib
```

### CDN Standalone

For browser usage, you can also directly rely on unpkg. Below, we also assume you use [localForage](https://github.com/localForage/localForage) as your persistence adapter.

```
<script src="https://unpkg.com/@hellarpro/wallet-lib"></script>
<script src="https://unpkg.com/localforage"></script>
const wallet = new Wallet({adapter: localforage});
```

## Usage

In your file, where you want to execute it :

```js
const { Wallet, EVENTS } = require('@hellarpro/wallet-lib');

const wallet = new Wallet();

// We can dump our initialization parameters
const mnemonic = wallet.exportWallet();

// Hook on headers and TX sync progress events
wallet.on(EVENTS.HEADERS_SYNC_PROGRESS, (progressInfo) => {
  const {
    confirmedProgress,
    totalProgress,
    confirmedSyncedCount,
    totalSyncedCount,
    totalCount
  } = progressInfo;
})

wallet.on(EVENTS.TRANSACTIONS_SYNC_PROGRESS, (progressInfo) => {
  const {
    progress,
    syncedBlocksCount,
    totalBlocksCount,
    transactionsCount
  } = progressInfo;
})

wallet.getAccount().then((account) => {
  // At this point, account has fetch all UTXOs if they exists
  const balance = account.getTotalBalance();
  console.log(`Balance: ${balance}`);

  // We easily can get a new address to fund
  const { address } = account.getUnusedAddress();
});
```

Wallet will by default connects to HAPI and use either localforage (browser based device) or a InMem adapter.
Account will by default be on expected BIP44 path (...0/0).

### Transports:

Insight-Client has been removed from MVP and is not working since Wallet-lib v3.0.

- [HAPI-Client](https://github.com/hellarpay/platform/tree/master/packages/js-hapi-client)

### Adapters :

- [LocalForage](https://github.com/localForage/localForage)
- [ReactNative AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage)

## Documentation

You can see some [examples here](docs/usage/examples.md).

More extensive documentation is available at https://hellarpay.github.io/platform/Wallet-library/ along with additional [examples & snippets](https://hellarpay.github.io/platform/Wallet-library/usage/examples/).

## Maintainers

Wallet-Lib is maintained by the [Hellar Core Developers](https://www.github.com/hellarpay).
We want to thank all members of the community that have submitted suggestions, issues and pull requests.

## Contributing

Feel free to dive in! [Open an issue](https://github.com/hellarpay/platform/issues/new/choose) or submit PRs.

## License

[MIT](LICENSE) &copy; Hellar Core Group, Inc.