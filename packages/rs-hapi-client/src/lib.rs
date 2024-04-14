//! This crate provides [DapiClient] --- transport layer for a decentralized API for Hellar.

#![deny(missing_docs)]

mod address_list;
mod hapi_client;
#[cfg(feature = "dump")]
pub mod dump;
#[cfg(feature = "mocks")]
pub mod mock;
mod request_settings;
pub mod transport;

pub use hapi_client::Dapi;
use futures::{future::BoxFuture, FutureExt};
pub use http::Uri;

pub use address_list::AddressList;
pub use hapi_client::{DapiClient, DapiClientError};
#[cfg(feature = "dump")]
pub use dump::DumpData;
pub use request_settings::RequestSettings;

/// A HAPI request could be executed with an initialized [DapiClient].
///
/// # Examples
/// ```
/// use rs_hapi_client::{RequestSettings, AddressList, mock::MockDapiClient, DapiClientError, DapiRequest};
/// use hapi_grpc::platform::v0::{self as proto};
///
/// # let _ = async {
/// let mut client = MockDapiClient::new();
/// let request: proto::GetIdentityRequest = proto::get_identity_request::GetIdentityRequestV0 { id: b"0".to_vec(), prove: true }.into();
/// let response = request.execute(&mut client, RequestSettings::default()).await?;
/// # Ok::<(), DapiClientError<_>>(())
/// # };
/// ```
pub trait DapiRequest {
    /// Response from HAPI for this specific request.
    type Response;
    /// An error type for the transport this request uses.
    type TransportError;

    /// Executes the request.
    fn execute<'c, D: Dapi>(
        self,
        hapi_client: &'c mut D,
        settings: RequestSettings,
    ) -> BoxFuture<'c, Result<Self::Response, DapiClientError<Self::TransportError>>>
    where
        Self: 'c;
}

/// The trait is intentionally made sealed since it defines what is possible to send to HAPI.
impl<T: transport::TransportRequest + Send> DapiRequest for T {
    type Response = T::Response;

    type TransportError = <T::Client as transport::TransportClient>::Error;

    fn execute<'c, D: Dapi>(
        self,
        hapi_client: &'c mut D,
        settings: RequestSettings,
    ) -> BoxFuture<'c, Result<Self::Response, DapiClientError<Self::TransportError>>>
    where
        Self: 'c,
    {
        hapi_client.execute(self, settings).boxed()
    }
}

/// Allows to flag the transport error variant how tolerant we are of it and whether we can
/// try to do a request again.
pub trait CanRetry {
    /// Get boolean flag that indicates if the error is retryable.
    fn can_retry(&self) -> bool;
}
