import * as assert from "assert";

import { Resolver } from "../lib/resolver";

describe("Resolver class", () => {
    describe("objectGuide method", () => {
        it("respond information by japanese", () => {
            const resolver = new Resolver({ lang: "ja" });
            const result = resolver.objectGuide({ area: "georgopol", object: "vehicle" });
            assert(result.indexOf("ガレージ") !== -1);
        });

        it("response default error on unknown area", () => {
            const resolver = new Resolver({ lang: "ja" });
            const result = resolver.objectGuide({ area: "unknown", object: "vehicle" });
            assert(result === "データベースに存在しませんね… https://github.com/vvakame/pubg-assistant");
        });
    });
});