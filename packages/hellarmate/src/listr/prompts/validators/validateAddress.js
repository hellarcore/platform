import hellarcoreLib from '@hellarpro/hellarcore-lib';

const { Address } = hellarcoreLib;
/**
 * @param {string} value
 * @param {string} network
 * @returns {boolean}
 */
export default function validateAddress(value, network) {
  try {
    Address(value, network);
  } catch (e) {
    return false;
  }

  return true;
}
