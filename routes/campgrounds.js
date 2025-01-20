const express = require("express");
const router = express.Router();

//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("../utils/CatchAsync");
//requiring the expresserror class
const ExpressError = require("../utils/ExpressError");

const { campgroundSchema } = require("../schema.js");

const Campground = require("../models/campground");

const { isLoggedIn } = require("../middleware.js");


const validateCampground = (req,res,next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
//route to display all the campgrounds...
//get route for getting data...
router.get("/", CatchAsync( async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))
//creating a new camp
//order does matters here...it can not find the campground with the id of new 
router.get("/new",isLoggedIn, (req,res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must sign in");
    //     return res.redirect("/login");
    // }
    res.render("campgrounds/new");
})

router.get("/:id",CatchAsync( async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews").populate("author");
    console.log(campground);
    if(!campground){
        req.flash("error","Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    // console.log(campground);
    res.render("campgrounds/show", { campground });
}))

router.get("/:id/edit",isLoggedIn, CatchAsync( async (req,res) => {
    const { id } = req.params;
    // console.log(req.params);
    const editcampground = await Campground.findById(id);
    if(!editcampground){
        req.flash("error","Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { editcampground });
}))

//post requests
router.post("/",validateCampground,isLoggedIn,CatchAsync (async (req,res) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`campgrounds/${campground._id}`);
}));

//put requests
router.put("/:id",validateCampground,CatchAsync( async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have permissions to that");
        return res.redirect(`/campgrounds/${id}`);
    }
    // console.log(req.params);
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground });
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:id",isLoggedIn,CatchAsync( async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","The campground was deleted");
    res.redirect("/campgrounds");
}))


module.exports = router;