const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

let tasks = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

app.get("/", function (req, res) {
  let day = date();
  Item.find({}).then((data) => {
    res.render("list", { day: day, tasks: data });
  });
});

app.post("/", function (req, res) {
  Item.insertMany([new Item({ name: req.body.task })]);
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  Item.findByIdAndDelete(req.body.checkbox).then(res.redirect("/"));
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
