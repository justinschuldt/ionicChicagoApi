

module.exports = {
    get: function (req, res, next) {
        var imageTable = req.azureMobile.tables('images');
        var promiseArr = []
        imageTable.where().read().then(results => {
            results.forEach(item => {
                var query = {
                    sql: 'select t.tag, t.id from images_tags it left join tags t on t.id = it.tagsId where it.imagesId = @imagesId',
                    parameters: [
                        { name: 'imagesId', value: item.id }
                    ]
                };
                promiseArr.push(req.azureMobile.data.execute(query)
                    .then(function (results) {
                        item.tags = results;
                        Promise.resolve(item);
                }, error => Promise.reject(error)))
                
            })
        })

            
        Promise.all(promiseArr).then(result => {
            res.status(200).send(result);
        }, error => res.status(500).send(error))
    }
}