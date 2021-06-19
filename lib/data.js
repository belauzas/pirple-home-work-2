const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const fullPath = (dir, file) => {
    return `${lib.basDir}${dir}/${file}.json`;
}

const lib = {}

lib.basDir = path.join(__dirname, '../.data/');

lib.create = (dir, file, data, callback) => {
    fs.open(fullPath(dir, file), 'wx', (err, fileDescriptor) => {
        if (err || !fileDescriptor) {
            return callback('Could not create new file, it may already exist');
        }

        const stringData = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, err => {
            if (err) {
                return callback('Error writing to a new file');
            }

            fs.close(fileDescriptor, err => {
                return err ? callback('Error closing new file') : callback(false);
            })
        })
    })
}

lib.read = (dir, file, callback) => {
    fs.readFile(fullPath(dir, file), 'utf-8', (err, data) => {
        if (err || !data) {
            return callback(err, data);
        }

        return callback(false, helpers.parseJsonToObject(data));
    });
}

lib.update = (dir, file, data, callback) => {
    fs.open(fullPath(dir, file), 'r+', (err, fileDescriptor) => {
        if (err || !fileDescriptor) {
            return callback('Could not open the file for updating, it may not exist yet');
        }

        const stringData = JSON.stringify(data);

        fs.ftruncate(fileDescriptor, err => {
            if (err) {
                return callback('Error truncating file');
            }

            fs.writeFile(fileDescriptor, stringData, err => {
                if (err) {
                    return callback('Error writing to existing file');
                }

                fs.close(fileDescriptor, err => {
                    return err ? callback('Error closing existing file') : callback(false);
                })
            })
        })
    })
}

lib.delete = (dir, file, callback) => {
    fs.unlink(fullPath(dir, file), (err) => {
        return err ? callback('Error deleting file') : callback(false);
    })
}

lib.list = (dir, callback) => {
    fs.readdir(lib.basDir + dir + '/', (err, data) => {
        if (err || !data || data.length === 0) {
            return callback(err, data);
        }

        const trimmedFileNames = [];
        for (const file of data) {
            trimmedFileNames.push(file.split('.').slice(0, -1).join('.'));
        }
        return callback(false, trimmedFileNames);
    })
}

module.exports = lib;