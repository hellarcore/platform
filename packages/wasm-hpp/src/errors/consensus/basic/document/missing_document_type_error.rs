use crate::buffer::Buffer;
use hpp::consensus::basic::document::MissingDocumentTypeError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=MissingDocumentTypeError)]
pub struct MissingDocumentTypeErrorWasm {
    inner: MissingDocumentTypeError,
}

impl From<&MissingDocumentTypeError> for MissingDocumentTypeErrorWasm {
    fn from(e: &MissingDocumentTypeError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=MissingDocumentTypeError)]
impl MissingDocumentTypeErrorWasm {
    #[wasm_bindgen(js_name=getCode)]
    pub fn get_code(&self) -> u32 {
        ConsensusError::from(self.inner.clone()).code()
    }

    #[wasm_bindgen(getter)]
    pub fn message(&self) -> String {
        self.inner.to_string()
    }
}
