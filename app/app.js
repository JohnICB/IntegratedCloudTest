var express = require('express');
var app = express();


// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/api/add_device', function (req, res) {
    console.log("Got a POST request for /api/add_device");
    res.send("Hello POST");
})


var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port

    console.log(" app listening at http://%s:%s", host, port)
})