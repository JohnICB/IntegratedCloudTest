var express = require('express');
var path = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
app.use(express.static("../views"));
app.use(cookieParser());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
var db = require('./database');

app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    console.log(req.cookies);
    // if (req.cookies.uid < 0) {
    //     res.redirect('http://127.0.0.1:8082/login');
    // }

    // res.send('Hello GET');
    // db.select();
})

app.get('/login', function (req, res) {
    console.log("Got a GET request for the login page");
    res.sendFile(path.join(__dirname + '\\..\\views\\login.html'));
})

/*
Route for getting all the devices of an user.
@param 
    cookie uid = id of the user
@return obj { devices: [{}] } array of objects in this format:
    { type = (str) "light" / "switch",
    name = (str) "name of the device",
    power = (str) "on" or "off" ,
    location = (str) "location of the device" ,
    id = (int) id of the device }
*/
app.get('/api/get_devices', function (req, res) {
    console.log("Got a GET request for the devices");
    if (req.cookies.uid > 0) {
        db.getDevices("light", req.cookies.uid, res);
    }
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
    ans = db.addDevice(req.body, res);
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
    console.log(req.body);
    db.login(req.body, res);

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
    db.addUser(req.body, res);
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
    ans = db.deleteUser(req.body, res);
})


/*
Route for deleting an user. Also deletes the saved devices.
@param req.body = 
    obj {
    id = (int) id of the user to delete }
@return obj {
    answer = (str) "ok" / error }
*/
app.delete('/api/remove_device', function (req, res) {
    console.log("Got a DELETE request for /remove_device");
    ans = db.deleteDevice(req.body, res);
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
    ans = db.updateDeviceState(req.body, res);
})


var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port

    console.log(" app listening at http://%s:%s", host, port)
})