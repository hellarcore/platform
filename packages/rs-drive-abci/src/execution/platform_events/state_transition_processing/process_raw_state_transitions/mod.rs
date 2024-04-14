mod v0;

use crate::error::execution::ExecutionError;
use crate::error::Error;
use crate::platform_types::platform::Platform;
use crate::platform_types::platform_state::PlatformState;
use crate::platform_types::state_transition_execution_result::StateTransitionExecutionResult;
use crate::rpc::core::CoreRPCLike;
use hpp::block::block_info::BlockInfo;
use hpp::fee::fee_result::FeeResult;
use hpp::version::PlatformVersion;
use drive::grovedb::Transaction;
use tenderhellar_abci::proto::abci::ExecTxResult;

impl<C> Platform<C>
where
    C: CoreRPCLike,
{
    /// Processes the given raw state transitions based on the `block_info` and `transaction`.
    ///
    /// # Arguments
    ///
    /// * `raw_state_transitions` - A reference to a vector of raw state transitions.
    /// * `block_platform_state` - A `PlatformState` reference containing the current platform state.
    /// * `block_info` - Information about the current block being processed.
    /// * `transaction` - The transaction associated with the raw state transitions.
    /// * `platform_version` - A `PlatformVersion` reference that dictates which version of
    ///   the method to call.
    ///
    /// # Returns
    ///
    /// * `Result<(FeeResult, Vec<ExecTxResult>), Error>` - If the processing is successful, it returns
    ///   a tuple consisting of a `FeeResult` and a vector of `ExecTxResult`. If the processing fails,
    ///   it returns an `Error`.
    ///
    /// # Errors
    ///
    /// This function may return an `Error` variant if there is a problem with deserializing the raw
    /// state transitions, processing state transitions, or executing events.
    pub(in crate::execution) fn process_raw_state_transitions(
        &self,
        raw_state_transitions: &Vec<Vec<u8>>,
        block_platform_state: &PlatformState,
        block_info: &BlockInfo,
        transaction: &Transaction,
        platform_version: &PlatformVersion,
    ) -> Result<(FeeResult, Vec<(Vec<u8>, StateTransitionExecutionResult)>), Error> {
        match platform_version
            .drive_abci
            .methods
            .state_transition_processing
            .process_raw_state_transitions
        {
            0 => self.process_raw_state_transitions_v0(
                raw_state_transitions,
                block_platform_state,
                block_info,
                transaction,
                platform_version,
            ),
            version => Err(Error::Execution(ExecutionError::UnknownVersionMismatch {
                method: "process_raw_state_transitions".to_string(),
                known_versions: vec![0],
                received: version,
            })),
        }
    }
}
