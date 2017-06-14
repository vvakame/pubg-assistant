import * as url from "url";
import * as path from "path";

import fetch from "node-fetch";

import { baseUrl, apiVersion } from "./base";
import { Status, Entity, EntityDescription } from "./model";

export * from "./base";
export * from "./model";

export interface Options {
    baseUrl?: string;
    accessToken?: string;
}

export class Client {
    baseUrl: string;
    accessToken: string;

    constructor(opts: Options = {}) {
        this.baseUrl = opts.baseUrl || baseUrl;
        this.accessToken = opts.accessToken || process.env["APIAI_DEVELOPER_ACCESS_TOKEN"];
    }

    async getEntities(): Promise<EntityDescription[]> {
        const endpointUrl = url.parse(this.baseUrl, true);
        endpointUrl.pathname = path.join(endpointUrl.pathname || "/v1", "/entities");
        endpointUrl.query = {
            v: apiVersion,
            ...endpointUrl.query,
        };
        const resp = await fetch(url.format(endpointUrl), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        if (resp.status !== 200) {
            const text = await resp.text();
            throw new Error(`unexpected result: ${resp.status}, ${text}`);
        }

        return await resp.json();
    }

    async getEntity(eid: string): Promise<Entity> {
        const endpointUrl = url.parse(this.baseUrl, true);
        endpointUrl.pathname = path.join(endpointUrl.pathname || "/v1", `/entities/${encodeURIComponent(eid)}`);
        endpointUrl.query = {
            v: apiVersion,
            ...endpointUrl.query,
        };
        const resp = await fetch(url.format(endpointUrl), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        if (resp.status !== 200) {
            const text = await resp.text();
            throw new Error(`unexpected result: ${resp.status}, ${text}`);
        }

        return await resp.json();
    }

    async putEntity(entity: Entity): Promise<{ id: string; status: Status; }> {
        const endpointUrl = url.parse(this.baseUrl, true);
        endpointUrl.pathname = path.join(endpointUrl.pathname || "/v1", `/entities`);
        endpointUrl.query = {
            v: apiVersion,
            ...endpointUrl.query,
        };
        const resp = await fetch(url.format(endpointUrl), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${this.accessToken}`,
            },
            body: JSON.stringify(entity),
        });
        if (resp.status !== 200) {
            const text = await resp.text();
            throw new Error(`unexpected result: ${resp.status}, ${text}`);
        }

        return await resp.json();
    }
}
