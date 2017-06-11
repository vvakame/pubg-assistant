import * as http from "http";
import * as express from "express";

import { QueryResponse, WebhookResponse } from "./apiai";

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

interface ObjectGuide {
    area: string;
    object: "vehicle" | "weapon";
}

function handleObjectGuide(req: QueryResponse<ObjectGuide>): WebhookResponse {
    return {
        speech: `speech: ${req.result.parameters.area}の${req.result.parameters.object}を探せばいいの？`,
        displayText: `displayText: ${req.result.parameters.area}の${req.result.parameters.object}を探せばいいの？`,
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
