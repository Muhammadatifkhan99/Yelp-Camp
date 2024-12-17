


// SERVING ON PORT 3000





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
//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("./utils/CatchAsync");
//requiring the expresserror class
const ExpressError = require("./utils/ExpressError");
//joi tool used for schema validation on the server side
// const Joi = require("joi");
//Joi validations Schemas( Joi is always used in here so no need to require it separatly)
const { campgroundSchema } = require("./Schema.js");


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
//use the method override
app.use(methodoverride("_method"));

const validateCampground = (req,res,next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}

app.get("/", (req,res) => {
    res.render("home");
})

//route to display all the campgrounds...
//get route for getting data...
app.get("/campgrounds",validateCampground, CatchAsync( async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))
//creating a new camp
//order does matters here...it can not find the campground with the id of new 
app.get("/campgrounds/new",  (req,res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id",CatchAsync( async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
}))

app.get("/campgrounds/:id/edit",validateCampground, CatchAsync( async (req,res) => {
    const { id } = req.params;
    const editcampground = await Campground.findById(id);
    res.render("campgrounds/edit", { editcampground });
}))

//post requests
app.post("/campgrounds",validateCampground,CatchAsync (async (req,res,next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
}));

//put requests
app.put("/campgrounds/:id",validateCampground,CatchAsync( async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.editcampground });
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete("/campgrounds/:id",CatchAsync( async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

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