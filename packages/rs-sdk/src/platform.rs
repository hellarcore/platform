//! Platform HAPI requests.

// TODO: rs-sdk should define a proper user-facing API hiding transport and serialization
// details, however we don't have any data model yet, so for now it will re-export proto
// generated types. Later these re-exports could be swapped with actual rs-sdk's requests
// and while it will change the substance, the API structure will remain the same.

mod delegate;
mod document_query;
mod fetch;
mod fetch_many;
mod query;
pub mod types;

pub use hapi_grpc::platform::v0::{self as proto};
pub use drive::{
    hpp::{
        self as hpp,
        document::Document,
        prelude::{DataContract, Identifier, Identity, IdentityPublicKey, Revision},
    },
    query::DriveQuery,
};
pub use {
    document_query::DocumentQuery,
    fetch::Fetch,
    fetch_many::FetchMany,
    query::{LimitQuery, Query, DEFAULT_EPOCH_QUERY_LIMIT},
};

pub use rs_hapi_client as hapi;
