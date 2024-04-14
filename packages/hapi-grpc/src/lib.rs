pub use prost::Message;

#[cfg(feature = "core")]
pub mod core {
    pub mod v0 {
        include!("core/proto/org.hellar.platform.hapi.v0.rs");
    }
}

#[cfg(feature = "platform")]
pub mod platform {
    pub mod v0 {
        include!("platform/proto/org.hellar.platform.hapi.v0.rs");
    }
    #[cfg(feature = "tenderhellar-proto")]
    pub use tenderhellar_proto as proto;

    mod versioning;
    pub use versioning::{VersionedGrpcMessage, VersionedGrpcResponse};
}

#[cfg(feature = "serde")]
// Serde deserialization logic
pub mod deserialization;
