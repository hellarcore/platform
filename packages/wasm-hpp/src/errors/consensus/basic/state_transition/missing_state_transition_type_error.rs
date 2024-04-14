use crate::buffer::Buffer;
use hpp::consensus::basic::state_transition::MissingStateTransitionTypeError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=MissingStateTransitionTypeError)]
pub struct MissingStateTransitionTypeErrorWasm {
    inner: MissingStateTransitionTypeError,
}

impl From<&MissingStateTransitionTypeError> for MissingStateTransitionTypeErrorWasm {
    fn from(e: &MissingStateTransitionTypeError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=MissingStateTransitionTypeError)]
impl MissingStateTransitionTypeErrorWasm {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: MissingStateTransitionTypeError::new(),
        }
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
