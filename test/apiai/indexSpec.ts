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
                console.log(JSON.stringify(entity, null, 2));
                assert(!!entity.name);
                entity.entries.forEach(entry => {
                    assert(!!entry.value);
                    assert(entry.synonyms.length !== 0);
                });
            });
        });
    });
});
