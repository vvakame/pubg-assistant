export interface OriginalRequestSlack {
    source: "slack";
}

export interface QueryResponse<P = {}, Req = any> {
    originalRequest?: Req;
    id: string;
    timestamp: string; // ISO-8601 format
    lang: string;
    result: {
        source: string;
        resolvedQuery: string;
        speech: string; // ドキュメント上存在しないが来るんだから仕方がない
        action: string;
        actionIncomplete: boolean;
        parameters: P;
        contexts: {
            name: string;
            parameters: {};
            lifespan: number;
        }[];
        fulfillment: {
            speech: string;
            messages: Message[];
        };
        score: number; // between 0 and 1
        metadata: {
            intentId: string;
            webhookUsed: string;
            webhookForSlotFillingUsed: string;
            webhookResponseTime?: number; // ドキュメント上Optionalじゃないけど来ないんだから仕方がない
            intentName: string;
        };
    }
    status: Status;
    sessionId: string;
}

export interface Status {
    code: number;
    errorType: string;
    errorId?: string;
    errorDetails?: string;
}

export type Message = TextMessage | CardMessage | QuickRepliesMessage | ImageMessage | CustomPayloadMessage | UnknownMessage;

export interface TextMessage {
    type: 0;
    speech: string;
}

export interface CardMessage {
    type: 1;
    title: string;
    subtitle: string;
    buttons: {
        text: string;
        postback: string;
    }[];
}

export interface QuickRepliesMessage {
    type: 2;
    title: string;
    replies: string[];
}

export interface ImageMessage {
    type: 3;
    imageUrl: string;
}

export interface CustomPayloadMessage {
    type: 4;
    payload: any;
}

// ドキュメントにはないが実際にこういうデータが来るんだから仕方ない
export interface UnknownMessage {
    type: "simple_response";
    platform: string;
    textToSpeech: string;
}

export interface WebhookResponse {
    speech: string;
    displayText: string;
    data: any;
    contextOut: any[];
    source: string;
    followupEvent: any;
}
