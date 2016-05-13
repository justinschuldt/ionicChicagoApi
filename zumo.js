var azureMobileApp = require('azure-mobile-apps');

var zumo = azureMobileApp();

zumo.tables.use(function (req, res, next) {
    if (req.user) {
        req.azureMobile.user = req.user;
    }
    return next();
});

zumo.api.use(function (req,res, next) {
    console.log('zumo.api middleware: ', req.user);
    if (req.user) {
        req.azureMobile.user = req.user;
    }
    return next();
});


zumo.api.import('./api');

zumo.tables.import('./tables');

module.exports = exports = zumo;