# hellarcore Lib primitives

All hellarcore lib primitives are exposed via the `Core` namespace.

```js
const Hellar = require('hellar');
const {
  Core: {
    Block,
    Transaction,
    Address,
    // ...
  }
} = Hellar;
```

## Transaction 

The Transaction primitive allows creating and manipulating transactions. It also allows signing transactions with a private key.  
Supports fee control and input/output access (which allows passing a specific script).

```js
const { Transaction } = Hellar.Core;
const tx = new Transaction(txProps)
```

Access the [Transaction documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/transaction.md)

## Address

Standardized representation of a Hellar Address. Address can be instantiated from a String, PrivateKey, PublicKey, HDPrivateKey or HdPublicKey.  
Pay-to-script-hash (P2SH) multi-signature addresses from an array of PublicKeys are also supported.  

```js
const { Address } = Hellar.Core;
```

Access the [Address documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/address.md)

## Block

Given a binary representation of the block as input, the Block class allows you to have a deserialized representation of a Block or its header. It also allows validating the transactions in the block against the header merkle root.

The block's transactions can also be explored by iterating over elements in array (`block.transactions`).  

`const { Block } = Hellar.Core;`

Access the [Block documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/block.md)

## UnspentOutput

Representation of an UnspentOutput (also called UTXO as in Unspent Transaction Output).  
Mostly useful in association with a Transaction and for Scripts. 

`const { UnspentOutput } = Hellar.Core.Transaction;`

Access the [UnspentOutput documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/unspentoutput.md)

## HDPublicKey

Hierarchical Deterministic (HD) version of the PublicKey.  
Used internally by Wallet-lib and for exchange between peers (HellarPay)

const { HDPublicKey } = Hellar.Core;`

Access the [HDKeys documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/hierarchical.md#hdpublickey)

## HDPrivateKey

Hierarchical Deterministic (HD) version of the PrivateKey.  
Used internally by Wallet-lib.

`const { HDPrivateKey } = Hellar.Core;`

Access the [HDKeys documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/hierarchical.md#hdprivatekey)

## PublicKey

`const { PublicKey } = Hellar.Core;`

Access the [PublicKey documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/publickey.md)

## PrivateKey

`const { PrivateKey } = Hellar.Core;`

Access the [PrivateKey documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/privatekey.md)

## Mnemonic

Implementation of [BIP39 Mnemonic code for generative deterministic keys](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).  
Generates a random mnemonic with the chosen language, validates a mnemonic or returns the associated HDPrivateKey.  

`const { Mnemonic } = Hellar.Core;`

Access the [Mnemonic documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/mnemonic.md)

## Network

A representation of the internal parameters relative to the selected network. By default, all primitives works with 'livenet'.

`const { Network } = Hellar.Core;`


Access the [Network documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/networks.md)

## Script

`const { Script } = Hellar.Core.Transaction;`

Access the [Script documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/script.md)


## Input

`const { Input } = Hellar.Core.Transaction;`

Access the [Transaction documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/transaction.md#adding-inputs)


## Output

`const { Output } = Hellar.Core.Transaction;`

Access the [Transaction documentation on hellarpay/hellarcore-lib](https://github.com/hellarpay/hellarcore-lib/blob/master/docs/core-concepts/transaction.md#handling-outputs)
