import * as fs from "fs";
import * as path from "path";

import * as yaml from "js-yaml";

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

    constructor(opts: ResolverOptions = {}) {
        this.basePath = opts.basePath || path.resolve(__dirname, "../resources");
        this.lang = opts.lang || "en";
        this.map = opts.map || "erangel";

        this.loadObjectGuide(this.lang);
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
        if (!areaKey) {
            return base.defaultError || "message unknown's battle ground";
        }

        return mapData[areaKey]![req.object];
    }
}
