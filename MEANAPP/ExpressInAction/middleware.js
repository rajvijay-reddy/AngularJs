var express = require('express');
var http=require('http');

var app = express();

app.use(function(req,res) {
  console.log('In comes a request to: ', req.url);
  res.end('Hello World');
});

app.get("/", function(req,res) {
  // res.send('Hello World');
})

http.createServer(app).listen(4000);
