use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "lohellar")]
extern "C" {
    #[wasm_bindgen(js_name = "set")]
    pub fn lohellar_set(object: &JsValue, path: &str, value: JsValue);
}
