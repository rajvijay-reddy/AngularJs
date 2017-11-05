var express = require('express');
var http=require('http');
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger("short"));

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.use(function(req,res) {
  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end("Looks like u didn't find a static file");
});

app.listen(4000);
