**Usage**: `new HAPIClient(options)`  
**Description**: This method creates a new HAPIClient instance.

Parameters:

| parameters                                | type                | required[def value]         | Description                                                                                                                                                                    |
|-------------------------------------------|---------------------|-----------------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **options**                               | Object              |  |   |
| **options.hapiAddressProvider**           | HAPIAddressProvider | no[ListHAPIAddressProvider] | Allow to override the default hapiAddressProvider (do not allow seeds or hapiAddresses params)  |
| **options.seeds**                         | string[]            | no[seeds]                   | Allow to override default seeds (to connect to specific node) |
| **options.network**                       | string|Network      | no[=evonet]                 | Allow to setup the network to be used (livenet, testnet, evonet,..) |
| **options.timeout**                       | number              | no[=2000]                   | Used to specify the timeout time in milliseconds. |
| **options.retries**                       | number              | no[=3]                      | Used to specify the number of retries before aborting and erroring a request. |
| **options.baseBanTime**                   | number              | no[=6000]                   |  |

Returns : HAPIClient instance.

```js
const HAPIClient = require('@hellarpro/hapi-client');
const client = new HAPIClient({
  timeout: 5000,
  retries: 3,
  network: 'livenet'
});
```

**Notes**: 
- Accessing the SimplifiedMasternodeListHAPIAddressProvider (or its overwrote instance), can be accessed via `client.hapiAddressProvider`.  
 
