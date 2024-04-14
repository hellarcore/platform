const HAPIClient = require('../../lib/HAPIClient');
const CoreMethodsFacade = require('../../lib/methods/core/CoreMethodsFacade');
const PlatformMethodsFacade = require('../../lib/methods/platform/PlatformMethodsFacade');
const SimplifiedMasternodeListHAPIAddressProvider = require('../../lib/hapiAddressProvider/SimplifiedMasternodeListHAPIAddressProvider');
const ListHAPIAddressProvider = require('../../lib/hapiAddressProvider/ListHAPIAddressProvider');
const BlockHeadersProvider = require('../../lib/BlockHeadersProvider/BlockHeadersProvider');

describe('HAPIClient', () => {
  let options;
  let hapiClient;

  describe('#constructor', () => {
    it('should construct HAPIClient with options', async () => {
      options = {
        retries: 0,
        newOption: true,
      };

      hapiClient = new HAPIClient(options);

      expect(hapiClient.options).to.deep.equal({
        network: 'testnet',
        retries: 0,
        newOption: true,
        timeout: 10000,
        blockHeadersProviderOptions: BlockHeadersProvider.defaultOptions,
        loggerOptions: {
          identifier: '',
        },
      });

      expect(hapiClient.hapiAddressProvider).to.be.an.instanceOf(
        SimplifiedMasternodeListHAPIAddressProvider,
      );

      expect(hapiClient.blockHeadersProvider).to.be.an.instanceOf(
        BlockHeadersProvider,
      );

      expect(hapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(hapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });

    it('should construct HAPIClient without options', async () => {
      hapiClient = new HAPIClient();

      expect(hapiClient.options).to.deep.equal({
        retries: 5,
        timeout: 10000,
        network: 'testnet',
        blockHeadersProviderOptions: BlockHeadersProvider.defaultOptions,
        loggerOptions: {
          identifier: '',
        },
      });

      expect(hapiClient.hapiAddressProvider).to.be.an.instanceOf(
        SimplifiedMasternodeListHAPIAddressProvider,
      );

      expect(hapiClient.blockHeadersProvider).to.be.an.instanceOf(
        BlockHeadersProvider,
      );

      expect(hapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(hapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });

    it('should construct HAPIClient with address options', async () => {
      options = {
        retries: 0,
        hapiAddresses: ['localhost'],
      };

      hapiClient = new HAPIClient(options);

      expect(hapiClient.options).to.deep.equal({
        retries: 0,
        hapiAddresses: ['localhost'],
        network: 'testnet',
        timeout: 10000,
        blockHeadersProviderOptions: BlockHeadersProvider.defaultOptions,
        loggerOptions: {
          identifier: '',
        },
      });

      expect(hapiClient.hapiAddressProvider).to.be.an.instanceOf(ListHAPIAddressProvider);

      expect(hapiClient.blockHeadersProvider).to.be.an.instanceOf(
        BlockHeadersProvider,
      );

      expect(hapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(hapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });

    it('should construct HAPIClient with network options', async () => {
      options = {
        retries: 3,
        network: 'local',
      };

      hapiClient = new HAPIClient(options);
      expect(hapiClient.options).to.deep.equal({
        retries: 3,
        network: 'local',
        timeout: 10000,
        blockHeadersProviderOptions: BlockHeadersProvider.defaultOptions,
        loggerOptions: {
          identifier: '',
        },
      });

      expect(hapiClient.hapiAddressProvider).to.be.an.instanceOf(ListHAPIAddressProvider);
      expect(hapiClient.blockHeadersProvider).to.be.an.instanceOf(
        BlockHeadersProvider,
      );
      expect(hapiClient.core).to.be.an.instanceOf(CoreMethodsFacade);
      expect(hapiClient.platform).to.be.an.instanceOf(PlatformMethodsFacade);
    });
  });
});
