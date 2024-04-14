const { DUFFS_PER_HELLAR } = require('../CONSTANTS');

function hellarToDuffs(hellar) {
  if (hellar === undefined || hellar.constructor.name !== Number.name) {
    throw new Error('Can only convert a number');
  }
  return parseInt((hellar * DUFFS_PER_HELLAR).toFixed(0), 10);
}
module.exports = hellarToDuffs;
