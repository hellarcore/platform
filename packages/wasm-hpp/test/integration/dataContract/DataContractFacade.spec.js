const crypto = require('crypto');
const getDataContractFixture = require('../../../lib/test/fixtures/getDataContractFixture');
const getBlsAdapterMock = require('../../../lib/test/mocks/getBlsAdapterMock');
const createStateRepositoryMock = require('../../../lib/test/mocks/createStateRepositoryMock');
const getPrivateAndPublicKeyForSigningFixture = require('../../../lib/test/fixtures/getPrivateAndPublicKeyForSigningFixture');

const { default: loadWasmDpp } = require('../../..');
let {
  HellarPlatformProtocol, DataContract, ValidationResult,
  DataContractFactory, DataContractCreateTransition, DataContractUpdateTransition,
} = require('../../..');

describe('DataContractFacade', () => {
  let hpp;
  let dataContract;
  let dataContractFactory;
  let rawDataContract;
  let stateTransitionMock;

  before(async () => {
    ({
      HellarPlatformProtocol, DataContract, ValidationResult, DataContractFactory,
      DataContractCreateTransition, DataContractUpdateTransition,
    } = await loadWasmDpp());
  });

  beforeEach(async function beforeEach() {
    stateTransitionMock = createStateRepositoryMock(this.sinon);
    hpp = new HellarPlatformProtocol({ generate: () => crypto.randomBytes(32) }, 1);

    dataContract = await getDataContractFixture();
    rawDataContract = dataContract.toObject();

    dataContractFactory = new DataContractFactory(
      1,
      { generate: () => crypto.randomBytes(32) },
    );
  });

  describe('create', () => {
    it('should create DataContract', () => {
      const result = hpp.dataContract.create(
        dataContract.getOwnerId(),
        dataContract.getDocumentSchemas(),
      );

      expect(result).to.be.an.instanceOf(DataContract);

      expect(result.getOwnerId().toBuffer()).to.deep.equal(dataContract.getOwnerId().toBuffer());
      expect(result.getDocumentSchemas()).to.deep.equal(dataContract.getDocumentSchemas());
    });
  });

  describe('createFromObject', () => {
    it('should create DataContract from plain object', async () => {
      const result = await hpp.dataContract.createFromObject(rawDataContract);

      expect(result).to.be.an.instanceOf(DataContract);

      expect(result.toObject()).to.deep.equal(dataContract.toObject());
    });
  });

  describe('createFromBuffer', () => {
    it('should create DataContract from string', async () => {
      const contract = hpp.dataContract.create(
        dataContract.getOwnerId(),
        dataContract.getDocumentSchemas(),
      );

      const result = await hpp.dataContract.createFromBuffer(contract.toBuffer());

      expect(result).to.be.an.instanceOf(DataContract);
      expect(result.toObject()).to.deep.equal(contract.toObject());
    });
  });

  describe('createDataContractCreateTransition', () => {
    it('should create DataContractCreateTransition from DataContract', async () => {
      const stateTransition = await dataContractFactory
        .createDataContractCreateTransition(dataContract);

      const result = hpp.dataContract.createDataContractCreateTransition(dataContract);

      expect(result).to.be.an.instanceOf(DataContractCreateTransition);

      expect(result.toObject()).to.deep.equal(stateTransition.toObject());
    });
  });

  describe('createDataContractUpdateTransition', () => {
    it('should create DataContractUpdateTransition from buffer', async () => {
      const dataContractBuffer = dataContract.toBuffer();

      const dataContractNew = await hpp.dataContract.createFromBuffer(dataContractBuffer);

      const updatedDataContract = await hpp.dataContract.createFromObject(
        dataContractNew.toObject(),
      );

      updatedDataContract.incrementVersion();

      const dataContractUpdateTransition = hpp.dataContract
        .createDataContractUpdateTransition(updatedDataContract);

      const { identityPublicKey, privateKey } = await getPrivateAndPublicKeyForSigningFixture();

      dataContractUpdateTransition.sign(
        identityPublicKey,
        privateKey,
        await getBlsAdapterMock(),
      );

      const buf = dataContractUpdateTransition.toBuffer();
      stateTransitionMock.fetchDataContract.resolves(dataContract);

      const st = await hpp.stateTransition.createFromBuffer(buf);

      expect(st).to.be.an.instanceOf(DataContractUpdateTransition);
    });
  });

  describe.skip('validate', () => {
    it('should validate raw data contract', async () => {
      const result = await hpp.dataContract.validate(rawDataContract);

      expect(result).to.be.an.instanceOf(ValidationResult);
      expect(result.getErrors().length).to.be.equal(0);
    });

    it('should validate DataContract instance', async () => {
      const result = await hpp.dataContract.validate(dataContract);

      expect(result).to.be.an.instanceOf(ValidationResult);
      expect(result.getErrors().length).to.be.equal(0);
    });
  });
});
