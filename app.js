const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
//requiring our own Campground model from the files
const Campground = require("./models/campground");


//connection to the database
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})


const app = express();
//use the app.set to set the view engine to ejs &&&& set the directory to views using the path modules
//setting the view engine
app.set("view engine", "ejs");
//set the view directory.....>require path module for that
app.set('views',path.join(__dirname, 'views'));

// need to parse the request body before we can use
app.use(express.urlencoded({extended:true}));


app.get("/", (req,res) => {
    res.render("home");
})

//route to display all the campgrounds...
//get route for getting data...
app.get("/campgrounds", async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
})
//creating a new camp
//order does matters here...it can not find the campground with the id of new 
app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
})

//post requests
app.post("/campgrounds", async (req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`)
})

// app.get("/makecampground", async (req,res) => {
//     const camp = new Campground({title: "My Backyard", description: "Cheap camping and heavy security is provided"});
//     await camp.save();
//     res.send(camp);
// })



app.listen(3000, () =>{
    console.log("SERVING ON PORT 3000");
})