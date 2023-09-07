const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

let day = date();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// change localhost to 127.0.0.1 or won't work
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// schema for today list
const itemSchema = {
  name: String,
};

// model for today list
const Item = mongoose.model("Item", itemSchema);

//  schema for custom list
const listSchema = {
  name: String,
  items: [itemSchema],
};

// model for custom list
const List = mongoose.model("List", listSchema);

// retreive data and render (today list)
app.get("/", function (req, res) {
  Item.find({}).then((data) => {
    res.render("list", { listName: day, tasks: data });
  });
});

// store new item
app.post("/", function (req, res) {
  let listTitle = req.body.add;
  if (listTitle == day) {
    Item.insertMany([new Item({ name: req.body.task })]);
    res.redirect("/");
  } else {
    List.findOne({ name: listTitle }).then((data) => {
      data.items.push(new Item({ name: req.body.task }));
      data.save();
      res.redirect("/" + listTitle);
    });
  }
});

// delete checked item
app.post("/delete", function (req, res) {
  let listTitle = req.body.listName;
  if (listTitle === day) {
    Item.findByIdAndDelete(req.body.checkbox).then(res.redirect("/"));
  } else {
    List.findOneAndUpdate(
      { name: listTitle },
      { $pull: { items: { _id: req.body.checkbox } } }
    ).then((data) => {
      res.redirect("/" + listTitle);
    });
  }
});

app.get("/:listTitle", function (req, res) {
  let listTitle = req.params.listTitle;

  List.findOne({ name: listTitle }).then((data) => {
    if (data) {
      res.render("list", { listName: listTitle, tasks: data.items });
    } else {
      const list = new List({
        name: listTitle,
        items: [],
      });
      list.save();
      res.render("list", { listName: listTitle, tasks: [] });
    }
  });
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});
