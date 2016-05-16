var azureMobileApps = require('azure-mobile-apps');

// Create a new table definition
var table = azureMobileApps.table();

table.read(function (context) {
    console.log('read tags table');
    return context.execute();
});


module.exports = table;