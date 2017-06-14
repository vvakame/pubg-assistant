import * as fs from "fs";
import * as path from "path";

import * as yaml from "js-yaml";

import { Client, Entity } from "./apiai/";

export interface ObjectGuideData {
    defaultError: string;
    erangel: {
        [area: string]: ObjectGuide;
    };
}

export interface ObjectGuide {
    vehicle: string;
    weapon: string;
}

export interface ObjectGuideReq {
    area: string;
    object: "vehicle" | "weapon";
}

export interface TipsData {
    defaultError: string;
    tips: Tips[];
}

export interface Tips {
    entry: string;
    tags?: string[];
}

export interface TipsRequest {
    tag?: string;
}

export interface ResolverOptions {
    basePath?: string;
    lang?: string;
    map?: "erangel";
}

export class Resolver {
    basePath: string;
    lang: string;
    map: "erangel";

    objectGuideCache: {
        [lang: string]: ObjectGuideData;
    } = {};

    tipsCache: {
        [lang: string]: TipsData;
    } = {};

    constructor(opts: ResolverOptions = {}) {
        this.basePath = opts.basePath || path.resolve(__dirname, "../resources");
        this.lang = opts.lang || "en";
        this.map = opts.map || "erangel";

        this.loadObjectGuide(this.lang);
        this.loadTips(this.lang);
    }

    loadObjectGuide(lang = this.lang) {
        if (this.objectGuideCache[lang]) {
            return this.objectGuideCache[lang];
        }
        if (lang !== "en") {
            this.loadObjectGuide("en");
        }
        const dataFilePath = path.resolve(this.basePath, `object-guide.${lang}.yml`);
        const content = fs.readFileSync(dataFilePath, { encoding: "utf8" });
        const data = yaml.load(content);
        // TODO use deepAssign like function
        this.objectGuideCache[lang] = Object.assign({}, this.objectGuideCache["en"], data);

        return this.objectGuideCache[lang];
    }

    objectGuide(req: ObjectGuideReq): string {
        const base = this.loadObjectGuide();
        const mapData = base[this.map];
        const areaKey = Object.keys(mapData || {}).filter(areaKey => areaKey == req.area)[0];
        if (!areaKey || !mapData[areaKey] || !mapData[areaKey][req.object]) {
            return base.defaultError || "message unknown's battle ground https://github.com/vvakame/pubg-assistant";
        }

        return mapData[areaKey][req.object];
    }

    loadTips(lang = this.lang) {
        if (this.tipsCache[lang]) {
            return this.tipsCache[lang];
        }
        if (lang !== "en") {
            this.loadTips("en");
        }
        const dataFilePath = path.resolve(this.basePath, `tips.${lang}.yml`);
        const content = fs.readFileSync(dataFilePath, { encoding: "utf8" });
        const data = yaml.load(content);
        // TODO use deepAssign like function
        this.tipsCache[lang] = Object.assign({}, this.tipsCache["en"], data);

        return this.tipsCache[lang];
    }

    tips(req: TipsRequest = {}): string {
        // TODO オリジナル入力文を形態素解析して近いやつ選んだほうがいいと思う

        const base = this.loadTips();
        let tips = base.tips || [];
        if (req.tag) {
            tips = tips.filter(tip => (tip.tags || []).some(tag => tag === req.tag));

            if (tips.length === 0) {
                tips = (base.tips || []).filter(tip => tip.entry.indexOf(req.tag!) !== -1);
            }
        }
        if (tips.length === 0) {
            return base.defaultError;
        }

        let index = Math.floor(Math.random() * tips.length);
        const tip = tips[index] || tips[0];
        return tip.entry;
    }

    loadApiAIEntities() {
        const dataFilePath = path.resolve(this.basePath, "entities.yml");
        const content = fs.readFileSync(dataFilePath, { encoding: "utf8" });
        const data = yaml.load(content);
        return data;
    }

    async updateApiAIEntities() {
        const cli = new Client();
        const entities = this.loadApiAIEntities();
        const results = await Promise.all(Object.keys(entities).map(async entityName => {
            const entity: Entity = entities[entityName];
            entity.name = entityName;
            return await cli.putEntity(entity);
        }));

        return results;
    }
}
