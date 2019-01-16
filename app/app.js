var express = require('express');
var app = express();
var db = require('./database');

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
    // db.select();
})

app.post('/api/add_device', function (req, res) {
    console.log("Got a POST request for /api/add_device");
    ans = db.addDevice(req.body);
    res.send(ans);
})

app.post('/login', function (req, res) {
    console.log("Got a POST request for /login");
    ans = db.login(req.body);
    res.send(ans);
})

app.post('/register', function (req, res) {
    console.log("Got a POST request for /register");
    ans = db.addUser(req.body);
    res.send(ans);
})

app.delete('/delete_user', function (req, res) {
    console.log("Got a DELETE request for /delete_user");
    ans = db.deleteUser(req.body);
    res.send(ans);
})

app.patch('/api/update_device', function (req, res) {
    console.log("Got a PATCH request for /api/update_device");
    ans = db.updateDeviceState(req.body);
    res.send(ans);
})


var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port

    console.log(" app listening at http://%s:%s", host, port)
})