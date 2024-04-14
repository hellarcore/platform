use crate::error::Error;
use hpp::data_contract::DataContract;
use hpp::system_data_contracts::{load_system_data_contract, SystemDataContract};

/// System contracts
pub struct SystemContracts {
    /// Withdrawal contract
    pub withdrawal_contract: DataContract,
    /// HPNS contract
    pub hpns_contract: DataContract,
    /// Hellarpay contract
    pub hellarpay_contract: DataContract,
    /// Masternode reward shares contract
    pub masternode_rewards: DataContract,
}

impl SystemContracts {
    /// load genesis system contracts
    pub fn load_genesis_system_contracts(protocol_version: u32) -> Result<Self, Error> {
        Ok(SystemContracts {
            withdrawal_contract: load_system_data_contract(
                SystemDataContract::Withdrawals,
                protocol_version,
            )?,
            hpns_contract: load_system_data_contract(SystemDataContract::HPNS, protocol_version)?,
            hellarpay_contract: load_system_data_contract(
                SystemDataContract::Hellarpay,
                protocol_version,
            )?,
            masternode_rewards: load_system_data_contract(
                SystemDataContract::MasternodeRewards,
                protocol_version,
            )?,
        })
    }
}
