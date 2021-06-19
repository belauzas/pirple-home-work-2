const helpers = require('../helpers');
const valid = require('../valid');
const _data = require('../data');
const token_handlers = require('./handlers_tokens');

// URLs
const handlers = {};

handlers.users = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._users[data.httpMethod](data, callback);
    }
    return callback(405, { error: 'Not an acceptable request method' });
}

handlers._users = {}

handlers._users.get = (data, callback) => {
    const email = data.queryStringObject.email;

    if (!valid.all({ email })) {
        return callback(404, { error: 'Missing required fields' });
    }

    const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
    token_handlers._tokens.verifyToken(tokenID, email, isValidToken => {
        if (!isValidToken) {
            return callback(403, { error: 'Missing required token in header, or token is invalid' });
        }

        _data.read('users', email, (err, data) => {
            if (err || !data) {
                return callback(404);
            }

            delete data.hashedPassword;
            return callback(200, data);
        })
    })
}

handlers._users.post = (data, callback) => {
    const { firstName, lastName, email, password, tosAgreement } = data.payload;

    if (!valid.all({ firstName, lastName, email, password, tosAgreement })) {
        return callback(404, { error: 'Missing required fields' });
    }

    _data.read('users', email, (err, data) => {
        if (!err) {
            return callback(404, { error: 'A user with that email already exists' })
        }

        const hashedPassword = helpers.hash(password);

        if (!hashedPassword) {
            return callback(500, { error: 'Could not hash the user\'s password' })
        }

        const userObject = {
            firstName,
            lastName,
            email,
            hashedPassword,
            tosAgreement
        }

        _data.create('users', email, userObject, (err, data) => {
            if (err) {
                return callback(500, { error: 'Could not create the new user' })
            }
            return callback(200, { success: 'User created' });
        })
    })
}

handlers._users.put = (data, callback) => {
    const { firstName, lastName, email, password } = data.payload;
    const status = valid.checkAllStatus({ firstName, lastName, email, password });

    if (status.email) {
        if (!status.firstName && !status.lastName && !status.password) {
            return callback(400, { error: 'Missing fields to update' });
        }

        const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
        token_handlers._tokens.verifyToken(tokenID, email, (isValidToken) => {
            if (!isValidToken) {
                return callback(403, { error: 'Missing required token in header, or token is invalid' });
            }

            _data.read('users', email, (err, userData) => {
                if (err || !userData) {
                    return callback(400, { error: 'The specified user does not exist' })
                }

                if (status.firstName) {
                    userData.firstName = firstName;
                }
                if (status.lastName) {
                    userData.lastName = lastName;
                }
                if (status.password) {
                    userData.hashedPassword = helpers.hash(password);
                }

                _data.update('users', email, userData, err => {
                    if (err) {
                        return callback(500, { error: 'Cound not update users data' });
                    }
                    return callback(200);
                })
            })
        })
    } else {
        return callback(400, { error: 'Missing required fields' });
    }
}

handlers._users.delete = (data, callback) => {
    const email = data.queryStringObject.email;

    if (!valid.all({ email })) {
        return callback(404, { error: 'Missing required fields' });
    }

    const tokenID = valid.tokenID(data.headers.token) ? data.headers.token : false;
    token_handlers._tokens.verifyToken(tokenID, email, (isValidToken) => {
        if (!isValidToken) {
            return callback(403, { error: 'Missing required token in header, or token is invalid' });
        }

        _data.read('users', email, (err, userData) => {
            if (err || !userData) {
                return callback(404, { error: 'Cound not find the specified user' });
            }

            _data.delete('users', email, err => {
                if (err) {
                    return callback(500, { error: 'Cound not delete the specified user' });
                }

                if (Array.isArray(userData.checks)) {
                    let deletionErrors = false;
                    for (const checkID of userData.checks) {
                        _data.delete('checks', checkID, err => {
                            if (err) {
                                deletionErrors = true;
                            }
                        })
                    }
                    if (deletionErrors) {
                        return callback(500, { success: 'Errors encoutered white attempting to delete all the user\'s checks. Some or all checks may not have been deleted from the system successfully' });
                    } else {
                        return callback(200, { success: 'User has been deleted' });
                    }
                }
                return callback(200, { success: 'User has been deleted' });
            })
        })
    })
}

module.exports = handlers;