import { ExtendedDocument } from '@hellarpro/wasm-hpp';
import { Platform } from '../../Platform';

declare interface CreateOpts {
  [name:string]: any;
}

/**
 * Create and prepare documents for the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} typeLocator - type locator
 * @param identity - identity
 * @param {Object} [data] - options
 */
export async function create(
  this: Platform,
  typeLocator: string,
  identity: any,
  data: CreateOpts = {},
): Promise<ExtendedDocument> {
  this.logger.debug(`[Document#create] Create document "${typeLocator}"`);
  await this.initialize();

  const { hpp } = this;

  const appNames = this.client.getApps().getNames();

  // We can either provide of type `hellarpay.profile`
  // or if only one schema provided, of type `profile`.
  const [appName, fieldType] = (typeLocator.includes('.')) ? typeLocator.split('.') : [appNames[0], typeLocator];

  const { contractId } = this.client.getApps().get(appName);

  const dataContract = await this.contracts.get(contractId);
  this.logger.silly(`[Document#create] Obtained data contract ${dataContract.getId()}`);

  if (dataContract === null) {
    throw new Error(`Contract ${appName} not found. Ensure contractId ${contractId} is correct.`);
  }

  const document = hpp.document.create(
    dataContract,
    identity.getId(),
    fieldType,
    data,
  );

  this.logger.debug(`[Document#create] Created document ${typeLocator} for data contract ${dataContract.getId()}}`);
  return document;
}

export default create;
