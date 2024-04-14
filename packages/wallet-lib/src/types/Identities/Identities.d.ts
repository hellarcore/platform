import { Wallet } from "../Wallet/Wallet";
import { HDPrivateKey } from "@hellarpro/hellarcore-lib";

export declare class Identities {
    constructor(wallet: Wallet);

    getIdentityHDKeyById(identityId: string, keyIndex: number): HDPrivateKey;
    getIdentityHDKeyByIndex(identityIndex: number, keyIndex: number): HDPrivateKey;
    getIdentityIds(): string[];
}

export declare namespace Identities {
}
