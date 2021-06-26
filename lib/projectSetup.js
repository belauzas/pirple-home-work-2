/**
 * Functions for project setup
 * Creating initial folders, etc
 */

const fs = require('fs');
const path = require('path');

const setup = {}

setup.basDir = path.join(__dirname, '../');

setup.init = (data, callback) => {
    let errorInProcess = false;

    for (const folder of data) {
        try {
            fs.statSync(setup.basDir + folder);
        } catch (error) {
            fs.mkdir(setup.basDir + folder, (err) => {
                if (err) {
                    errorInProcess = true;
                }
            })
        }
    }

    if (errorInProcess) {
        return callback(true, 'Could not create all the required folders');
    }

    return callback(false);
}

setup.cleanUp = () => {
    setup.cleanUpExpiredTokens();
}

// TODO cleanUpExpiredTokens
setup.cleanUpExpiredTokens = () => {

}

module.exports = setup;