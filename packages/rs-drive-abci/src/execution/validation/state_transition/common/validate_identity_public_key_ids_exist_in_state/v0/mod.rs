use crate::error::Error;

use hpp::consensus::state::identity::missing_identity_public_key_ids_error::MissingIdentityPublicKeyIdsError;

use hpp::identity::KeyID;
use hpp::platform_value::Identifier;

use hpp::validation::SimpleConsensusValidationResult;

use drive::drive::identity::key::fetch::{IdentityKeysRequest, KeyIDVec, KeyRequestType};
use drive::drive::Drive;
use drive::grovedb::TransactionArg;

use crate::execution::types::state_transition_execution_context::StateTransitionExecutionContext;
use hpp::version::PlatformVersion;
use std::collections::BTreeSet;

/// This will validate that all keys are valid against the state
pub(super) fn validate_identity_public_key_ids_exist_in_state_v0(
    identity_id: Identifier,
    key_ids: &[KeyID],
    drive: &Drive,
    execution_context: &mut StateTransitionExecutionContext,
    transaction: TransactionArg,
    platform_version: &PlatformVersion,
) -> Result<SimpleConsensusValidationResult, Error> {
    let limit = key_ids.len() as u16;
    let identity_key_request = IdentityKeysRequest {
        identity_id: identity_id.to_buffer(),
        request_type: KeyRequestType::SpecificKeys(key_ids.to_vec()),
        limit: Some(limit),
        offset: None,
    };
    let keys = drive.fetch_identity_keys::<KeyIDVec>(
        identity_key_request,
        transaction,
        platform_version,
    )?;
    if keys.len() != key_ids.len() {
        let to_remove = BTreeSet::from_iter(keys);
        let mut missing_keys = key_ids.to_vec();
        missing_keys.retain(|found_key| !to_remove.contains(found_key));
        // keys should all exist
        Ok(SimpleConsensusValidationResult::new_with_error(
            MissingIdentityPublicKeyIdsError::new(missing_keys).into(),
        ))
    } else {
        Ok(SimpleConsensusValidationResult::default())
    }
}
