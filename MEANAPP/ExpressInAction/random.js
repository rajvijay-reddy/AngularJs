var express = require('express');

var app = express();

app.get('/random/:min/:max', function(req,res) {
  if(isNaN(req.params.min) || isNaN(req.params.max)) {
    res.status(400);
    res.json({"error": "Not a Number"});
    return;
  }

  var result = Math.round((Math.random() * (req.params.max - req.params.min)) +
  req.params.min);
  res.json({"result": result});
});

app.listen(4000);
