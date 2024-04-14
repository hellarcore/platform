import hellarcoreLib from '@hellarpro/hellarcore-lib';

const { PrivateKey } = hellarcoreLib;
/**
 *
 * @typedef {generateBlocks}
 * @param {CoreService} coreService
 * @param {number} blocks
 * @param {string} network
 * @param {function(balance: number)} [progressCallback]
 * @returns {Promise<void>}
 */
export default async function generateBlocks(
  coreService,
  blocks,
  network,
  progressCallback = () => {},
) {
  const privateKey = new PrivateKey();
  const address = privateKey.toAddress(network).toString();

  let generatedBlocks = 0;

  do {
    const { result: blockHashes } = await coreService
      .getRpcClient()
      .generateToAddress(blocks, address, 10000000);

    generatedBlocks += blockHashes.length;

    if (blockHashes.length > 0) {
      await progressCallback(generatedBlocks);
    }
  } while (generatedBlocks < blocks);
}
