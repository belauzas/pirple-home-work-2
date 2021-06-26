const user_handlers = require('./handlers_users');
const tokens_handlers = require('./handlers_tokens');
const cart_handlers = require('./handlers_cart');
const menu_handlers = require('./handlers_menu');

// URLs
let handlers = {};

handlers.ping = (data, callback) => {
    return callback(200);
}

handlers.notFound = (data, callback) => {
    return callback(404, { error: 'Not found' });
}

handlers = {
    ...handlers,
    ...user_handlers,
    ...tokens_handlers,
    ...cart_handlers,
    ...menu_handlers,
}

module.exports = handlers;