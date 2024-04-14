use hapi_grpc::platform::v0::{GetIdentityRequest, GetIdentityResponse, Proof};

use rs_hapi_client::{mock::MockDapiClient, Dapi, DapiRequest, RequestSettings};

#[tokio::test]
async fn test_mock_get_identity_hapi_client() {
    let mut hapi = MockDapiClient::new();

    let request = GetIdentityRequest::default();
    let response: GetIdentityResponse = GetIdentityResponse {
        version: Some(hapi_grpc::platform::v0::get_identity_response::Version::V0(hapi_grpc::platform::v0::get_identity_response::GetIdentityResponseV0 {
            result: Some(
                hapi_grpc::platform::v0::get_identity_response::get_identity_response_v0::Result::Proof(Proof {
                    quorum_type: 106,
                    ..Default::default()
                }),
            ),
            metadata: Default::default(),
        }))
    };

    hapi.expect(&request, &response);

    let settings = RequestSettings::default();

    let result = hapi.execute(request.clone(), settings).await.unwrap();

    let result2 = request.execute(&mut hapi, settings).await.unwrap();

    assert_eq!(result, response);
    assert_eq!(result2, response);
}
