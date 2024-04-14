import init from './wasm/wasm_hpp';
// Ignore the following line, it's not present in the lib/wasm,
// but added to the dist/wasm by the build process
// @ts-ignore
import wasmBase from './wasm/wasm_hpp_bg';
import * as hpp_module from './hpp';

export * from './hpp';
export type DPPModule = typeof hpp_module;

let isInitialized = false;
let loadingPromise: Promise<void> | null = null;

export default async function loadDpp(): Promise<DPPModule> {
  if (isInitialized) {
    return hpp_module
  }

  if (!loadingPromise) {
    loadingPromise = loadDppModule()
  }

  await loadingPromise;
  isInitialized = true;
  loadingPromise = null;
  return hpp_module;
};

const loadDppModule = async () => {
  // @ts-ignore
  let bytes = Buffer.from(wasmBase, 'base64');

  if (typeof window !== 'undefined') {
    let blob = new Blob([bytes], { type: "application/wasm" });
    let wasmUrl = URL.createObjectURL(blob);
    await init(wasmUrl);
  } else {
    hpp_module.initSync(bytes);
  }
}

