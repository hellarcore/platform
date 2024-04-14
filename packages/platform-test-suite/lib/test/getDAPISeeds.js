const HAPIAddress = require('@hellarpro/hapi-client/lib/hapiAddressProvider/HAPIAddress');

function getHAPISeeds() {
  return process.env.HAPI_SEED
    .split(',')
    .map((seed) => {
      const address = new HAPIAddress(seed);

      return address.toJSON();
    });
}

module.exports = getHAPISeeds;
