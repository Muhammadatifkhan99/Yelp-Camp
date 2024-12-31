



const express = require("express");
//using mongoose to interact with MONGODB
const mongoose = require("mongoose");
const path = require("path");
//using the method-override package for using other requests types
const methodoverride = require("method-override"); 
//requiring our own Campground model from the files
const Campground = require("./models/campground");
//using ejs-mate to add some more functionality to ejs
const ejsMate = require("ejs-mate");
//requiring the expresserror class
const ExpressError = require("./utils/ExpressError");
//joi tool used for schema validation on the server side
// const Joi = require("joi");
//Joi validations Schemas( Joi is always used in here so no need to require it separatly)
const { campgroundSchema, reviewSchema } = require("./schema.js");
//requiring the campgrounds.js file for the router
const campgrounds = require("./routes/campgrounds.js");
//reviews.js file for the review routes
const reviews = require("./routes/reviews.js");



//connection to the database
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})


const app = express();

//setting engine to ejs-mate 
app.engine("ejs",ejsMate);

//use the app.set to set the view engine to ejs &&&& set the directory to views using the path modules
//setting the view engine
app.set("view engine", "ejs");
//set the view directory.....>require path module for that
app.set('views',path.join(__dirname, 'views'));

// need to parse the request body before we can use
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//use the method override
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req,res) => {
    res.render("home");
})

// app.get("/makecampground", async (req,res) => {
//     const camp = new Campground({title: "My Backyard", description: "Cheap camping and heavy security is provided"});
//     await camp.save();
//     res.send(camp);
// })

app.all("/*",(req,res,next) => {
    next(new ExpressError("Page not found",404));
})

app.use((err,req,res,next) =>{
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("errors", {err});
    // res.send("oh boy, something went wrong");
})

app.listen(3000, () =>{
    console.log("SERVING ON PORT 3000");
})