import HAPIClient from "@hellarpro/hapi-client"

export declare namespace SDK {
    interface platformOpts {
        client: HAPIClient;
        apps: object;
        state: object;
    }
}
