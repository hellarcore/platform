use data_contracts::{DataContractSource, SystemDataContract};
use platform_value::platform_value;
use serde_json::json;

use crate::data_contract::created_data_contract::CreatedDataContract;
use crate::data_contract::DataContractFactory;
use crate::prelude::*;
use crate::tests::utils::generate_random_identifier_struct;

pub fn get_hpns_data_contract_fixture(
    owner_id: Option<Identifier>,
    protocol_version: u32,
) -> CreatedDataContract {
    let factory = DataContractFactory::new(protocol_version, None)
        .expect("expected to create a factory for get_hpns_data_contract_fixture");

    let owner_id = owner_id.unwrap_or_else(generate_random_identifier_struct);

    let DataContractSource {
        mut document_schemas,
        ..
    } = SystemDataContract::HPNS
        .source()
        .expect("should return HPNS data contract source");

    //Todo create config
    factory
        .create_with_value_config(owner_id, document_schemas.into(), None, None)
        .expect("data in fixture should be correct")
}
