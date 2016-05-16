module.exports = {
    "post": function (req, res, next) {
        
        var usersTagsTable = req.azureMobile.tables('users_tags');

        //console.log('req.azureMobile.push');
        //console.log('req.body: ', req.body);
        
        var template = '{"data":{"message":"$(message)","title":"$(title)","payload":{"messageId":"$(messageId)","messageDetailsBol":"$(messageDetailsBol)"}}}';
        
        var template2 = '{"data": {"title": "$(title)","message": "$(message)","style": "$(style)","picture": "$(picture)","summaryText": "$(summaryText)"}}';


        req.azureMobile.push.createRegistrationId(function(error, response){

            if (error) {
                console.log('registration error: ', error);
                res.status(500).send(error);
            }

            //console.log('registration response: ', response);
            //TODO retrive the users_tags from the db and include all of them in the registration
            req.azureMobile.push.gcm.createOrUpdateTemplateRegistration(response, req.body.gcmRegistrationId, [req.body.tag], template2, {templateName: 'picture'}, function(error, response){
                if (error) {
                    console.log('registration error: ', error);
                    res.status(500).send(error);
                }

                console.log('registration response: ', response);
                usersTagsTable.insert({
					usersId: req.azureMobile.user.id,
					tagsId: req.body.tag.id
				}).then(result => console.log('users_tags result: ', result));
				
				//res.status(200).send(tag);
                res.status(200).send(response);
            })

        });





    }
};
