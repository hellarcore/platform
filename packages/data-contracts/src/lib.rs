use serde_json::{Error, Value};

pub use hellarpay_contract;
pub use hpns_contract;
pub use feature_flags_contract;
pub use masternode_reward_shares_contract;
use platform_value::Identifier;
pub use withdrawals_contract;

#[repr(u8)]
#[derive(PartialEq, Eq, Clone, Copy, Debug, Ord, PartialOrd)]
pub enum SystemDataContract {
    Withdrawals = 0,
    MasternodeRewards = 1,
    FeatureFlags = 2,
    HPNS = 3,
    Hellarpay = 4,
}

pub struct DataContractSource {
    pub id_bytes: [u8; 32],
    pub owner_id_bytes: [u8; 32],
    pub definitions: Option<Value>,
    pub document_schemas: Value,
}

impl SystemDataContract {
    pub fn id(&self) -> Identifier {
        let bytes = match self {
            SystemDataContract::Withdrawals => withdrawals_contract::ID_BYTES,
            SystemDataContract::MasternodeRewards => masternode_reward_shares_contract::ID_BYTES,
            SystemDataContract::FeatureFlags => feature_flags_contract::ID_BYTES,
            SystemDataContract::HPNS => hpns_contract::ID_BYTES,
            SystemDataContract::Hellarpay => hellarpay_contract::ID_BYTES,
        };
        Identifier::new(bytes)
    }
    /// Returns [DataContractSource]
    pub fn source(self) -> Result<DataContractSource, Error> {
        let data = match self {
            SystemDataContract::Withdrawals => DataContractSource {
                id_bytes: withdrawals_contract::ID_BYTES,
                owner_id_bytes: withdrawals_contract::OWNER_ID_BYTES,
                definitions: None,
                document_schemas: withdrawals_contract::load_documents_schemas()?,
            },
            SystemDataContract::MasternodeRewards => DataContractSource {
                id_bytes: masternode_reward_shares_contract::ID_BYTES,
                owner_id_bytes: masternode_reward_shares_contract::OWNER_ID_BYTES,
                definitions: None,
                document_schemas: masternode_reward_shares_contract::load_documents_schemas()?,
            },
            SystemDataContract::FeatureFlags => DataContractSource {
                id_bytes: feature_flags_contract::ID_BYTES,
                owner_id_bytes: feature_flags_contract::OWNER_ID_BYTES,
                definitions: None,
                document_schemas: feature_flags_contract::load_documents_schemas()?,
            },
            SystemDataContract::HPNS => DataContractSource {
                id_bytes: hpns_contract::ID_BYTES,
                owner_id_bytes: hpns_contract::OWNER_ID_BYTES,
                definitions: None,
                document_schemas: hpns_contract::load_documents_schemas()?,
            },
            SystemDataContract::Hellarpay => DataContractSource {
                id_bytes: hellarpay_contract::ID_BYTES,
                owner_id_bytes: hellarpay_contract::OWNER_ID_BYTES,
                definitions: None,
                document_schemas: hellarpay_contract::load_documents_schemas()?,
            },
        };

        Ok(data)
    }
}
