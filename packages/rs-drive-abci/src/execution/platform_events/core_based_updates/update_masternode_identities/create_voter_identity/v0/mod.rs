use crate::error::Error;
use crate::platform_types::platform::Platform;
use crate::rpc::core::CoreRPCLike;
use hellarcore_rpc::hellarcore_rpc_json::MasternodeListItem;
use hpp::hellarcore::hashes::Hash;
use hpp::identity::accessors::IdentityGettersV0;
use hpp::identity::Identity;
use hpp::version::PlatformVersion;

impl<C> Platform<C>
where
    C: CoreRPCLike,
{
    pub(super) fn create_voter_identity_v0(
        pro_tx_hash: &[u8; 32],
        voting_key: &[u8; 20],
        platform_version: &PlatformVersion,
    ) -> Result<Identity, Error> {
        let voting_identifier =
            Self::get_voter_identifier(pro_tx_hash, voting_key, platform_version)?;
        let mut identity = Identity::create_basic_identity(voting_identifier, platform_version)?;
        identity.add_public_keys([Self::get_voter_identity_key(
            *voting_key,
            0,
            platform_version,
        )?]);
        Ok(identity)
    }

    pub(super) fn create_voter_identity_from_masternode_list_item_v0(
        masternode: &MasternodeListItem,
        platform_version: &PlatformVersion,
    ) -> Result<Identity, Error> {
        Self::create_voter_identity_v0(
            &masternode.pro_tx_hash.to_byte_array(),
            &masternode.state.voting_address,
            platform_version,
        )
    }
}
