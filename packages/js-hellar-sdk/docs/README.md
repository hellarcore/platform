# Hellar SDK

[![NPM Version](https://img.shields.io/npm/v/hellar)](https://www.npmjs.org/package/hellar)
[![Release Packages](https://github.com/hellarpay/platform/actions/workflows/release.yml/badge.svg)](https://github.com/hellarpay/platform/actions/workflows/release.yml)
[![Release Date](https://img.shields.io/github/release-date/hellarpay/platform)](https://github.com/hellarpay/platform/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

Hellar library for JavaScript/TypeScript ecosystem (Wallet, HAPI, Primitives, BLS, ...)

Hellar library provides access via [HAPI](https://hellarplatform.readme.io/docs/explanation-hapi) to use both the Hellar Core network and Hellar Platform on [supported networks](https://github.com/hellarpay/platform/#supported-networks). The Hellar Core network can be used to broadcast and receive payments. Hellar Platform can be used to manage identities, register data contracts for applications, and submit or retrieve application data via documents.

## Install

### From NPM
In order to use this library, you will need to add our [NPM package](https://www.npmjs.com/hellar) to your project.

Having [NodeJS](https://nodejs.org/) installed, just type:

```bash
npm install hellar
```

### From unpkg
```html
<script src="https://unpkg.com/hellar"></script>
```

### Usage examples

- [Generate a mnemonic](examples/generate-a-new-mnemonic.md)
- [Receive money and display balance](examples/receive-money-and-check-balance.md)
- [Pay to another address](examples/pay-to-another-address.md)
- [Use another BIP44 account](examples/use-different-account.md)

### Hellar Platform Tutorials

See the [Tutorial section](https://hellarplatform.readme.io/docs/tutorials-introduction) of the Hellar Platform documentation for examples.

## Licence

[MIT](https://github.com/hellarpro/hellarjs/blob/master/LICENCE.md) © Hellar Core Group, Inc.
