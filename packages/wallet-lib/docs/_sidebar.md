- Getting started
    - [Quick start](getting-started/quickstart.md)
    - [Quick introduction to core concepts](getting-started/core-concepts.md)
- Usage 
    - [HAPI](usage/hapi.md)   
    - [Examples](usage/examples.md)
    - [Coin Selection](usage/coinSelection.md)
    - Account
        - [`new Account()`](account/Account.md)
        - [`.broadcastTransaction()`](account/broadcastTransaction.md)
        - [`.connect()`](account/connect.md)
        - [`.createTransaction()`](account/createTransaction.md)
        - [`.decode()`](account/decode.md)
        - [`.decrypt()`](account/decrypt.md)
        - [`.disconnect()`](account/disconnect.md)
        - [`.encode()`](account/encode.md)
        - [`.encrypt()`](account/encrypt.md)
        - [`.fetchAddressInfo()`](account/fetchAddressInfo.md)
        - [`.fetchStatus()`](account/fetchStatus.md)
        - [`.fetchTransactionInfo()`](account/fetchTransactionInfo.md)
        - [`.forceRefreshAccount()`](account/forceRefreshAccount.md)
        - [`.generateAddress()`](account/generateAddress.md)
        - [`.getAddress()`](account/getAddress.md)
        - [`.getConfirmedBalance()`](account/getConfirmedBalance.md)
        - [`.getPrivateKeys()`](account/getPrivateKeys.md)
        - [`.getTotalBalance()`](account/getTotalBalance.md)
        - [`.getTransaction()`](account/getTransaction.md)
        - [`.getTransactionHistory()`](account/getTransactionHistory.md)
        - [`.getTransactions()`](account/getTransactions.md)
        - [`.getUnconfirmedBalance()`](account/getUnconfirmedBalance.md)
        - [`.getUTXOS()`](account/getUTXOS.md)
        - [`.sign()`](account/sign.md)
    - Wallet
        - [`new Wallet()`](wallet/Wallet.md)
        - [`.createAccount()`](wallet/createAccount.md)
        - [`.disconnect()`](wallet/disconnect.md)
        - [`.exportWallet()`](wallet/exportWallet.md)
        - [`.fromHDPrivateKey()`](wallet/fromHDPrivateKey.md)
        - [`.fromHDPublicKey()`](wallet/fromHDPublicKey.md)
        - [`.fromMnemonic()`](wallet/fromMnemonic.md)
        - [`.fromPrivateKey()`](wallet/fromPrivateKey.md)
        - [`.fromSeed()`](wallet/fromSeed.md)
        - [`.generateNewWalletId()`](wallet/generateNewWalletId.md)
        - [`.getAccount()`](wallet/getAccount.md)
        - [`.dumpStorage()`](wallet/dumpStorage.md)
    - Identities
        - [`new Identities()`](identities/Identities.md)
        - [`.getIdentityHDKeyByIndex()`](identities/getIdentityHDKeyByIndex.md)
    - KeyChain
        - [`new KeyChain()`](keychain/KeyChain.md)
        - [`.generateKeyForChild()`](keychain/generateKeyForChild.md)
        - [`.generateKeyForPath()`](keychain/generateKeyForPath.md)
        - [`.getDIPExtendedKey()`](keychain/getDIPExtendedKey.md)
        - [`.getHardenedBIP44HDKey()`](keychain/getHardenedBIP44HDKey.md)
        - [`.getHardenedDIP9FeatureHDKey()`](keychain/getHardenedDIP9FeatureHDKey.md)
        - [`.getHardenedDIP15AccountKey()`](keychain/getHardenedDIP15AccountKey.md)
        - [`.getKeyForChild()`](keychain/getKeyForChild.md)
        - [`.getKeyForPath()`](keychain/getKeyForPath.md)
        - [`.getPrivateKey()`](keychain/getPrivateKey.md)
        - [`.sign()`](keychain/sign.md)
    - Storage
        - [`new KeyChain()`](storage/Storage.md)
        - [`.addNewTxToAddress()`](storage/addNewTxToAddress.md)
        - [`.addUTXOToAddress()`](storage/addUTXOToAddress.md)
        - [`.announce()`](storage/announce.md)
        - [`.calculateDuffBalance()`](storage/calculateDuffBalance.md)
        - [`.clearAll()`](storage/clearAll.md)
        - [`.configure()`](storage/configure.md)
        - [`.createChain()`](storage/createChain.md)
        - [`.createWallet()`](storage/createWallet.md)
        - [`.getStore()`](storage/getStore.md)
        - [`.getTransaction()`](storage/getTransaction.md)
        - [`.getTransactionMetadata()`](storage/getTransactionMetadata.md)
        - [`.importTransaction()`](storage/importTransaction.md)
        - [`.importTransactions()`](storage/importTransactions.md)
        - [`.rehydrateState()`](storage/rehydrateState.md)
        - [`.saveState()`](storage/saveState.md)
        - [`.searchAddress()`](storage/searchAddress.md)
        - [`.searchAddressesWithTx()`](storage/searchAddressesWithTx.md)
        - [`.searchBlockHeader()`](storage/searchBlockHeader.md)
        - [`.searchTransaction()`](storage/searchTransaction.md)
        - [`.searchTransactionMetadata()`](storage/searchTransactionMetadata.md)
        - [`.searchWallet()`](storage/searchWallet.md)
        - [`.startWorker()`](storage/startWorker.md)
        - [`.stopWorker()`](storage/stopWorker.md)
        - [`.stopWorker()`](storage/stopWorker.md)
        - [`.updateTransaction()`](storage/updateTransaction.md)
    - Utils
        - [`calculateTransactionFees()`](utils/calculateTransactionFees.md)
        - [`categorizeTransactions()`](utils/categorizeTransactions.md)
        - [`classifyAddresses()`](utils/classifyAddresses.md)
        - [`coinSelection()`](utils/coinSelection.md)
        - [`hellarToDuffs()`](utils/hellarToDuffs.md)
        - [`duffsToHellar()`](utils/duffsToHellar.md)
        - [`extendTransactionsWithMetadata()`](utils/extendTransactionsWithMetadata.md)
        - [`filterTransactions()`](utils/filterTransactions.md)
        - [`getBytesOf()`](utils/getBytesOf.md)
        - Mnemonic
            - [`generateNewMnemonic()`](utils/mnemonic/generateNewMnemonic.md)
            - [`mnemonicToHDPrivateKey()`](utils/mnemonic/mnemonicToHDPrivateKey.md)
            - [`mnemonicToSeed()`](utils/mnemonic/mnemonicToSeed.md)
            - [`mnemonicToWalletId()`](utils/mnemonic/mnemonicToWalletId.md)
            - [`seedToHDPrivateKey()`](utils/mnemonic/seedToHDPrivateKey.md)
    - Events
        - [`FETCHED/UNCONFIRMED_TRANSACTION`](events/fetched_unconfirmed_transaction.md)
        - [`FETCHED/CONFIRMED_TRANSACTION`](events/fetched_confirmed_transaction.md)
        - [`CONFIRMED_BALANCE_CHANGED`](events/confirmed_balance_changed.md)
        - [`UNCONFIRMED_BALANCE_CHANGED`](events/unconfirmed_balance_changed.md)
        - [`BLOCKHEIGHT_CHANGED`](events/blockheight_changed.md)
    
- Plugins 
    - [Using a plugin](plugins/using-a-plugin.md)
    - [Writing a new plugin](plugins/writing-a-new-plugin.md)
    - [Wallet workers](plugins/wallet-workers.md)
    - [Community plugins](plugins/community-plugins.md)
- Develop
    - [Logging](develop/logging.md)
    - [Persistence](develop/persistence.md)
- [License](https://github.com/hellarpro/wallet-lib/blob/master/LICENSE)