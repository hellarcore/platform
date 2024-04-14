import { PrivateKey } from '@hellarpro/hellarcore-lib';
import { IdentityPublicKey } from '@hellarpro/wasm-hpp';
import { Platform } from '../../../Platform';

/**
 * Creates a funding transaction for the platform identity
 * and returns one-time key to sign the state transition
 * @param {Platform} this
 * @param {AssetLockProof} assetLockProof - asset lock transaction proof
 *  for the identity create transition
 * @param {PrivateKey} assetLockPrivateKey - private key used in asset lock
 * @param {string|Buffer|Identifier} identityId
 * @return {{identity: Identity, identityCreateTransition: IdentityCreateTransition}}
 *  - identity, state transition and index of the key used to create it
 * that can be used to sign registration/top-up state transition
 */
export async function createIdentityTopUpTransition(
  this : Platform,
  assetLockProof: any,
  assetLockPrivateKey: PrivateKey,
  identityId: any,
): Promise<any> {
  const platform = this;
  await platform.initialize();

  const { hpp } = platform;

  const identityTopUpTransition = hpp.identity
    .createIdentityTopUpTransition(identityId, assetLockProof);

  await identityTopUpTransition
    .signByPrivateKey(assetLockPrivateKey.toBuffer(), IdentityPublicKey.TYPES.ECDSA_SECP256K1);

  // TODO(versioning): restore
  // @ts-ignore
  // const result = await hpp.stateTransition.validateBasic(
  //   identityTopUpTransition,
  //   // TODO(v0.24-backport): get rid of this once decided
  //   //  whether we need execution context in wasm bindings
  //   new StateTransitionExecutionContext(),
  // );

  // if (!result.isValid()) {
  //   const messages = result.getErrors().map((error) => error.message);
  //   throw new Error(`StateTransition is invalid - ${JSON.stringify(messages)}`);
  // }

  return identityTopUpTransition;
}

export default createIdentityTopUpTransition;
