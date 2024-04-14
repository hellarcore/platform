use crate::{
    data_contract::DataContractFactory, prelude::Identifier,
    tests::utils::generate_random_identifier_struct,
};

use crate::data_contract::config::v0::DataContractConfigV0;
use crate::data_contract::created_data_contract::CreatedDataContract;
use crate::data_contract::storage_requirements::keys_for_document_type::StorageKeyRequirements;
use data_contracts::SystemDataContract;

pub fn get_hellarpay_contract_with_generalized_encryption_key_fixture(
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
        .create(
            owner_id,
            hpns_schema.into(),
            Some(
                DataContractConfigV0 {
                    requires_identity_encryption_bounded_key: Some(StorageKeyRequirements::Unique),
                    requires_identity_decryption_bounded_key: Some(StorageKeyRequirements::Unique),
                    ..Default::default()
                }
                .into(),
            ),
            None,
        )
        .expect("data in fixture should be correct")
}
