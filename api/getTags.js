module.exports = {
    post: function (req, res, next) {
        //console.log('headers: ', req.headers);
        
        if(req.azureMobile.user){
            console.log('req.azureMobile.user: ', req.azureMobile.user);
        }
        if(req.user){
            console.log('req.user: ', req.user);
        }

        
        if (req.azureMobile.user && req.azureMobile.user.id) {
            var usersId = req.azureMobile.user.id;
        } else {
            //this is just a failsafe, in case the token is bad
            var usersId = '6f2b91c3-0657-477b-9716-ca9ceb6c9bbc';
        }
        console.log('usersId: ', usersId);
        
        var query = {
            sql: 'select t.id, t.createdAt, t.updatedAt, t.deleted, t.tag from users_tags ut join tags t on t.id = ut.tagsId where ut.usersId = @usersId',
            parameters: [
                { name: 'usersId', value: usersId }
            ]
        };
        console.log('sql: ', query);
        req.azureMobile.data.execute(query)
            .then(function (result) {
                console.log('query result: ', result)
                res.json(result);
                
        }, error => res.status(500).send(error))

    },
    get: function (req, res, next) {
        var tagsTable = req.azureMobile.tables('tags');
        
        tagsTable.read().then(result => res.status(200).send(result))
        
    }
}