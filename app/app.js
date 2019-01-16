var express = require('express');
var app = express();
var db = require('./database');

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
    // db.select();
})
/*
Route for adding a device to an user.
@param 
    obj {
    type = (str) "light" / "switch",
    name = (str) "name of the device",
    location = (str) "location of the device" ,
    uid = (int) user id }
@return obj {
    answer = (str) "ok" / "error",
    id = (int) id of the device }
*/
app.post('/api/add_device', function (req, res) {
    console.log("Got a POST request for /api/add_device");
    ans = db.addDevice(req.body);
    res.send(ans);
})

/*
Route for logging in and getting the devices.
@param 
    obj {
    name = (str) "name of the user" }
@return obj {
    answer = (str) "ok" / "error",
    id = (int) id of the user,
    devices = [ {} ] array of devices in this format: { type, name, location, power / brightness } }
*/
app.post('/login', function (req, res) {
    console.log("Got a POST request for /login");
    ans = db.login(req.body);
    res.send(ans);
})

/*
Route for adding a new user.
@param req.body =
    obj {
    name = (str) "name of the new user" }
@return obj {
    answer = (str) "ok" / error,
    id = (int) id of the user }
*/
app.post('/register', function (req, res) {
    console.log("Got a POST request for /register");
    ans = db.addUser(req.body);
    res.send(ans);
})

/*
Route for deleting an user and it's devices.
@param req.body = 
    obj {
    id = (int) id of the user to delete }
@return obj {
    answer = (str) "ok" / error }
*/
app.delete('/delete_user', function (req, res) {
    console.log("Got a DELETE request for /delete_user");
    ans = db.deleteUser(req.body);
    res.send(ans);
})

/*
Route for updating a device.
@param req.body = 
    obj {
    id = (int) id of the device to update,
    type = "light" / "switch",
    power = "Off" / "On" for a switch,
    brightness = (int) 0-100 brightness for a light }
@return obj {
    answer = (str) "ok" / error }
*/
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