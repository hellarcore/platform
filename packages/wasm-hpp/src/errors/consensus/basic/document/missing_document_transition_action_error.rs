use crate::buffer::Buffer;
use hpp::consensus::basic::document::MissingDocumentTransitionActionError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=MissingDocumentTransitionActionError)]
pub struct MissingDocumentTransitionActionErrorWasm {
    inner: MissingDocumentTransitionActionError,
}

impl From<&MissingDocumentTransitionActionError> for MissingDocumentTransitionActionErrorWasm {
    fn from(e: &MissingDocumentTransitionActionError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=MissingDocumentTransitionActionError)]
impl MissingDocumentTransitionActionErrorWasm {
    #[wasm_bindgen(js_name=getCode)]
    pub fn get_code(&self) -> u32 {
        ConsensusError::from(self.inner.clone()).code()
    }

    #[wasm_bindgen(getter)]
    pub fn message(&self) -> String {
        self.inner.to_string()
    }
}
