const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { StringDecoder } = require('string_decoder');

const config = require('../config.js');
const handlers = require('./handlers');
const helpers = require('./helpers');

// jei serveri paleisime: NODE_DEBUG=server node .
// tai rodys tik sio failo console.log zinutes
const debug = util.debuglog('server');

const server = {};

server.httpServer = http.createServer((req, res) => server.unifiedServer(req, res));


server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
}
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => server.unifiedServer(req, res));


server.unifiedServer = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const httpMethod = req.method.toLowerCase();

    const queryStringObject = parsedUrl.query;
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    req.on('end', () => {
        buffer += decoder.end();

        const requestHandler = server.router[trimmedPath] ? server.router[trimmedPath] : handlers.notFound;
        const data = {
            trimmedPath,
            queryStringObject,
            httpMethod,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        }

        requestHandler(data, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            if (statusCode === 200) {
                debug('\x1b[32m%s\x1b[0m', httpMethod.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', httpMethod.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            }
        })
    })
}

server.router = {
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks,
    cart: handlers.cart,
    menu: handlers.menu,
}

server.init = () => {
    server.httpServer.listen(config.httpPort, () => {
        console.log('\x1b[36m%s\x1b[0m', `Serveris sukasi http://localhost:${config.httpPort} "${config.envName}" rezyme`);
    })
    server.httpsServer.listen(config.httpsPort, () => {
        console.log('\x1b[35m%s\x1b[0m', `Serveris sukasi https://localhost:${config.httpsPort} "${config.envName}" rezyme`);
    })
}

module.exports = server;