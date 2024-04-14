use crate::error::Error;
use hpp::identity::state_transition::AssetLockProved;

use hpp::state_transition::identity_topup_transition::IdentityTopUpTransition;
use hpp::validation::SimpleConsensusValidationResult;
use hpp::version::PlatformVersion;

pub(in crate::execution::validation::state_transition::state_transitions::identity_top_up) trait IdentityTopUpStateTransitionStructureValidationV0
{
    fn validate_base_structure_v0(
        &self,
        platform_version: &PlatformVersion,
    ) -> Result<SimpleConsensusValidationResult, Error>;
}

impl IdentityTopUpStateTransitionStructureValidationV0 for IdentityTopUpTransition {
    fn validate_base_structure_v0(
        &self,
        platform_version: &PlatformVersion,
    ) -> Result<SimpleConsensusValidationResult, Error> {
        // TODO: Add validation for the structure of the IdentityTopUpTransition

        self.asset_lock_proof()
            .validate_structure(platform_version)
            .map_err(Error::Protocol)
    }
}
