const getDataContractFixture = require('../../../../lib/test/fixtures/getDataContractFixture');
const getPrivateAndPublicKeyFixture = require('../../../../lib/test/fixtures/getPrivateAndPublicKeyForSigningFixture');

const createStateRepositoryMock = require('../../../../lib/test/mocks/createStateRepositoryMock');
const getBlsMock = require('../../../../lib/test/mocks/getBlsAdapterMock');
const { expectValidationError } = require('../../../../lib/test/expect/expectError');

const { default: loadWasmDpp } = require('../../../..');
let {
  HellarPlatformProtocol,
  MissingStateTransitionTypeError,
  InvalidStateTransitionTypeError,
  StateTransitionMaxSizeExceededError,
  JsonSchemaError,
  ValidationResult,
  StateTransitionExecutionContext,
} = require('../../../..');

describe.skip('validateStateTransitionBasicFactory', () => {
  let rawStateTransition;
  let dataContract;
  let stateTransition;
  let hpp;
  let executionContext;

  beforeEach(async function beforeEach() {
    ({
      HellarPlatformProtocol,
      MissingStateTransitionTypeError,
      InvalidStateTransitionTypeError,
      StateTransitionMaxSizeExceededError,
      StateTransitionExecutionContext,
      JsonSchemaError,
      ValidationResult,
    } = await loadWasmDpp());

    const stateRepositoryMock = createStateRepositoryMock(this.sinon);
    const blsMock = getBlsMock();

    hpp = new HellarPlatformProtocol(blsMock, stateRepositoryMock);

    dataContract = await getDataContractFixture();

    const { privateKey, identityPublicKey } = await getPrivateAndPublicKeyFixture();

    stateTransition = await hpp.dataContract.createDataContractCreateTransition(dataContract);

    await stateTransition.sign(identityPublicKey, privateKey, getBlsMock());

    rawStateTransition = stateTransition.toObject();

    executionContext = new StateTransitionExecutionContext();
  });

  it('should return invalid result if ST type is missing', async () => {
    delete rawStateTransition.type;

    const result = await hpp.stateTransition.validateBasic(rawStateTransition, executionContext);

    await expectValidationError(result);

    const [error] = result.getErrors();

    expect(error).to.be.instanceof(MissingStateTransitionTypeError);
  });

  it('should return invalid result if ST type is not valid', async () => {
    rawStateTransition.type = 66;

    const result = await hpp.stateTransition.validateBasic(rawStateTransition, executionContext);

    await expectValidationError(result);

    const [error] = result.getErrors();

    expect(error).to.be.instanceof(InvalidStateTransitionTypeError);
  });

  it('should return invalid result if ST is invalid against validation function', async () => {
    delete rawStateTransition.signaturePublicKeyId;
    const result = await hpp.stateTransition.validateBasic(rawStateTransition, executionContext);

    await expectValidationError(result);

    const [error] = result.getErrors();

    expect(error).to.instanceof(JsonSchemaError);
  });

  it('should return invalid result if ST size is more than 25 kb', async () => {
    const largeDocument = rawStateTransition.dataContract.documents.niceDocument;

    // generate big state transition
    for (let i = 0; i < 7; i++) {
      largeDocument.properties[`name${i}`] = { type: 'string' };
    }
    for (let i = 0; i < 90; i++) {
      rawStateTransition.dataContract.documents[`anotherContract${i}`] = largeDocument;
    }

    const result = await hpp.stateTransition.validateBasic(
      rawStateTransition,
      executionContext,
    );

    await expectValidationError(result, StateTransitionMaxSizeExceededError);

    const [error] = result.getErrors();

    expect(error.getCode()).to.equal(1045);
  });

  it('should return valid result', async () => {
    const result = await hpp.stateTransition.validateBasic(rawStateTransition, executionContext);

    expect(result).to.be.an.instanceOf(ValidationResult);
    expect(result.isValid()).to.be.true();
  });
});
