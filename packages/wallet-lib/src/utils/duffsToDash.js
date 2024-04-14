const { DUFFS_PER_HELLAR } = require('../CONSTANTS');

function duffsToHellar(duffs) {
  if (duffs === undefined || duffs.constructor.name !== Number.name) {
    throw new Error('Can only convert a number');
  }
  return duffs / DUFFS_PER_HELLAR;
}
module.exports = duffsToHellar;
