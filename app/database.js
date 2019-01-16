var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "devices"
});

var getDevices = function (type, uid) {
    devices = [];
    con.connect(function (err) {
        if (err) throw err;
        var sql_query = "SELECT * FROM " + con.escape(type) + " WHERE uid=" + con.escape(uid);
        con.query(sql_query, function (err, result) {
            if (err) throw err;
            console.log(result);
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
        });

        con.end();
    });
}

var login = function (data) {
    console.log("Login called");
    var sql_query = "SELECT * FROM USER WHERE name=" + con.escape(data.name);
    con.query(sql_query, function (err, result) {
        if (err) throw err;
        var ans = {};
        if (result.length == 0) {
            ans.answer = "not found";
        } else {
            ans.answer = "ok";
            ans.id = result[0].id;
            ans.devices = getDevices("light", result[0].id).concat(getDevices("switch", result[0].id));
        }
    });
    con.end();
}

var deleteUser = function (data) {
    console.log("Delete user called");
    con.connect(function (err) {
        if (err) throw err;
        var sql = "DELETE FROM user WHERE id=" + con.escape(data.id);
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows == 0) {
                return {
                    answer: "User not found",
                }
            } else {
                return {
                    answer: "ok"
                }
            }
        });
        con.end();
    });
}

var addUser = function (data) {
    console.log("Add user called");
    con.connect(function (err) {
        if (err) throw err;
        var sql_query = "INSERT INTO user (`name`) VALUES (" + con.escape(data.name) + ")";
        con.query(sql, function (err, result) {
            if (err) throw err;
            var ans = {};
            if (result.affectedRows == 0) {
                ans.answer = "Error, already exists";
            } else {
                ans.answer = "ok";
                ans.id = result.insertId;
            }
            return ans;
        });
        con.end();
    });
}

var updateDeviceState = function (data) {
    console.log("Update device called");
    con.connect(function (err) {
        if (err) throw err;
        var sql;
        if (data.type === "light") {
            if (data.brightness > 100 || data.brightness < 0) {
                ///TODO: flag error
                data.brightness = 0;
            }
            sql_query = "UPDATE light SET brightness = " + con.escape(data.brightness) + "WHERE id=" + con.escape(data.id);
        } else if (data.type === "switch") {
            sql_query = "UPDATE switch SET power = " + con.escape(data.power) + "WHERE id=" + con.escape(data.id);
        }
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows == 0) {
                return {
                    answer: "Device not found",
                }
            } else {
                return {
                    answer: "ok"
                }
            }
        });
        con.end();
    });
}

var addDevice = function (data) {
    console.log("Add device called");
    con.connect(function (err) {
        if (err) throw err;
        var sql_query = "INSERT INTO " + con.escape(data.type) + "(`name`, `location`, `uid`) VALUES(" +
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
            return ans;
        });
        con.end();
    });
}

var deleteDevice = function (data) {
    console.log("Delete device called");
    con.connect(function (err) {
        if (err) throw err;
        var sql_query = "DELETE FROM " + con.escape(data.type) + " WHERE id=" + con.escape(data.id);

        con.query(sql, function (err, result) {
            if (err) throw err;
            var ans = {};
            if (result.affectedRows == 0) {
                ans.answer = "Error. Not Found.";
            } else {
                ans.answer = "ok";
                ans.id = result.insertId;
            }
            // console.log(result);
            return ans;
        });
        con.end();
    });
}

var select = function () {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        var sql_query = "SELECT * FROM light";
        con.query(sql_query, function (err, result) {
            if (err) throw err;
            console.log(result);
            // console.log(result[0].id);
        });
        con.end();
    });
}

module.exports = {
    login,
    select,
    addUser,
    deleteUser,
    updateDeviceState,
    addDevice,
    deleteDevice
}


// CREATE TABLE `switch` (
//     `id` int(11) NOT NULL AUTO_INCREMENT,
//     `name` varchar(32) DEFAULT NULL,
//     `location` varchar(64) DEFAULT NULL,
//     `power` int(3) DEFAULT 0,
//     `uid` int(11) NOT NULL,
//     PRIMARY KEY (`id`)
//   );