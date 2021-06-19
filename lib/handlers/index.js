const user_handlers = require('./handlers_users');
const tokens_handlers = require('./handlers_tokens');

// URLs
let handlers = {};

handlers.ping = (data, callback) => {
    return callback(200);
}

handlers.notFound = (data, callback) => {
    return callback(404);
}

handlers = {
    ...handlers,
    ...user_handlers,
    ...tokens_handlers,
}

module.exports = handlers;