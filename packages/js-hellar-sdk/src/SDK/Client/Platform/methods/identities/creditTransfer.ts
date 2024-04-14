import { Identifier, Identity } from '@hellarpro/wasm-hpp';
import broadcastStateTransition from '../../broadcastStateTransition';
import { Platform } from '../../Platform';
import { signStateTransition } from '../../signStateTransition';

export async function creditTransfer(
  this: Platform,
  identity: Identity,
  recipientId: Identifier | string,
  amount: number,
): Promise<any> {
  this.logger.debug(`[Identity#creditTransfer] credit transfer from ${identity.getId().toString()} to ${recipientId.toString()} with amount ${amount}`);
  await this.initialize();

  const { hpp } = this;

  recipientId = Identifier.from(recipientId);

  const identityCreditTransferTransition = hpp.identity
    .createIdentityCreditTransferTransition(
      identity.getId(),
      recipientId,
      BigInt(amount),
    );

  this.logger.silly('[Identity#creditTransfer] Created IdentityCreditTransferTransition');

  const signerKeyIndex = 2;

  await signStateTransition(this, identityCreditTransferTransition, identity, signerKeyIndex);

  await broadcastStateTransition(this, identityCreditTransferTransition, {
    skipValidation: true,
  });

  this.logger.silly('[Identity#creditTransfer] Broadcasted IdentityCreditTransferTransition');

  return true;
}

export default creditTransfer;
