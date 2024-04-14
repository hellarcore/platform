use hellarcore_rpc::json::QuorumType;
use tenderhellar_abci::proto;

pub trait CommitAccessorsV0 {
    fn inner(&self) -> &proto::types::Commit;

    fn chain_id(&self) -> &String;

    fn quorum_type(&self) -> QuorumType;
}
