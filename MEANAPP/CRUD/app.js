var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbConfig = require('./models/db');
var Book = require('./models/book');
var app = express();

var port = 4000;

// Connect to DB
mongoose.connect(dbConfig.url);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function(req,res) {
  res.send("happy to be here");
});

app.get('/books', function(req,res) {
  Book.find({})
    .exec(function(err, books){
      if(err) {
        console.log('Error has occured');
      } else {
        console.log(books);
        res.json(books);
      }
    });
});

app.get('/books/:id', function(req,res) {
  console.log('Getting 1 book object');
  Book.findOne({_id: req.params.id})
    .exec(function(err, book){
      if(err) {
        res.send('Error has occured');
      } else {
        console.log(book);
        res.json(book);
      }
    });
});

app.post('/book', function(req,res) {
  console.log('posting');
  var newBook = new Book();
  newBook.title = req.body.title;
  newBook.author = req.body.author;
  newBook.category = req.body.category;

  newBook.save(function(err, book) {
    if(err) {
      res.send('Error occured');
    } else {
      console.log(book);
      res.send(book);
    }
  });
});

//another way less error prone using create command
app.post('/book2', function(req,res) {
  console.log('posting');
  Book.create(req.body, function(err,book) {
    if(err) {
      res.send('Error occured');
    } else {
      console.log(book);
      res.send(book);
    }
  });
});

app.put('/book/:id', function(req,res) {
  console.log('updating');
  Book.findOneAndUpdate({
    _id: req.params.id
  }, {$set:
    { title: req.body.title }},
    // { upsert: true },
    function (err, newbook) {
      if (err) { res.send('Error occured'); }
      else {
          res.send(newbook);
        // res.status(204);

      }
   });
});


app.put('/book/:id', function(req,res) {
  console.log('updating');
  Book.findOneAndUpdate({
    _id: req.params.id
  }, {$set:
    { title: req.body.title }},
    // { upsert: true },
    function (err, newbook) {
      if (err) { res.send('Error occured'); }
      else {
          res.send(newbook);
        // res.status(204);

      }
   });
});

app.delete('/book/:id', function(req,res) {
  console.log('updating');
  Book.findOneAndRemove({
    _id: req.params.id
  }, function (err, book) {
      if (err) { res.send('Error deleting'); }
      else {
          res.send(book);
        res.status(204);

      }
   });
});


app.listen(port, function() {
  console.log('app listening on port', port);
});
