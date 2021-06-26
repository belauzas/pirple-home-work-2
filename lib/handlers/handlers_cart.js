const helpers = require('../helpers');
const valid = require('../valid');
const _data = require('../data');
const token_handlers = require('./handlers_tokens');
const config = require('../../config');

// URLs
const handlers = {};

handlers.cart = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._cart[data.httpMethod](data, callback);
    }
    return callback(405, { error: 'Not an acceptable request method' });
}

handlers._cart = {}

handlers._cart.get = (data, callback) => {
    const cartID = data.queryStringObject.id;

    if (!valid.all({ tokenID: cartID })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('cart', cartID, (err, cartData) => {
        if (err || !cartData) {
            return callback(403, { error: 'Could not find cart' });
        }

        const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
        token_handlers._tokens.verifyToken(tokenID, cartData.userEmail, (tokenIsValid) => {
            if (!tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }
            return callback(200, cartData);
        })
    })
}

handlers._cart.post = (data, callback) => {
    const { protocol, url, method, successCodes, timeoutSeconds } = data.payload;

    if (!valid.all({
        httpProtocol: protocol,
        url,
        httpMethod: method,
        httpResponseCodes: successCodes,
        positiveInteger: timeoutSeconds
    }) || timeoutSeconds > 5) {
        return callback(404, { error: 'Missing required fields' });
    }

    const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
    _data.read('tokens', tokenID, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(403, { error: 'Could not find token' });
        }

        _data.read('users', tokenData.email, (err, userData) => {
            if (err || !userData) {
                return callback(403, { error: 'Could not find user' })
            }

            const usercart = Array.isArray(userData.cart) ? userData.cart : [];
            if (usercart.length >= config.maxcart) {
                return callback(400, { error: `The use already has the maximum number of cart (${config.maxcart})` });
            }

            const checkObject = {
                id: helpers.createRandomString(20),
                userEmail: userData.email,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds
            }

            _data.create('cart', checkObject.id, checkObject, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not create the new check' });
                }

                usercart.push(checkObject.id);
                userData.cart = usercart;

                _data.update('users', userData.email, userData, (err) => {
                    if (err) {
                        return callback(500, { error: 'Could not update user with the new check' });
                    }

                    return callback(200, checkObject);
                })
            })
        })
    })
}

handlers._cart.put = (data, callback) => {
    const { id: cartID, protocol, url, method, successCodes, timeoutSeconds } = data.payload;

    if (!valid.all({
        tokenID: cartID,
        httpProtocol: protocol,
        url,
        httpMethod: method,
        httpResponseCodes: successCodes,
        positiveInteger: timeoutSeconds
    }) || timeoutSeconds > 5) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('cart', cartID, (err, cartData) => {
        if (err || !cartData) {
            return callback(404, { error: 'Cart not found' });
        }

        const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
        token_handlers._tokens.verifyToken(tokenID, cartData.userEmail, (tokenIsValid) => {
            if (tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }

            if (protocol) {
                cartData.protocol = protocol;
            }
            if (url) {
                cartData.url = url;
            }
            if (method) {
                cartData.method = method;
            }
            if (successCodes) {
                cartData.successCodes = successCodes;
            }
            if (timeoutSeconds) {
                cartData.timeoutSeconds = timeoutSeconds;
            }

            _data.update('cart', cartID, cartData, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not update check' });
                }
                return callback(200, cartData);
            })
        })
    })
}

handlers._cart.delete = (data, callback) => {
    const cartID = data.queryStringObject.id;

    if (!valid.all({ tokenID: cartID })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('cart', cartID, (err, cartData) => {
        if (err || !cartData) {
            return callback(404, { error: 'Cart not found' });
        }

        const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
        token_handlers._tokens.verifyToken(tokenID, cartData.userEmail, (tokenIsValid) => {
            if (!tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }

            _data.delete('cart', cartID, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not delete check' });
                }
            })

            _data.read('users', cartData.userEmail, (err, userData) => {
                if (err || !userData) {
                    return callback(500, { error: 'Could not find user who created the check' })
                }

                const usercart = Array.isArray(userData.cart) ? userData.cart : [];
                if (!usercart.includes(cartID)) {
                    return callback(500, { error: 'Could not find the check on the user\'s object, so could not remove it' })
                }

                userData.cart = usercart.filter(id => id !== cartID);
                _data.update('users', cartData.userEmail, userData, (err) => {
                    if (err) {
                        return callback(500, { error: 'Could not update user\'s data' });
                    }
                    return callback(200);
                })
            })
        })
    })
}

module.exports = handlers;