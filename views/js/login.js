$(document).ready(function () {
    $("#login").on("click", function (e) {
        var user = $("#user").val();
        if (user.length < 3) {
            alert("username must be at least 2 characters long");
            return;
        }
        var dt = {
            name: user.toString()
        };
        console.log(dt);
        // alert(user);
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8082/login",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(dt),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                // alert(JSON.stringify(data));
                console.log(data);
                if (data.answer === "ok") {
                    $.cookie("uid", data.id);
                    window.location.href = "http://127.0.0.1:8082/";
                } else(alert(data.answer));
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    })

    $("#register").on("click", function (e) {
        var user = $("#user").val();
        if (user.length < 3) {
            alert("username must be at least 2 characters long");
            return;
        }
        var dt = {
            name: user.toString()
        };
        console.log(dt);
        // alert(user);
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8082/register",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(dt),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {;
                console.log(data);
                if (data.answer === "ok") {
                    $.cookie("uid", data.id);
                    window.location.href = "http://127.0.0.1:8082/";
                } else(alert(data.answer));
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    })
});