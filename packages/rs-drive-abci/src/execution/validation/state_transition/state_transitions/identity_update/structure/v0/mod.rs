use crate::error::Error;
use hpp::consensus::basic::identity::{
    DuplicatedIdentityPublicKeyIdBasicError, InvalidIdentityUpdateTransitionDisableKeysError,
    InvalidIdentityUpdateTransitionEmptyError,
};
use hpp::consensus::state::identity::max_identity_public_key_limit_reached_error::MaxIdentityPublicKeyLimitReachedError;
use hpp::consensus::ConsensusError;
use hpp::state_transition::identity_update_transition::accessors::IdentityUpdateTransitionAccessorsV0;
use hpp::state_transition::identity_update_transition::IdentityUpdateTransition;
use hpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use hpp::validation::SimpleConsensusValidationResult;
use hpp::version::PlatformVersion;
use std::collections::HashSet;

const MAX_KEYS_TO_DISABLE: usize = 10;

pub(in crate::execution::validation::state_transition::state_transitions::identity_update) trait IdentityUpdateStateTransitionStructureValidationV0
{
    fn validate_base_structure_v0(
        &self,
        platform_version: &PlatformVersion,
    ) -> Result<SimpleConsensusValidationResult, Error>;
}

impl IdentityUpdateStateTransitionStructureValidationV0 for IdentityUpdateTransition {
    fn validate_base_structure_v0(
        &self,
        platform_version: &PlatformVersion,
    ) -> Result<SimpleConsensusValidationResult, Error> {
        let mut result = SimpleConsensusValidationResult::default();

        // Ensure that either disablePublicKeys or addPublicKeys is present
        if self.public_key_ids_to_disable().is_empty() && self.public_keys_to_add().is_empty() {
            result.add_error(ConsensusError::from(
                InvalidIdentityUpdateTransitionEmptyError::new(),
            ));
        }

        if !result.is_valid() {
            return Ok(result);
        }

        // Validate public keys to disable
        if !self.public_key_ids_to_disable().is_empty() {
            // Ensure max items
            if self.public_key_ids_to_disable().len() > MAX_KEYS_TO_DISABLE {
                result.add_error(ConsensusError::from(
                    MaxIdentityPublicKeyLimitReachedError::new(MAX_KEYS_TO_DISABLE),
                ));
            }

            // Check key id duplicates
            let mut ids = HashSet::new();
            for key_id in self.public_key_ids_to_disable() {
                if ids.contains(key_id) {
                    result.add_error(ConsensusError::from(
                        DuplicatedIdentityPublicKeyIdBasicError::new(vec![*key_id]),
                    ));
                    break;
                }

                ids.insert(key_id);
            }

            // Ensure disable at timestamp is present
            if self.public_keys_disabled_at().is_none() {
                result.add_error(ConsensusError::from(
                    InvalidIdentityUpdateTransitionDisableKeysError::new(),
                ))
            }
        } else if self.public_keys_disabled_at().is_some() {
            // Ensure there are public keys to disable when disable at timestamp is present
            result.add_error(ConsensusError::from(
                InvalidIdentityUpdateTransitionDisableKeysError::new(),
            ))
        }

        if !result.is_valid() {
            return Ok(result);
        }

        IdentityPublicKeyInCreation::validate_identity_public_keys_structure(
            self.public_keys_to_add(),
            platform_version,
        )
        .map_err(Error::Protocol)
    }
}
