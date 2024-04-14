const HAPIAddress = require('./HAPIAddress');

class SimplifiedMasternodeListHAPIAddressProvider {
  /**
   * @param {SimplifiedMasternodeListProvider} smlProvider
   * @param {ListHAPIAddressProvider} listHAPIAddressProvider
   * @param {HAPIAddress[]} addressWhiteList
   */
  constructor(smlProvider, listHAPIAddressProvider, addressWhiteList) {
    this.smlProvider = smlProvider;
    this.listHAPIAddressProvider = listHAPIAddressProvider;
    this.addressWhiteStrings = addressWhiteList.map((hapiAddress) => hapiAddress.toString());
  }

  /**
   * Get random live HAPI address from SML
   * @returns {Promise<HAPIAddress>}
   */
  async getLiveAddress() {
    const sml = await this.smlProvider.getSimplifiedMNList();
    const validMasternodeList = sml.getValidMasternodesList()
      // Keep only HP masternodes
      .filter((smlEntry) => smlEntry.nType === 1);

    const addressesByRegProTxHashes = {};
    let allowSelfSignedCertificate;
    this.listHAPIAddressProvider.getAllAddresses().forEach((address) => {
      allowSelfSignedCertificate = address.isSelfSignedCertificateAllowed();

      if (!address.getProRegTxHash()) {
        return;
      }

      addressesByRegProTxHashes[address.getProRegTxHash()] = address;
    });

    const updatedAddresses = validMasternodeList.map((smlEntry) => {
      let address = addressesByRegProTxHashes[smlEntry.proRegTxHash];

      if (!address) {
        address = new HAPIAddress({
          host: smlEntry.getIp(),
          port: smlEntry.platformHTTPPort,
          allowSelfSignedCertificate,
          proRegTxHash: smlEntry.proRegTxHash,
        });
      } else {
        address.setHost(smlEntry.getIp());
      }

      return address;
    });

    let filteredAddresses = updatedAddresses;
    if (this.addressWhiteStrings.length > 0) {
      filteredAddresses = updatedAddresses.filter((hapiAddress) => (
        this.addressWhiteStrings.includes(hapiAddress.toString())
      ));
    }

    this.listHAPIAddressProvider.setAddresses(filteredAddresses);

    return this.listHAPIAddressProvider.getLiveAddress();
  }

  /**
   * Check if we have live addresses left
   * @returns {Promise<boolean>}
   */
  async hasLiveAddresses() {
    return this.listHAPIAddressProvider.hasLiveAddresses();
  }
}

module.exports = SimplifiedMasternodeListHAPIAddressProvider;
