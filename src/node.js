var http = require('http');
var fs = require('fs');
var port = 8080;

function onRequest(req,res)
{
if(req.url=='/' || req.url=='/'){
fs.readFile('./public/index.html', (error,data)=> {
if(error){
res.writeHead(404);
res.write('File Not Found');
res.end();
}
else{
res.writeHead(200,{"Content-Type": "text/css"});
res.writeHead(200, {'Content-Type': 'text/html'});
res.write(data);
res.end();
}
});
}
}

http.createServer(onRequest).listen(3333);