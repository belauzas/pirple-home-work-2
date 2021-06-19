/*
 * Helper functions 
 */

const crypto = require('crypto');
const config = require('../config');
const valid = require('./valid');

const helpers = {}

helpers.hash = str => {
    if (typeof str === 'string' && str !== '') {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
}

helpers.parseJsonToObject = str => {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
}

helpers.createRandomString = length => {
    if (!valid.positiveInteger(length)) {
        return false;
    }
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const possibleCharactersCount = possibleCharacters.length;
    let str = '';
    for (let i = 0; i < length; i++) {
        str += possibleCharacters[Math.floor(Math.random() * possibleCharactersCount)];
    }
    return str;
}

module.exports = helpers;