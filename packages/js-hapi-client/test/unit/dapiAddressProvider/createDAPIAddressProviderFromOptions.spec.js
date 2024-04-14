const createHAPIAddressProviderFromOptions = require(
  '../../../lib/hapiAddressProvider/createHAPIAddressProviderFromOptions',
);
const ListHAPIAddressProvider = require('../../../lib/hapiAddressProvider/ListHAPIAddressProvider');
const SimplifiedMasternodeListHAPIAddressProvider = require('../../../lib/hapiAddressProvider/SimplifiedMasternodeListHAPIAddressProvider');

const networkConfigs = require('../../../lib/networkConfigs');

const HAPIClientError = require('../../../lib/errors/HAPIClientError');

describe('createHAPIAddressProviderFromOptions', () => {
  describe('hapiAddressProvider', () => {
    let options;
    let hapiAddressProvider;

    beforeEach(() => {
      hapiAddressProvider = Object.create(null);

      options = {
        network: 'evonet',
        hapiAddressProvider,
      };
    });

    it('should return AddressProvider from `hapiAddressProvider` option', async () => {
      const result = createHAPIAddressProviderFromOptions(options);

      expect(result).to.equal(hapiAddressProvider);
    });

    it('should throw HAPIClientError if `hapiAddresses` option is passed too', async () => {
      options.hapiAddresses = ['localhost'];

      try {
        createHAPIAddressProviderFromOptions(options);

        expect.fail('should throw HAPIClientError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIClientError);
      }
    });

    it('should throw HAPIClientError if `seeds` option is passed too', async () => {
      options.seeds = ['127.0.0.1'];

      try {
        createHAPIAddressProviderFromOptions(options);

        expect.fail('should throw HAPIClientError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIClientError);
      }
    });

    it('should throw HAPIClientError if `hapiAddressesWhiteList` option is passed too', async () => {
      options.hapiAddressesWhiteList = ['127.0.0.1'];

      try {
        createHAPIAddressProviderFromOptions(options);

        expect.fail('should throw HAPIClientError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIClientError);
      }
    });
  });

  describe('hapiAddresses', () => {
    let options;

    beforeEach(() => {
      options = {
        hapiAddresses: ['localhost'],
        network: 'local',
      };
    });

    it('should return ListHAPIAddressProvider with addresses', async () => {
      const result = createHAPIAddressProviderFromOptions(options);

      expect(result).to.be.an.instanceOf(ListHAPIAddressProvider);
    });

    it('should throw HAPIClientError if `seeds` option is passed too', async () => {
      options.seeds = ['127.0.0.1'];

      try {
        createHAPIAddressProviderFromOptions(options);

        expect.fail('should throw HAPIClientError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIClientError);
      }
    });

    it('should throw HAPIClientError if `hapiAddressesWhiteList` option is passed too', async () => {
      options.hapiAddressesWhiteList = ['127.0.0.1'];

      try {
        createHAPIAddressProviderFromOptions(options);

        expect.fail('should throw HAPIClientError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIClientError);
      }
    });
  });

  describe('seeds', () => {
    let options;

    beforeEach(() => {
      options = {
        seeds: ['127.0.0.1'],
        network: 'local',
        loggerOptions: {
          identifier: '',
        },
      };
    });

    it('should return SimplifiedMasternodeListHAPIAddressProvider based on seeds', async () => {
      const result = createHAPIAddressProviderFromOptions(options);

      expect(result).to.be.an.instanceOf(SimplifiedMasternodeListHAPIAddressProvider);
    });
  });

  describe('network', () => {
    let options;

    beforeEach(() => {
      options = {
        network: Object.keys(networkConfigs)[0],
        loggerOptions: {
          identifier: '',
        },
      };
    });

    it('should create address provider from `network` options', async () => {
      const result = createHAPIAddressProviderFromOptions(options);

      expect(result).to.be.an.instanceOf(SimplifiedMasternodeListHAPIAddressProvider);
    });

    it('should throw HAPIClientError if there is no config for a specified network', async () => {
      options.network = 'unknown';

      try {
        createHAPIAddressProviderFromOptions(options);

        expect.fail('should throw HAPIClientError');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HAPIClientError);
      }
    });
  });
});
