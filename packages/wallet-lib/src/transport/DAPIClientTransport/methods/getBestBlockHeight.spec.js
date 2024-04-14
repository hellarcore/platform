const { expect } = require('chai');

const HAPIClientTransport = require('../HAPIClientTransport');

const getStatus = require('../../FixtureTransport/methods/getStatus');

describe('transports - HAPIClientTransport - .getBestBlockHeight', function suite() {
  let fixture;
  let transport;
  let clientMock;

  beforeEach(() => {
    fixture = getStatus();

    clientMock = {
      core: {
        getStatus: () => fixture,
      }
    }

    transport = new HAPIClientTransport(clientMock);
  })

  afterEach(() => {
    transport.disconnect();
  })

  it('should work', async () => {
    const res = await transport.getBestBlockHeight();

    expect(res).to.deep.equal(fixture.blocks);
  });
});
