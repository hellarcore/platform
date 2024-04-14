mod chain;
mod instant;

use crate::error::Error;
use crate::platform_types::platform::PlatformRef;
use crate::rpc::core::CoreRPCLike;
use hpp::prelude::AssetLockProof;
use hpp::validation::SimpleConsensusValidationResult;
use hpp::version::PlatformVersion;
use drive::grovedb::TransactionArg;

/// A trait for validating state transitions within a blockchain.
pub trait AssetLockProofStateValidation {
    /// Validates the state transition by analyzing the changes in the platform state after applying the transaction.
    ///
    /// # Arguments
    ///
    /// * `platform` - A reference to the platform containing the state data.
    /// * `tx` - The transaction argument to be applied.
    ///
    /// # Type Parameters
    ///
    /// * `C: CoreRPCLike` - A type constraint indicating that C should implement `CoreRPCLike`.
    ///
    /// # Returns
    ///
    /// * `Result<SimpleConsensusValidationResult, Error>` - A result with either a SimpleConsensusValidationResult or an Error.
    fn validate_state<C: CoreRPCLike>(
        &self,
        platform_ref: &PlatformRef<C>,
        transaction: TransactionArg,
        platform_version: &PlatformVersion,
    ) -> Result<SimpleConsensusValidationResult, Error>;
}

impl AssetLockProofStateValidation for AssetLockProof {
    fn validate_state<C: CoreRPCLike>(
        &self,
        platform_ref: &PlatformRef<C>,
        transaction: TransactionArg,
        platform_version: &PlatformVersion,
    ) -> Result<SimpleConsensusValidationResult, Error> {
        match self {
            AssetLockProof::Instant(proof) => {
                proof.validate_state(platform_ref, transaction, platform_version)
            }
            AssetLockProof::Chain(proof) => {
                proof.validate_state(platform_ref, transaction, platform_version)
            }
        }
    }
}
