module.exports = {
    "post": function (req, res, next) {

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

            req.azureMobile.push.gcm.createOrUpdateTemplateRegistration(response, req.body.gcmRegistrationId, [req.body.tag], template2, {templateName: 'picture'}, function(error, response){
                if (error) {
                    //console.log('registration error: ', error);
                    res.status(500).send(error);
                }

                //console.log('registration response: ', response);
                res.status(200).send(response);
            })

        });





    }
};
