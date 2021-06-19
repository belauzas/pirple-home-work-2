const server = require('./lib/server');
const projectSetup = require('./lib/projectSetup');

const app = {};

app.init = () => {
    server.init();
}

const requiredFolders = [
    '.data',
    '.data/users',
    '.data/tokens',
];
projectSetup.init(requiredFolders, (err) => {
    if (err) {
        console.log('Could not complete project setup');
        return false;
    }

    app.init();
});

module.exports = app;