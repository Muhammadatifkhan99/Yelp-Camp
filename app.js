if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

console.log(process.env.SECRET);
console.log(process.env.API_KEY);

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
//the session module for flash messages
const session = require("express-session");
//flashing messages in to the camp
const flash = require("connect-flash");
//requiring the expresserror class
const ExpressError = require("./utils/ExpressError");
//joi tool used for schema validation on the server side
// const Joi = require("joi");
//Joi validations Schemas( Joi is always used in here so no need to require it separatly)
const { campgroundSchema, reviewSchema } = require("./schema.js");




//requiring the campgrounds.js file for the router
const campgroundRoutes = require("./routes/campgrounds.js");
//reviews.js file for the review routes
const reviewRoutes = require("./routes/reviews.js");
//users routes
const userRoutes = require("./routes/user.js");




//using passport for regular authentications
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const { getMaxListeners } = require("events");



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

//sessions
const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: false,
    cookie: {
       httpOnly: true,
       expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
       maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
//make sure passport.session is used before the normal sesssions 
app.use(passport.session());

passport.use(new localStrategy(User.authenticate())); // authenticate is the static method that has been added to the passportlocalmongoose

//how to serialize user--->how to store it in the session
passport.serializeUser(User.serializeUser());
//how to unstore it in the session
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error  = req.flash("error");
    next();
})

// app.get("/makeUser",async (req,res) => {
//     const user = new User ({email: "atifff@gmail.com",username: "colt"});
//     const newUser = await User.register(user, "chicken");
//     res.send(newUser);
// })


app.use("/",userRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

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