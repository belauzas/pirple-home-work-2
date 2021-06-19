const helpers = require('../helpers');
const valid = require('../valid');
const _data = require('../data');

// URLs
const handlers = {};
const tokenExpirationPeriod = 3600000;

handlers.tokens = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._tokens[data.httpMethod](data, callback);
    }
    return callback(405, { error: 'Not an acceptable request method' });
}

handlers._tokens = {}

handlers._tokens.get = (data, callback) => {
    const tokenID = data.queryStringObject.id;

    if (!valid.all({ tokenID })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('tokens', tokenID, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(404, { error: 'Could not find token' });
        }

        return callback(200, tokenData);
    })
}

handlers._tokens.post = (data, callback) => {
    const { email, password } = data.payload;

    if (!valid.all({ email, password })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('users', email, (err, userData) => {
        if (err || !userData) {
            return callback(404, { error: 'Could not find specified user' })
        }

        const hashedPassword = helpers.hash(password);
        if (!hashedPassword) {
            return callback(500, { error: 'Could not hash the user\'s password' })
        }
        if (hashedPassword !== userData.hashedPassword) {
            return callback(400, { error: 'Password did not match user\'s stored password' })
        }

        const tokenObject = {
            email,
            id: helpers.createRandomString(20),
            expires: Date.now() + tokenExpirationPeriod,
        }

        _data.create('tokens', tokenObject.id, tokenObject, (err, data) => {
            if (err) {
                return callback(500, { error: 'Could not create the new token' })
            }
            return callback(200, tokenObject);
        })
    })
}

handlers._tokens.put = (data, callback) => {
    const { id: tokenID, extend } = data.payload;

    if (!valid.all({ tokenID }) ||
        typeof extend !== 'boolean' ||
        !extend) {
        return callback(400, { error: 'Missing required fields or fields are invalid' });
    }

    _data.read('tokens', tokenID, (err, tokenData) => {
        if (err || !tokenData) {
            return callback(400, { error: 'The specified token does not exist' })
        }

        if (tokenData.expires < Date.now()) {
            return callback(400, { error: 'The token has already expired, and can not be extended' })
        }

        tokenData.expires = Date.now() + tokenExpirationPeriod;

        _data.update('tokens', tokenID, tokenData, err => {
            if (err) {
                return callback(500, { error: 'Cound not update token\'s expiration' });
            }
            return callback(200, tokenData);
        })
    })
}

handlers._tokens.delete = (data, callback) => {
    const tokenID = data.queryStringObject.id;

    console.log(tokenID);

    if (!valid.all({ tokenID })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('tokens', tokenID, (err, data) => {
        if (err || !data) {
            return callback(404, { error: 'Cound not find the specified token' });
        }

        _data.delete('tokens', tokenID, err => {
            if (err) {
                return callback(500, { error: 'Cound not delete the specified token' });
            }
            return callback(200, { success: 'Token has been deleted' });
        })
    })
}

handlers._tokens.verifyToken = (tokenID, email, callback) => {
    _data.read('tokens', tokenID, (err, tokenData) => {
        if (err ||
            !tokenData ||
            tokenData.email !== email ||
            tokenData.expires < Date.now()) {
            return callback(false);
        }
        return callback(true);
    })
}

module.exports = handlers;