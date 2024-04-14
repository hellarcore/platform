## HAPI-Client

[![NPM Version](https://img.shields.io/npm/v/@hellarpro/hapi-client)](https://www.npmjs.com/package/@hellarpro/hapi-client)
[![Build Status](https://github.com/hellarpro/js-hapi-client/actions/workflows/test_and_release.yml/badge.svg)](https://github.com/hellarpro/js-hapi-client/actions/workflows/test_and_release.yml)
[![Release Date](https://img.shields.io/github/release-date/hellarpro/hapi-client)](https://github.com/hellarpro/hapi-client/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen)](https://github.com/RichardLitt/standard-readme)

Client library used to access Hellar HAPI endpoints

This library enables HTTP-based interaction with the Hellar blockchain and Hellar
Platform via the decentralized API ([HAPI](https://github.com/hellarpro/hapi))
hosted on Hellar masternodes.

 - `HAPI-Client` provides automatic server (masternode) discovery using either a default seed node or a user-supplied one
 - `HAPI-Client` maps to HAPI's [RPC](https://github.com/hellarpro/hapi/tree/master/lib/rpcServer/commands) and [gRPC](https://github.com/hellarpro/hapi/tree/master/lib/grpcServer/handlers) endpoints

### Install

### ES5/ES6 via NPM

In order to use this library in Node, you will need to add it to your project as a dependency.

Having [NodeJS](https://nodejs.org/) installed, just type in your terminal :

```sh
npm install @hellarpro/hapi-client
```

### CDN Standalone

For browser usage, you can also directly rely on unpkg :

```
<script src="https://unpkg.com/@hellarpro/hapi-client"></script>
```


## Licence

[MIT](https://github.com/hellarpro/hapi-client/blob/master/LICENCE.md) © Hellar Core Group, Inc.
