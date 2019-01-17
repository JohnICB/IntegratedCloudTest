var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "devices"
});

/* Returns an array of all the devices of the type 'type' 
 for the user with id = 'uid' */
var getDevices = function (type, uid, res = -1, second = false, lights = undefined) {
    var devices = [];
    con.connect(function (err) {
        // if (err) throw err;
        var sql_query = "SELECT * FROM " + type + " WHERE uid=" + uid; //sql inj vuln
        // console.log(lights, sql_query);
        con.query(sql_query, function (err, result) {
            devices = [];
            if (err) throw err;
            // console.log("get devices: ");
            // console.log(result, result.length);
            for (let i = 0; i < result.length; ++i) {
                device = {
                    id: result[i].id,
                    name: result[i].name,
                    location: result[i].location,
                    type: type
                }
                if (type === "light") {
                    device.brightness = result[i].brightness;
                } else if (type === "switch") {
                    device.power = result[i].power;
                }
                devices.push(device);
            }

            if (second == false) {
                // console.log(devices, "devices");
                getDevices("switch", uid, res, true, devices);
            }
            if (second == true) {
                // console.log("Lights are: ", lights);
                // console.log("Switches are: ", devices);
                // console.log("Joined are: ", devices.concat(lights));
                var joined = devices.concat(lights);
                // console.log(devices);
                res.send(JSON.stringify({
                    devices: joined
                }));
            }
        });
    });
    // console.log("RETURNING DEVICES: " + JSON.stringify(devices));
    return devices;
}

/* Checks if username exists, returns as an object an array of all 
owned devices and a flag for success / error */
var login = function (data, res) {
    console.log("Login called");
    var ans = {};
    con.connect(function (err) {
        var sql_query = "SELECT * FROM USER WHERE name=" + con.escape(data.name);
        con.query(sql_query, function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
                ans.answer = "not found";
                res.send(JSON.stringify(ans));
            } else {
                ans.answer = "ok";
                ans.id = result[0].id;
                res.send(JSON.stringify(ans));
            }
        });
    });

}

/* Deletes an user with the id = 'data.id' and returns
an object with a flag for success / error */
var deleteUser = function (data, res) {
    console.log("Delete user called");
    // con.connect(function (err) {
    //     if (err) throw err;
    var sql = "DELETE FROM user WHERE id=" + (data.id);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.affectedRows == 0) {
            res.send(JSON.stringify({
                answer: 'User not found'
            }));
        } else {
            deleteUserData(data.id, "light");
            deleteUserData(data.id, "switch");
            res.send(JSON.stringify({
                answer: 'ok'
            }));
        }
        // con.end();
    });
    // });
}
/* Deletes all the devices of type = 'type' owned by the user with id = 'id' */
var deleteUserData = function (id, type) {
    // con.connect(function (err) {
    // if (err) throw err;
    console.log("deleting user data");
    var sql = "DELETE FROM " + (type) + " WHERE uid= " + (id);
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    // con.end();
    // });
}

/* Adds a new user, returns an object with the id of the user and a flag*/
var addUser = function (data, res) {
    console.log("Add user called");
    // con.connect(function (err) {
    //     if (err) throw err;
    var sql = "INSERT INTO user (`name`) VALUES (" + con.escape(data.name) + ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var ans = {};
        if (result.affectedRows == 0) {
            ans.answer = "Error, already exists";
        } else {
            ans.answer = "ok";
            ans.id = result.insertId;
        }
        res.send(JSON.stringify(ans));
        // con.end();
    });
    // });
}

/* Updates the device power / brightness with the id = 'data.id' 
returns an object with a flag for error / success*/
var updateDeviceState = function (data, res) {
    console.log("Update device called");
    // con.connect(function (err) {
    //     if (err) throw err;
    var sql;
    console.log(data);
    if (data.type === "light") {
        if (data.brightness > 100 || data.brightness < 0) {
            ///TODO: flag error
            data.brightness = 0;
        }
        sql = "UPDATE light SET brightness = " + (data.brightness) + " WHERE id=" + (data.id);
    } else if (data.type === "switch") {
        sql = "UPDATE switch SET power = " + con.escape(data.power) + " WHERE id=" + (data.id);
    }
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.affectedRows == 0) {
            res.send(JSON.stringify({
                answer: 'Device not found'
            }));
        } else {
            res.send(JSON.stringify({
                answer: 'ok'
            }));
        }
        // con.end();
    });
    // });
}

/* Adds a new devices of type = 'data.type' for the user with id= 'data.uid' 
returns an object with the id of the new device and a flag for success / error */
var addDevice = function (data, res) {
    console.log("Add device called");
    // con.connect(function (err) {
    //     if (err) throw err;
    var sql = "INSERT INTO " + data.type + "(`name`, `location`, `uid`) VALUES(" +
        con.escape(data.name) + ", " + con.escape(data.location) + ", " + con.escape(data.uid) + ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        var ans = {};
        if (result.affectedRows == 0) {
            ans.answer = "Error, already exists";
        } else {
            ans.answer = "ok";
            ans.id = result.insertId;
        }
        // console.log(result);
        res.send(JSON.stringify(ans));
        // con.end();
    });
    // });
}

/* Deletes a device  with the id = 'data.id' and the type = 'data.type', returns a flag*/
var deleteDevice = function (data, res) {
    console.log("Delete device called");
    // con.connect(function (err) {
    //     if (err) throw err;
    var sql_query = "DELETE FROM " + (data.type) + " WHERE id=" + (data.id);
    con.query(sql_query, function (err, result) {
        if (err) throw err;
        var ans = {};
        if (result.affectedRows == 0) {
            ans.answer = "Error. Not Found.";
        } else {
            ans.answer = "ok";
        }
        console.log("del device: ", ans);
        res.send(JSON.stringify(ans));
        // con.end();
    });
    // });
}

/* Test function */
// var select = function () {
//     con.connect(function (err) {
//         if (err) throw err;
//         console.log("Connected!");
//         var sql_query = "SELECT * FROM light";
//         con.query(sql_query, function (err, result) {
//             if (err) throw err;
//             console.log(result);
//             // console.log(result[0].id);
//         });
// con.end();
//     });
// }

module.exports = {
    login,
    // select,
    addUser,
    deleteUser,
    updateDeviceState,
    addDevice,
    deleteDevice,
    getDevices
}