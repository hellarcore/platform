// Entry point for HAPI.
const dotenv = require('dotenv');
const grpc = require('@grpc/grpc-js');
// const loadBLS = require('@hellarpro/bls');

const {
  server: {
    createServer,
  },
} = require('@hellarpro/grpc-common');

const {
  getCoreDefinition,
  getPlatformDefinition,
} = require('@hellarpro/hapi-grpc');

const { default: loadWasmDpp, HellarPlatformProtocol } = require('@hellarpro/wasm-hpp');

const { client: RpcClient } = require('jayson/promise');

// Load config from .env
dotenv.config();

const WsClient = require('../lib/externalApis/tenderhellar/WsClient');

const config = require('../lib/config');
const { validateConfig } = require('../lib/config/validator');
const logger = require('../lib/logger');
const rpcServer = require('../lib/rpcServer/server');
const DriveClient = require('../lib/externalApis/drive/DriveClient');
const hellarcoreRpcClient = require('../lib/externalApis/hellarcore/rpc');
const BlockchainListener = require('../lib/externalApis/tenderhellar/BlockchainListener');
// const DriveStateRepository = require('../lib/hpp/DriveStateRepository');

const coreHandlersFactory = require(
  '../lib/grpcServer/handlers/core/coreHandlersFactory',
);
const platformHandlersFactory = require(
  '../lib/grpcServer/handlers/platform/platformHandlersFactory',
);

async function main() {
  await loadWasmDpp();
  // const blsSignatures = await loadBLS();

  /* Application start */
  const configValidationResult = validateConfig(config);
  if (!configValidationResult.isValid) {
    configValidationResult.validationErrors.forEach(logger.fatal.bind(logger));
    logger.log('Aborting HAPI startup due to config validation errors');
    process.exit();
  }

  const isProductionEnvironment = process.env.NODE_ENV === 'production';

  logger.info('Connecting to Drive');
  const driveClient = new DriveClient({
    host: config.tendermintCore.host,
    port: config.tendermintCore.port,
  });

  const rpcClient = RpcClient.http({
    host: config.tendermintCore.host,
    port: config.tendermintCore.port,
  });

  const tenderHellarWsClient = new WsClient({
    host: config.tendermintCore.host,
    port: config.tendermintCore.port,
  });

  const tenderhellarLogger = logger.child({
    process: 'TenderhellarWs',
  });

  tenderhellarLogger.info(`Connecting to Tenderhellar on ${config.tendermintCore.host}:${config.tendermintCore.port}`);

  tenderHellarWsClient.on('connect', () => {
    tenderhellarLogger.info('Connection to Tenderhellar established.');
  });

  tenderHellarWsClient.on('connect:retry', ({ interval }) => {
    tenderhellarLogger.info(`Reconnect to Tenderhellar in ${interval} ms`);
  });

  tenderHellarWsClient.on('connect:max_retry_exceeded', ({ maxRetries }) => {
    tenderhellarLogger.info(`Connection retry limit ${maxRetries} is reached`);
  });

  tenderHellarWsClient.on('error', ({ error }) => {
    tenderhellarLogger.error(`Tenderhellar connection error: ${error.message}`);
  });

  tenderHellarWsClient.on('close', ({ error }) => {
    tenderhellarLogger.warn(`Connection closed: ${error.code}`);
  });

  tenderHellarWsClient.on('disconnect', () => {
    tenderhellarLogger.fatal('Disconnected from Tenderhellar... exiting');

    process.exit(1);
  });

  await tenderHellarWsClient.connect();

  const blockchainListener = new BlockchainListener(tenderHellarWsClient);
  blockchainListener.start();

  // Start JSON RPC server
  logger.info('Starting JSON RPC server');
  rpcServer.start({
    port: config.rpcServer.port,
    networkType: config.network,
    hellarcoreAPI: hellarcoreRpcClient,
    logger,
  });
  logger.info(`JSON RPC server is listening on port ${config.rpcServer.port}`);

  const hpp = new HellarPlatformProtocol(null, 1);

  // Start GRPC server
  logger.info('Starting GRPC server');

  const coreHandlers = coreHandlersFactory(
    hellarcoreRpcClient,
    isProductionEnvironment,
  );
  const platformHandlers = platformHandlersFactory(
    rpcClient,
    blockchainListener,
    driveClient,
    hpp,
    isProductionEnvironment,
  );

  const grpcApiServer = createServer(getCoreDefinition(0), coreHandlers);

  grpcApiServer.addService(getPlatformDefinition(0).service, platformHandlers);

  grpcApiServer.bindAsync(
    `0.0.0.0:${config.grpcServer.port}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      grpcApiServer.start();
    },
  );

  logger.info(`GRPC API RPC server is listening on port ${config.grpcServer.port}`);

  // Display message that everything is ok
  logger.info(`HAPI Core process is up and running in ${config.livenet ? 'livenet' : 'testnet'} mode`);
  logger.info(`Network is ${config.network}`);
}

main().catch((e) => {
  logger.error(e.stack);

  process.exit(1);
});

process.on('unhandledRejection', (e) => {
  logger.error(e);

  process.exit(1);
});

// break on ^C
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Exiting...');

  process.exit();
});

// Tell PM2 that process ready to receive connections
process.send('ready');
