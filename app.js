const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

let tasks = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  let day = date();
  res.render("list", { day: day, tasks: tasks });
});

app.post("/", function (req, res) {
  let task = req.body.task;
  tasks.push(task);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
