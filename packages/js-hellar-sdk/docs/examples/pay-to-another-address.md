## Paying to another address

In order to pay, you need to have an [existing balance](../examples/receive-money-and-check-balance.md).   
The below code will allow you to pay to a single address a specific amount of satoshis.

```js
const Hellar = require('hellar');

const mnemonic = ''; // your mnemonic here.
const client = new Hellar.Client({
  wallet: {
    mnemonic,
  },
});

async function payToRecipient(account) {
  const transaction = account.createTransaction({
    recipient: 'yNPbcFfabtNmmxKdGwhHomdYfVs6gikbPf',
    satoshis: 10000,
  });
  const transactionId = await account.broadcastTransaction(transaction);
}

client.wallet.getAccount().then(payToRecipient);

```

See more on create [transaction options here](https://hellarpay.github.io/platform/Wallet-library/account/createTransaction/).
