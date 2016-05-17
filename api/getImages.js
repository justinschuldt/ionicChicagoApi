

module.exports = {
    get: function (req, res, next) {
        var imageTable = req.azureMobile.tables('images');
        var promiseArr = []
        imageTable.orderByDescending('createdAt').read().then(results => {
            console.log('table results ', results);
            results.forEach(item => {
                var prom = new Promise(function(resolve, reject){
                    var query = {
                        sql: 'select t.tag, t.id from images_tags it left join tags t on t.id = it.tagsId where it.imagesId = @imagesId',
                        parameters: [
                            { name: 'imagesId', value: item.id }
                        ]
                    };
                    //console.log('sql: ', query);
                    req.azureMobile.data.execute(query)
                        .then(function (results) {
                            //console.log(results)
                            item.tags = results;
                            resolve(item);
                    }, error => reject(error))
                })
                promiseArr.push(prom);

                
            })
            Promise.all(promiseArr).then(result => {
                res.status(200).json(result);
            }, error => res.status(500).send(error))
        })

            

    }
}