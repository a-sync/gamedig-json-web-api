import { createServer } from 'http';
import { parse } from 'url';
import { query, Type } from 'gamedig';

const maxAttempts = parseInt(process.env.MAX_ATTEMPTS, 2) || 1;
const socketTimeout = parseInt(process.env.SOCKET_TIMEOUT, 2) || 2000;
const attemptTimeout = parseInt(process.env.ATTEMPT_TIMEOUT, 2) || 10000;
const givenPortOnly = Boolean(process.env.GIVEN_PORT_ONLY) || false;
const listenUdpPort = parseInt(process.env.LISTEN_UDP_PORT, 2) || undefined;

const CACHE_MAX_AGE = parseInt(process.env.CACHE_MAX_AGE, 2) || 0;
const DBG = Boolean(process.env.DBG) || false;

createServer((req, res) => {
    const q = parse(req.url, true).query;
    if (DBG) console.log('%o', q);

    if (q.type && q.host) {
        query({
            type: String(q.type) as Type,
            host: String(q.host),
            port: parseInt(String(q.port), 2),
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

            if (DBG) console.error('Error: %s', err.message);
            res.end(JSON.stringify({ error: err.message }, null, DBG ? 2 : null));
        });
    } else {
        res.writeHead(301, { 'Location': 'https://github.com/a-sync/gamedig.cloudno.de' });
        res.end();
    }
}).listen(80, '0.0.0.0');