const dotenv = require('dotenv');
const grpc = require('@grpc/grpc-js');

const {
  client: {
    converters: {
      jsonToProtobufFactory,
      protobufToJsonFactory,
    },
  },
  server: {
    createServer,
    jsonToProtobufHandlerWrapper,
    error: {
      wrapInErrorHandlerFactory,
    },
  },
} = require('@hellarpro/grpc-common');

const {
  v0: {
    TransactionsWithProofsRequest,
    BlockHeadersWithChainLocksRequest,
    pbjs: {
      TransactionsWithProofsRequest: PBJSTransactionsWithProofsRequest,
      TransactionsWithProofsResponse: PBJSTransactionsWithProofsResponse,
      BlockHeadersWithChainLocksRequest: PBJSBlockHeadersWithChainLocksRequest,
      BlockHeadersWithChainLocksResponse: PBJSBlockHeadersWithChainLocksResponse,
    },
  },
  getCoreDefinition,
} = require('@hellarpro/hapi-grpc');

// Load config from .env
dotenv.config();

const ChainDataProvider = require('../lib/chainDataProvider/ChainDataProvider');

const config = require('../lib/config');
const { validateConfig } = require('../lib/config/validator');
const logger = require('../lib/logger');

const BlockHeadersCache = require('../lib/chainDataProvider/BlockHeadersCache');
const ZmqClient = require('../lib/externalApis/hellarcore/ZmqClient');
const hellarcoreRpcClient = require('../lib/externalApis/hellarcore/rpc');

const BloomFilterEmitterCollection = require('../lib/bloomFilter/emitter/BloomFilterEmitterCollection');

const testTransactionAgainstFilterCollectionFactory = require('../lib/transactionsFilter/testRawTransactionAgainstFilterCollectionFactory');
const emitBlockEventToFilterCollectionFactory = require('../lib/transactionsFilter/emitBlockEventToFilterCollectionFactory');
const testTransactionsAgainstFilter = require('../lib/transactionsFilter/testTransactionAgainstFilter');
const emitInstantLockToFilterCollectionFactory = require('../lib/transactionsFilter/emitInstantLockToFilterCollectionFactory');
const subscribeToTransactionsWithProofsHandlerFactory = require('../lib/grpcServer/handlers/tx-filter-stream/subscribeToTransactionsWithProofsHandlerFactory');
const subscribeToBlockHeadersWithChainLocksHandlerFactory = require('../lib/grpcServer/handlers/blockheaders-stream/subscribeToBlockHeadersWithChainLocksHandlerFactory');
const getHistoricalBlockHeadersIteratorFactory = require('../lib/grpcServer/handlers/blockheaders-stream/getHistoricalBlockHeadersIteratorFactory');
const subscribeToNewBlockHeaders = require('../lib/grpcServer/handlers/blockheaders-stream/subscribeToNewBlockHeaders');

const subscribeToNewTransactions = require('../lib/transactionsFilter/subscribeToNewTransactions');
const getHistoricalTransactionsIteratorFactory = require('../lib/transactionsFilter/getHistoricalTransactionsIteratorFactory');
const getMemPoolTransactionsFactory = require('../lib/transactionsFilter/getMemPoolTransactionsFactory');

async function main() {
  // Validate config
  const configValidationResult = validateConfig(config);
  if (!configValidationResult.isValid) {
    configValidationResult.validationErrors.forEach(logger.fatal.bind(logger));
    logger.error('Aborting HAPI startup due to config validation errors');
    process.exit();
  }

  const isProductionEnvironment = process.env.NODE_ENV === 'production';

  // Subscribe to events from Hellar Core
  const hellarcoreZmqClient = new ZmqClient(config.hellarcore.zmq.host, config.hellarcore.zmq.port);

  // Bind logs on ZMQ connection events
  hellarcoreZmqClient.on(ZmqClient.events.DISCONNECTED, logger.warn.bind(logger));
  hellarcoreZmqClient.on(ZmqClient.events.CONNECTION_DELAY, logger.warn.bind(logger));
  hellarcoreZmqClient.on(ZmqClient.events.MONITOR_ERROR, logger.warn.bind(logger));

  // Wait until zmq connection is established
  logger.info(`Connecting to hellarcore ZMQ on ${hellarcoreZmqClient.connectionString}`);

  await hellarcoreZmqClient.start();

  logger.info('Connection to ZMQ established.');

  // Add ZMQ event listeners
  const bloomFilterEmitterCollection = new BloomFilterEmitterCollection();
  const emitBlockEventToFilterCollection = emitBlockEventToFilterCollectionFactory(
    bloomFilterEmitterCollection,
  );
  const testRawTransactionAgainstFilterCollection = testTransactionAgainstFilterCollectionFactory(
    bloomFilterEmitterCollection,
  );
  const emitInstantLockToFilterCollection = emitInstantLockToFilterCollectionFactory(
    bloomFilterEmitterCollection,
  );

  // Send raw transactions via `subscribeToTransactionsWithProofs` stream if matched
  hellarcoreZmqClient.on(
    hellarcoreZmqClient.topics.rawtx,
    testRawTransactionAgainstFilterCollection,
  );

  // Send merkle blocks via `subscribeToTransactionsWithProofs` stream
  hellarcoreZmqClient.on(
    hellarcoreZmqClient.topics.rawblock,
    emitBlockEventToFilterCollection,
  );

  // TODO: check if we can receive this event before 'rawtx', and if we can,
  // we need to test tx in this message first before emitng lock to the bloom
  // filter collection
  // Send transaction instant locks via `subscribeToTransactionsWithProofs` stream
  hellarcoreZmqClient.on(
    hellarcoreZmqClient.topics.rawtxlocksig,
    emitInstantLockToFilterCollection,
  );

  const blockHeadersCache = new BlockHeadersCache();

  const chainDataProvider = new ChainDataProvider(
    hellarcoreRpcClient,
    hellarcoreZmqClient,
    blockHeadersCache,
  );
  await chainDataProvider.init();

  // Start GRPC server
  logger.info('Starting GRPC server');

  const wrapInErrorHandler = wrapInErrorHandlerFactory(logger, isProductionEnvironment);

  const getHistoricalTransactionsIterator = getHistoricalTransactionsIteratorFactory(
    hellarcoreRpcClient,
  );

  const getHistoricalBlockHeadersIterator = getHistoricalBlockHeadersIteratorFactory(
    chainDataProvider,
  );

  const getMemPoolTransactions = getMemPoolTransactionsFactory(
    hellarcoreRpcClient,
    testTransactionsAgainstFilter,
  );

  const subscribeToTransactionsWithProofsHandler = subscribeToTransactionsWithProofsHandlerFactory(
    getHistoricalTransactionsIterator,
    subscribeToNewTransactions,
    bloomFilterEmitterCollection,
    testTransactionsAgainstFilter,
    hellarcoreRpcClient,
    getMemPoolTransactions,
  );

  const wrappedSubscribeToTransactionsWithProofs = jsonToProtobufHandlerWrapper(
    jsonToProtobufFactory(
      TransactionsWithProofsRequest,
      PBJSTransactionsWithProofsRequest,
    ),
    protobufToJsonFactory(
      PBJSTransactionsWithProofsResponse,
    ),
    wrapInErrorHandler(subscribeToTransactionsWithProofsHandler),
  );

  // eslint-disable-next-line operator-linebreak
  const subscribeToBlockHeadersWithChainLocksHandler =
    subscribeToBlockHeadersWithChainLocksHandlerFactory(
      getHistoricalBlockHeadersIterator,
      hellarcoreRpcClient,
      chainDataProvider,
      hellarcoreZmqClient,
      subscribeToNewBlockHeaders,
    );

  const wrappedSubscribeToBlockHeadersWithChainLocks = jsonToProtobufHandlerWrapper(
    jsonToProtobufFactory(
      BlockHeadersWithChainLocksRequest,
      PBJSBlockHeadersWithChainLocksRequest,
    ),
    protobufToJsonFactory(
      PBJSBlockHeadersWithChainLocksResponse,
    ),
    wrapInErrorHandler(subscribeToBlockHeadersWithChainLocksHandler),
  );

  const grpcServer = createServer(
    getCoreDefinition(0),
    {
      subscribeToTransactionsWithProofs: wrappedSubscribeToTransactionsWithProofs,
      subscribeToBlockHeadersWithChainLocks: wrappedSubscribeToBlockHeadersWithChainLocks,
    },
  );

  grpcServer.bindAsync(
    `0.0.0.0:${config.txFilterStream.grpcServer.port}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      grpcServer.start();
    },
  );

  logger.info(`GRPC server is listening on port ${config.txFilterStream.grpcServer.port}`);

  // Display message that everything is ok
  logger.info(`HAPI TxFilterStream process is up and running in ${config.livenet ? 'livenet' : 'testnet'} mode`);
  logger.info(`Network is ${config.network}`);
}

main().catch((e) => {
  logger.error(e.stack);
  process.exit();
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT. Exiting...');

  process.exit();
});

// Tell PM2 that process ready to receive connections
process.send('ready');
