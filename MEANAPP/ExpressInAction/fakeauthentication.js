var express = require('express');
var http=require('http');

var app = express();

app.use(function(req,res, next) {
  console.log('In comes a ', req.method, ' request to: ', req.url);
  next();
});

app.use(function(req,res, next) {
  var minutes = new Date().getMinutes();
  if((minutes % 2) == 0) {
    next();
  }
  else {
    res.writeHead(403, {'Content-Type': 'text/plain'});
    res.end('Not authorized');
  }
});

app.use(function(req,res, next) {
  res.end('Secret info: the password is: swordfish');
});

app.listen(4000);
