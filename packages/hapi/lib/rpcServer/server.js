const jayson = require('jayson/promise');
const { isRegtest, isDevnet } = require('../utils');
const errorHandlerDecorator = require('./errorHandlerDecorator');

const getBestBlockHash = require('./commands/getBestBlockHash');
const getBlockHash = require('./commands/getBlockHash');
const getMnListDiff = require('./commands/getMnListDiff');
const generateToAddress = require('./commands/generateToAddress');

// Following commands are not implemented yet:
// const getVersion = require('./commands/getVersion');

const createCommands = (hellarcoreAPI) => ({
  getBestBlockHash: getBestBlockHash(hellarcoreAPI),
  getBlockHash: getBlockHash(hellarcoreAPI),
  getMnListDiff: getMnListDiff(hellarcoreAPI),
});

const createRegtestCommands = (hellarcoreAPI) => ({
  generateToAddress: generateToAddress(hellarcoreAPI),
});

/**
  * Starts RPC server
 *  @param options
  * @param {number} options.port - port to listen for incoming RPC connections
  * @param {string} options.networkType
  * @param {object} options.hellarcoreAPI
  * @param {AbstractDriveAdapter} options.driveAPI - Drive api adapter
  * @param {object} options.tendermintRpcClient
  * @param {HellarPlatformProtocol} options.hpp
  * @param {object} options.log
 */
const start = ({
  port,
  networkType,
  hellarcoreAPI,
  logger,
}) => {
  const commands = createCommands(
    hellarcoreAPI,
  );

  const areRegtestCommandsEnabled = isRegtest(networkType) || isDevnet(networkType);

  const allCommands = areRegtestCommandsEnabled
    ? Object.assign(commands, createRegtestCommands(hellarcoreAPI))
    : commands;

  /*
  Decorate all commands with decorator that will intercept errors and format
  them before passing to user.
  */
  Object.keys(allCommands).forEach((commandName) => {
    allCommands[commandName] = errorHandlerDecorator(allCommands[commandName], logger);
  });

  const server = jayson.server(allCommands);
  server.http().listen(port);
};

module.exports = {
  createCommands,
  start,
};
