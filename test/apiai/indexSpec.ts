import * as assert from "assert";

import { Client } from "../../lib/apiai/";

describe("Client class", () => {
    it("can read developer access token from environment variable", () => {
        const cli = new Client();
        assert(!!cli.accessToken);
    });

    describe("getEntities method", () => {
        it("can fetch entities from api.ai", async () => {
            const cli = new Client();

            const entities = await cli.getEntities();
            assert(entities.length !== 0);
        });
    });

    describe("getEntity method", () => {
        it("can fetch entity data from api.ai", async () => {
            const cli = new Client();

            const entities = await cli.getEntities();
            assert(entities.length !== 0);

            const details = await Promise.all(entities.map(async entityDescription => {
                return await cli.getEntity(entityDescription.id);
            }));

            details.forEach(entity => {
                assert(!!entity.name);
                entity.entries.forEach(entry => {
                    assert(!!entry.value);
                    assert(entry.synonyms.length !== 0);
                });
            });
        });
    });

    describe("putEntity method", () => {
        it("can put entity data to api.ai", async () => {
            const cli = new Client();

            const result = await cli.putEntity({
                id: undefined as any,
                name: "unittest",
                entries: [
                    {
                        value: "unit-test",
                        synonyms: ["unittest", "テスト"],
                    }
                ],
                isEnum: false,
                automatedExpansion: false,
            });

            assert(result.status.errorType === "success");
        });
    });
});
