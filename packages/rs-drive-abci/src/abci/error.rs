use hpp::bls_signatures::BlsError;

// @append_only
/// Error returned within ABCI server
#[derive(Debug, thiserror::Error)]
pub enum AbciError {
    /// Invalid system state
    #[error("invalid state: {0}")]
    InvalidState(String),
    /// Request does not match currently processed block
    #[error("request does not match current block: {0}")]
    RequestForWrongBlockReceived(String),
    /// Withdrawal transactions mismatch
    #[error("vote extensions mismatch: got {got:?}, expected {expected:?}")]
    #[allow(missing_docs)]
    VoteExtensionMismatchReceived { got: String, expected: String },
    /// Vote extensions signature is invalid
    #[error("one of vote extension signatures is invalid")]
    VoteExtensionsSignatureInvalid,
    /// Cannot load withdrawal transactions
    #[error("cannot load withdrawal transactions: {0}")]
    WithdrawalTransactionsDBLoadError(String),
    /// Wrong finalize block received
    #[error("finalize block received before processing from Tenderhellar: {0}")]
    FinalizeBlockReceivedBeforeProcessing(String),
    /// Wrong finalize block received
    #[error("wrong block from Tenderhellar: {0}")]
    WrongBlockReceived(String),
    /// Wrong finalize block received
    #[error("wrong finalize block from Tenderhellar: {0}")]
    WrongFinalizeBlockReceived(String),
    /// Bad request received from Tenderhellar that can't be translated to the correct size
    /// This often happens if a Vec<> can not be translated into a \[u8;32\]
    #[error("data received from Tenderhellar could not be converted: {0}")]
    BadRequestDataSize(String),
    /// Bad request received from Tenderhellar
    #[error("bad request received from Tenderhellar: {0}")]
    BadRequest(String),

    /// Bad initialization from Tenderhellar
    #[error("bad initialization: {0}")]
    BadInitialization(String),

    /// Bad commit signature from Tenderhellar
    #[error("bad commit signature: {0}")]
    BadCommitSignature(String),

    /// Error returned by Tenderhellar-abci library
    #[error("tenderhellar: {0}")]
    Tenderhellar(#[from] tenderhellar_abci::Error),

    /// Error occurred during protobuf data manipulation
    #[error("tenderhellar data: {0}")]
    TenderhellarProto(tenderhellar_abci::proto::Error),

    /// Error occurred during signature verification or deserializing a BLS primitive
    #[error("bls error from user message: {0}")]
    BlsErrorFromUserMessage(BlsError),

    /// Error occurred related to threshold signing, either of commit
    #[error("bls error from Tenderhellar for threshold mechanisms: {1}: {0}")]
    BlsErrorOfTenderhellarThresholdMechanism(BlsError, String),

    /// Generic with code should only be used in tests
    #[error("generic with code: {0}")]
    GenericWithCode(u32),
}

// used by `?` operator
impl From<AbciError> for String {
    fn from(value: AbciError) -> Self {
        value.to_string()
    }
}
