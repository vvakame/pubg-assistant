import * as assert from "assert";

import { KnowledgeBase } from "../lib/knowledgeBase";

describe("KnowledgeBase class", () => {
    describe("objectGuide method", () => {
        it("respond information by japanese", () => {
            const knowledgeBase = new KnowledgeBase({ lang: "ja" });
            const result = knowledgeBase.objectGuide({ area: "georgopol", object: "vehicle" });
            assert(result.indexOf("ガレージ") !== -1);
        });

        it("response default error on unknown area", () => {
            const knowledgeBase = new KnowledgeBase({ lang: "ja" });
            const result = knowledgeBase.objectGuide({ area: "unknown", object: "vehicle" });
            assert(result === "データベースに存在しませんね… https://github.com/vvakame/pubg-assistant");
        });
    });

    describe("tips method", () => {
        it("respond information by japanese", () => {
            const knowledgeBase = new KnowledgeBase({ lang: "ja" });

            {
                const result = knowledgeBase.tips();
                assert(result !== "良さそうなTipsがありませんでした… https://github.com/vvakame/pubg-assistant");
            }
            {
                const result = knowledgeBase.tips({ tag: "零点距離" });
                assert(result.indexOf("零点距離") !== -1);
            }
            {
                // tagsで該当がなかった場合entryから全文検索
                const result = knowledgeBase.tips({ tag: "。" });
                assert(result.indexOf("。") !== -1);
            }
        });

        it("response default error on unknown area", () => {
            const knowledgeBase = new KnowledgeBase({ lang: "ja" });
            const result = knowledgeBase.tips({ tag: "存在しないタグ" });
            assert(result === "良さそうなTipsがありませんでした… https://github.com/vvakame/pubg-assistant");
        });
    });
});
