use crate::errors::consensus::consensus_error::from_consensus_error;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformDeserializable;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::{JsError, JsValue};

#[wasm_bindgen(js_name=deserializeConsensusError)]
pub fn deserialize_consensus_error(bytes: Vec<u8>) -> Result<JsValue, JsError> {
    ConsensusError::deserialize_from_bytes(bytes.as_slice())
        .map(from_consensus_error)
        .map_err(|e| e.into())
}
