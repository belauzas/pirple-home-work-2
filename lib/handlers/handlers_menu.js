const helpers = require('../helpers');
const valid = require('../valid');
const _data = require('../data');
const token_handlers = require('./handlers_tokens');
const config = require('../../config');

// URLs
const handlers = {};

handlers.menu = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._menu[data.httpMethod](data, callback);
    }
    return callback(405, { error: 'Not an acceptable request method' });
}

handlers._menu = {}

handlers._menu.get = (data, callback) => {
    const email = data.queryStringObject.email;

    if (!valid.all({ email })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('menu', 'main-menu', (err, menuData) => {
        if (err || !menuData) {
            return callback(403, { error: 'Could not find a menu' });
        }

        const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
        token_handlers._tokens.verifyToken(tokenID, email, (tokenIsValid) => {
            if (!tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }
            return callback(200, menuData);
        })
    })
}

module.exports = handlers;