// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var promises = require('azure-mobile-apps/src/utilities/promises');

// a custom API that adds the specified tag for this installation
module.exports = {
    post: function (req, res, next) {
        // Get the notification hub used by the mobile app.
		var push = req.azureMobile.push;
            installationId = req.get('X-ZUMO-INSTALLATION-ID'),
		    tags = [request.body.tag.id],
			usersTagsTable = req.azureMobile.tables('users_tags');
			
			console.log('req.azureMobile.user.id: ', req.azureMobile.user.id);

		// Define an update tags operation.
		var updateOperation = [{
			"op": "add",
			"path": "/tags",
			"value": tags
		}];

		// Update the installation to add the new tags.
		push.patchInstallation(installationId, updateOperation, function(error) {
			if(error){
				logger.error('An error occurred when adding tags', error);
				res.status(error.statusCode).send(error.detail);
			} else {
				usersTagsTable.insert({
					usersId: req.azureMobile.user.id,
					tagsId: req.body.tag.id
				}).then(result => console.log('users_tags result: ', result));
				
				res.status(200).send(tag);
			}
		});
    }
}