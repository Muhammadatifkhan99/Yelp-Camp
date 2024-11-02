const express = require("express");
const path = require("path");
const app = express();

//setting the view engine
app.set("view engine", "ejs");
//set the view directory.....>require path module for that
app.set('views',path.join(__dirname, 'views'));



app.get("/", (req,res) => {
    res.render("home");
})



app.listen(3000, () =>{
    console.log("SERVING ON PORT 3000");
})