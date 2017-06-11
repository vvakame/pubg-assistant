import * as http from "http";
import * as express from "express";

export function apiai(req: express.Request, res: express.Response) {
    if (req.body.message === undefined) {
        res.status(400).send("No message defined!");
    } else {
        console.log(req.body.message);
        res.status(200).send(`Success: ${req.body.message}`);
    }
}
