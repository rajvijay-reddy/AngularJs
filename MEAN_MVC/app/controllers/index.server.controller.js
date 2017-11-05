exports.render = function(req, res) {
    res.send('Howdy World');
};

app.get('/', function(req, res) {
    res.send('This is a GET request');
});
