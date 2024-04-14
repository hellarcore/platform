const wait = require('./wait');

/**
 *
 * @param {HAPIClient} hapiClient
 * @param {number} numberOfBlocks
 * @return {Promise<void>}
 */
module.exports = async function waitForBlocks(hapiClient, numberOfBlocks) {
  let { chain: { blocksCount: currentBlockHeight } } = await hapiClient.core.getStatus();

  const desiredBlockHeight = currentBlockHeight + numberOfBlocks;
  do {
    ({ chain: { blocksCount: currentBlockHeight } } = await hapiClient.core.getStatus());

    if (currentBlockHeight < desiredBlockHeight) {
      await wait(5000);
    }
  } while (currentBlockHeight < desiredBlockHeight);
};
