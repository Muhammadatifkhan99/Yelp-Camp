const express = require("express");
const router = express.Router();

//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("../utils/CatchAsync");

const campgrounds = require("../controllers/campgrounds.js")


const Campground = require("../models/campground");

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware.js");
const campground = require("../models/campground");


//using multer middleware
const multer  = require("multer")
const upload = multer({ dest: "uploads/" })



//route to display all the campgrounds...
//get route for getting data...
router.route("/")
    .get(CatchAsync(campgrounds.index))
    //post requests
    // .post(validateCampground,isLoggedIn,CatchAsync(campgrounds.createCampground))
    .post(upload.single("image"),(req,res) => {
        res.send(req.body,req.file);
    })
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