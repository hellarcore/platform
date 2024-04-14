const HAPIClient = require('../../lib/HAPIClient');

const BlockHeadersProvider = require('../../lib/BlockHeadersProvider/BlockHeadersProvider');

describe('HAPIClient - integration', () => {
  let hapiClient;
  beforeEach(() => {
    hapiClient = new HAPIClient();
  });

  describe('BlockHeadersProvider', () => {
    it('should instantiate a BlockHeadersProvider from default options', () => {
      expect(hapiClient.blockHeadersProvider).to.be.instanceOf(BlockHeadersProvider);
    });

    it('should propagate ERROR event from BlockHeadersProvider', () => {
      let emittedError;
      hapiClient.on(HAPIClient.EVENTS.ERROR, (e) => {
        emittedError = e;
      });

      const errorToEmit = new Error('test error');
      hapiClient.blockHeadersProvider.emit(BlockHeadersProvider.EVENTS.ERROR, errorToEmit);

      expect(emittedError).to.equal(errorToEmit);
    });
  });
});
