import * as hpp_module from './wasm/wasm_hpp';
import { patchConsensusErrors } from './errors/patchConsensusErrors';
import _Identifier from "./identifier/Identifier";
import _IdentifierError from "./identifier/errors/IdentifierError";

patchConsensusErrors();

// While we declared it above, those fields do not hold any values - let's assign them.
// We need to suppress the compiler here, as he won't be happy about those reassignments.
// @ts-ignore
hpp_module.IdentityPublicKey.TYPES = hpp_module.KeyType;
// @ts-ignore
hpp_module.IdentityPublicKey.PURPOSES = hpp_module.KeyPurpose;
// @ts-ignore
hpp_module.IdentityPublicKey.SECURITY_LEVELS = hpp_module.KeySecurityLevel;
// @ts-ignore
hpp_module.Identifier = _Identifier;
// @ts-ignore
hpp_module.IdentifierError = _IdentifierError;

export * from './wasm/wasm_hpp';
export * from './errors/AbstractConsensusError';
export * from './errors/DPPError';

// Declarations written prior to "export *" will overwrite exports
export declare class IdentityPublicKey extends hpp_module.IdentityPublicKey {
    static TYPES: typeof hpp_module.KeyType;
    static PURPOSES: typeof hpp_module.KeyPurpose;
    static SECURITY_LEVELS: typeof hpp_module.KeySecurityLevel;
}

// TypeScript voodoo to ensure Identifier and IdentifierError are exported
export declare class Identifier extends _Identifier {}
export declare class IdentifierError extends _IdentifierError {}
