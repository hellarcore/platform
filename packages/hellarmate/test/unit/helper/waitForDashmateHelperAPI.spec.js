import HomeDir from '../../../src/config/HomeDir.js';
import getBaseConfigFactory from '../../../configs/defaults/getBaseConfigFactory.js';
import getConfigMock from '../../../src/test/mock/getConfigMock.js';
import waitForHellarmateHelperAPI from '../../../src/helper/waitForHellarmateHelperAPI.js';

describe('waitForHellarmateHelperAPI', () => {
  let config;
  let mockFetch;

  beforeEach(async function it() {
    mockFetch = this.sinon.stub(global, 'fetch');

    config = getConfigMock(this.sinon);
  });

  beforeEach(async () => {
    const getBaseConfig = getBaseConfigFactory(HomeDir.createTemp());

    config = getBaseConfig();
  });

  it('should throw error if API is not enabled', async () => {
    try {
      await waitForHellarmateHelperAPI(config);

      expect.fail('should throw error');
    } catch (e) {
      expect(e.message).to.be.equal('Hellarmate helper HTTP API is not enabled for base');
    }
  });

  it('should wait until hellarmate helper come up', async () => {
    config.set('hellarmate.helper.api.enable', true);

    // imitate network errors (ECONNRESET and such)
    mockFetch.throws();

    // should not resolve, because fetch should be throwing errors
    await new Promise((resolve, reject) => {
      waitForHellarmateHelperAPI(config).then(reject).catch(reject);

      setTimeout(resolve, 1000);
    });

    // set invalid status code
    mockFetch.resolves({ status: 500 });

    // throw invalid status code for 1s
    await new Promise((resolve, reject) => {
      waitForHellarmateHelperAPI(config).then(reject).catch(reject);

      setTimeout(resolve, 1000, { delay: 100 });
    });

    // start resolving 200
    mockFetch.resolves({ status: 200 });

    await waitForHellarmateHelperAPI(config);
  });
});
