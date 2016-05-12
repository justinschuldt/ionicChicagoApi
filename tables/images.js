
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var table = require('azure-mobile-apps').table(),
    logger = require('azure-mobile-apps/src/logger');

table.columns = {
    "title": "string",
    "tags": "string",
    "imageUrl": "string"
};

// For details of the Notification Hubs JavaScript SDK,
// see https://azure.microsoft.com/en-us/documentation/articles/notification-hubs-nodejs-how-to-use-notification-hubs/

// When adding record, send a push notification via WNS
// For this to work, you must have a WNS Hub already configured
table.insert(function (context) {
    // Execute the insert. The insert returns the results as a Promise,
    // Do the push as a post-execute action within the promise flow.
    return context.execute()
        .then(function (results) {
            sendPush();
            return results;
        });

    function sendPush() {
        // This push uses a template mechanism, so we need a template
        var payload = '<toast><visual><binding template="Toast01"><text id="1">' + context.item.text + '</text></binding></visual></toast>';

        // if(context.push) {
        if(context.push && context.item.tags) {
            var tags = context.item.tags.split(',').map(tag => tag.trim());
            context.push.wns.send(tags, payload, 'wns/toast', function (error) {
            // context.push.wns.send(null, payload, 'wns/toast', function (error) {
                if (error)
                    logger.error('Error while sending push notification: ', error);
                else
                    logger.silly('Push notification sent successfully!');
            });
        }
    }
});

module.exports = table;