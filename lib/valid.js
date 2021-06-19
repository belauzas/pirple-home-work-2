const valid = {}

valid.all = data => {
    const rules = Object.keys(data);
    const size = rules.length;
    for (let i = 0; i < size; i++) {
        const rule = rules[i];
        if (!valid[rule](data[rule])) {
            return false;
        }
    }
    return true;
}

valid.checkAllStatus = data => {
    const status = {};
    for (const rule in data) {
        try {
            status[rule] = valid[rule](data[rule]);
        } catch (error) {
            status[rule] = false;
        }
    }
    return status;
}

valid.firstName = str => {
    if (valid.nonEmptyString(str)) {
        return true;
    }
    return false;
}

valid.lastName = str => {
    if (valid.nonEmptyString(str)) {
        return true;
    }
    return false;
}

valid.email = str => {
    if (valid.nonEmptyString(str)) {
        return true;
    }
    return false;
}

valid.password = str => {
    if (valid.nonEmptyString(str)) {
        return true;
    }
    return false;
}

valid.tosAgreement = agree => {
    if (typeof agree !== 'boolean') {
        return false;
    }
    return agree;
}

valid.nonEmptyString = str => {
    if (typeof str === 'string' && str.trim() !== '') {
        return true;
    }
    return false;
}

valid.positiveInteger = n => {
    if (typeof n !== 'number' || n < 0 || n % 1 !== 0) {
        return false;
    }
    return true;
}

valid.tokenID = str => {
    if (!valid.nonEmptyString(str)) {
        return false;
    }
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (const c of str) {
        if (!possibleCharacters.includes(c)) {
            return false;
        }
    }
    return true;
}

valid.httpProtocol = str => {
    const allowed = ['http', 'https'];
    if (!valid.nonEmptyString ||
        !allowed.includes(str)) {
        return false;
    }
    return true;
}

valid.url = str => {
    if (valid.nonEmptyString(str)) {
        return true;
    }
    return false;
}

valid.httpMethod = str => {
    const allowed = ['get', 'post', 'put', 'delete'];
    if (!valid.nonEmptyString ||
        !allowed.includes(str)) {
        return false;
    }
    return true;
}

valid.httpResponseCodes = codes => {
    if (!Array.isArray(codes) || codes.length === 0) {
        return false;
    }
    for (const code of codes) {
        if (!valid.positiveInteger(code) ||
            code < 100 ||
            code > 599) {
            return false;
        }
    }
    return true;
}

valid.checkState = state => {
    const availableStates = ['down', 'up'];
    if (valid.nonEmptyString(state) && availableStates.includes(state)) {
        return state;
    }
    return availableStates[0];
}

module.exports = valid;