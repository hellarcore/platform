## Sign and verify messages

Hellar SDK exports the Message constructor inside the Core namespace `new Hellar.Core.Message`

```js
const Hellar = require('hellar');

const mnemonic = '';

const client = new Hellar.Client({
  wallet: {
    mnemonic,
  },
});

async function signAndVerify() {
  const account = await client.wallet.getAccount();

  const pk = new Hellar.Core.PrivateKey();
  const message = new Hellar.Core.Message('hello, world');
  const signed = account.sign(message, pk);
  const verified = message.verify(pk.toAddress().toString(), signed.toString());
}
```
