use crate::state_transition_action::contract::data_contract_update::v0::DataContractUpdateTransitionActionV0;
use hpp::data_contract::DataContract;
use hpp::state_transition::data_contract_update_transition::DataContractUpdateTransitionV0;
use hpp::ProtocolError;
use platform_version::version::PlatformVersion;
use platform_version::TryFromPlatformVersioned;

impl TryFromPlatformVersioned<DataContractUpdateTransitionV0>
    for DataContractUpdateTransitionActionV0
{
    type Error = ProtocolError;

    fn try_from_platform_versioned(
        value: DataContractUpdateTransitionV0,
        platform_version: &PlatformVersion,
    ) -> Result<Self, Self::Error> {
        Ok(DataContractUpdateTransitionActionV0 {
            data_contract: DataContract::try_from_platform_versioned(
                value.data_contract,
                true,
                platform_version,
            )?,
        })
    }
}

impl TryFromPlatformVersioned<&DataContractUpdateTransitionV0>
    for DataContractUpdateTransitionActionV0
{
    type Error = ProtocolError;

    fn try_from_platform_versioned(
        value: &DataContractUpdateTransitionV0,
        platform_version: &PlatformVersion,
    ) -> Result<Self, Self::Error> {
        Ok(DataContractUpdateTransitionActionV0 {
            data_contract: DataContract::try_from_platform_versioned(
                value.data_contract.clone(),
                true,
                platform_version,
            )?,
        })
    }
}
