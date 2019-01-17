var newDevice = function (data) {
  console.log(data);
  var bigDiv = $("<div></div>").addClass("col-lg-4 col-sm-6 col-xs-12");
  var cardDiv = $("<div></div>").addClass("card");
  // var editBtn = $("<a></a>")
  //   .addClass("btn btn-secondary a-btn-slide-text edit")
  //   .attr("item", data.id)
  //   .attr("type", data.type);
  // var spn1 = $("<span></span>").addClass("glyphicon glyphicon-edit");
  // spn1.attr("aria-hidden", "true");
  // var spnEdit = $("<span></span>").append($("<strong></strong)").text("Edit"));
  var img = $("<img></img>")
    .addClass("card-img-top device-image")
    .prop("alt", "Card Image");
  if (data.type == "light") {
    img.prop("src", "/images/bec.png");
  } else if (data.type == "switch") {
    img.prop("src", "/images/switch.png");
  }
  var cardBody = $("<div></div>").addClass("card-body");
  var cardTitle = $("<h4></h4>")
    .addClass("card-title")
    .text(data.name);
  var cardText = $("<p></p>")
    .addClass("card-text")
    .text(data.location);
  var status = $("<span></span>");
  var switchBtn = $("<a></a>")
    .addClass("btn btn-primary btn-width")
    .attr("item", data.id)
    .attr("type", data.type)
    .attr("id", "switch");
  var removeBtn = $("<a></a>")
    .addClass("btn btn-danger btn-width")
    .text("x Remove")
    .attr("item", data.id)
    .attr("type", data.type)
    .attr("id", "remove");

  var onOffbtn = $("<a></a>")
    .addClass("btn btn-info  btn-width")
    .text("x Remove")
    .attr("item", data.id)
    .attr("type", data.type)
    .attr("id", "onoff");

  var onoffbadge = $("<span></span>");
  if (data.type === "light") {

    if (data.power == "off") {
      onOffbtn.text("Switch On");
      onoffbadge.text("Off").addClass("badge badge-danger status");
    } else {
      onOffbtn.text("Switch Off");
      onoffbadge.text("On").addClass("badge badge-success status");
    }

    if (data.brightness == 0 || data.brightness == undefined) {
      switchBtn.text("Brightness");
      status.text("0").addClass("badge badge-danger status");
    } else {
      switchBtn.text("Brightness");
      status.text(data.brightness).addClass("badge badge-success status");
    }

  } else {
    if (data.power == "off") {
      switchBtn.text("Switch On");
      status.text("Off").addClass("badge badge-danger status");
    } else {
      switchBtn.text("Switch Off");
      status.text("On").addClass("badge badge-success status");
    }
  }

  cardBody.append(cardTitle, cardText, status);
  if (data.type === "light") {
    cardBody.append(onoffbadge, onOffbtn);
  } else {
    switchBtn.addClass("downpad");
    removeBtn.addClass("downpad");
  }
  cardBody.append(switchBtn, removeBtn);
  // editBtn.append(spn1, spnEdit);
  cardDiv.append( /*editBtn ,*/ img, cardBody);
  bigDiv.append(cardDiv);
  var x = $("#items-cntr").append(bigDiv);
  // console.log("ADDED");
};
var removeDeviceHTML = function (buttonElm) {
  var div = buttonElm
    .parent()
    .parent()
    .parent();
  div.remove();
};
var switchDevice = function (buttonElm, val = 0) {
  var badge = buttonElm.prev().prev().prev();
  if (buttonElm.attr("type") === "light") {
    badge
      .text(val)
      .removeClass("badge-danger")
      .removeClass("badge-success");
    if (val > 0) {
      badge.addClass("badge-success");
    } else {
      badge.addClass("badge-danger");
    }
  } else

  {
    badge = badge.next().next();
    if (badge.text() == "On") {

      badge
        .text("Off")
        .addClass("badge-danger")
        .removeClass("badge-success");
      buttonElm.text("Switch On");
    } else {
      badge
        .text("On")
        .addClass("badge-success")
        .removeClass("badge-danger");
      buttonElm.text("Switch Off");
    }
  }

};
var getDevices = function () {
  if ($.cookie("uid")) {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8082/api/get_devices",
      // The key needs to match your method's input parameter (case-sensitive).
      success: function (data) {
        var dvs = JSON.parse(data);
        // console.log(dvs.devices);
        for (let i = 0; i < dvs.devices.length; i++) {
          // console.log(dvs.devices[i]);
          newDevice(dvs.devices[i]);

        }
      },
      failure: function (errMsg) {
        alert(errMsg);
      }
    });
  }
}
var resetForm = function () {
  $("#light-input").prop('checked', true);
  $('#switch-input').prop('checked', false);
  $('input[name="name"]').val('');
  $('input[name="location"]').val('');

}
var lightonoff = function (elem) {
  badge = elem.prev();
  if (badge.text() == "On") {
    badge
      .text("Off")
      .addClass("badge-danger")
      .removeClass("badge-success");
    elem.text("Switch On");
  } else {
    badge
      .text("On")
      .addClass("badge-success")
      .removeClass("badge-danger");
    elem.text("Switch Off");
  }
}
$(document).ready(function () {
  // alert($.cookie("uid"));
  // console.log($.cookie("uid"));
  getDevices();

  $("#add").on("click", function () {
    var rawFormData = JSON.parse(
      JSON.stringify($("#device-form").serializeArray())
    );
    // [{"name":"type","value":"light"},{"name":"name","value":"ewewew"},{"name":"location","value":"weew"}]
    var formData = {
      name: rawFormData[1].value,
      type: rawFormData[0].value,
      location: rawFormData[2].value,
      uid: $.cookie("uid"),
      id: ""
    };
    if (
      formData.name.length < 1 ||
      formData.type.length < 1 ||
      formData.location.length < 1
    ) {
      alert("Fields cannot be empty!");
      return;
    }
    // console.log(formData);

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8082/api/add_device",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(formData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        if (data.answer === "ok") {
          // console.log("yay");
          formData.id = data.id;
          newDevice(formData);
        }
        // console.log(data);
      },
      failure: function (errMsg) {
        alert(errMsg);
      }
    });
    $("#add-modal").modal("hide");
    resetForm();
    // alert("Name = " + rawFormData[1].value + " Type = " + rawFormData[0].value + " Location = " + rawFormData[2].value);
  });

  $("#items-cntr").on("click", "#remove", function () {
    // alert($(this).text() + $(this).attr("item"));
    //do request here
    var target = $(this);
    var req = {
      id: target.attr("item"),
      type: target.attr("type"),
    }
    // console.log(req);
    $.ajax({
      type: "DELETE",
      url: "http://127.0.0.1:8082/api/remove_device",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(req),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        if (data.answer === "ok") {
          removeDeviceHTML(target);
        }
        // console.log(data);
      },
      failure: function (errMsg) {
        alert(errMsg);
      }
    });
    //remove from html if success

  });

  $("#items-cntr").on("click", "#switch", function () {
    var brg = -1;
    var pwr = "off";
    var element = $(this);
    var info = {
      type: element.attr("type"),
      id: element.attr("item")
    }
    if (element.attr("type") === "light") {
      brg = prompt("Please enter brightness % (0 - 100)", "50");
      if (brg == null || brg == "") {
        return;
      } else {
        if (brg < 0) {
          brg = 0
        } else {
          if (brg > 100) {
            brg = 100;
          }
        }
      }
      info.brightness = brg;
    } else {
      if (element.prev().prev().prev().text() == "Off") {
        pwr = "on";
      }
      info.power = pwr;
    }

    // alert(element.text() + element.attr("item"));
    //do request here
    $.ajax({
      type: "PATCH",
      url: "http://127.0.0.1:8082/api/update_device",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(info),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        if (data.answer === "ok") {
          switchDevice(element, brg);
        }
        // console.log(data);
      },
      failure: function (errMsg) {
        alert(errMsg);
      }
    });
    //remove from html if success

  });

  $("#delete-user").on("click", function () {
    $.ajax({
      type: "DELETE",
      url: "http://127.0.0.1:8082/delete_user",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify({
        id: $.cookie("uid")
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        if (data.answer === "ok") {

        }
        $.cookie("uid", "");
        window.location.href = "http://127.0.0.1:8082/login";
      },
      failure: function (errMsg) {
        alert(errMsg);
      }
    });
  })

  $("#items-cntr").on("click", "#onoff", function () {
    var pwr = "off";
    var element = $(this);
    info = {
      type: element.attr("type")
    };
    if (element.prev().text() == "Off") {
      pwr = "on";
    }
    info.power = pwr;
    info.brightness = -1;
    info.id = element.attr("item");


    // alert(element.text() + element.attr("item"));
    //do request here
    $.ajax({
      type: "PATCH",
      url: "http://127.0.0.1:8082/api/update_device",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(info),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        if (data.answer === "ok") {
          lightonoff(element);
        }
      },
      failure: function (errMsg) {
        alert(errMsg);
      }
    });
    //remove from html if success

  });

});