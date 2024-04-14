const chai = require('chai');
const sinon = require('sinon');

const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');

const { default: loadWasmDpp, HellarPlatformProtocol } = require('@hellarpro/wasm-hpp');

const generateRandomIdentifierAsync = require('@hellarpro/wasm-hpp/lib/test/utils/generateRandomIdentifierAsync');
const getDataContractFixture = require('@hellarpro/wasm-hpp/lib/test/fixtures/getDataContractFixture');

const {
  v0: {
    GetDataContractResponse,
  },
} = require('@hellarpro/hapi-grpc');

const DriveStateRepository = require('../../../lib/hpp/DriveStateRepository');

chai.use(chaiAsPromised);
chai.use(dirtyChai);

const { expect } = chai;

describe('DriveStateRepository', () => {
  let hpp;
  let driveClientMock;
  let stateRepository;
  let dataContractFixture;
  let proto;

  before(async () => {
    await loadWasmDpp();
  });

  beforeEach(async function before() {
    dataContractFixture = await getDataContractFixture();

    hpp = new HellarPlatformProtocol(null, 1);

    proto = new GetDataContractResponse();
    proto.setV0(
      new GetDataContractResponse.GetDataContractResponseV0()
        .setDataContract(dataContractFixture.toBuffer()),
    );

    driveClientMock = sinon.stub();
    driveClientMock.fetchDataContract = this.sinon.stub().resolves(
      proto.serializeBinary(),
    );

    stateRepository = new DriveStateRepository(driveClientMock, hpp);
  });

  describe('#fetchDataContract', () => {
    it('should fetch and parse data contract', async () => {
      const contractId = await generateRandomIdentifierAsync();
      const result = await stateRepository.fetchDataContract(contractId);

      expect(result.toObject()).to.be.deep.equal(dataContractFixture.toObject());

      expect(driveClientMock.fetchDataContract).to.be.calledOnce();
      expect(driveClientMock.fetchDataContract).to.be.calledWithExactly(contractId, false);
    });
  });
});
