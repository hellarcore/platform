use crate::buffer::Buffer;
use hpp::consensus::basic::identity::InvalidIdentityKeySignatureError;
use hpp::consensus::codes::ErrorWithCode;
use hpp::consensus::ConsensusError;
use hpp::identity::KeyID;
use hpp::serialization::PlatformSerializable;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name=InvalidIdentityKeySignatureError)]
pub struct InvalidIdentityKeySignatureErrorWasm {
    inner: InvalidIdentityKeySignatureError,
}

impl From<&InvalidIdentityKeySignatureError> for InvalidIdentityKeySignatureErrorWasm {
    fn from(e: &InvalidIdentityKeySignatureError) -> Self {
        Self { inner: e.clone() }
    }
}

#[wasm_bindgen(js_class=InvalidIdentityKeySignatureError)]
impl InvalidIdentityKeySignatureErrorWasm {
    #[wasm_bindgen(js_name=getPublicKeyId)]
    pub fn get_public_key_id(&self) -> KeyID {
        self.inner.public_key_id()
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
