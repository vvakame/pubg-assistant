import * as http from "http";
import * as express from "express";

import { QueryResponse, WebhookResponse } from "./apiai/apiai";
import { ObjectGuideReq, TipsRequest, Resolver } from "./resolver";

export function apiai(req: express.Request, res: express.Response) {
    const data: QueryResponse<any> = req.body;
    if (!data.result.metadata) {
        res.status(400).send("invalid format");
    }
    if (data.result.metadata.intentName === "object-guide") {
        let result = handleObjectGuide(data);
        result = modifyResult(data, result) || result;

        console.log(data.result.metadata.intentName, JSON.stringify(result, null, 2));

        res.status(200).json(result);
        return;
    } else if (data.result.metadata.intentName === "tips") {
        let result = handleTips(data);
        result = modifyResult(data, result) || result;

        console.log(data.result.metadata.intentName, JSON.stringify(result, null, 2));

        res.status(200).json(result);
        return;
    }

    console.error(`unknown intentName ${data.result.metadata.intentName}`, JSON.stringify(data, null, 2));
    res.status(400).json({
        status: {
            code: 400,
            errorType: "unknown intentName",
            errorDetails: "unknown intentName",
        },
    });
}

function handleObjectGuide(req: QueryResponse<ObjectGuideReq>): WebhookResponse {
    console.log(JSON.stringify(req.result.parameters, null, 2));

    const resolver = new Resolver({ lang: req.lang });
    const result = resolver.objectGuide(req.result.parameters);

    return {
        speech: `${result}`,
        displayText: `${result}`,
        data: req.result.parameters,
        contextOut: [],
        source: "PUBG Cloud Functions",
        followupEvent: null,
    };
}

function handleTips(req: QueryResponse<TipsRequest>): WebhookResponse {
    console.log(JSON.stringify(req.result.parameters, null, 2));

    const resolver = new Resolver({ lang: req.lang });
    const result = resolver.tips(req.result.parameters);

    return {
        speech: `${result}`,
        displayText: `${result}`,
        data: req.result.parameters,
        contextOut: [],
        source: "PUBG Cloud Functions",
        followupEvent: null,
    };
}

function modifyResult(req: QueryResponse, result: WebhookResponse): WebhookResponse | null {
    if (!req.originalRequest) {
        return null;
    }

    if (req.originalRequest.source === "slack") {
        let data = {
            slack: {
                text: result.displayText,
            },
            ...result.data,
        };
        result.data = data;
        return result;
    }

    return null;
}
