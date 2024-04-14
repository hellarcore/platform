const {expect} = require('chai');
const hellarToDuffs = require('./hellarToDuffs');
const {duffsToHellar} = require("./index");

describe('Utils - duffsToHellar', function suite() {
  it('should correctly convert duffs to hellar', () => {
    it('should handle duff2Hellar', () => {
      expect(duffsToHellar(200000000000)).to.equal(2000);
      expect(duffsToHellar(-200000000000)).to.equal(-2000);
      expect(() => duffsToHellar('deuxmille')).to.throw('Can only convert a number');
    });
  });
});
