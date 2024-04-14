use crate::buffer::Buffer;
use hpp::consensus::basic::identity::InvalidIdentityAssetLockTransactionOutputError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=InvalidIdentityAssetLockTransactionOutputError)]
pub struct InvalidIdentityAssetLockTransactionOutputErrorWasm {
    inner: InvalidIdentityAssetLockTransactionOutputError,
}

impl From<&InvalidIdentityAssetLockTransactionOutputError>
    for InvalidIdentityAssetLockTransactionOutputErrorWasm
{
    fn from(e: &InvalidIdentityAssetLockTransactionOutputError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=InvalidIdentityAssetLockTransactionOutputError)]
impl InvalidIdentityAssetLockTransactionOutputErrorWasm {
    #[wasm_bindgen(js_name=getOutputIndex)]
    pub fn output_index(&self) -> usize {
        self.inner.output_index()
    }

    #[wasm_bindgen(js_name=getCode)]
    pub fn get_code(&self) -> u32 {
        ConsensusError::from(self.inner.clone()).code()
    }

    #[wasm_bindgen(getter)]
    pub fn message(&self) -> String {
        self.inner.to_string()
    }
}
