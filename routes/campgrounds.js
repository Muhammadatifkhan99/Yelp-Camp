const express = require("express");
const router = express.Router();

//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("../utils/CatchAsync");

const campgrounds = require("../controllers/campgrounds.js")


const Campground = require("../models/campground");

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware.js");
const campground = require("../models/campground");



//route to display all the campgrounds...
//get route for getting data...
router.get("/",CatchAsync(campgrounds.index));
//creating a new camp
//order does matters here...it can not find the campground with the id of new 
router.get("/new",isLoggedIn, campgrounds.renderNewForm);

router.get("/:id",CatchAsync(campgrounds.showCampground));

router.get("/:id/edit",isLoggedIn,isAuthor, CatchAsync(campgrounds.renderEditForm));

//post requests
router.post("/",validateCampground,isLoggedIn,CatchAsync(campgrounds.createCampground));

//put requests
router.put("/:id",validateCampground,isAuthor,CatchAsync(campgrounds.updateCampground))

router.delete("/:id",isLoggedIn,isAuthor,CatchAsync(campgrounds.deleteCampground))


module.exports = router;