
module.exports = {
    "post": function (req, res, next) {

        var template = "{'aps':{'alert':{'title':'$(title)','body':'$(message)'},'payload':{'messageId':'$(messageId)','messageDetailsBol':'$(messageDetailsBol)'}}}";
        var template1 = '{"aps":{"alert":{"title":"$(title)","body":"$(message)"},"payload":{"messageId":"$(messageId)","messageDetailsBol":"$(messageDetailsBol)"}}}';
        var template2 = "{\"aps\":{\"alert\":{\"title\":\"$(title)\",\"body\":\"$(message)\"},\"payload\":{\"messageId\":\"$(messageId)\",\"messageDetailsBol\":\"$(messageDetailsBol)\"}}}";

        //console.log('req.azureMobile.push');
        //console.log('req.body: ', req.body);

        //var hub = new GcmService(req.azureMobile.push);
        console.log('req.body.token: ', req.body.token);
        console.log('req.body: ', req.body);
        console.log('req.body: ', req.body);

        req.azureMobile.push.createRegistrationId(function(error, response){

            if (error) {
                console.log('registration error1: ', error);
                res.status(500).send(error);
            }

            if (response) {
                console.log('registration response1: ', response);

                req.azureMobile.push.apns.createOrUpdateTemplateRegistration(response, req.body.token, req.body.options.tags, template1, req.body.options, function(error, response){
                    if (error) {
                        console.log('registration error2: ', error);
                        res.status(500).send(error);
                    }
                    if (response){
                        console.log('registration response2: ', response);
                        res.status(200).send(response);
                    }


                })
            }



        });


        //registration response1:  5861619917661984491-132354305988712905-9
        //registration error2:  { [Error: 400 - An invalid tag 'System.Collections.Generic.HashSet`1[System.String]' was supplied. Valid tag characters are alphanumeric, _, @, -, ., : and #.TrackingId:16f1aba7-24aa-4ad6-b718-b2bbf450a5fd_G6,TimeStamp:1/21/2016 2:10:27 AM]
        //    code: '400',
        //        detail: 'An invalid tag \'System.Collections.Generic.HashSet`1[System.String]\' was supplied. Valid tag characters are alphanumeric, _, @, -, ., : and #.TrackingId:16f1aba7-24aa-4ad6-b718-b2bbf450a5fd_G6,TimeStamp:1/21/2016 2:10:27 AM',
        //        statusCode: 400 }


    }
};
