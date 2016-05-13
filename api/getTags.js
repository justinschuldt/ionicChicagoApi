module.exports = {
    get: function (req, res, next) {
        var tagsTable = req.azureMobile.tables('tags')
            usersTagsTable = req.azureMobile.tables('users_tags');
        var promiseArr = [];
        var usersId = req.azureMobile.user.id
        //usersTagsTable.where({usersId: usersId}).read().then(results => {
            //console.log('usersTagsTable results ', results);
            //results.forEach(item => {
                //var prom = new Promise(function(resolve, reject){
                    var query = {
                        sql: 'select t.id, t.createdAt, t.updatedAt, t.deleted, t.tag from users_tags ut join tags t on t.id = ut.tagsId where ut.usersId = @usersId',
                        parameters: [
                            { name: 'usersId', value: usersId }
                        ]
                    };
                    console.log('sql: ', query);
                    req.azureMobile.data.execute(query)
                        .then(function (results) {
                            console.log(results)
                            item.tags = results;
                            resolve(item);
                    }, error => reject(error))
                //})
                //promiseArr.push(prom);

                
            //})
            //Promise.all(promiseArr).then(result => {
            //    res.status(200).send(result);
            //}, error => res.status(500).send(error))
        //})

            

    }
}