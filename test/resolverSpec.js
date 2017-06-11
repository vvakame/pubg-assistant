"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var resolver_1 = require("../lib/resolver");
describe("Resolver class", function () {
    describe("objectGuide method", function () {
        it("respond information by japanese", function () {
            var resolver = new resolver_1.Resolver({ lang: "ja" });
            var result = resolver.objectGuide({ area: "georgopol", object: "vehicle" });
            assert(result.indexOf("ガレージ") !== -1);
        });
        it("response default error on unknown area", function () {
            var resolver = new resolver_1.Resolver({ lang: "ja" });
            var result = resolver.objectGuide({ area: "unknown", object: "vehicle" });
            assert(result === "データベースに存在しませんね… https://github.com/vvakame/pubg-assistant");
        });
    });
});
