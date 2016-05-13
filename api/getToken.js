var auth = require('azure-mobile-apps/src/auth');


module.exports = {
    // validates a username and password and returns a JWT token if successful
    post: function (req, res, next) {
        var context = req.azureMobile,
            // the sign function creates a signed JWT token from provided claims
            sign = auth(context.configuration.auth).sign;
            //console.log('sign', sign);

        context.tables('users')
            .where({ uuid: req.body.uuid })
            .read()
            .then(function (users) {
                
                console.log('users: ', users);
                
                if(users.length === 1)
                    res.json(createResponse(sign, users[0]));
                else {
                context.tables('users')
                    .insert({
                        uuid: req.body.uuid
                    })
                    .then(function (user) {
                        res.json(createResponse(sign, user));
                    })
                }
                    
            })
            .catch(next);
    },

    // create a new user with the specified username and password and return a JWT token
    put: function (req, res, next) {
        var context = req.azureMobile,
            sign = auth(context.configuration.auth).sign;

        context.tables('users')
            .insert({
                uuid: req.body.uuid
            })
            .then(function (user) {
                res.json(createResponse(sign, user));
            })
            .catch(next);
    }
}


function createResponse(sign, user) {
    return {
        // this JWT token must be applied on the Mobile Apps client using the appropriate client APIs
        token: sign({
            // sub is the only required property. this becomes context.user.id
            // you can add other claims here. they become available as context.user.claims
            sub: user.id
        })
    };
}
