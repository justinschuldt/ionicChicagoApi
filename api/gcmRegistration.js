'use strict';

module.exports = {
    "post": function (req, res, next) {
        
        // first get the existing tags
        var usersTagsTable = req.azureMobile.tables('users_tags');
        usersTagsTable.where({usersId: req.azureMobile.user.id}).read().then(results => {
            let tagsIdsArr = []
            results.forEach(item =>{
                tagsIdsArr.push(item.id);
            });
            //then add the new tags.id to the array of existing
            tagsIdsArr.push(req.body.tag);
            //now do all the other stuff
            
            var template2 = '{"data": {"title": "$(title)","message": "$(message)","style": "$(style)","picture": "$(picture)","summaryText": "$(summaryText)"}}';

            req.azureMobile.push.createRegistrationId(function(error, response){
                if (error) {
                    console.log('registration error: ', error);
                    res.status(500).send(error);
                }

                //console.log('registration response: ', response);
                
                req.azureMobile.push.gcm.createOrUpdateTemplateRegistration(response, req.body.gcmRegistrationId, tagsIdsArr, template2, {templateName: 'picture'}, function(error, response){
                    if (error) {
                        console.log('registration error: ', error);
                        res.status(500).send(error);
                    }

                    console.log('registration response: ', response);
                    //now insert the new tag into the users_tags table
                    usersTagsTable.insert({
                        usersId: req.azureMobile.user.id,
                        tagsId: req.body.tag.id
                    }).then(result => console.log('users_tags result: ', result));
                    
                    //res.status(200).send(tag);
                    res.status(200).send(response);
                })

            });
            
            
        })

    }
};
