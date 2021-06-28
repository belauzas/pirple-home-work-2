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
        token_handlers._tokens.verifyToken(tokenID, cartData.email, (tokenIsValid) => {
            if (!tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }
            return callback(200, cartData);
        })
    })
}

handlers._cart.post = (data, callback) => {
    const { email } = data.payload;
    let { items: cartItems } = data.payload;

    if (!valid.all({
        email,
        cartItems
    })) {
        return callback(404, { error: 'Missing required fields' });
    }

    cartItems = handlers._cart.limitVerification(cartItems);

    const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
    _data.read('tokens', tokenID, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(403, { error: 'Could not find token' });
        }

        _data.read('users', tokenData.email, (err, userData) => {
            if (err || !userData) {
                return callback(403, { error: 'Could not find user' })
            }

            const userCart = Array.isArray(userData.cart) ? userData.cart : [];
            if (userCart.length >= config.maxcart) {
                return callback(400, { error: `The user already has the maximum number of cart (${config.maxcart})` });
            }

            const cartObject = {
                id: helpers.createRandomString(20),
                email: userData.email,
                items: cartItems,
            }

            _data.create('cart', cartObject.id, cartObject, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not create the new cart' });
                }

                userCart.push(cartObject.id);
                userData.cart = userCart;

                _data.update('users', userData.email, userData, (err) => {
                    if (err) {
                        return callback(500, { error: 'Could not update user with the new cart' });
                    }

                    return callback(200, cartObject);
                })
            })
        })
    })
}

handlers._cart.put = (data, callback) => {
    const { id: cartID, items: cartItems } = data.payload;

    if (!valid.all({
        tokenID: cartID,
        cartItems
    })) {
        return callback(404, { error: 'Missing required fields' });
    }

    cartItems = handlers._cart.limitVerification(cartItems);

    _data.read('cart', cartID, (err, cartData) => {
        if (err || !cartData) {
            return callback(404, { error: 'Cart not found' });
        }

        const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
        token_handlers._tokens.verifyToken(tokenID, cartData.email, (tokenIsValid) => {
            if (!tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }

            if (cartItems) {
                cartData.items = cartItems;
            }

            _data.update('cart', cartID, cartData, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not update cart' });
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
        token_handlers._tokens.verifyToken(tokenID, cartData.email, (tokenIsValid, err) => {
            if (!tokenIsValid) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }

            _data.delete('cart', cartID, (err) => {
                if (err) {
                    return callback(500, { error: 'Could not delete cart' });
                }
            })

            _data.read('users', cartData.email, (err, userData) => {
                if (err || !userData) {
                    return callback(500, { error: 'Could not find user who created the cart' })
                }

                const userCart = Array.isArray(userData.cart) ? userData.cart : [];
                if (!userCart.includes(cartID)) {
                    return callback(500, { error: 'Could not find the cart on the user\'s object, so could not remove it' })
                }

                userData.cart = userCart.filter(id => id !== cartID);
                _data.update('users', cartData.email, userData, (err) => {
                    if (err) {
                        return callback(500, { error: 'Could not update user\'s data' });
                    }
                    return callback(200, { success: 'Cart has been deleted' });
                })
            })
        })
    })
}

handlers._cart.limitVerification = (cartItems) => {
    const max = config.cart.maxAmountPerItem;
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].amount > max) {
            cartItems[i].amount = max;
        }
    }
    return cartItems;
}

module.exports = handlers;