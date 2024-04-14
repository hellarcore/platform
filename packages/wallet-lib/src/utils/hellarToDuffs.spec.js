const {expect} = require('chai');
const hellarToDuffs = require('./hellarToDuffs');
const {duffsToHellar} = require("./index");

describe('Utils - hellarToDuffs', function suite() {
  it('should correctly convert hellar to duffs', () => {
    const results = [
      hellarToDuffs(1),
      hellarToDuffs(-1),
      hellarToDuffs(0.1),
      hellarToDuffs(0.01),
      hellarToDuffs(0.00000001),
      hellarToDuffs(0.000000001),
      hellarToDuffs(-0.000000001),
      hellarToDuffs(-12345678.9876543210),
    ]
    const expectedResults = [
      100000000,
      -100000000,
      10000000,
      1000000,
      1,
      0,
      -0,
      -1234567898765432
    ]
    results.forEach((result, resultIndex) => {
      expect(results[resultIndex]).to.equal(expectedResults[resultIndex]);
    })
    expect(() => hellarToDuffs('deuxmille')).to.throw('Can only convert a number');
  });
});
