const GrpcErrorCodes = require('@hellarpro/grpc-common/lib/server/error/GrpcErrorCodes');

const GrpcError = require('@hellarpro/grpc-common/lib/server/error/GrpcError');
const GrpcTransport = require('../../../../lib/transport/GrpcTransport/GrpcTransport');
const HAPIAddress = require('../../../../lib/hapiAddressProvider/HAPIAddress');

const MaxRetriesReachedError = require('../../../../lib/transport/errors/response/MaxRetriesReachedError');
const NoAvailableAddressesForRetryError = require('../../../../lib/transport/errors/response/NoAvailableAddressesForRetryError');
const NoAvailableAddressesError = require('../../../../lib/transport/errors/NoAvailableAddressesError');
const ResponseError = require('../../../../lib/transport/errors/response/ResponseError');
const TimeoutError = require('../../../../lib/transport/GrpcTransport/errors/TimeoutError');
const RetriableResponseError = require('../../../../lib/transport/errors/response/RetriableResponseError');

describe('GrpcTransport', () => {
  let grpcTransport;
  let hapiAddressProviderMock;
  let globalOptions;
  let createHAPIAddressProviderFromOptionsMock;
  let hapiAddress;
  let host;
  let url;

  beforeEach(function beforeEach() {
    host = '127.0.0.1';
    hapiAddress = new HAPIAddress(host);

    hapiAddressProviderMock = {
      getLiveAddress: this.sinon.stub().resolves(hapiAddress),
      hasLiveAddresses: this.sinon.stub().resolves(false),
    };

    globalOptions = {
      retries: 0,
      loggerOptions: {
        identifier: '',
      },
    };

    createHAPIAddressProviderFromOptionsMock = this.sinon.stub().returns(null);

    grpcTransport = new GrpcTransport(
      createHAPIAddressProviderFromOptionsMock,
      hapiAddressProviderMock,
      null,
      globalOptions,
    );

    // noinspection JSUnresolvedFunction
    url = grpcTransport.makeGrpcUrlFromAddress(hapiAddress);
  });

  describe('#request', () => {
    let method;
    let clientClassMock;
    let requestMessage;
    let options;
    let data;
    let requestFunc;
    let clock;
    let createGrpcTransportErrorMock;

    beforeEach(function beforeEach() {
      data = 'result';
      method = 'method';
      requestMessage = 'requestMessage';
      options = {
        option: 'value',
      };

      requestFunc = this.sinon.stub().resolves(data);

      clientClassMock = this.sinon.stub().returns({
        [method]: requestFunc,
      });

      hapiAddressProviderMock.hasLiveAddresses.resolves(true);

      globalOptions = {
        retries: 1,
        loggerOptions: {
          identifier: '',
        },
      };

      createGrpcTransportErrorMock = this.sinon.stub();

      grpcTransport = new GrpcTransport(
        createHAPIAddressProviderFromOptionsMock,
        hapiAddressProviderMock,
        createGrpcTransportErrorMock,
        globalOptions,
      );
    });

    afterEach(() => {
      if (clock) {
        clock.restore();
      }
    });

    describe('#request', () => {
      it('should make a request', async () => {
        const receivedData = await grpcTransport.request(
          clientClassMock,
          method,
          requestMessage,
          options,
        );

        expect(receivedData).to.equal(data);
        expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
        expect(clientClassMock).to.be.calledOnceWithExactly(url);
        expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        expect(grpcTransport.lastUsedAddress).to.deep.equal(hapiAddress);
      });

      it('should make a request with `deadline` option if `timeout` option is set', async function itContainer() {
        // Freeze time by using fake timers
        clock = this.sinon.useFakeTimers();

        const timeout = 2000;

        const deadline = new Date();
        deadline.setMilliseconds((new Date()).getMilliseconds() + timeout);

        const receivedData = await grpcTransport.request(
          clientClassMock,
          method,
          requestMessage,
          {
            timeout,
            ...options,
          },
        );

        expect(receivedData).to.equal(data);
        expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly({
          timeout,
          ...options,
        });
        expect(clientClassMock).to.be.calledOnceWithExactly(url);
        expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {
          deadline,
        });
        expect(grpcTransport.lastUsedAddress).to.deep.equal(hapiAddress);
      });

      it('should throw NoAvailableAddressesError if there is no available addresses', async () => {
        hapiAddressProviderMock.getLiveAddress.resolves(null);

        try {
          await grpcTransport.request(
            clientClassMock,
            method,
            requestMessage,
            options,
          );

          expect.fail('should throw NoAvailableAddressesError');
        } catch (e) {
          expect(e).to.be.an.instanceof(NoAvailableAddressesError);
          expect(clientClassMock).to.not.be.called();
        }
      });

      it('should throw unknown error if it happened during the request', async () => {
        const error = new Error('Unknown error');

        requestFunc.throws(error);

        try {
          await grpcTransport.request(
            clientClassMock,
            method,
            requestMessage,
            options,
          );

          expect.fail('should throw error');
        } catch (e) {
          expect(e).to.deep.equal(error);
          expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
          expect(clientClassMock).to.be.calledOnceWithExactly(url);
          expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        }
      });

      it('should throw non-retriable response error', async () => {
        const error = new GrpcError(GrpcErrorCodes.UNKNOWN, 'doesnt matter');

        requestFunc.throws(error);

        const responseError = new ResponseError(
          error.code,
          error.message,
          {},
          hapiAddress,
        );

        createGrpcTransportErrorMock.returns(responseError);

        try {
          await grpcTransport.request(
            clientClassMock,
            method,
            requestMessage,
            options,
          );

          expect.fail('should throw ResponseError');
        } catch (e) {
          expect(e).to.equal(responseError);

          expect(createGrpcTransportErrorMock).to.be.calledOnceWithExactly(error, hapiAddress);

          expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
          expect(clientClassMock).to.be.calledOnceWithExactly(url);
          expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        }
      });

      it('should throw TimeoutError with throwDeadlineExceeded option enabled', async () => {
        hapiAddressProviderMock.hasLiveAddresses.resolves(false);

        options.throwDeadlineExceeded = true;

        const error = new GrpcError(GrpcErrorCodes.DEADLINE_EXCEEDED, 'time is over');

        requestFunc.throws(error);

        const responseError = new TimeoutError(
          error.message,
          {},
          hapiAddress,
        );

        createGrpcTransportErrorMock.returns(responseError);

        try {
          await grpcTransport.request(
            clientClassMock,
            method,
            requestMessage,
            options,
          );

          expect.fail('should throw TimeoutError');
        } catch (e) {
          expect(e).to.equal(responseError);

          expect(createGrpcTransportErrorMock).to.be.calledOnceWithExactly(error, hapiAddress);

          expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
          expect(clientClassMock).to.be.calledOnceWithExactly(url);
          expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        }
      });

      it('should throw MaxRetriesReachedError if there are no more retries left', async () => {
        const error = new GrpcError(GrpcErrorCodes.UNKNOWN, 'doesnt matter');

        requestFunc.throws(error);

        const responseError = new RetriableResponseError(
          error.code,
          error.message,
          {},
          hapiAddress,
        );

        createGrpcTransportErrorMock.returns(responseError);

        options.retries = 0;

        try {
          await grpcTransport.request(
            clientClassMock,
            method,
            requestMessage,
            options,
          );

          expect.fail('should throw MaxRetriesReachedError');
        } catch (e) {
          expect(e).to.be.an.instanceof(MaxRetriesReachedError);
          expect(e.getCause()).to.equal(responseError);

          createGrpcTransportErrorMock.returns(responseError);

          expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
          expect(clientClassMock).to.be.calledOnceWithExactly(url);
          expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        }
      });

      it('should throw NoAvailableAddressesForRetryError if there are no more available addresses to request', async () => {
        hapiAddressProviderMock.hasLiveAddresses.resolves(false);

        const error = new GrpcError(GrpcErrorCodes.UNKNOWN, 'doesnt matter');

        requestFunc.throws(error);

        const responseError = new RetriableResponseError(
          error.code,
          error.message,
          {},
          hapiAddress,
        );

        createGrpcTransportErrorMock.returns(responseError);

        try {
          await grpcTransport.request(
            clientClassMock,
            method,
            requestMessage,
            options,
          );

          expect.fail('should throw NoAvailableAddressesForRetryError');
        } catch (e) {
          expect(e).to.be.an.instanceof(NoAvailableAddressesForRetryError);
          expect(e.getCause()).to.deep.equal(responseError);

          expect(createGrpcTransportErrorMock).to.be.calledOnceWithExactly(error, hapiAddress);

          expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
          expect(clientClassMock).to.be.calledOnceWithExactly(url);
          expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        }
      });
    });

    describe('#getLastUsedAddress', () => {
      it('should return last used address', async () => {
        await grpcTransport.request(
          clientClassMock,
          method,
          requestMessage,
        );

        const getLastUsedAddress = grpcTransport.getLastUsedAddress();
        expect(getLastUsedAddress).to.deep.equal(grpcTransport.lastUsedAddress);
      });
    });

    describe('gRPC-Web', () => {
      let originalVersion;

      before(() => {
        originalVersion = process.versions;
        Object.defineProperty(process, 'versions', {
          value: null,
        });
      });

      after(() => {
        Object.defineProperty(process, 'versions', {
          value: originalVersion,
        });
      });

      it('should make a request in web environment', async () => {
        const receivedData = await grpcTransport.request(
          clientClassMock,
          method,
          requestMessage,
          options,
        );

        expect(receivedData).to.deep.equal(data);
        expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
        expect(clientClassMock).to.be.calledOnceWithExactly(`${hapiAddress.getProtocol()}://${host}:${hapiAddress.getPort()}`);
        expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        expect(grpcTransport.lastUsedAddress).to.deep.equal(hapiAddress);
      });

      it('should make a https request in web environment', async () => {
        hapiAddress = new HAPIAddress({
          host,
          port: 443,
        });

        hapiAddressProviderMock.getLiveAddress.resolves(hapiAddress);

        grpcTransport = new GrpcTransport(
          createHAPIAddressProviderFromOptionsMock,
          hapiAddressProviderMock,
          createGrpcTransportErrorMock,
          globalOptions,
        );

        const receivedData = await grpcTransport.request(
          clientClassMock,
          method,
          requestMessage,
          options,
        );

        expect(receivedData).to.deep.equal(data);
        expect(createHAPIAddressProviderFromOptionsMock).to.be.calledOnceWithExactly(options);
        expect(clientClassMock).to.be.calledOnceWithExactly(`${HAPIAddress.DEFAULT_PROTOCOL}://${host}:${hapiAddress.getPort()}`);
        expect(requestFunc).to.be.calledOnceWithExactly(requestMessage, {}, {});
        expect(grpcTransport.lastUsedAddress).to.deep.equal(hapiAddress);
      });
    });
  });
});
