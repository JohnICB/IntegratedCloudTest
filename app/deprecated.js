var insertDevice = function (data) {
    console.log("Login called");
    var sql;
    if (data.type === "light") {
        sql_query = "INSERT INTO light (`name`, `location`, `brightness`) \
        VALUES (" + con.escape(data.name) + " , " + con.escape(data.location) + ", " + con.escape(data.brightness) + ")";
    } else if (data.type === "switch") {
        sql_query = "INSERT INTO switch (`name`, `location`, `power`) \
        VALUES (" + con.escape(data.name) + " , " + con.escape(data.location) + ", " + con.escape(data.power) + ")";
    }
    con.query(sql_query, function (err, result) {
        if (err) throw err;
        var ans = {
            answer: "",
            id: ""
        }
        if (result.affectedRows == 0) {
            ans.answer = "Error, already exists";
        } else {
            ans.answer = "ok";
            ans.id = result.insertId;
        }
        return ans;
    });
    con.end();
}
var addSwitch = function (data) {
    console.log("Update device called");
    con.connect(function (err) {
        if (err) throw err;

        var sql_query = "INSERT INTO switch (`name`, `location`, `uid`) VALUES( " +
            con.escape(data.name) + ", " + con.escape(data.location) + ", " + con.escape(data.uid) + ")";

        con.query(sql, function (err, result) {
            if (err) throw err;

            var ans = {
                answer: "",
                id: ""
            }
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