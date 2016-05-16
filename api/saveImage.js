var azure = require('azure-storage');
var sql = require('mssql');
var fs = require("fs")
var blobSvc = azure.createBlobService();
blobSvc.createContainerIfNotExists('meetupphotos2', {publicAccessLevel: 'container'}, function(error, result, response){
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
        var fileName = Date.now() + '.jpeg'
        var imagesId;
        var resourceName;
        
        fs.writeFile('./images/' + fileName, req.body.imageString, 'base64', function(err) {
            if(err){
                console.error('fs.writeFile err: ', err);
                //res.status(500).send(err);
            }
        

        //res.status(200).send('POST worked!');
        var imagesTable = req.azureMobile.tables('images');
        var tagsTable = req.azureMobile.tables('tags');
        var imagesTagsTable = req.azureMobile.tables('images_tags');

        var tagsArr = [];
        var promiseArr = [];
        console.log('req.body.title: ', req.body.title);
        console.log('req.body.tags: ', req.body.tags);
        //console.log('req.body.imageString: ', req.body.imageString);
       
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
        

        var prom = new Promise(function(resolve, reject){
            blobSvc.createBlockBlobFromLocalFile('meetupphotos2', fileName, './images/' + fileName,  function(error, result, response){
                if(!error){
                    console.log('blob result: ', result);
                    //console.log('response: ', response);
                    resourceName = result;
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
                    //delete the file now that we're done with it
                    fs.unlink('./images/' + fileName);
                    tagsArr.forEach(item =>{
                        sendPush(req, item, tableResult);
                    })
                    res.status(200).send(tableResult);
                    
                }, error => res.status(500).send(error))
                    
            }, error => Promise.reject(error))
            

        }, error => res.status(500).send(error))
        
        });
       
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

    function sendPush(req, tag, tableResult) {
        // This push uses a template mechanism, so we need a template
        // var payload = '<toast><visual><binding template="Toast01"><text id="1">' + context.item.text + '</text></binding></visual></toast>';

        if (req.azureMobile.push) {

            // this is the template that was registered
            var template2 = '{"data": {"title": "$(title)","message": "$(message)","style": "$(style)","picture": "$(picture)","summaryText": "$(summaryText)"}}';

            var payload = '{ "message" : "New image with tag ' + tag.tag + ' has been uploaded!", "title" : "Ionic Chicago", "style": "picture", "picture": "' + tableResult.imageUrl +'", "summaryText": "' + tableResult.title +'"}';
            

            //req.azureMobile.push.send('AE5095D2-BFAD-4EDE-92A6-3916501F44BA', payload, function (error) {
            req.azureMobile.push.send([tag.id], payload, function (error) {
                if (error) {
                    logger.error('Error while sending push notification: ', error);
                    res.status(500).send(error);
                } else {
                    console.log('Push notification sent successfully!');
                    res.status(200).send('Push notification sent successfully!');
                }
            });
        }
        
    }