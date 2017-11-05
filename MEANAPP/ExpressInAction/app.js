var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();

//logging message
app.use(function(req, res, next) {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});

//middleware to see if a file exists then send the file else goto next middleware
app.use(function(req,res) {
  var filePath = path.join(__dirname, "static", req.url);
  fs.stat(filePath, function(err, fileInfo) {
    if(err) {
      next();
      return;
    }

    if(fileInfo.isFile()) {
      res.sendFile(filePath);
    }
      else {
        next();
      }


  });
});

app.listen(4000);
