const getDataContractFixture = require('@hellarpro/wasm-hpp/lib/test/fixtures/getDataContractFixture');
const {
  v0: {
    GetDataContractHistoryResponse,
    ResponseMetadata,
    Proof: ProofResponse,
  },
} = require('@hellarpro/hapi-grpc');

const GetDataContractHistoryResponseClass = require('../../../../../lib/methods/platform/getDataContractHistory/GetDataContractHistoryResponse');
const getMetadataFixture = require('../../../../../lib/test/fixtures/getMetadataFixture');
const getProofFixture = require('../../../../../lib/test/fixtures/getProofFixture');
const InvalidResponseError = require('../../../../../lib/methods/platform/response/errors/InvalidResponseError');
const Proof = require('../../../../../lib/methods/platform/response/Proof');
const Metadata = require('../../../../../lib/methods/platform/response/Metadata');

describe('GetDataContractHistoryResponse', () => {
  let getDataContractHistoryResponse;
  let metadataFixture;
  let dataContractFixture;
  let proofFixture;
  let dataContractHistoryFixture;

  beforeEach(async () => {
    metadataFixture = getMetadataFixture();
    dataContractFixture = await getDataContractFixture();
    dataContractHistoryFixture = {
      2000: dataContractFixture.toBuffer(),
      3000: dataContractFixture.toBuffer(),
    };
    proofFixture = getProofFixture();

    getDataContractHistoryResponse = new GetDataContractHistoryResponseClass(
      dataContractHistoryFixture,
      new Metadata(metadataFixture),
    );
  });

  it('should return data contract history', () => {
    const dataContract = getDataContractHistoryResponse.getDataContractHistory();
    const proof = getDataContractHistoryResponse.getProof();

    expect(dataContract).to.deep.equal(dataContractHistoryFixture);
    expect(proof).to.equal(undefined);
  });

  it('should return proof', () => {
    getDataContractHistoryResponse = new GetDataContractHistoryResponseClass(
      {},
      new Metadata(metadataFixture),
      new Proof(proofFixture),
    );

    const dataContract = getDataContractHistoryResponse.getDataContractHistory();
    const proof = getDataContractHistoryResponse.getProof();

    expect(dataContract).to.deep.equal({});
    expect(proof).to.be.an.instanceOf(Proof);
    expect(proof.getGrovedbProof()).to.deep.equal(proofFixture.merkleProof);
    expect(proof.getQuorumHash()).to.deep.equal(proofFixture.quorumHash);
    expect(proof.getSignature()).to.deep.equal(proofFixture.signature);
  });

  it('should create an instance from proto', () => {
    const {

      GetDataContractHistoryResponseV0,
    } = GetDataContractHistoryResponse;

    const {
      DataContractHistory,
      DataContractHistoryEntry,
    } = GetDataContractHistoryResponseV0;

    const dataContractHistoryEntryProto = new DataContractHistoryEntry();
    dataContractHistoryEntryProto.setDate(1000);
    dataContractHistoryEntryProto.setValue(dataContractFixture.toBuffer());

    const dataContractHistoryEntryProto2 = new DataContractHistoryEntry();
    dataContractHistoryEntryProto2.setDate(2000);
    dataContractHistoryEntryProto2.setValue(dataContractFixture.toBuffer());

    const dataContractHistoryProto = new DataContractHistory();
    dataContractHistoryProto.setDataContractEntriesList([
      dataContractHistoryEntryProto,
      dataContractHistoryEntryProto2,
    ]);

    // Each entry has date and value, and value also has a value?

    const proto = new GetDataContractHistoryResponse();

    const metadata = new ResponseMetadata();
    metadata.setHeight(metadataFixture.height);
    metadata.setCoreChainLockedHeight(metadataFixture.coreChainLockedHeight);

    proto.setV0(
      new GetDataContractHistoryResponseV0()
        .setDataContractHistory(dataContractHistoryProto)
        .setMetadata(metadata),
    );

    getDataContractHistoryResponse = GetDataContractHistoryResponseClass.createFromProto(proto);

    expect(getDataContractHistoryResponse).to.be.an.instanceOf(GetDataContractHistoryResponseClass);
    expect(getDataContractHistoryResponse.getDataContractHistory()).to.deep.equal({
      1000: dataContractFixture.toBuffer(),
      2000: dataContractFixture.toBuffer(),
    });

    expect(getDataContractHistoryResponse.getMetadata())
      .to.be.an.instanceOf(Metadata);
    expect(getDataContractHistoryResponse.getMetadata().getHeight())
      .to.equal(metadataFixture.height);
    expect(getDataContractHistoryResponse.getMetadata().getCoreChainLockedHeight())
      .to.equal(metadataFixture.coreChainLockedHeight);

    expect(getDataContractHistoryResponse.getProof()).to.equal(undefined);
  });

  it('should create an instance with proof from proto', () => {
    const proofProto = new ProofResponse();

    proofProto.setQuorumHash(proofFixture.quorumHash);
    proofProto.setSignature(proofFixture.signature);
    proofProto.setGrovedbProof(proofFixture.merkleProof);

    const { GetDataContractHistoryResponseV0 } = GetDataContractHistoryResponse;
    const proto = new GetDataContractHistoryResponse();

    const metadata = new ResponseMetadata();
    metadata.setHeight(metadataFixture.height);
    metadata.setCoreChainLockedHeight(metadataFixture.coreChainLockedHeight);

    proto.setV0(
      new GetDataContractHistoryResponseV0()
        .setDataContractHistory(undefined)
        .setProof(proofProto)
        .setMetadata(metadata),
    );

    getDataContractHistoryResponse = GetDataContractHistoryResponseClass.createFromProto(proto);
    expect(getDataContractHistoryResponse).to.be.an.instanceOf(GetDataContractHistoryResponseClass);
    expect(getDataContractHistoryResponse.getDataContractHistory()).to.deep.equal({});

    expect(getDataContractHistoryResponse.getMetadata())
      .to.be.an.instanceOf(Metadata);
    expect(getDataContractHistoryResponse.getMetadata().getHeight())
      .to.equal(metadataFixture.height);
    expect(getDataContractHistoryResponse.getMetadata().getCoreChainLockedHeight())
      .to.equal(metadataFixture.coreChainLockedHeight);

    const proof = getDataContractHistoryResponse.getProof();

    expect(proof).to.be.an.instanceOf(Proof);
    expect(proof.getGrovedbProof()).to.deep.equal(proofFixture.merkleProof);
    expect(proof.getQuorumHash()).to.deep.equal(proofFixture.quorumHash);
    expect(proof.getSignature()).to.deep.equal(proofFixture.signature);
  });

  it('should throw InvalidResponseError if Metadata is not defined', () => {
    const {
      GetDataContractHistoryResponseV0,
    } = GetDataContractHistoryResponse;

    const {
      DataContractHistory,
      DataContractHistoryEntry,
    } = GetDataContractHistoryResponseV0;

    const dataContractHistoryEntryProto = new DataContractHistoryEntry();
    dataContractHistoryEntryProto.setDate(1000);
    dataContractHistoryEntryProto.setValue(dataContractFixture.toBuffer());

    const dataContractHistoryEntryProto2 = new DataContractHistoryEntry();
    dataContractHistoryEntryProto2.setDate(2000);
    dataContractHistoryEntryProto2.setValue(dataContractFixture.toBuffer());

    const dataContractHistoryProto = new DataContractHistory();
    dataContractHistoryProto.setDataContractEntriesList([
      dataContractHistoryEntryProto,
      dataContractHistoryEntryProto2,
    ]);

    const proto = new GetDataContractHistoryResponse();
    proto.setV0(
      new GetDataContractHistoryResponseV0()
        .setDataContractHistory(dataContractHistoryProto),
    );

    try {
      getDataContractHistoryResponse = GetDataContractHistoryResponseClass.createFromProto(proto);

      expect.fail('should throw InvalidResponseError');
    } catch (e) {
      expect(e).to.be.an.instanceOf(InvalidResponseError);
    }
  });

  it('should throw InvalidResponseError if DataContractHistory is not defined', () => {
    const { GetDataContractHistoryResponseV0 } = GetDataContractHistoryResponse;
    const proto = new GetDataContractHistoryResponse();
    const metadata = new ResponseMetadata();
    metadata.setHeight(metadataFixture.height);
    metadata.setCoreChainLockedHeight(metadataFixture.coreChainLockedHeight);

    proto.setV0(
      new GetDataContractHistoryResponseV0()
        .setMetadata(metadata),
    );

    try {
      getDataContractHistoryResponse = GetDataContractHistoryResponseClass.createFromProto(proto);

      expect.fail('should throw InvalidResponseError');
    } catch (e) {
      expect(e).to.be.an.instanceOf(InvalidResponseError);
    }
  });
});
