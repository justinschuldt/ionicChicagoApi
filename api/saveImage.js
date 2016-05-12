var azure = require('azure-storage');
var sql = require('mssql');

module.exports = {
    post: function (req, res, next) {
        res.status(200).send('POST worked!');
    }, 
    get: function (req, res, next) {
        res.status(200).send('GET worked!');
    }
};
