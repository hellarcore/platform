import { Identifier, Metadata } from '@hellarpro/wasm-hpp';
import { GetIdentityResponse } from '@hellarpro/hapi-client/lib/methods/platform/getIdentity/GetIdentityResponse';
import { Platform } from '../../Platform';

const NotFoundError = require('@hellarpro/hapi-client/lib/transport/GrpcTransport/errors/NotFoundError');

/**
 * Get an identity from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string|Identifier} id - id
 * @returns Identity
 */
export async function get(this: Platform, id: Identifier | string): Promise<any> {
  await this.initialize();

  const identifier = Identifier.from(id);

  let identityResponse: GetIdentityResponse;
  try {
    identityResponse = await this.fetcher.fetchIdentity(identifier);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return null;
    }

    throw e;
  }
  const identity = this.hpp.identity.createFromBuffer(identityResponse.getIdentity() as Uint8Array);

  let metadata;
  const responseMetadata = identityResponse.getMetadata();
  if (responseMetadata) {
    metadata = new Metadata({
      blockHeight: responseMetadata.getHeight(),
      coreChainLockedHeight: responseMetadata.getCoreChainLockedHeight(),
      timeMs: responseMetadata.getTimeMs(),
      protocolVersion: responseMetadata.getProtocolVersion(),
    });
  }

  identity.setMetadata(metadata);

  return identity;
}

export default get;
