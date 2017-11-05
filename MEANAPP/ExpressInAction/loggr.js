var express = require('express');
var http=require('http');
var logger = require('morgan');

var app = express();

app.use(logger("short"));

app.use(function(req,res, next) {
  res.writeHead(200, {'Content-Type': 'text/json'});
  res.end('logger with morgan');
});

app.listen(4000);
