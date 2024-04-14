use crate::abci::config::Keys;
use crate::platform_types::required_identity_public_key_set;
use serde::{Deserialize, Serialize};

/// System identity public keys
#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SystemIdentityPublicKeysV0 {
    /// Required public key set for masternode reward shares contract owner identity
    pub masternode_reward_shares_contract_owner:
        required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    /// Required public key set for feature flags contract owner identity
    pub feature_flags_contract_owner:
        required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    /// Required public key set for hpns contract owner identity
    pub hpns_contract_owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    /// Required public key set for withdrawals contract owner identity
    pub withdrawals_contract_owner:
        required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    /// Required public key set for hellarpay contract owner identity
    pub hellarpay_contract_owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
}

impl From<Keys> for SystemIdentityPublicKeysV0 {
    fn from(keys: Keys) -> Self {
        Self {
            masternode_reward_shares_contract_owner:
                required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
                    master: keys.masternode_reward_shares_master_public_key,
                    high: keys.masternode_reward_shares_second_public_key,
                },
            feature_flags_contract_owner:
                required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
                    master: keys.feature_flags_master_public_key,
                    high: keys.feature_flags_second_public_key,
                },
            hpns_contract_owner:
                required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
                    master: keys.hpns_master_public_key,
                    high: keys.hpns_second_public_key,
                },
            withdrawals_contract_owner:
                required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
                    master: keys.withdrawals_master_public_key,
                    high: keys.withdrawals_second_public_key,
                },
            hellarpay_contract_owner:
                required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
                    master: keys.hellarpay_master_public_key,
                    high: keys.hellarpay_second_public_key,
                },
        }
    }
}

/// Trait to get the fields of SystemIdentityPublicKeysV0
pub trait SystemIdentityPublicKeysV0Getters {
    /// Returns the required public key set for masternode reward shares contract owner identity
    fn masternode_reward_shares_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet;
    /// Returns the required public key set for feature flags contract owner identity
    fn feature_flags_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet;
    /// Returns the required public key set for hpns contract owner identity
    fn hpns_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet;
    /// Returns the required public key set for withdrawals contract owner identity
    fn withdrawals_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet;
    /// Returns the required public key set for hellarpay contract owner identity
    fn hellarpay_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet;
}

/// Trait to set the fields of SystemIdentityPublicKeysV0
pub trait SystemIdentityPublicKeysV0Setters {
    /// Sets the required public key set for masternode reward shares contract owner identity
    fn set_masternode_reward_shares_contract_owner(
        &mut self,
        keys: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    );
    /// Sets the required public key set for feature flags contract owner identity
    fn set_feature_flags_contract_owner(
        &mut self,
        keys: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    );
    /// Sets the required public key set for hpns contract owner identity
    fn set_hpns_contract_owner(
        &mut self,
        keys: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    );
    /// Sets the required public key set for withdrawals contract owner identity
    fn set_withdrawals_contract_owner(
        &mut self,
        keys: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    );
    /// Sets the required public key set for hellarpay contract owner identity
    fn set_hellarpay_contract_owner(
        &mut self,
        keys: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    );
}

impl SystemIdentityPublicKeysV0Getters for SystemIdentityPublicKeysV0 {
    fn masternode_reward_shares_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
        &self.masternode_reward_shares_contract_owner
    }

    fn feature_flags_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
        &self.feature_flags_contract_owner
    }

    fn hpns_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
        &self.hpns_contract_owner
    }

    fn withdrawals_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
        &self.withdrawals_contract_owner
    }

    fn hellarpay_contract_owner(
        &self,
    ) -> &required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet {
        &self.hellarpay_contract_owner
    }
}

impl SystemIdentityPublicKeysV0Setters for SystemIdentityPublicKeysV0 {
    fn set_masternode_reward_shares_contract_owner(
        &mut self,
        owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    ) {
        self.masternode_reward_shares_contract_owner = owner;
    }

    fn set_feature_flags_contract_owner(
        &mut self,
        owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    ) {
        self.feature_flags_contract_owner = owner;
    }

    fn set_hpns_contract_owner(
        &mut self,
        owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    ) {
        self.hpns_contract_owner = owner;
    }

    fn set_withdrawals_contract_owner(
        &mut self,
        owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    ) {
        self.withdrawals_contract_owner = owner;
    }

    fn set_hellarpay_contract_owner(
        &mut self,
        owner: required_identity_public_key_set::v0::RequiredIdentityPublicKeysSet,
    ) {
        self.hellarpay_contract_owner = owner;
    }
}
