## Fetching an identity from its name

Assuming you have created an identity and attached a name to it (see how to [register an identity](https://hellarplatform.readme.io/docs/tutorial-register-an-identity) and how to [attach it to a name](https://hellarplatform.readme.io/docs/tutorial-register-a-name-for-an-identity)),
you will then be able to directly recover an identity from its names. See below: 

```js
const client = new Hellar.Client({
  wallet: {
    mnemonic: '', // Your app mnemonic, which holds the identity
  },
});

// This is the name previously registered in HPNS.
const identityName = 'alice';

const nameDocument = await client.platform.names.resolve(`${identityName}.hellar`);
const identity = await client.platform.identities.get(nameDocument.ownerId);
```
