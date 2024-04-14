**Usage**: `await client.core.getTransaction(id, options)`  
**Description**: Allow to fetch a transaction by ID

Parameters:

| parameters                | type                | required       | Description                                                                                      |
|---------------------------|---------------------|----------------| ------------------------------------------------------------------------------------------------ |
| **id**                    | string              | yes            | A valid transaction id to fetch  |
| **options**               | HAPIClientOptions   | no             |  |

Returns : {Promise<null|Buffer>} - The bufferized transaction
