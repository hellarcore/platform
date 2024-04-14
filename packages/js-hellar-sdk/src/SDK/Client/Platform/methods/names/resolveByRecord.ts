import { Identifier } from '@hellarpro/wasm-hpp';
import { Platform } from '../../Platform';

/**
 * @param record - the exact name of the record to resolve
 * @param value - the exact value for this record to resolve
 * @returns {ExtendedDocument[]} - Resolved domains
 */
export async function resolveByRecord(this: Platform, record: string, value: any): Promise<any> {
  await this.initialize();

  if (record === 'hellarUniqueIdentityId' || record === 'hellarAliasIdentityId') {
    value = Identifier.from(value);
  }

  return await this.documents.get('hpns.domain', {
    where: [
      [`records.${record}`, '==', value],
    ],
  });
}

export default resolveByRecord;
