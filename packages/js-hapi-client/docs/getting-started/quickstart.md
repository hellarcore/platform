# Quick start

## ES5/ES6 via NPM

In order to use this library in Node, you will need to add it to your project as a dependency.

Having [NodeJS](https://nodejs.org/) installed, just type in your terminal :

```sh
npm install @hellarpro/hapi-client
```

## CDN Standalone

For browser usage, you can also directly rely on unpkg :

```
<script src="https://unpkg.com/@hellarpro/hapi-client"></script>
```

You can see an [example usage here](https://github.com/hellarpro/js-hapi-client/blob/master/examples/web/web.usage.html) 

## Initialization

```js
const HAPIClient = require('@hellarpro/hapi-client');
const client = new HAPIClient();

(async () => {
  const bestBlockHash = await client.core.getBestBlockHash();
  console.log(bestBlockHash);
})();
```

## Quicknotes

This package allows you to fetch & send information from both the payment chain (layer 1) and the application chain (layer 2, a.k.a Platform chain).
