use crate::buffer::Buffer;
use hpp::consensus::basic::data_contract::DuplicateIndexError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=DuplicateIndexError)]
pub struct DuplicateIndexErrorWasm {
    inner: DuplicateIndexError,
}

impl From<&DuplicateIndexError> for DuplicateIndexErrorWasm {
    fn from(e: &DuplicateIndexError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=DuplicateIndexError)]
impl DuplicateIndexErrorWasm {
    #[wasm_bindgen(js_name=getDocumentType)]
    pub fn get_document_type(&self) -> String {
        self.inner.document_type().to_string()
    }

    #[wasm_bindgen(js_name=getIndexName)]
    pub fn get_index_name(&self) -> String {
        self.inner.index_name().to_string()
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
