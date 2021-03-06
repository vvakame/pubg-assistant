import * as fs from "fs";
import * as path from "path";

import * as yaml from "js-yaml";

import { Client, Entity } from "./apiai/";

const knowledgeBaseMap: { [lang: string]: KnowledgeBase; } = {};
export function getKnowledgeBase(lang: string): KnowledgeBase {
    let knowledgeBase = knowledgeBaseMap[lang];
    if (knowledgeBase) {
        return knowledgeBase;
    }
    knowledgeBase = new KnowledgeBase({ lang: lang });
    knowledgeBaseMap[lang] = knowledgeBase;

    return knowledgeBase;
}

export interface ObjectGuideReq {
    area: string;
    object: "vehicle" | "weapon";
}

export interface ObjectGuideContainer {
    defaultError: string;
    erangel: {
        [area: string]: ObjectGuide;
    };
}

export interface ObjectGuide {
    vehicle: string;
    weapon: string;
}

export interface TipsRequest {
    tag?: string;
    originalQuery?: string;
}

export interface TipsContainer {
    defaultError: string;
    tips: Tips[];
}

export interface Tips {
    entry: string;
    tags?: string[];
}

export interface KnowledgeBaseOptions {
    basePath?: string;
    lang?: string;
    map?: "erangel";
}

export class KnowledgeBase {
    basePath: string;
    lang: string;
    map: "erangel";

    objectGuideCache: {
        [lang: string]: ObjectGuideContainer;
    } = {};

    tipsCache: {
        [lang: string]: TipsContainer;
    } = {};

    constructor(opts: KnowledgeBaseOptions = {}) {
        this.basePath = opts.basePath || path.resolve(__dirname, "../resources");
        this.lang = opts.lang || "en";
        this.map = opts.map || "erangel";

        this._loadObjectGuide(this.lang);
        this._loadTips(this.lang);
    }

    private _loadObjectGuide(lang = this.lang) {
        if (this.objectGuideCache[lang]) {
            return this.objectGuideCache[lang];
        }
        if (lang !== "en") {
            this._loadObjectGuide("en");
        }
        const dataFilePath = path.resolve(this.basePath, `knowledge/object-guide.${lang}.yml`);
        const content = fs.readFileSync(dataFilePath, { encoding: "utf8" });
        const data = yaml.load(content);
        // TODO use deepAssign like function
        this.objectGuideCache[lang] = Object.assign({}, this.objectGuideCache["en"], data);

        return this.objectGuideCache[lang];
    }

    objectGuide(req: ObjectGuideReq): string {
        const base = this._loadObjectGuide();
        const mapData = base[this.map];
        const areaKey = Object.keys(mapData || {}).filter(areaKey => areaKey == req.area)[0];
        if (!areaKey || !mapData[areaKey] || !mapData[areaKey][req.object]) {
            return base.defaultError || "message unknown's battle ground https://github.com/vvakame/pubg-assistant";
        }

        return mapData[areaKey][req.object];
    }

    private _loadTips(lang = this.lang) {
        if (this.tipsCache[lang]) {
            return this.tipsCache[lang];
        }
        if (lang !== "en") {
            this._loadTips("en");
        }
        const dataFilePath = path.resolve(this.basePath, `knowledge/tips.${lang}.yml`);
        const content = fs.readFileSync(dataFilePath, { encoding: "utf8" });
        const data = yaml.load(content);
        // TODO use deepAssign like function
        this.tipsCache[lang] = Object.assign({}, this.tipsCache["en"], data);

        return this.tipsCache[lang];
    }

    tips(req: TipsRequest = {}): string {
        // TODO オリジナル入力文を形態素解析して近いやつ選んだほうがいいと思う

        const base = this._loadTips();
        if (req.tag) {
            let tips = base.tips || [];
            tips = tips.filter(tip => (tip.tags || []).some(tag => tag === req.tag));

            if (tips.length === 0) {
                tips = (base.tips || []).filter(tip => tip.entry.indexOf(req.tag!) !== -1);
            }

            const tip = this._randomPickup(tips);
            if (tip) {
                return tip.entry;
            }
        }

        if (req.originalQuery) {
            let tips = base.tips || [];
            tips = tips.filter(tip => (tip.tags || []).some(tag => req.originalQuery!.indexOf(tag) !== -1));
            const tip = this._randomPickup(tips);
            if (tip) {
                return tip.entry;
            }
        }

        return base.defaultError;
    }

    private _randomPickup<T>(array: T[]): T | undefined {
        let index = Math.floor(Math.random() * array.length);
        return array[index] || array[0];
    }

    private _loadApiAIEntities(): Entity[] {
        const dataDirPath = path.resolve(this.basePath, "api-ai");
        const files = fs.readdirSync(dataDirPath);
        return files.map(file => {
            const content = fs.readFileSync(path.resolve(dataDirPath, file), { encoding: "utf8" });
            return yaml.load(content);
        });
    }

    async updateApiAIEntities() {
        const cli = new Client();
        const entities = this._loadApiAIEntities();
        return await Promise.all(entities.map(entity => cli.putEntity(entity)));
    }
}
