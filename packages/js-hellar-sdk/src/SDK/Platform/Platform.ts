// TODO remove default exports
// eslint-disable-next-line no-restricted-exports
import * as _HellarPlatformProtocol from '@hellarpro/wasm-hpp';
import { Platform as PlatformClient } from '../Client/Platform/Platform';

export namespace Platform {
  export const HellarPlatformProtocol = _HellarPlatformProtocol;
  export const { initializeDppModule } = PlatformClient;
}
// eslint-disable-next-line no-restricted-exports
export { Platform as default };
