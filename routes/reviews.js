const express = require("express");
//as the /:id is in the separate file form the router file so the params needs to be merged otherwise it won't work as expect
//for the campground routes......................
//the campground routes have the /:id defined in the campground routes file that is why it does not needed the merged params

const router = express.Router({mergeParams: true});

//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("../utils/CatchAsync");
//the middleware file 
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")

// const { reviewSchema } = require("../schema.js");

const Review = require("../models/review.js");
const Campground = require("../models/campground");

const reviews = require("../controllers/reviews.js");


router.post("/",isLoggedIn,validateReview,CatchAsync (reviews.createReview))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, CatchAsync(reviews.deleteReview))


module.exports = router;