"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const gamedig_1 = require("gamedig");
const maxAttempts = parseInt(process.env.MAX_ATTEMPTS, 10) || 1;
const socketTimeout = parseInt(process.env.SOCKET_TIMEOUT, 10) || 2000;
const attemptTimeout = parseInt(process.env.ATTEMPT_TIMEOUT, 10) || 10000;
const givenPortOnly = Boolean(process.env.GIVEN_PORT_ONLY) || false;
const listenUdpPort = parseInt(process.env.LISTEN_UDP_PORT, 10) || undefined;
const CACHE_MAX_AGE = parseInt(process.env.CACHE_MAX_AGE, 10) || 0;
const DBG = Boolean(process.env.DBG) || false;
(0, http_1.createServer)((req, res) => {
    const q = (0, url_1.parse)(req.url, true).query;
    if (DBG)
        console.log('%o', q);
    if (q.type && q.host) {
        (0, gamedig_1.query)({
            type: String(q.type),
            host: String(q.host),
            port: parseInt(String(q.port), 10),
            requestRules: Boolean(q.requestRules),
            maxAttempts,
            socketTimeout,
            attemptTimeout,
            givenPortOnly,
            // @ts-ignore
            listenUdpPort
        }).then(data => {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=' + String(CACHE_MAX_AGE)
            });
            res.end(JSON.stringify(data, null, DBG ? 2 : null));
        }).catch(err => {
            res.writeHead(404, {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=' + String(CACHE_MAX_AGE)
            });
            if (DBG)
                console.error('Error: %s', err.message);
            res.end(JSON.stringify({ error: err.message }, null, DBG ? 2 : null));
        });
    }
    else {
        res.writeHead(301, { 'Location': 'https://github.com/a-sync/gamedig.cloudno.de' });
        res.end();
    }
}).listen(80, '0.0.0.0');
