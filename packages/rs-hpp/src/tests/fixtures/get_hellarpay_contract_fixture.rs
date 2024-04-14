use crate::{
    data_contract::DataContractFactory, prelude::Identifier,
    tests::utils::generate_random_identifier_struct,
};

use crate::data_contract::created_data_contract::CreatedDataContract;
use data_contracts::SystemDataContract;

pub fn get_hellarpay_contract_fixture(
    owner_id: Option<Identifier>,
    protocol_version: u32,
) -> CreatedDataContract {
    let factory =
        DataContractFactory::new(protocol_version, None).expect("expected to create factory");
    let hpns_schema = SystemDataContract::Hellarpay
        .source()
        .expect("HPNS contract must be defined")
        .document_schemas;
    let owner_id = owner_id.unwrap_or_else(generate_random_identifier_struct);

    factory
        .create_with_value_config(owner_id, hpns_schema.into(), None, None)
        .expect("data in fixture should be correct")
}
