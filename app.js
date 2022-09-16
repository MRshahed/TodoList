const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var inputs = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    const today = new Date();
  
   var option = {
    weekday : "long",
    day : "numeric",
    month : "long"
   };

   var day = today.toLocaleDateString("en-us", option);

    res.render("list", {ListTitle:day, listeditem:inputs});
})

app.post("/", function(req, res){
    const userinput = req.body.input;
    inputs.push(userinput);
    res.redirect("/");
   
})


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})