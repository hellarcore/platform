use crate::buffer::Buffer;
use hpp::consensus::basic::decode::SerializedObjectParsingError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=SerializedObjectParsingError)]
pub struct SerializedObjectParsingErrorWasm {
    inner: SerializedObjectParsingError,
}

impl From<&SerializedObjectParsingError> for SerializedObjectParsingErrorWasm {
    fn from(e: &SerializedObjectParsingError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=SerializedObjectParsingError)]
impl SerializedObjectParsingErrorWasm {
    #[wasm_bindgen(js_name=getParsingError)]
    pub fn get_parsing_error(&self) -> String {
        self.inner.parsing_error().to_string()
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
