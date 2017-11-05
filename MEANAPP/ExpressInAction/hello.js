var express = require('express');

var app = express();

app.get("/", function(req,res) {
  res.send('Hello World');
})

app.listen(4000, function() {
  console.log('express app started on port 4000');
})
