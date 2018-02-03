var http = require('http');
var config = require('./config.json');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var fs = require('fs');
var path = require('path');
var RESOURCES = __dirname + '/resources'

function handleRequest(request, response){
   try {
       console.log("Requested URL: " + request.url);
       dispatcher.dispatch(request, response);
   } catch(err) {
       console.log(err);
   }
}

dispatcher.onGet("/", function(req, res) {
   fs.readdir(RESOURCES, function(err, files){
     if(err || !files){
       res.writeHead(500);
       return res.end('500')
     }

     var length = files.length;
     var index = Math.floor(Math.random() * length);

     var filename = files[index]
     var mime_extension = filename.split('.').pop();

     fs.readFile(path.join(RESOURCES,filename), function(err, file){
       console.log("read file : " + path.join(RESOURCES, filename))
       if(err || !file){
         console.log("Couldn't find file")
         var respText = '500';
         res.writeHead(500);
         if(err){
           respText = JSON.stringify(err);
         }
         return res.end(respText)
       }

       console.log("Loaded file.")
       var content = 'image/' + mime_extension;
       console.log("content type " + content)

       res.writeHead(200,  { 'Content-Type': content });
       return res.end(file)
     })



   });
});

dispatcher.onError(function(req, res) {
       res.writeHead(404);
       res.end("404 - Page Does not exists");
});

http.createServer(handleRequest).listen(config.port, function(){
   console.log("Server listening on: http://localhost:%s", config.port);
});
