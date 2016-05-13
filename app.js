
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// This is a base-level Azure Mobile App SDK.
var express = require('express'),
    azureMobileApps = require('azure-mobile-apps'),
    bodyParser = require('body-parser'),
    mobileApp = require('./zumo');
    

// Set up a standard Express app
var app = express();

//so we can upload large images
app.use(bodyParser.json({limit: '50mb'}));



mobileApp.tables.initialize()
    .then(function () {
        app.use(mobileApp);    // Register the Azure Mobile Apps middleware
        app.listen(process.env.PORT || 3000);   // Listen for requests
    });