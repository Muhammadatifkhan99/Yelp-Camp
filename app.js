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
const Joi = require("joi");


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


app.get("/", (req,res) => {
    res.render("home");
})

//route to display all the campgrounds...
//get route for getting data...
app.get("/campgrounds",CatchAsync( async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))
//creating a new camp
//order does matters here...it can not find the campground with the id of new 
app.get("/campgrounds/new", (req,res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id",CatchAsync( async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
}))

app.get("/campgrounds/:id/edit",CatchAsync( async (req,res) => {
    const { id } = req.params;
    const editcampground = await Campground.findById(id);
    res.render("campgrounds/edit", { editcampground });
}))

//post requests
app.post("/campgrounds",CatchAsync (async (req,res,next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    }
    console.log(msg);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
}));

//put requests
app.put("/campgrounds/:id",CatchAsync( async (req,res) => {
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