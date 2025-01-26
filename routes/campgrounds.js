const express = require("express");
const router = express.Router();

//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("../utils/CatchAsync");

const campgrounds = require("../controllers/campgrounds.js")


const Campground = require("../models/campground");

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware.js");
const campground = require("../models/campground");

//requiring the cloudinary files
const { storage } = require("../cloudinary/index.js");
//no index file is specified because node automatically looks for an index file


//using multer middleware
const multer  = require("multer")
const upload = multer({ storage })



//route to display all the campgrounds...
//get route for getting data...
router.route("/")
    .get(CatchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("image"),validateCampground,CatchAsync(campgrounds.createCampground));

    
//creating a new camp
//order does matters here...it can not find the campground with the id of new 
router.get("/new",isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .put(validateCampground,isAuthor,CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,CatchAsync(campgrounds.deleteCampground))
    .get(CatchAsync(campgrounds.showCampground));

router.get("/:id/edit",isLoggedIn,isAuthor, CatchAsync(campgrounds.renderEditForm));

//put requests



module.exports = router;