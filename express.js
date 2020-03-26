var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set the view engine to ejs
app.set("view engine", "ejs");
app.locals.pretty = true;

//show frontpage
//app.use(express.static("demosite/"));
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
  res.render("pages/index");
});

// subdirectory guestbook
app.get("/guestbook", function(req, res) {
  var data = require("./message.json");
  //res.send(data);
  res.render("pages/guestbook", { users: data });
  /*var results =
    '<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css" integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47" crossorigin="anonymous">';
  results += '<style type="text/css">{display:inline-block;}</style>';
  results +=
    '<div class="pure-menu pure-menu-horizontal pure-menu-scrollable"><ul class="pure-menu-list"><li><a href="/" class="pure-menu-link">HomePage</a></li><li><a href="#" class="pure-menu-link">Guestbook</a></li><li><a href="/newmessage" class="pure-menu-link">newmessage</a></li><li><a href="/ajaxmessage" class="pure-menu-link">ajaxmessage</a></li></ul></div>';
  results +=
    '<div><table class="pure-table pure-table-horizontal" border="0"><tr><th>#</th><th>Name</th><th>Country</th><th>Date</th><th>Message</th></tr>';
  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td>" +
      data[i].id +
      "</td>" +
      "<td>" +
      data[i].username +
      "</td>" +
      "<td>" +
      data[i].country +
      "</td>" +
      "<td>" +
      data[i].date +
      "</td>" +
      "<td>" +
      data[i].message +
      "</td>" +
      "</tr>";
  }
  results += "</div>";
  res.send(results);*/
});

//add newmessage to the json file
app.get("/newmessage", function(req, res) {
  res.sendFile(__dirname + "/newmessage.html");

  app.post("/newmessage", function(req, res) {
    var data = require("./message.json");

    // handle ID
    var newid = data.length + 1;

    data.push({
      id: newid,
      username: req.body.username,
      country: req.body.country,
      message: req.body.message,
      date: new Date()
    });

    var jsonStr = JSON.stringify(data);

    fs.writeFile("message.json", jsonStr, function(err) {
      if (err) throw err;
      console.log("It is saved!");
    });
    /*res.send(
      "Saved the data to a file.Browse to the details to see the contents of the file!"
    );*/
    res.redirect("/newmessage");
  });
});

// add newmessage and show items under the table , use ajax
app.get("/ajaxmessage", function(req, res) {
  res.sendFile(__dirname + "/ajaxnewmessage.html");

  app.post("/ajaxmessage", function(req, res) {
    console.log(req.body);
    var username = req.body.username;
    var country = req.body.country;
    var message = req.body.message;

    res.send(
      "Lähetit lomakkeen! username: " +
        username +
        " country: " +
        country +
        "message:" +
        message
    );

    var data = require("./message.json");
    // handle ID
    var newid = data.length + 1;
    data.push({
      id: newid,
      username: username,
      country: country,
      message: message,
      date: new Date()
    });
    var jsonStr = JSON.stringify(data);
    fs.writeFile("message.json", jsonStr, function(err) {
      if (err) throw err;
      console.log("It is saved!");
    });
  });
});

// err handle
app.get("*", function(req, res) {
  res.send("can't find the requested page!", 404);
});

app.listen(8081);
