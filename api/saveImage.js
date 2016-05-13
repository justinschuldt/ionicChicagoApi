var azure = require('azure-storage');
var sql = require('mssql');

var blobSvc = azure.createBlobService();
blobSvc.createContainerIfNotExists('meetupphotos2', {publicAccessLevel : 'blob'}, function(error, result, response){
    if(!error){
        console.log('container is set up!');
        //console.log('result: ', result);
        //console.log('response: ', response);
      // Container exists and allows
      // anonymous read access to blob
      // content and metadata within this container
    }
});

module.exports = {
    post: function (req, res, next) {
        //res.status(200).send('POST worked!');
        var imagesTable = req.azureMobile.tables('images');
        var tagsTable = req.azureMobile.tables('tags');
        var imagesTagsTable = req.azureMobile.tables('images_tags');

        var tagsArr = [];
        var promiseArr = [];
        console.log('req.body.title: ', req.body.title);
        console.log('req.body.tags: ', req.body.tags);
       
       if(req.body.tags && req.body.tags.length >= 1){
          req.body.tags.forEach(item => {
              promiseArr.push(tagsTable.where({tag: item}).read().then(result => {
                  if (result.length >=1) {
                      tagsArr.push(result[0]); 
                      return Promise.resolve();
                    } else {
                      tagsTable.insert({tag: item}).then(result => tagsArr.push(result));
                      return Promise.resolve();
                  }
              })
              )
          })

       } 
        

        var options = {
            contentSettings: {
                contentType: 'image/jpeg',
                contentEncoding: 'base64'
            }
        };
        var imagesId;
        var resourceName;
        var prom = new Promise(function(resolve, reject){
            blobSvc.createBlockBlobFromText('meetupphotos2', Date.now() + '.jpg', req.body.base64Image, options, function(error, result, response){
                if(!error){
                    console.log('result: ', result);
                    //console.log('response: ', response);
                    resourceName = result.blob;
                    resolve();
                    //res.status(200).send(result);
                } else {
                    reject(error);
                    console.error(error);
                    //res.status(500).send(error);
                }
            })
        })
        promiseArr.push(prom);
        
        Promise.all(promiseArr).then(result => {
            console.log('tagsArr: ', tagsArr);
            saveToTable(imagesTable, resourceName, req.body.title, req.body.uuid).then(tableResult =>{
                imagesId = tableResult.id;
                console.log('tableResult:', tableResult);
                    
                bindTagsToImage(imagesTagsTable, tagsArr, imagesId).then(result =>{
                    res.status(200).send();
                }, error => res.status(500).send(error))
                    
            }, error => Promise.reject(error))
            

        }, error => res.status(500).send(error))
       
    }, 
    get: function (req, res, next) {
        res.status(200).send('GET worked!');
    }
};

function saveToTable (table, resourceName, title, uuid) {
    var obj = {
        imageUrl:  'https://ma1568895daa2242.blob.core.windows.net/meetupphotos2/' + resourceName,
        title: title,
        uuid: uuid
    }
    return table.insert(obj);
}

function bindTagsToImage(table, tagsArr, imagesId) {
    if (tagsArr.length >= 1){
        var promiseArr = [];
        tagsArr.forEach(item => {
            var obj = {
                imagesId: imagesId,
                tagsId: item.id
            }
            promiseArr.push(table.insert(obj))
        })
        return Promise.all(promiseArr);
    } else{
        return Promise.resolve();
    }
}