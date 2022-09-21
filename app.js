const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

mongoose.connect("mongodb+srv://admin:admin123@cluster0.6uv7ni8.mongodb.net/todolistDB");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const todoSchema = new mongoose.Schema({
  name: String,
});
const item = mongoose.model("item", todoSchema);

app.get("/", function (req, res) {
  item.find({}, (err, items) => {
    res.render("list", { ListTitle: "Today", listeditem: items });
  });
});

const listSchema = new mongoose.Schema({
  name: String,
  list: [todoSchema]
});

const list = mongoose.model("list", listSchema);


app.get("/:newpost", (req, res) => {
  const newpage = _.capitalize(req.params.newpost);
    if(newpage === "Favicon.ico"){
        list.deleteMany({name:"Favicon.ico"},(err)=>{});
    }
  list.findOne({ name: newpage }, (err, items) => {
    if (!err) {
      if (!items) {
        const newlist = new list({
          name: newpage,
          list: []
        });
        newlist.save();
        res.redirect("/" + newpage);
      } else {
        res.render("list", { ListTitle: items.name, listeditem: items.list });
      }
    }
  });
});

app.post("/delete", (req, res) => {
  const checked = req.body.checkbox;
  const listname = _.capitalize(req.body.listname);

  if(listname === "Today"){
    item.deleteOne({ _id: checked }, (err) => {
        res.redirect("/");
      });
  }
  else{
    list.findOneAndUpdate({name: listname},{$pull:{list:{_id:checked}}}, (err, deletedItem)=>{
         res.redirect("/"+ listname);
    })
  }
});

app.post("/", (req, res) => {
  const userinput = req.body.input;
  const listname = req.body.submit;

  const inputs = new item({
    name: userinput,
  });

  if (listname === "Today") {
    inputs.save();
    res.redirect("/");
  } else {
    list.findOne({ name: listname }, (err, foundlist) => {
      foundlist.list.push(inputs);
      foundlist.save();
      res.redirect("/"+ listname);
    });
  }
});

app.listen(process.env.PORT  || 3000, function () {
  console.log("Server is running on port 3000");
});
