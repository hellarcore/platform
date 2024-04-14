use hpp::identity::state_transition::asset_lock_proof::AssetLockProof;
use hpp::identity::state_transition::AssetLockProved;
use hpp::state_transition::identity_create_transition::accessors::IdentityCreateTransitionAccessorsV0;
use hpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use hpp::{
    identifier::Identifier, state_transition::identity_create_transition::IdentityCreateTransition,
    state_transition::StateTransitionLike,
};
use serde::Deserialize;
use std::default::Default;

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ToObjectOptions {
    pub skip_signature: Option<bool>,
}

#[derive(Default)]
pub struct ToObject {
    pub transition_type: u8,
    pub identity_id: Identifier,
    pub asset_lock_proof: AssetLockProof,
    pub public_keys: Vec<IdentityPublicKeyInCreation>,
    pub signature: Option<Vec<u8>>,
}

pub fn to_object_struct(
    transition: &IdentityCreateTransition,
    options: &ToObjectOptions,
) -> ToObject {
    let mut to_object = ToObject {
        transition_type: transition.state_transition_type() as u8,
        public_keys: transition.public_keys().to_owned(),
        asset_lock_proof: transition.asset_lock_proof().to_owned(),
        identity_id: transition.identity_id().to_owned(),
        signature: None,
    };

    if !options.skip_signature.unwrap_or(false) {
        to_object.signature = Some(transition.signature().to_vec());
    }

    to_object
}
